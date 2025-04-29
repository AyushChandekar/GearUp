"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import MainNav from "@/components/main-nav"
import { motion } from "framer-motion"
import { Sofa, Tv, Car, Shirt, PenToolIcon as Tool, Book, Camera, Utensils, Gamepad, Briefcase } from "lucide-react"

export default function CategoriesPage() {
  // Define categories with images and descriptions
  const categories = [
    {
      id: "electronics",
      name: "Electronics",
      description: "Cameras, drones, speakers, and more",
      image: "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 120,
      icon: Tv,
      color: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300",
    },
    {
      id: "furniture",
      name: "Furniture",
      description: "Sofas, tables, chairs, and more",
      image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 85,
      icon: Sofa,
      color: "bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-300",
    },
    {
      id: "vehicles",
      name: "Vehicles",
      description: "Cars, bikes, scooters, and more",
      image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 42,
      icon: Car,
      color: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300",
    },
    {
      id: "clothing",
      name: "Clothing & Accessories",
      description: "Clothing, shoes, jewelry, and more",
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 210,
      icon: Shirt,
      color: "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300",
    },
    {
      id: "tools",
      name: "Tools & Equipment",
      description: "Power tools, gardening equipment, and more",
      image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 95,
      icon: Tool,
      color: "bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300",
    },
    {
      id: "books",
      name: "Books & Media",
      description: "Books, movies, music, and more",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 72,
      icon: Book,
      color: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300",
    },
    {
      id: "photography",
      name: "Photography",
      description: "Cameras, lenses, lighting equipment, and more",
      image: "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 58,
      icon: Camera,
      color: "bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300",
    },
    {
      id: "kitchen",
      name: "Kitchen & Appliances",
      description: "Kitchen gadgets, appliances, and more",
      image: "https://images.unsplash.com/photo-1556911220-dabc1f02913a?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 63,
      icon: Utensils,
      color: "bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300",
    },
    {
      id: "gaming",
      name: "Gaming",
      description: "Consoles, games, accessories, and more",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 47,
      icon: Gamepad,
      color: "bg-cyan-100 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-300",
    },
    {
      id: "business",
      name: "Business Equipment",
      description: "Office furniture, projectors, and more",
      image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
      count: 39,
      icon: Briefcase,
      color: "bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Categories</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Browse all categories of items available for rent in Pune
              </p>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/search?category=${category.id}`}>
                    <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white">{category.name}</h3>
                          <p className="text-sm text-white/80">{category.count} items</p>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className={`rounded-full ${category.color} p-2 mr-3`}>
                              <category.icon className="h-5 w-5" />
                            </div>
                            <p className="text-sm text-muted-foreground">{category.description}</p>
                          </div>
                          <Badge variant="outline">View</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Items Section */}
        <section className="py-16 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter">Popular Items</h2>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Most frequently rented items across all categories
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'MacBook Pro 16"',
                  category: "Electronics",
                  price: 4999,
                  image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
                },
                {
                  title: "DSLR Camera",
                  category: "Photography",
                  price: 2499,
                  image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
                },
                {
                  title: "PlayStation 5",
                  category: "Gaming",
                  price: 3499,
                  image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
                },
                {
                  title: "Royal Enfield Classic 350",
                  category: "Vehicles",
                  price: 8999,
                  image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full overflow-hidden">
                    <div className="relative h-40">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                      <Badge className="absolute top-2 right-2">{item.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{item.title}</h3>
                      <p className="font-medium mt-1">
                        ₹{item.price} <span className="text-sm font-normal text-muted-foreground">/ month</span>
                      </p>
                      <Button className="w-full mt-3 bg-gradient-to-r from-secondary to-accent text-white" asChild>
                        <Link href={`/search?q=${encodeURIComponent(item.title)}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter mb-4">Can't Find What You Need?</h2>
              <p className="text-muted-foreground mb-8">
                If you're looking for something specific that you don't see listed, let us know and we'll help you find
                it.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-gradient-to-r from-secondary to-accent text-white">
                  <Link href="/contact">Contact Us</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/search">Browse All Items</Link>
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
              <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
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
