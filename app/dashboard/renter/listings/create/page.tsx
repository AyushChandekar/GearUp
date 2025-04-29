"use client"

import type React from "react"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CreateListingPage() {
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [policies, setPolicies] = useState<string[]>([])
  const [newPolicy, setNewPolicy] = useState("")
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(event.currentTarget)

      const title = formData.get("title") as string
      const description = formData.get("description") as string
      const category = formData.get("category") as string
      const price = Number.parseFloat(formData.get("price") as string)
      const period = formData.get("period") as string
      const deposit = Number.parseFloat(formData.get("deposit") as string)
      const location = formData.get("location") as string

      // Get current user
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        toast({
          title: "Error",
          description: "You must be logged in to create a listing",
          variant: "destructive",
        })
        return
      }

      // Create the listing - Fixed field names to match database schema
      const { data, error } = await supabase
        .from("products")
        .insert({
          title,
          description,
          category,
          price, // Changed from price_per_day to price
          period,
          deposit,
          location,
          features,
          policies,
          images: images.length > 0 ? images : ["/placeholder.svg?height=300&width=300"],
          owner_id: session.user.id,
          available: true,
        })
        .select()
        .single()

      if (error) throw error

      toast({
        title: "Success",
        description: "Your listing has been created",
      })

      router.push("/dashboard/renter/listings")
    } catch (error: any) {
      console.error("Error creating listing:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create listing",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleAddFeature() {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  function handleRemoveFeature(feature: string) {
    setFeatures(features.filter((f) => f !== feature))
  }

  function handleAddPolicy() {
    if (newPolicy.trim() && !policies.includes(newPolicy.trim())) {
      setPolicies([...policies, newPolicy.trim()])
      setNewPolicy("")
    }
  }

  function handleRemovePolicy(policy: string) {
    setPolicies(policies.filter((p) => p !== policy))
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    // In a real app, this would upload to storage and get URLs
    // For now, we'll just use placeholder images
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages = Array.from(files).map(
        (_, index) => `/placeholder.svg?height=300&width=300&text=Image ${images.length + index + 1}`,
      )
      setImages([...images, ...newImages])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Listing</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listing Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Modern Sofa" required />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your item in detail..."
                  className="min-h-32"
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required defaultValue="furniture">
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Furniture">Furniture</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Vehicles">Vehicles</SelectItem>
                      <SelectItem value="Photography">Photography</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Appliances">Appliances</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" placeholder="Mumbai, Maharashtra" required />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" name="price" type="number" min="0" step="0.01" placeholder="1999" required />
                </div>

                <div>
                  <Label htmlFor="period">Period</Label>
                  <Select name="period" required defaultValue="day">
                    <SelectTrigger id="period">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hour">Per Hour</SelectItem>
                      <SelectItem value="day">Per Day</SelectItem>
                      <SelectItem value="week">Per Week</SelectItem>
                      <SelectItem value="month">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="deposit">Security Deposit (₹)</Label>
                  <Input id="deposit" name="deposit" type="number" min="0" step="0.01" placeholder="5000" required />
                </div>
              </div>

              <div>
                <Label>Images</Label>
                <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-md border bg-muted">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full rounded-md object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer text-xs font-medium text-muted-foreground hover:text-foreground"
                      >
                        Upload Image
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          multiple
                          className="sr-only"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label>Features</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      <span>{feature}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => handleRemoveFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Add a feature..."
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
                  />
                  <Button type="button" onClick={handleAddFeature}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Rental Policies</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {policies.map((policy) => (
                    <div key={policy} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm">
                      <span>{policy}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => handleRemovePolicy(policy)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    placeholder="Add a policy..."
                    value={newPolicy}
                    onChange={(e) => setNewPolicy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPolicy())}
                  />
                  <Button type="button" onClick={handleAddPolicy}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard/renter/listings")}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Listing"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
