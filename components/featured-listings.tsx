"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency } from "@/lib/utils"

// Featured listings with real images
const featuredItems = [
  {
    id: 1,
    title: "Ergonomic Office Chair",
    category: "Furniture",
    price: 399,
    period: "month",
    rating: 4.8,
    reviews: 124,
    location: "Kothrud, Pune",
    image: "https://m.media-amazon.com/images/I/61LszsKltuL._AC_UF350,350_QL50_.jpg",
    isNew: true,
    deposit: 1000,
  },
  {
    id: 2,
    title: 'MacBook Pro 16" M2',
    category: "Electronics",
    price: 4999,
    period: "month",
    rating: 4.9,
    reviews: 89,
    location: "Baner, Pune",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    deposit: 15000,
  },
  {
    id: 3,
    title: "Royal Enfield Classic 350",
    category: "Vehicles",
    price: 8999,
    period: "month",
    rating: 4.7,
    reviews: 56,
    location: "Hinjewadi, Pune",
    image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    isNew: true,
    deposit: 20000,
  },
  {
    id: 4,
    title: "Canon EOS R5 DSLR Camera",
    category: "Electronics",
    price: 2499,
    period: "month",
    rating: 4.6,
    reviews: 72,
    location: "Aundh, Pune",
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    deposit: 5000,
  },
]

export default function FeaturedListings() {
  const { addToCart } = useCart()
  const { toast } = useToast()

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

  const handleAddToCart = (product: any) => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        period: product.period,
        image: product.image,
        deposit: product.deposit,
      },
      1,
    )

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    })
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {featuredItems.map((item) => (
        <motion.div key={item.id} variants={item}>
          <Card className="overflow-hidden h-full">
            <div className="relative">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <Badge className="absolute top-2 right-2 bg-primary">{item.category}</Badge>
              {item.isNew && (
                <Badge className="absolute top-2 left-2 bg-gradient-to-r from-secondary to-accent text-white">
                  New
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg truncate">{item.title}</h3>
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 fill-secondary text-secondary" />
                <span className="text-sm ml-1">{item.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">({item.reviews} reviews)</span>
              </div>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{item.location}</span>
              </div>
              <p className="font-semibold mt-2 text-lg">
                {formatCurrency(item.price)}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ {item.period}</span>
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex gap-2">
              <Link href={`/listings/${item.id}`} className="flex-1">
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </Link>
              <Button
                variant="default"
                size="icon"
                className="bg-gradient-to-r from-secondary to-accent text-white"
                onClick={() => handleAddToCart(item)}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
