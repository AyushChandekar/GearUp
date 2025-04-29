"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Sofa, Tv, Car, Shirt, Briefcase, Utensils, Gamepad2, Camera } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const categories = [
  {
    title: "Furniture",
    icon: Sofa,
    href: "/categories/furniture",
    color: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-primary",
  },
  {
    title: "Electronics",
    icon: Tv,
    href: "/categories/electronics",
    color: "bg-amber-100 dark:bg-amber-900",
    iconColor: "text-secondary",
  },
  {
    title: "Vehicles",
    icon: Car,
    href: "/categories/vehicles",
    color: "bg-green-100 dark:bg-green-900",
    iconColor: "text-accent",
  },
  {
    title: "Clothing",
    icon: Shirt,
    href: "/categories/clothing",
    color: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Office",
    icon: Briefcase,
    href: "/categories/office",
    color: "bg-gray-100 dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
  },
  {
    title: "Appliances",
    icon: Utensils,
    href: "/categories/appliances",
    color: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    title: "Gaming",
    icon: Gamepad2,
    href: "/categories/gaming",
    color: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "Photography",
    icon: Camera,
    href: "/categories/photography",
    color: "bg-yellow-100 dark:bg-yellow-900",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
]

export default function CategorySection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Browse by Category</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Find exactly what you need from our wide range of rental categories
            </p>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={item}>
              <Link href={category.href}>
                <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                  <CardContent className={`p-6 flex flex-col items-center text-center ${category.color}`}>
                    <div className="rounded-full bg-background p-3 mb-3">
                      <category.icon className={`h-6 w-6 ${category.iconColor}`} />
                    </div>
                    <h3 className="font-semibold">{category.title}</h3>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
