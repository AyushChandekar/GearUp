"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bell,
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Package,
  PlusCircle,
  Settings,
  ShoppingBag,
  Star,
  User,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function RenterDashboard() {
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
                    className="flex items-center gap-3 rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
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
                    className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
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
              <h1 className="text-3xl font-bold">Renter Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, Ananya!</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹24,850</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">5 with high demand</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground">2 ending this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">From 32 reviews</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="listings" className="mt-8">
              <TabsList>
                <TabsTrigger value="listings">My Listings</TabsTrigger>
                <TabsTrigger value="rentals">Active Rentals</TabsTrigger>
                <TabsTrigger value="earnings">Earnings</TabsTrigger>
              </TabsList>
              <TabsContent value="listings" className="pt-4">
                <div className="flex justify-end mb-4">
                  <Button className="bg-gradient-to-r from-secondary to-accent text-white">
                    <Link href="/dashboard/renter/listings/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add New Listing
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="Modern Sofa"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          Available
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">Modern Sofa</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                            <span className="text-sm">4.8</span>
                          </div>
                          <p className="font-medium">₹1,999/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Manage
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
                          alt="Projector"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Rented</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">4K Projector</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                            <span className="text-sm">4.9</span>
                          </div>
                          <p className="font-medium">₹3,499/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Manage
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
                          alt="Drone"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge variant="secondary" className="absolute top-2 right-2">
                          Available
                        </Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">Drone with Camera</h3>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-primary text-primary mr-1" />
                            <span className="text-sm">4.7</span>
                          </div>
                          <p className="font-medium">₹4,999/month</p>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="rentals" className="pt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Image
                          src="/placeholder.svg?height=200&width=300"
                          alt="4K Projector"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Active</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">4K Projector</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">Rented until: Apr 15, 2023</p>
                          <p className="font-medium">₹3,499/month</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Rented by: Vikram Mehta</p>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
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
                          alt="Gaming Console"
                          width={300}
                          height={200}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        <Badge className="absolute top-2 right-2">Active</Badge>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold">Gaming Console</h3>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-sm text-muted-foreground">Rented until: Apr 20, 2023</p>
                          <p className="font-medium">₹2,999/month</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Rented by: Priya Desai</p>
                        </div>
                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="earnings" className="pt-4">
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
                    <div className="mt-6 space-y-4">
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">March 2023</p>
                          <p className="text-sm text-muted-foreground">5 rentals</p>
                        </div>
                        <p className="font-bold">₹8,750</p>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">February 2023</p>
                          <p className="text-sm text-muted-foreground">4 rentals</p>
                        </div>
                        <p className="font-bold">₹7,200</p>
                      </div>
                      <div className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">January 2023</p>
                          <p className="text-sm text-muted-foreground">6 rentals</p>
                        </div>
                        <p className="font-bold">₹8,900</p>
                      </div>
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
