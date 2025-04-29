import { createClient } from "@supabase/supabase-js"
import { supabaseConfig } from "./env-config"

// Define types for our database schema
export type UserRole = "borrower" | "renter"

export type UserProfile = {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string | null
  avatar_url?: string | null
  role: UserRole
  created_at: string
  bio?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
  country?: string | null
  notifications_email?: boolean
  notifications_sms?: boolean
  payment_info?: string | null
}

export type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  period: string
  deposit: number
  owner_id: string
  location: string
  features: string[]
  policies: string[]
  images: string[]
  available: boolean
  created_at: string
}

export type Rental = {
  id: number
  product_id: number
  borrower_id: string
  start_date: string
  end_date: string
  status: "pending" | "active" | "completed" | "cancelled"
  total_amount: number
  deposit_amount: number
  created_at: string
  product?: Product
}

export type Review = {
  id: number
  product_id: number
  user_id: string
  rating: number
  comment: string
  created_at: string
  user?: {
    id: string
    first_name: string
    last_name: string
    avatar_url: string | null
  }
}

export type Message = {
  id: number
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

export type Conversation = {
  user_id: string
  first_name: string
  last_name: string
  avatar_url: string | null
  last_message: string
  last_message_time: string
  unread_count: number
}

// Create a single supabase client for interacting with your database
let supabaseInstance: ReturnType<typeof createClient> | null = null
let clientSideSupabaseInstance: ReturnType<typeof createClient> | null = null

// Server-side Supabase client
export const supabase = (() => {
  try {
    if (!supabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseConfig.url
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseConfig.anonKey

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key are required')
      }

      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
        global: {
          fetch: (...args) => {
            return fetch(...args)
          },
        },
      })
    }
    return supabaseInstance
  } catch (error) {
    console.error("Error initializing Supabase client:", error)
    throw new Error("Failed to initialize Supabase client")
  }
})()

// Client-side Supabase client with singleton pattern
export function getClientSupabase() {
  if (typeof window === "undefined") {
    return supabase // Return the server-side client when running on the server
  }

  try {
    if (!clientSideSupabaseInstance) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || supabaseConfig.url
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseConfig.anonKey

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key are required')
      }

      clientSideSupabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          storage: typeof window !== "undefined" ? window.localStorage : undefined,
          storageKey: "gearup_auth_token",
          detectSessionInUrl: true,
        },
      })
    }
    return clientSideSupabaseInstance
  } catch (error) {
    console.error("Error initializing client-side Supabase client:", error)
    throw new Error("Failed to initialize client-side Supabase client")
  }
}

// Function to check if Supabase is properly configured
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        return { connected: true, tablesExist: false, error: null }
      }
      return { connected: false, tablesExist: false, error: error.message }
    }
    return { connected: true, tablesExist: true, error: null }
  } catch (err: any) {
    return { connected: false, tablesExist: false, error: err.message }
  }
}
