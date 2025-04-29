"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { UserRole, UserProfile, Product, Message } from "@/lib/supabase"

// Authentication actions
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const phone = formData.get("phone") as string
  const role = formData.get("role") as UserRole

  // Check if user already exists
  const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).single()

  if (existingUser) {
    return { error: "User with this email already exists" }
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Create user profile
  if (authData.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      role,
    })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  // Redirect based on role
  redirect(`/dashboard/${role}`)
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user role
  const { data: userData } = await supabase.from("users").select("role").eq("id", data.user.id).single()

  if (userData) {
    // Redirect based on role
    redirect(`/dashboard/${userData.role}`)
  } else {
    return { error: "User profile not found" }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

// User profile actions
export async function getCurrentUser(): Promise<UserProfile | null> {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return data as UserProfile
}

// Update user profile
export async function updateUserProfile(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to update your profile" }
  }

  const firstName = formData.get("firstName") as string
  const lastName = formData.get("lastName") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string
  const city = formData.get("city") as string
  const bio = formData.get("bio") as string
  const paymentInfo = formData.get("paymentInfo") as string

  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      address: address || null,
      city: city || null,
      bio: bio || null,
      payment_info: paymentInfo || null,
    })
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { user: data }
}

// Product actions
export async function createProduct(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to create a product" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const period = formData.get("period") as "day" | "week" | "month"
  const deposit = Number.parseFloat(formData.get("deposit") as string)
  const location = formData.get("location") as string
  const features = JSON.parse(formData.get("features") as string)
  const policies = JSON.parse(formData.get("policies") as string)
  const images = JSON.parse(formData.get("images") as string)

  const { data, error } = await supabase
    .from("products")
    .insert({
      title,
      description,
      category,
      price,
      period,
      deposit,
      owner_id: user.id,
      location,
      features,
      policies,
      images,
      available: true,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/renter")
  return { product: data }
}

export async function getProducts(category?: string, search?: string) {
  let query = supabase.from("products").select("*").eq("available", true)

  if (category) {
    query = query.eq("category", category)
  }

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query

  if (error) {
    return { error: error.message }
  }

  return { products: data as Product[] }
}

export async function getProductById(id: number) {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    return { error: error.message }
  }

  return { product: data as Product }
}

// Rental actions
export async function createRental(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to rent a product" }
  }

  const productId = Number.parseInt(formData.get("product_id") as string)
  const startDate = formData.get("start_date") as string
  const endDate = formData.get("end_date") as string
  const totalAmount = Number.parseFloat(formData.get("total_amount") as string)
  const depositAmount = Number.parseFloat(formData.get("deposit_amount") as string)

  const { data, error } = await supabase
    .from("rentals")
    .insert({
      product_id: productId,
      borrower_id: user.id,
      start_date: startDate,
      end_date: endDate,
      status: "pending",
      total_amount: totalAmount,
      deposit_amount: depositAmount,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/borrower")
  return { rental: data }
}

export async function getUserRentals() {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view rentals" }
  }

  const { data, error } = await supabase
    .from("rentals")
    .select(`
      *,
      product:products(*)
    `)
    .eq("borrower_id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { rentals: data }
}

export async function getOwnerRentals() {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view rentals" }
  }

  const { data, error } = await supabase
    .from("rentals")
    .select(`
      *,
      product:products(*),
      borrower:users(*)
    `)
    .eq("product.owner_id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { rentals: data }
}

// Message actions
export async function sendMessage(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to send messages" }
  }

  const receiverId = formData.get("receiver_id") as string
  const content = formData.get("content") as string

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      read: false,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  return { message: data }
}

export async function getConversations() {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view messages" }
  }

  // Get unique conversations
  const { data, error } = await supabase.rpc("get_conversations", {
    user_id: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  return { conversations: data }
}

export async function getMessages(otherUserId: string) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to view messages" }
  }

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`,
    )
    .order("created_at", { ascending: true })

  if (error) {
    return { error: error.message }
  }

  // Mark messages as read
  await supabase.from("messages").update({ read: true }).eq("receiver_id", user.id).eq("sender_id", otherUserId)

  return { messages: data as Message[] }
}

// Review actions
export async function createReview(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { error: "You must be logged in to leave a review" }
  }

  const productId = Number.parseInt(formData.get("product_id") as string)
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: productId,
      user_id: user.id,
      rating,
      comment,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/listings/${productId}`)
  return { review: data }
}

export async function getProductReviews(productId: number) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      user:users(id, first_name, last_name, avatar_url)
    `)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })

  if (error) {
    return { error: error.message }
  }

  return { reviews: data }
}

// Payment actions
export async function processPayment(formData: FormData) {
  // In a real app, this would integrate with a payment gateway like Stripe or Razorpay
  const totalAmount = Number.parseFloat(formData.get("total_amount") as string)
  const depositAmount = Number.parseFloat(formData.get("deposit_amount") as string)
  const rentalId = Number.parseInt(formData.get("rental_id") as string)

  // Simulate payment processing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Update rental status
  const { error } = await supabase.from("rentals").update({ status: "active" }).eq("id", rentalId)

  if (error) {
    return { error: error.message }
  }

  return { success: true, transaction_id: `TR-${Date.now()}` }
}
