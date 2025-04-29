"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function RenterListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [listingToDelete, setListingToDelete] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        router.push("/auth/login")
        return
      }

      fetchListings(session.user.id)
    }

    checkAuth()
  }, [supabase, router])

  async function fetchListings(userId: string) {
    try {
      setLoading(true)

      // Get listings where the user is the owner
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      setListings(data || [])
    } catch (error) {
      console.error("Error fetching listings:", error)
    } finally {
      setLoading(false)
    }
  }

  function confirmDelete(listingId: string) {
    setListingToDelete(listingId)
    setDeleteDialogOpen(true)
  }

  async function deleteListing() {
    if (!listingToDelete) return

    try {
      const { error } = await supabase.from("listings").delete().eq("id", listingToDelete)

      if (error) throw error

      // Update the listings state
      setListings(listings.filter((listing) => listing.id !== listingToDelete))
      setDeleteDialogOpen(false)
      setListingToDelete(null)
    } catch (error) {
      console.error("Error deleting listing:", error)
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "available":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Available
          </Badge>
        )
      case "rented":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Rented
          </Badge>
        )
      case "unavailable":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Unavailable
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Listings</h2>
        <Button asChild>
          <Link href="/dashboard/renter/listings/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="mb-4 text-center text-muted-foreground">You haven't created any listings yet.</p>
            <Button asChild>
              <Link href="/dashboard/renter/listings/create">Create Your First Listing</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <Card key={listing.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <Image
                  src={listing.images?.[0] || "/placeholder.svg?height=200&width=300"}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                  {getStatusBadge(listing.status || "available")}
                </div>
                <p className="text-sm text-muted-foreground">${listing.price_per_day}/day</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">{listing.description}</p>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" asChild>
                    <Link href={`/dashboard/renter/listings/edit/${listing.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" className="flex-1" onClick={() => confirmDelete(listing.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteListing}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
