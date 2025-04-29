"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Settings,
  User,
  Upload,
  ShoppingBag,
  Star,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions"
import type { UserProfile } from "@/lib/supabase"

export default function RenterProfile() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
  firstName: "Ananya",
  lastName: "Sharma",
  email: "ananya.sharma@example.com",
  phone: "+91-9988776655",
  address: "501, Green Meadows Society, Sector 21",
  city: "Mumbai",
  bio: "UX designer who loves simplifying digital experiences for everyday users.",
  paymentInfo: {
    paymentId: "PMT10234",
    amount: 2200,
    date: "2025-04-15",
    method: "UPI",
    status: "Completed",
    rentedItem: {
      itemName: "Canon EOS 1500D DSLR Camera",
      itemId: "ITM9021",
      rentalPeriod: "2025-04-10 to 2025-04-14",
      pricePerDay: 550,
      totalDays: 4,
      vendor: "PixelGear Rentals",
    },
    invoiceLink: "/invoices/PMT10234.pdf",
  },
})


  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const userData = await getCurrentUser()
        if (userData) {
          setUser(userData)
          setFormData({
            firstName: userData.first_name || "",
            lastName: userData.last_name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            address: userData.address || "",
            city: userData.city || "",
            bio: userData.bio || "",
            paymentInfo: userData.payment_info || "",
          })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // In a real app, this would update the user profile in the database
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/dashboard/renter" className="flex items-center gap-2 font-semibold">
                <User className="h-5 w-5" />
                <span>Ananya Sharma</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide">Dashboard</h2>
                <div className="space-y-1">
                  <Link
                    href="/dashboard/renter"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/dashboard/renter/listings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>My Listings</span>
                  </Link>
                  <Link
                    href="/dashboard/renter/bookings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                  <Link
                    href="/dashboard/renter/earnings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Earnings</span>
                  </Link>
                  <Link
                    href="/dashboard/renter/messages"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </div>
              </div>
              <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide">Account</h2>
                <div className="space-y-1">
                  <Link
                    href="/dashboard/renter/profile"
                    className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/renter/settings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your personal information and listing preferences</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Profile" />
                    <AvatarFallback className="text-4xl">
                      {user ? user.first_name.charAt(0) + user.last_name.charAt(0) : "AS"}
                    </AvatarFallback>
                  </Avatar>
                  <Button className="mt-4" variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                  <p className="mt-2 text-xs text-muted-foreground text-center">
                    Recommended: Square image, at least 300x300px
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        rows={4}
                        placeholder="Tell potential borrowers about yourself..."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentInfo">Payment Information</Label>
                      <Input
                        id="paymentInfo"
                        name="paymentInfo"
                        value={formData.paymentInfo}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="UPI ID or bank account details"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading || isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Renter Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">7</span>
                      <span className="text-sm text-muted-foreground">Active Listings</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">32</span>
                      <span className="text-sm text-muted-foreground">Total Rentals</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">4.8</span>
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">₹24,850</span>
                      <span className="text-sm text-muted-foreground">Total Earnings</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Reviews from Borrowers</CardTitle>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-primary text-primary mr-1" />
                    <span className="font-bold">4.8</span>
                    <span className="text-muted-foreground ml-1">(32 reviews)</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        name: "Vikram Mehta",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 5,
                        date: "2 weeks ago",
                        comment:
                          "Ananya was very professional and the drone was in perfect condition. Would definitely rent from her again!",
                      },
                      {
                        name: "Priya Desai",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 4,
                        date: "1 month ago",
                        comment:
                          "Great experience renting the gaming console. Everything worked perfectly and communication was smooth.",
                      },
                      {
                        name: "Rahul Patel",
                        avatar: "/placeholder.svg?height=40&width=40",
                        rating: 5,
                        date: "2 months ago",
                        comment:
                          "The MacBook was in excellent condition and Ananya was very helpful with setup instructions. Highly recommended!",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.name} />
                              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.name}</p>
                              <p className="text-xs text-muted-foreground">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? "fill-primary text-primary" : "text-muted"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.comment}</p>
                      </div>
                    ))}
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
