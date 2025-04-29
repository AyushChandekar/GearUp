"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, MessageCircle, Plus, Minus, Loader2 } from "lucide-react"
import Image from "next/image"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import MainNav from "@/components/main-nav"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/contexts/cart-context"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export default function ListingPage() {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  })
  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [listing, setListing] = useState<any>(null)
  const [owner, setOwner] = useState<any>(null)
  const supabaseClient = createClientComponentClient()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    async function fetchListing() {
      try {
        setLoading(true)

        // Fetch the product
        const { data: product, error: productError } = await supabaseClient
          .from("products")
          .select("*")
          .eq("id", id)
          .single()

        if (productError) throw productError

        if (!product) {
          router.push("/404")
          return
        }

        setListing(product)

        // Fetch the owner
        const { data: owner, error: ownerError } = await supabaseClient
          .from("users")
          .select("id, first_name, last_name, avatar_url")
          .eq("id", product.owner_id)
          .single()

        if (ownerError) throw ownerError

        setOwner(owner)

        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabaseClient
          .from("reviews")
          .select(`
            *,
            user:users(id, first_name, last_name, avatar_url)
          `)
          .eq("product_id", id)
          .order("created_at", { ascending: false })

        if (reviewsError) throw reviewsError

        setReviews(reviewsData || [])

        calculateTotalPrice(product, dateRange.from, dateRange.to)
      } catch (error) {
        console.error("Error fetching listing:", error)
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, supabaseClient, router, toast, dateRange.from, dateRange.to])

  const handleAddToCart = () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Please select rental dates",
        variant: "destructive",
      })
      return
    }

    if (!listing) return

    addToCart(
      {
        id: listing.id,
        title: listing.title,
        price: listing.price,
        period: listing.period,
        image: listing.images?.[0] || "/placeholder.svg",
        deposit: listing.deposit,
      },
      quantity,
      dateRange.from,
      dateRange.to,
    )

    toast({
      title: "Added to cart",
      description: `${listing.title} has been added to your cart.`,
    })
  }

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault()

    if (!reviewText.trim()) {
      toast({
        title: "Please enter a review",
        variant: "destructive",
      })
      return
    }

    try {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()

      if (!session) {
        toast({
          title: "Please log in",
          description: "You must be logged in to leave a review",
          variant: "destructive",
        })
        return
      }

      // Add the review to the database
      const { data: newReview, error } = await supabaseClient
        .from("reviews")
        .insert({
          product_id: listing.id,
          user_id: session.user.id,
          rating: reviewRating,
          comment: reviewText,
        })
        .select(`
          *,
          user:users(id, first_name, last_name, avatar_url)
        `)
        .single()

      if (error) throw error

      // Add the new review to the state
      setReviews([newReview, ...reviews])
      setReviewText("")

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      })
    }
  }

  function getInitials(firstName: string, lastName: string) {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase()
  }

  // Calculate total price based on rental period
  const calculateTotalPrice = (listingData: any, startDate: Date, endDate: Date) => {
    if (!listingData) return

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    let price = 0

    switch (listingData.period) {
      case "day":
        price = listingData.price * days
        break
      case "week":
        price = listingData.price * Math.ceil(days / 7)
        break
      case "month":
        price = listingData.price * Math.ceil(days / 30)
        break
      default:
        price = listingData.price
    }

    setTotalPrice(price)
  }

  // Handle date range change
  const handleDateRangeChange = (range: { from: Date; to: Date | undefined }) => {
    if (range.from && range.to) {
      setDateRange({ from: range.from, to: range.to })
      calculateTotalPrice(listing, range.from, range.to)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="container py-8">
          <h1 className="text-3xl font-bold">Listing not found</h1>
          <p className="mt-4">The listing you're looking for doesn't exist or has been removed.</p>
          <Button className="mt-6" onClick={() => router.push("/search")}>
            Browse Other Listings
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                  <span>{listing.rating || "New"}</span>
                  <span className="text-muted-foreground ml-1">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{listing.location}</span>
                </div>
                <Badge>{listing.category}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-8">
                <div className="col-span-2 row-span-2">
                  <Image
                    src={listing.images?.[0] || "/placeholder.svg?height=400&width=600"}
                    alt={listing.title}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
                {(listing.images || []).slice(1, 5).map((image: string, index: number) => (
                  <div key={index}>
                    <Image
                      src={image || "/placeholder.svg?height=200&width=200"}
                      alt={`${listing.title} ${index + 1}`}
                      width={200}
                      height={200}
                      className={`w-full h-full object-cover ${index === 0 ? "rounded-tr-lg" : ""} ${
                        index === 2 ? "rounded-br-lg" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                      Listing by {owner?.first_name} {owner?.last_name}
                    </h2>
                    <Avatar>
                      <AvatarImage src={owner?.avatar_url || "/placeholder.svg"} alt={owner?.first_name} />
                      <AvatarFallback>{owner ? getInitials(owner.first_name, owner.last_name) : "??"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
                    <div className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span>Quick responses</span>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <p className="mb-6">{listing.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <ul className="space-y-2 mb-6">
                    {(listing.features || []).map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <Tabs defaultValue="reviews" className="mb-8">
                <TabsList>
                  <TabsTrigger value="policies">Policies</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                <TabsContent value="policies" className="pt-4">
                  <h3 className="text-lg font-semibold mb-3">Rental Policies</h3>
                  <ul className="space-y-2">
                    {(listing.policies || []).map((policy: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{policy}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <h3 className="text-lg font-semibold mb-3">Reviews</h3>
                  {reviews.length === 0 ? (
                    <p>No reviews yet.</p>
                  ) : (
                    <ul className="space-y-4">
                      {reviews.map((review: any) => (
                        <li key={review.id} className="border rounded-md p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <Avatar className="mr-2 h-8 w-8">
                                <AvatarImage
                                  src={review.user?.avatar_url || "/placeholder.svg"}
                                  alt={review.user?.first_name}
                                />
                                <AvatarFallback>
                                  {review.user ? getInitials(review.user.first_name, review.user.last_name) : "??"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">
                                  {review.user?.first_name} {review.user?.last_name}
                                </p>
                                <div className="flex items-center">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-primary text-primary mr-0.5" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p>{review.comment}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Separator className="my-4" />
                  <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                    <h4 className="text-md font-semibold">Leave a Review</h4>
                    <Textarea
                      placeholder="Write your review here..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <p>Rating:</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setReviewRating(Math.max(1, reviewRating - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{reviewRating}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setReviewRating(Math.min(5, reviewRating + 1))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button type="submit">Submit Review</Button>
                  </form>
                </TabsContent>
                <TabsContent value="location" className="pt-4">
                  <h3 className="text-lg font-semibold mb-3">Location</h3>
                  <p>The exact location will be provided after booking.</p>
                </TabsContent>
              </Tabs>
            </div>
            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Rental Details</h2>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground">Price per {listing.period}</p>
                    <p className="text-2xl font-bold">{formatCurrency(listing.price)}</p>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-muted-foreground">Deposit</p>
                    <p className="text-lg font-bold">{formatCurrency(listing.deposit)}</p>
                  </div>
                  <div className="mb-4">
                    <DatePickerWithRange
                      date={dateRange}
                      onDateChange={(date) =>
                        setDateRange({
                          from: date?.from || null,
                          to: date?.to || null,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <p>Quantity</p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span>{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleAddToCart}>
                    Rent Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
