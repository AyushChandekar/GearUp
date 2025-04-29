"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Calendar, CreditCard, Home, MessageSquare, Package, Search, User } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions"
import type { UserProfile } from "@/lib/supabase"

const mockBookings = [
  {
    id: "1",
    title: "Modern Sofa",
    date: "May 1, 2025",
    location: "Kothrud, Pune",
  },
  {
    id: "2",
    title: 'MacBook Pro 16" M2',
    date: "May 3, 2025",
    location: "Baner, Pune",
  },
  {
    id: "3",
    title: "Canon DSLR Camera",
    date: "May 7, 2025",
    location: "Aundh, Pune",
  },
  {
    id: "4",
    title: "Foldable Bicycle",
    date: "May 12, 2025",
    location: "Shivajinagar, Pune",
  },
  {
    id: "5",
    title: "Wooden Study Table",
    date: "May 18, 2025",
    location: "Viman Nagar, Pune",
  },
]

export default function BorrowerBookings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [bookings, setBookings] = useState(mockBookings)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleCancelBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id))
    toast({ title: "Booking Cancelled", description: `Booking #${id} has been cancelled.` })
  }

  const handleViewDetails = (id: string) => {
    toast({ title: "View Booking", description: `Booking #${id} details shown here.` })
    // You can route to a details page or modal later
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
            </Link>
            <span className="text-xl font-bold text-primary">GEARUP</span>
          </div>
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search for items to rent in Pune..." className="pl-8 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>RP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard/borrower" className="flex items-center gap-2 font-semibold">
                <User className="h-5 w-5" />
                <span>Rahul Patel</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide">Dashboard</h2>
                <div className="space-y-1">
                  <Link href="/dashboard/borrower" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                  <Link href="/dashboard/borrower/rentals" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                    <Package className="h-4 w-4" />
                    <span>My Rentals</span>
                  </Link>
                  <Link href="/dashboard/borrower/bookings" className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary">
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                  <Link href="/dashboard/borrower/payments" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                    <CreditCard className="h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                  <Link href="/dashboard/borrower/messages" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">View your bookings and manage them</p>
            </div>

            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center border-b pb-3">
                          <div>
                            <h3 className="font-semibold">{booking.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Date: {booking.date} • Location: {booking.location}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" onClick={() => handleViewDetails(booking.id)}>
                              View Details
                            </Button>
                            <Button variant="destructive" onClick={() => handleCancelBooking(booking.id)}>
                              Cancel Booking
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">You have no upcoming bookings.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
