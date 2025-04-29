"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, CreditCard, Home, MessageSquare, Package, Search, Settings, User, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import Link from "next/link"
import { getCurrentUser } from "@/lib/actions"
import type { UserProfile } from "@/lib/supabase"

export default function BorrowerProfile() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
  firstName: "Parag",
  lastName: "Sutar",
  email: "verifying ",
  phone: "verifying ",
  address: "enter your address here",
  city: "Pune",
  bio: "Tech enthusiast and passionate about building smart rental solutions.",
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
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search for items to rent in Pune..." className="pl-8 w-full" />
            </div>
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
                  <Link
                    href="/dashboard/borrower"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Home className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    href="/dashboard/borrower/rentals"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Package className="h-4 w-4" />
                    <span>My Rentals</span>
                  </Link>
                  <Link
                    href="/dashboard/borrower/bookings"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Bookings</span>
                  </Link>
                  <Link
                    href="/dashboard/borrower/payments"
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Payments</span>
                  </Link>
                  <Link
                    href="/dashboard/borrower/messages"
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
                    href="/dashboard/borrower/profile"
                    className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/dashboard/borrower/settings"
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
              <p className="text-muted-foreground">Manage your personal information</p>
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
                      {user ? user.first_name.charAt(0) + user.last_name.charAt(0) : "RP"}
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
                  <CardTitle>Account Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">12</span>
                      <span className="text-sm text-muted-foreground">Total Rentals</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">4.9</span>
                      <span className="text-sm text-muted-foreground">Average Rating</span>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <span className="text-3xl font-bold">Jun 2022</span>
                      <span className="text-sm text-muted-foreground">Member Since</span>
                    </div>
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
