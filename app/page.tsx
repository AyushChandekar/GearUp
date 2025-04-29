"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CategorySection from "@/components/category-section"
import FeaturedListings from "@/components/featured-listings"
import ThemeToggle from "@/components/theme-toggle"
import Chatbot from "@/components/chatbot"
import { useCart } from "@/contexts/cart-context"
import CartDrawer from "@/components/cart-drawer"
import { motion } from "framer-motion"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { isCartOpen, openCart, closeCart } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} />
            </Link>
            <span className="text-xl font-bold text-primary">GEARUP</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/categories" className="text-sm font-medium">
              Categories
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="/about" className="text-sm font-medium">
              About Us
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <CartDrawer />
            <Link href="/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
              alt="Indian households with rental essentials"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/80"></div>
          </div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Rent Anything You Need, When You Need It
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Access thousands of items without the burden of ownership. Save money and reduce waste.
                  </p>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col gap-2 min-[400px]:flex-row">
                  <div className="relative flex-1">
                    <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
                      <Search className="h-4 w-4" />
                    </div>
                    <Input
                      type="search"
                      placeholder="Search for Furniture, Electronics, Vehicles... in Pune"
                      className="pl-8 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="default"
                    className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                  >
                    Search
                  </Button>
                </form>
              </motion.div>
              <motion.div
                className="mx-auto lg:mr-0 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                  alt="Hero Image"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover shadow-lg"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </section>

        <CategorySection />

        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Listings</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Discover our most popular rental items in Pune
                </p>
              </div>
            </div>
            <FeaturedListings />
            <div className="flex justify-center mt-10">
              <Button className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white px-8">
                Explore All Rentals
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">Renting has never been easier</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <motion.div
                className="flex flex-col items-center text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <h3 className="text-xl font-bold">Find What You Need</h3>
                <p className="text-muted-foreground">Browse thousands of items available for rent in Pune</p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  2
                </div>
                <h3 className="text-xl font-bold">Book & Pay Securely</h3>
                <p className="text-muted-foreground">Reserve your items and pay through our secure payment system</p>
              </motion.div>
              <motion.div
                className="flex flex-col items-center text-center space-y-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  3
                </div>
                <h3 className="text-xl font-bold">Pickup & Return</h3>
                <p className="text-muted-foreground">Get your items and return them when your rental period is over</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Have Items to Rent Out?</h2>
                <p className="text-primary-foreground/80 md:text-xl">
                  Turn your unused items into income. List your items on GEARUP and start earning today.
                </p>
              </div>
              <div className="flex justify-center lg:justify-end">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white px-8"
                >
                  List Your Item (Earn ₹)
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Serving Pune</h2>
                <p className="max-w-[700px] text-muted-foreground md:text-xl">
                  Currently available in Pune, Maharashtra
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {[
                { area: "Kothrud", count: "120+ items" },
                { area: "Baner", count: "95+ items" },
                { area: "Hinjewadi", count: "150+ items" },
                { area: "Aundh", count: "85+ items" },
                { area: "Viman Nagar", count: "110+ items" },
                { area: "Koregaon Park", count: "75+ items" },
              ].map((location) => (
                <Link
                  href={`/area/${location.area.toLowerCase().replace(/\s+/g, "-")}`}
                  key={location.area}
                  className="flex flex-col items-center p-6 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <MapPin className="h-8 w-8 text-primary mb-2" />
                  <span className="text-lg font-medium">{location.area}</span>
                  <span className="text-sm text-muted-foreground mt-1">{location.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Image src="/logo.jpeg" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold text-primary">GEARUP</span>
            </div>
            <p className="text-sm text-muted-foreground">Rent what you need, when you need it.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Company</h3>
              <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                Careers
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                Blog
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Support</h3>
              <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground">
                Help Center
              </Link>
              <Link href="/safety" className="text-sm text-muted-foreground hover:text-foreground">
                Safety Center
              </Link>
              <Link href="/community" className="text-sm text-muted-foreground hover:text-foreground">
                Community Guidelines
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-sm font-medium">Legal</h3>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/cookie" className="text-sm text-muted-foreground hover:text-foreground">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © 2025 GEARUP. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
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
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="https://www.instagram.com/gearup_287" target="_blank" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
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
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
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
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      <Chatbot />
      <CartDrawer open={isCartOpen} onOpenChange={closeCart} />
    </div>
  )
}
