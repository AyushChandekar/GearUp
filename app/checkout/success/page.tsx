"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ThemeToggle from "@/components/theme-toggle"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  // Redirect to home if accessed directly without checkout
  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if this page was accessed directly
      if (!document.referrer.includes("/checkout")) {
        router.push("/")
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold text-primary">GEARUP</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've sent a confirmation email with all the details.
          </p>
          <div className="bg-muted p-4 rounded-md mb-6">
            <h2 className="font-semibold mb-2">Order #GU12345678</h2>
            <p className="text-sm text-muted-foreground">
              Your items will be delivered on the selected dates. You'll receive updates via email and SMS.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/dashboard/borrower">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
