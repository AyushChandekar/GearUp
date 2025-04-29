"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

export default function RenterBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)
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

      fetchBookings(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  async function fetchBookings(userId: string) {
    try {
      setLoading(true)

      // Get bookings for items owned by this user
      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id")
        .eq("owner_id", userId)

      if (productsError) throw productsError

      if (!products || products.length === 0) {
        setBookings([])
        setLoading(false)
        return
      }

      const productIds = products.map((product) => product.id)

      const { data, error } = await supabase
        .from("rentals")
        .select(`
          *,
          product:products(*),
          borrower:users(id, first_name, last_name, email, avatar_url)
        `)
        .in("product_id", productIds)
        .order("created_at", { ascending: false })

      if (error) throw error

      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function openActionDialog(booking: any, action: "approve" | "reject") {
    setSelectedBooking(booking)
    setActionType(action)
    setActionDialogOpen(true)
  }

  async function handleBookingAction() {
    if (!selectedBooking || !actionType) return

    try {
      const newStatus = actionType === "approve" ? "active" : "cancelled"

      const { error } = await supabase.from("rentals").update({ status: newStatus }).eq("id", selectedBooking.id)

      if (error) throw error

      // Update local state
      setBookings(
        bookings.map((booking) => (booking.id === selectedBooking.id ? { ...booking, status: newStatus } : booking)),
      )

      // Send notification to borrower
      await supabase.from("notifications").insert({
        user_id: selectedBooking.borrower.id,
        type: actionType === "approve" ? "booking_approved" : "booking_rejected",
        content:
          actionType === "approve"
            ? `Your booking for ${selectedBooking.product.title} has been approved!`
            : `Your booking for ${selectedBooking.product.title} has been rejected.`,
        related_id: selectedBooking.id,
        read: false,
      })

      toast({
        title: actionType === "approve" ? "Booking Approved" : "Booking Rejected",
        description:
          actionType === "approve"
            ? "The borrower has been notified that their booking is approved."
            : "The borrower has been notified that their booking is rejected.",
      })

      setActionDialogOpen(false)
    } catch (error) {
      console.error("Error updating booking:", error)
      toast({
        title: "Error",
        description: "Failed to update booking status",
        variant: "destructive",
      })
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

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
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
        <h2 className="text-3xl font-bold tracking-tight">Bookings</h2>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">You don't have any bookings yet.</p>
            <p className="text-center text-muted-foreground">
              When borrowers request to rent your items, they will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{booking.product.title}</CardTitle>
                  {getStatusBadge(booking.status)}
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Booking Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start Date:</span>
                        <span>{formatDate(booking.start_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End Date:</span>
                        <span>{formatDate(booking.end_date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Amount:</span>
                        <span>₹{booking.total_amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deposit:</span>
                        <span>₹{booking.deposit_amount}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Borrower</h3>
                    <div className="mt-2 flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={booking.borrower.avatar_url || "/placeholder.svg"}
                          alt={booking.borrower.first_name}
                        />
                        <AvatarFallback>
                          {getInitials(booking.borrower.first_name, booking.borrower.last_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {booking.borrower.first_name} {booking.borrower.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">{booking.borrower.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button variant="default" className="flex-1" onClick={() => openActionDialog(booking, "approve")}>
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={() => openActionDialog(booking, "reject")}>
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}

                {booking.status === "active" && (
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/messages?user=${booking.borrower.id}`)}
                    >
                      Message Borrower
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{actionType === "approve" ? "Approve Booking" : "Reject Booking"}</DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this booking? The borrower will be notified and the item will be marked as rented."
                : "Are you sure you want to reject this booking? The borrower will be notified and the booking will be cancelled."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={actionType === "approve" ? "default" : "destructive"} onClick={handleBookingAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
