"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import { motion } from "framer-motion"

export default function HowItWorksPage() {
  const steps = [
    {
      title: "Find What You Need",
      description:
        "Browse thousands of items available for rent in Pune. Filter by category, location, and price to find exactly what you need.",
      icon: "https://images.unsplash.com/photo-1586769852044-692d5d239b1e?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Book & Pay Securely",
      description:
        "Reserve your items and pay through our secure payment system. Your payment is held safely until you receive the item.",
      icon: "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Pickup & Return",
      description:
        "Coordinate with the owner to pick up your rental. When your rental period is over, return the item in the same condition.",
      icon: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-amber-100 dark:bg-amber-900",
    },
  ]

  const renterSteps = [
    {
      title: "List Your Items",
      description:
        "Take photos and create detailed listings for the items you want to rent out. Set your own prices and availability.",
      icon: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Approve Requests",
      description: "Review rental requests from borrowers. You have full control over who rents your items and when.",
      icon: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-indigo-100 dark:bg-indigo-900",
    },
    {
      title: "Earn Money",
      description: "Get paid securely for each rental. Build your reputation with good reviews and earn even more.",
      icon: "https://images.unsplash.com/photo-1589666564459-93cdd3e2c5a5?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      color: "bg-red-100 dark:bg-red-900",
    },
  ]

  const faqs = [
    {
      question: "How does GEARUP ensure the safety of my items?",
      answer:
        "We verify all users with ID and contact information. Additionally, we require security deposits for high-value items and offer insurance options for both renters and borrowers.",
    },
    {
      question: "What happens if an item is damaged during the rental period?",
      answer:
        "If an item is damaged, the security deposit can be used to cover repairs or replacement. Our dispute resolution team will help mediate any issues between renters and borrowers.",
    },
    {
      question: "How do payments work?",
      answer:
        "Payments are processed securely through our platform. When a borrower books an item, the payment is held in escrow until the rental is complete, ensuring both parties are protected.",
    },
    {
      question: "Can I cancel a rental?",
      answer:
        "Yes, cancellations are possible, but policies vary depending on how close to the rental start date you cancel. Check the specific rental terms for each item.",
    },
    {
      question: "Is GEARUP available in my city?",
      answer:
        "Currently, GEARUP is available in Pune, Maharashtra. We're planning to expand to other major cities in India soon. Stay tuned for updates!",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How GEARUP Works</h1>
                <p className="text-muted-foreground md:text-xl">
                  GEARUP makes renting and lending items simple, secure, and beneficial for everyone. Learn how our
                  platform works and start saving money today.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-accent text-white">
                    <Link href="/search">Find Items to Rent</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard/renter">List Your Items</Link>
                  </Button>
                </div>
              </div>
              <div className="mx-auto lg:mr-0">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                  alt="How it works"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* For Borrowers Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">For Borrowers</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Rent what you need, when you need it, without the burden of ownership
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className={`rounded-full ${step.color} p-4 w-16 h-16 flex items-center justify-center mb-4`}>
                        <Image src={step.icon} alt={step.title} width={32} height={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* For Renters Section */}
        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">For Renters</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Turn your unused items into income by renting them out
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {renterSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className={`rounded-full ${step.color} p-4 w-16 h-16 flex items-center justify-center mb-4`}>
                        <Image src={step.icon} alt={step.title} width={32} height={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Find answers to common questions about using GEARUP
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Get Started?</h2>
                <p className="md:text-xl">
                  Join thousands of users who are already saving money and making extra income with GEARUP.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/search">Find Items to Rent</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                  <Link href="/dashboard/renter">List Your Items</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t bg-background">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image src="https://images.unsplash.com/photo-1579869681700-40cb8e2525de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" alt="Logo" width={32} height={32} />
              <span className="text-xl font-bold text-primary">GEARUP</span>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-8">
              <Link href="/terms" className="text-sm">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-sm">
                Contact Us
              </Link>
              <Link href="/help" className="text-sm">
                Help Center
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">© 2025 GEARUP. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
