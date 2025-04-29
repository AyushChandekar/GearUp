"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getClientSupabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

type Listing = {
  id: string
  title: string
  description: string
  price: number
  period: string
  category: string
  location: string
  images: string[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = getClientSupabase()

  // Get initial values from URL parameters
  const initialCategory = searchParams.get("category") || ""
  const initialMinPrice = Number(searchParams.get("minPrice")) || 0
  const initialMaxPrice = Number(searchParams.get("maxPrice")) || 1000
  const initialLocation = searchParams.get("location") || ""

  // State for filters
  const [category, setCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])
  const [location, setLocation] = useState(initialLocation)
  const [date, setDate] = useState({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 7),
  })

  // State for listings and loading
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Categories
  const categories = [
    "Furniture",
    "Electronics",
    "Vehicles",
    "Photography",
    "Clothing",
    "Appliances",
    "Tools",
    "Sports",
  ]

  // Fetch listings based on filters
  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      setError(null)

      try {
        let query = supabase
          .from("products")
          .select("id, title, description, price, period, category, location, images")
          .eq("available", true)

        // Apply filters
        if (category) {
          query = query.eq("category", category)
        }

        if (priceRange[0] > 0) {
          query = query.gte("price", priceRange[0])
        }

        if (priceRange[1] < 1000) {
          query = query.lte("price", priceRange[1])
        }

        if (location) {
          query = query.ilike("location", `%${location}%`)
        }

        const { data, error } = await query

        if (error) {
          throw new Error(error.message)
        }

        // Parse JSON fields
        const parsedListings = data.map((listing) => ({
          ...listing,
          images: Array.isArray(listing.images)
            ? listing.images
            : typeof listing.images === "string"
              ? JSON.parse(listing.images)
              : [],
        }))

        setListings(parsedListings)
      } catch (err) {
        console.error("Error fetching listings:", err)
        setError("Failed to fetch listings. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [category, priceRange, location, supabase])

  // Update URL with filters
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (category) params.set("category", category)
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString())
    if (priceRange[1] < 1000) params.set("maxPrice", priceRange[1].toString())
    if (location) params.set("location", location)

    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Search Rentals</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <Card className="lg:col-span-1 h-fit sticky top-4">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat}
                        checked={category === cat}
                        onCheckedChange={() => setCategory(category === cat ? "" : cat)}
                      />
                      <label htmlFor={cat} className="text-sm cursor-pointer">
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mb-2"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Location</h3>
                <Input
                  placeholder="Enter city or zip code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Rental Period</h3>
                <DatePickerWithRange value={date} onChange={(newDate) => newDate && setDate(newDate)} />
              </div>

              <Button onClick={updateFilters} className="w-full">
                <Search className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={updateFilters} className="mt-2">
                Try Again
              </Button>
            </div>
          ) : listings.length === 0 ? (
            <div className="bg-muted rounded-md p-8 text-center">
              <h3 className="text-xl font-medium mb-2">No listings found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your filters to find what you're looking for.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setCategory("")
                  setPriceRange([0, 1000])
                  setLocation("")
                  router.push("/search")
                }}
              >
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Link href={`/listings/${listing.id}`} key={listing.id}>
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video relative">
                      <Image
                        src={listing.images?.[0] || "/placeholder.svg?height=200&width=300"}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium line-clamp-1">{listing.title}</h3>
                        <span className="text-primary font-bold">
                          ${listing.price}/{listing.period}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{listing.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-muted px-2 py-1 rounded-full">{listing.category}</span>
                        <span>{listing.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
