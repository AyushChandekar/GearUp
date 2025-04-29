export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      listings: {
        Row: {
          id: string
          title: string
          description: string
          category: string
          price: number
          period: string
          deposit: number
          location: string
          features: string[]
          policies: string[]
          images: string[]
          owner_id: string
          created_at: string
          updated_at: string
          available: boolean
          rating: string | null
          reviews_count: number | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: string
          price: number
          period: string
          deposit: number
          location: string
          features: string[]
          policies: string[]
          images: string[]
          owner_id: string
          created_at?: string
          updated_at?: string
          available?: boolean
          rating?: string | null
          reviews_count?: number | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: string
          price?: number
          period?: string
          deposit?: number
          location?: string
          features?: string[]
          policies?: string[]
          images?: string[]
          owner_id?: string
          created_at?: string
          updated_at?: string
          available?: boolean
          rating?: string | null
          reviews_count?: number | null
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
          role: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
          role?: string
        }
      }
      rentals: {
        Row: {
          id: string
          listing_id: string
          renter_id: string
          borrower_id: string
          start_date: string
          end_date: string
          status: string
          total_price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          renter_id: string
          borrower_id: string
          start_date: string
          end_date: string
          status?: string
          total_price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          renter_id?: string
          borrower_id?: string
          start_date?: string
          end_date?: string
          status?: string
          total_price?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
