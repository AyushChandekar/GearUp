"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function RenterEarningsPage() {
  const [earnings, setEarnings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    monthlyEarnings: 0,
    activeRentals: 0,
    completedRentals: 0,
  })
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }

      fetchEarnings(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  async function fetchEarnings(userId: string) {
    try {
      setLoading(true)

      // Get products owned by this user
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id")
        .eq("owner_id", userId)

      if (productsError) throw productsError

      if (!products || products.length === 0) {
        setEarnings([])
        setLoading(false)
        return
      }

      const productIds = products.map((product) => product.id)

      // Get all rentals for these products
      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          product:products(title, price_per_day),
          borrower:users(first_name, last_name)
        `)
        .in("product_id", productIds)
        .in("status", ["active", "completed"])
        .order("created_at", { ascending: false })

      if (error) throw error

      setEarnings(data || [])

      // Calculate statistics
      const now = new Date()
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const totalEarnings = data?.reduce((sum, rental) => sum + rental.total_amount, 0) || 0
      const monthlyEarnings =
        data?.reduce((sum, rental) => {
          const rentalDate = new Date(rental.created_at)
          return rentalDate >= firstDayOfMonth ? sum + rental.total_amount : sum
        }, 0) || 0

      const activeRentals = data?.filter((rental) => rental.status === "active").length || 0
      const completedRentals = data?.filter((rental) => rental.status === "completed").length || 0

      setStats({
        totalEarnings,
        monthlyEarnings,
        activeRentals,
        completedRentals,
      })
    } catch (error) {
      console.error("Error fetching earnings:", error)
      toast({
        title: "Error",
        description: "Failed to load earnings data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateString: string) {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  function downloadEarningsReport() {
    // In a real app, this would generate a CSV or PDF report
    const earningsData = earnings.map((earning) => ({
      id: earning.id,
      item: earning.product.title,
      borrower: `${earning.borrower.first_name} ${earning.borrower.last_name}`,
      startDate: formatDate(earning.start_date),
      endDate: formatDate(earning.end_date),
      amount: earning.total_amount,
      status: earning.status,
    }))

    const csvContent = [
      ["ID", "Item", "Borrower", "Start Date", "End Date", "Amount (₹)", "Status"],
      ...earningsData.map((e) => [e.id, e.item, e.borrower, e.startDate, e.endDate, e.amount, e.status]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `earnings-report-${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Earnings</h2>
        <Button variant="outline" onClick={downloadEarningsReport} disabled={earnings.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.monthlyEarnings.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeRentals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedRentals}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="active">Active Rentals</TabsTrigger>
          <TabsTrigger value="completed">Completed Rentals</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="pt-4">
          <EarningsTable earnings={earnings} />
        </TabsContent>
        <TabsContent value="active" className="pt-4">
          <EarningsTable earnings={earnings.filter((e) => e.status === "active")} />
        </TabsContent>
        <TabsContent value="completed" className="pt-4">
          <EarningsTable earnings={earnings.filter((e) => e.status === "completed")} />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Earnings Overview</CardTitle>
          <CardDescription>Your earnings for the past 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart className="h-8 w-8 text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Chart would be displayed here</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function EarningsTable({ earnings }: { earnings: any[] }) {
  if (earnings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <p className="text-center text-muted-foreground">No earnings data to display.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Item</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Borrower</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Start Date</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">End Date</th>
              <th className="whitespace-nowrap px-4 py-3 text-right font-medium text-muted-foreground">Amount</th>
              <th className="whitespace-nowrap px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {earnings.map((earning) => (
              <tr key={earning.id} className="border-t">
                <td className="whitespace-nowrap px-4 py-3 font-medium">{earning.product.title}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  {earning.borrower.first_name} {earning.borrower.last_name}
                </td>
                <td className="whitespace-nowrap px-4 py-3">{format(new Date(earning.start_date), "MMM dd, yyyy")}</td>
                <td className="whitespace-nowrap px-4 py-3">{format(new Date(earning.end_date), "MMM dd, yyyy")}</td>
                <td className="whitespace-nowrap px-4 py-3 text-right">₹{earning.total_amount}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      earning.status === "active" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {earning.status === "active" ? "Active" : "Completed"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
