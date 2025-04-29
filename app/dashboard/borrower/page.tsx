"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Star,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function BorrowerDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

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
              <Input
                type="search"
                placeholder="Search for items to rent in Pune..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              <span className="sr-only">Notifications</span>
            </Button>
            <Link href="/dashboard/borrower/messages">
              <Button variant="ghost" size="icon">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Button>
            </Link>
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
                <span>Parag Sutar</span>
              </Link>
            </div>
            <nav className="flex-1 overflow-auto py-4">
              <div className="px-4 py-2">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide">Dashboard</h2>
                <div className="space-y-1">
                  <Link
                    href="/dashboard/borrower"
                    className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
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
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
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
              <h1 className="text-3xl font-bold">Borrower Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Parag !</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 ending this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹12,480</div>
                  <p className="text-xs text-muted-foreground">Last 3 months</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">5 with discounts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.9</div>
                  <p className="text-xs text-muted-foreground">From 12 rentals</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="active" className="mt-8">
              <TabsList>
                <TabsTrigger value="active">Active Rentals</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="history">Rental History</TabsTrigger>
              </TabsList>
              <TabsContent value="active" className="pt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="MacBook Pro"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Active</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">MacBook Pro 16"</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">Rented until: Apr 15, 2023</p>
                          <p className="font-medium">₹4,999/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Extend
                          </Button>
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="DSLR Camera"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Active</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">DSLR Camera</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">Rented until: Apr 10, 2023</p>
                          <p className="font-medium">₹2,499/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Extend
                          </Button>
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="Office Chair"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Active</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">Ergonomic Office Chair</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">Rented until: May 5, 2023</p>
                          <p className="font-medium">₹899/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Extend
                          </Button>
                          <Button variant="outline" size="sm">
                            Return
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="recommended" className="pt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Sony PlayStation 5",
                      category: "Gaming",
                      price: 3499,
                      image: "/placeholder.svg?height=200&width=300",
                    },
                    {
                      title: "Drone with 4K Camera",
                      category: "Electronics",
                      price: 4999,
                      image: "/placeholder.svg?height=200&width=300",
                    },
                    {
                      title: "Treadmill",
                      category: "Fitness",
                      price: 2999,
                      image: "/placeholder.svg?height=200&width=300",
                    },
                  ].map((item, index) => (
                    <Card key={index}>
                      <CardContent className="p-0">
                        <div className="relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            width={300}
                            height={200}
                            className="w-full h-40 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-secondary">{item.category}</Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{item.title}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-secondary text-secondary mr-1" />
                              <span className="text-sm">4.8</span>
                            </div>
                            <p className="font-medium">₹{item.price}/month</p>
                          </div>
                          <div className="mt-4">
                            <Button className="w-full bg-gradient-to-r from-secondary to-accent text-white">
                              Rent Now
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rental History</CardTitle>
                    <CardDescription>Your previous rentals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {[
                        {
                          title: "Projector",
                          period: "Jan 10 - Feb 10, 2023",
                          amount: "₹3,500",
                          status: "Returned",
                        },
                        {
                          title: "Mountain Bike",
                          period: "Dec 5 - Dec 20, 2022",
                          amount: "₹2,250",
                          status: "Returned",
                        },
                        {
                          title: "Sofa Set",
                          period: "Nov 1 - Jan 31, 2023",
                          amount: "₹9,000",
                          status: "Returned",
                        },
                      ].map((rental, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium">{rental.title}</p>
                            <p className="text-sm text-muted-foreground">{rental.period}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{rental.amount}</p>
                            <Badge variant="outline" className="mt-1">
                              {rental.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
