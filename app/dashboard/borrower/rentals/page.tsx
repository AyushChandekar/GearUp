"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Loader2 } from "lucide-react"
import { format, addDays, addWeeks, addMonths } from "date-fns"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { useToast } from "@/components/ui/use-toast"

export default function BorrowerRentalsPage() {
  const [rentals, setRentals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [extendDialogOpen, setExtendDialogOpen] = useState(false)
  const [selectedRental, setSelectedRental] = useState<any>(null)
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
    from: new Date(),
    to: undefined,
  })
  const [processing, setProcessing] = useState(false)
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

      fetchRentals(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  async function fetchRentals(userId: string) {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          product:products(*)
        `)
        .eq("borrower_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setRentals(data || [])
    } catch (error) {
      console.error("Error fetching rentals:", error)
      toast({
        title: "Error",
        description: "Failed to load rentals",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function openExtendDialog(rental: any) {
    // Check if rental can be extended (not expired, not cancelled)
    if (rental.status !== "active") {
      toast({
        title: "Cannot Extend",
        description: "This rental cannot be extended because it is not active.",
        variant: "destructive",
      })
      return
    }

    const currentEndDate = new Date(rental.end_date)
    const today = new Date()

    // If the rental has already expired, don't allow extension
    if (currentEndDate < today) {
      toast({
        title: "Rental Expired",
        description: "This rental has already expired. Please contact the owner for a new rental.",
        variant: "destructive",
      })
      return
    }

    setSelectedRental(rental)
    setDateRange({
      from: currentEndDate,
      to: addDays(currentEndDate, 7), // Default to 7 days extension
    })
    setExtendDialogOpen(true)
  }

  async function handleExtendRental() {
    if (!selectedRental || !dateRange.to) return

    try {
      setProcessing(true)

      const currentEndDate = new Date(selectedRental.end_date)
      const newEndDate = dateRange.to

      // Calculate additional cost based on the rental period and price
      const additionalDays = Math.ceil((newEndDate.getTime() - currentEndDate.getTime()) / (1000 * 60 * 60 * 24))
      const dailyRate = selectedRental.product.price / 30 // Assuming monthly price
      const additionalCost = dailyRate * additionalDays

      // If the end date is more than 7 days away, create an extension request
      const today = new Date()
      const daysTillEnd = Math.ceil((currentEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysTillEnd > 7) {
        // Create extension request
        const { error } = await supabase.from("rental_extensions").insert({
          rental_id: selectedRental.id,
          requested_end_date: newEndDate.toISOString(),
          additional_cost: additionalCost,
          status: "pending",
        })

        if (error) throw error

        toast({
          title: "Extension Requested",
          description: "Your extension request has been sent to the owner for approval.",
        })
      } else {
        // Auto-approve extension if end date is within 7 days
        const { error } = await supabase
          .from("rentals")
          .update({
            end_date: newEndDate.toISOString(),
            total_amount: selectedRental.total_amount + additionalCost,
          })
          .eq("id", selectedRental.id)

        if (error) throw error

        // Update local state
        setRentals(
          rentals.map((rental) =>
            rental.id === selectedRental.id
              ? { ...rental, end_date: newEndDate.toISOString(), total_amount: rental.total_amount + additionalCost }
              : rental,
          ),
        )

        toast({
          title: "Rental Extended",
          description: `Your rental has been extended until ${format(newEndDate, "MMM dd, yyyy")}.`,
        })
      }

      setExtendDialogOpen(false)
    } catch (error) {
      console.error("Error extending rental:", error)
      toast({
        title: "Error",
        description: "Failed to extend rental",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "active":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Active
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  function formatDate(dateString: string) {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  function getQuickExtendOptions(rental: any) {
    if (rental.status !== "active") return null

    const currentEndDate = new Date(rental.end_date)
    const today = new Date()

    // If the rental has already expired, don't show quick extend options
    if (currentEndDate < today) return null

    return (
      <div className="flex flex-wrap gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRental(rental)
            setDateRange({
              from: currentEndDate,
              to: addDays(currentEndDate, 7),
            })
            setExtendDialogOpen(true)
          }}
        >
          +7 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRental(rental)
            setDateRange({
              from: currentEndDate,
              to: addWeeks(currentEndDate, 2),
            })
            setExtendDialogOpen(true)
          }}
        >
          +2 Weeks
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedRental(rental)
            setDateRange({
              from: currentEndDate,
              to: addMonths(currentEndDate, 1),
            })
            setExtendDialogOpen(true)
          }}
        >
          +1 Month
        </Button>
      </div>
    )
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
        <h2 className="text-3xl font-bold tracking-tight">My Rentals</h2>
      </div>

      {rentals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">You don't have any rentals yet.</p>
            <Button onClick={() => router.push("/search")}>Browse Items to Rent</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rentals.map((rental) => (
            <Card key={rental.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{rental.product.title}</CardTitle>
                  {getStatusBadge(rental.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={rental.product.images?.[0] || "/placeholder.svg"}
                        alt={rental.product.title}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Rented from: {formatDate(rental.start_date)} to {formatDate(rental.end_date)}
                      </p>
                      <p className="mt-1 font-medium">₹{rental.total_amount}</p>
                      <div className="mt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/listings/${rental.product.id}`)}
                        >
                          View Item
                        </Button>
                        {rental.status === "active" && (
                          <Button variant="outline" size="sm" onClick={() => openExtendDialog(rental)}>
                            Extend
                          </Button>
                        )}
                      </div>
                      {getQuickExtendOptions(rental)}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {rental.status === "active"
                            ? `${Math.ceil(
                                (new Date(rental.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                              )} days remaining`
                            : rental.status === "completed"
                              ? "Rental completed"
                              : rental.status === "cancelled"
                                ? "Rental cancelled"
                                : "Awaiting approval"}
                        </span>
                      </div>
                    </div>
                    {rental.status === "active" && (
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => router.push(`/dashboard/borrower/return/${rental.id}`)}
                      >
                        Return Item
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={extendDialogOpen} onOpenChange={setExtendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Extend Rental</DialogTitle>
            <DialogDescription>
              Choose a new end date for your rental. The owner may need to approve your extension request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Current End Date: {selectedRental && formatDate(selectedRental.end_date)}
              </p>
              <p className="text-sm text-muted-foreground">Select a new end date:</p>
              <DatePickerWithRange
                value={dateRange}
                onChange={(range) => {
                  if (range?.from) {
                    setDateRange({
                      from: range.from,
                      to: range.to,
                    })
                  }
                }}
              />
            </div>
            {selectedRental && dateRange.to && (
              <div className="rounded-md bg-muted p-4">
                <p className="text-sm font-medium">Extension Summary</p>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>New End Date:</span>
                    <span>{formatDate(dateRange.to.toISOString())}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Days:</span>
                    <span>
                      {Math.ceil(
                        (dateRange.to.getTime() - new Date(selectedRental.end_date).getTime()) / (1000 * 60 * 60 * 24),
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Additional Cost:</span>
                    <span>
                      ₹
                      {Math.ceil(
                        ((dateRange.to.getTime() - new Date(selectedRental.end_date).getTime()) /
                          (1000 * 60 * 60 * 24)) *
                          (selectedRental.product.price / 30),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExtendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExtendRental} disabled={processing || !dateRange.to}>
              {processing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Request Extension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
