"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { Loader2, Settings, User, Home, Package, MessageSquare, CreditCard, Database } from "lucide-react"
import Image from "next/image"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user, loading, dbInitialized, initializeDb, initializingDb } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const role = user?.role || "borrower"
  const isRenter = role === "renter"

  const baseRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: `/dashboard/${role}/profile`,
      label: "Profile",
      icon: User,
    },
    {
      href: `/dashboard/${role}/messages`,
      label: "Messages",
      icon: MessageSquare,
    },
  ]

  const borrowerRoutes = [
    {
      href: "/dashboard/borrower/rentals",
      label: "My Rentals",
      icon: Package,
    },
    {
      href: "/dashboard/borrower/bookings",
      label: "Bookings",
      icon: CreditCard,
    },
    {
      href: "/dashboard/borrower/payments",
      label: "Payments",
      icon: CreditCard,
    },
  ]

  const renterRoutes = [
    {
      href: "/dashboard/renter/listings",
      label: "My Listings",
      icon: Package,
    },
    {
      href: "/dashboard/renter/bookings",
      label: "Bookings",
      icon: CreditCard,
    },
    {
      href: "/dashboard/renter/payments",
      label: "Payments",
      icon: CreditCard,
    },
  ]

  const adminRoutes = [
    {
      href: "/admin/environment",
      label: "Environment",
      icon: Database,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ]

  const routes = [...baseRoutes, ...(isRenter ? renterRoutes : borrowerRoutes), ...adminRoutes]

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <div
        className={cn(
          "fixed inset-y-0 z-50 flex w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:relative",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16",
        )}
      >
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.jpeg" alt="GearUp Logo" width={24} height={24} className={cn(!sidebarOpen && "md:mx-auto")} />
            <span className={cn("font-semibold", !sidebarOpen && "md:hidden")}>GearUp</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden md:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "transparent",
                  !sidebarOpen && "md:justify-center md:px-2",
                )}
              >
                <route.icon className="h-4 w-4" />
                <span className={cn(!sidebarOpen && "md:hidden")}>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        {!dbInitialized && (
          <div className="border-t p-4">
            <Button onClick={initializeDb} disabled={initializingDb} className="w-full" variant="outline">
              {initializingDb ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">
                  {user.first_name} {user.last_name}
                </span>
              </div>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
