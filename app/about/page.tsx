"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import { motion } from "framer-motion"
import { Users, Globe, Shield, Award, Clock } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
  {
    name: "Ranjeet Choudhary",
    role: "Frontend Developer",
    bio: "Student at MITAOE with a passion for building sleek and responsive web interfaces.",
    image: "/ranjeet.jpg",
  },
  {
    name: "Ayush Chandekar",
    role: "Backend Developer",
    bio: "Computer Engineering student at MITAOE focused on scalable APIs and clean backend architecture.",
    image: "/ayush.jpg",
  },
  {
    name: "Prachi Phunde",
    role: "UI/UX Designer",
    bio: "Design enthusiast from MITAOE, crafting intuitive user experiences and clean UI designs.",
    image: "/prachi.jpg",
  },
]


  const values = [
    {
      title: "Trust & Safety",
      description: "We verify all users and listings to create a safe rental environment for everyone.",
      icon: Shield,
    },
    {
      title: "Sustainability",
      description: "By promoting sharing over buying, we help reduce waste and environmental impact.",
      icon: Globe,
    },
    {
      title: "Community",
      description: "We believe in building connections between people through collaborative consumption.",
      icon: Users,
    },
    {
      title: "Quality",
      description: "We maintain high standards for all listings and user experiences on our platform.",
      icon: Award,
    },
    {
      title: "Convenience",
      description: "We make the rental process simple, quick, and hassle-free for all users.",
      icon: Clock,
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
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About GEARUP</h1>
                <p className="text-muted-foreground md:text-xl">
                  We're on a mission to transform how people access and use everyday items, making renting as easy as
                  buying.
                </p>
              </div>
              <div className="mx-auto lg:mr-0">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                  alt="GEARUP Team"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <Image
                  src="https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                  alt="Our Story"
                  width={500}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
              <div className="space-y-4 order-1 lg:order-2">
                <h2 className="text-3xl font-bold tracking-tighter">Our Story</h2>
                <p className="text-muted-foreground">
                  GEARUP was founded in 2025 with a simple idea: why buy when you can rent? We noticed that many items
                  people purchase are only used occasionally, taking up space and costing money.
                </p>
                <p className="text-muted-foreground">
                  Starting in Pune, we built a platform that connects people who have items to rent with those who need
                  them temporarily. Our goal is to make renting as convenient as buying, while helping people save money
                  and reduce waste.
                </p>
                <p className="text-muted-foreground">
                  Today, GEARUP hosts thousands of listings across multiple categories, from electronics and tools to
                  clothing and furniture. We're growing rapidly and plan to expand to other major cities in India soon.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Our Values</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                The principles that guide everything we do at GEARUP
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="rounded-full bg-primary/10 p-3 mb-4">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Meet Our Team</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">The passionate people behind GEARUP</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="mb-4 rounded-full overflow-hidden w-32 h-32">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-primary font-medium">{member.role}</p>
                      <p className="mt-2 text-muted-foreground">{member.bio}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">5,000+</div>
                <div className="text-primary-foreground/80">Items Listed</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">3,000+</div>
                <div className="text-primary-foreground/80">Active Users</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">₹15M+</div>
                <div className="text-primary-foreground/80">Saved by Borrowers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">₹8M+</div>
                <div className="text-primary-foreground/80">Earned by Renters</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Join the GEARUP Community</h2>
              <p className="text-muted-foreground mb-8">
                Whether you want to rent items or make money by renting out your own, GEARUP makes it easy and secure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-accent text-white">
                  <Link href="/search">Find Items to Rent</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
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
