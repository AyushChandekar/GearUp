"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { supabase, getClientSupabase } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { checkTablesExist, initializeDatabase } from "@/lib/db-init"
import { usePathname, useRouter } from "next/navigation"
import type { AuthChangeEvent, Session } from '@supabase/supabase-js'

// Define the auth event type
type AuthEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED'

type AuthContextType = {
  user: UserProfile | null
  loading: boolean
  error: string | null
  dbInitialized: boolean
  initializingDb: boolean
  initializeDb: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  dbInitialized: false,
  initializingDb: false,
  initializeDb: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [dbInitialized, setDbInitialized] = useState(false)
  const [initializingDb, setInitializingDb] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const pathname = usePathname()

  // Use the client-side Supabase instance when in the browser
  const clientSupabase = typeof window !== "undefined" ? getClientSupabase() : supabase

  const initializeDb = async () => {
    setInitializingDb(true)
    try {
      const result = await initializeDatabase()
      if (result.success) {
        setDbInitialized(true)
        toast({
          title: "Database Initialized",
          description: "The database schema has been successfully created.",
        })
        // Retry fetching user after DB initialization
        fetchUser()
      } else {
        toast({
          title: "Database Initialization Failed",
          description: "Failed to initialize the database schema.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error initializing database:", err)
      toast({
        title: "Database Initialization Failed",
        description: "An error occurred while initializing the database.",
        variant: "destructive",
      })
    } finally {
      setInitializingDb(false)
    }
  }

  const signOut = async () => {
    try {
      await clientSupabase.auth.signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const refreshUser = async () => {
    setLoading(true)
    await fetchUser()
    setLoading(false)
  }

  const fetchUser = async () => {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await clientSupabase.auth.getSession()

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        setError("Failed to authenticate")
        setLoading(false)
        return
      }

      // Check if tables exist with error handling
      try {
        const tablesExist = await checkTablesExist()
        setDbInitialized(tablesExist)

        if (!tablesExist) {
          setLoading(false)
          return
        }
      } catch (err) {
        console.error("Error checking database tables:", err)
        // Assume tables exist to prevent blocking the UI
        setDbInitialized(true)
      }

      if (session?.user) {
        try {
          // First check if the user exists in the users table by ID
          const { data: userById, error: userByIdError } = await clientSupabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .maybeSingle()

          if (userByIdError && !userByIdError.message.includes("No rows found")) {
            console.error("Error fetching user by ID:", userByIdError)

            // If it's a network error, don't block the UI
            if (
              userByIdError.message &&
              (userByIdError.message.includes("Failed to fetch") || userByIdError.message.includes("NetworkError"))
            ) {
              console.warn("Network error when fetching user, proceeding with session user")
              // Create a minimal user profile from the session
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                first_name: session.user.user_metadata?.first_name || "",
                last_name: session.user.user_metadata?.last_name || "",
                role: session.user.user_metadata?.role || "borrower",
                created_at: new Date().toISOString(),
              } as UserProfile)
              setLoading(false)
              return
            }

            setError("Failed to load user profile")
            setLoading(false)
            return
          }

          // If user exists by ID, use that profile
          if (userById) {
            setUser(userById as UserProfile)
            setLoading(false)
            return
          }

          // If user doesn't exist by ID, check if a user with the same email exists
          const { data: userByEmail, error: userByEmailError } = await clientSupabase
            .from("users")
            .select("*")
            .eq("email", session.user.email || "")
            .maybeSingle()

          if (userByEmailError && !userByEmailError.message.includes("No rows found")) {
            console.error("Error fetching user by email:", userByEmailError)

            // If it's a network error, don't block the UI
            if (
              userByEmailError.message &&
              (userByEmailError.message.includes("Failed to fetch") ||
                userByEmailError.message.includes("NetworkError"))
            ) {
              console.warn("Network error when fetching user by email, proceeding with session user")
              // Create a minimal user profile from the session
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                first_name: session.user.user_metadata?.first_name || "",
                last_name: session.user.user_metadata?.last_name || "",
                role: session.user.user_metadata?.role || "borrower",
                created_at: new Date().toISOString(),
              } as UserProfile)
              setLoading(false)
              return
            }

            setError("Failed to load user profile")
            setLoading(false)
            return
          }

          // Get user metadata from auth
          const {
            data: { user: authUser },
          } = await clientSupabase.auth.getUser()

          if (!authUser) {
            setLoading(false)
            return
          }

          const userMetadata = authUser.user_metadata || {}

          // If user exists by email but with different ID, update the ID
          if (userByEmail) {
            try {
              const { data: updatedUser, error: updateError } = await clientSupabase
                .from("users")
                .update({ id: session.user.id })
                .eq("email", session.user.email || "")
                .select()
                .single()

              if (updateError) {
                console.error("Error updating user ID:", updateError)

                // If it's a network error, don't block the UI
                if (
                  updateError.message &&
                  (updateError.message.includes("Failed to fetch") || updateError.message.includes("NetworkError"))
                ) {
                  console.warn("Network error when updating user, using existing user data")
                  setUser(userByEmail as UserProfile)
                  setLoading(false)
                  return
                }

                setError("Failed to update user profile")
                setLoading(false)
                return
              }

              setUser(updatedUser as UserProfile)
            } catch (err) {
              console.error("Error updating user:", err)
              // Use the existing user data as fallback
              setUser(userByEmail as UserProfile)
            }
          } else {
            // Create a new user profile if no matching user found
            try {
              const { data: newUser, error: insertError } = await clientSupabase
                .from("users")
                .insert({
                  id: authUser.id,
                  email: authUser.email || "",
                  first_name: userMetadata.first_name || "",
                  last_name: userMetadata.last_name || "",
                  role: userMetadata.role || "borrower", // Default role
                  created_at: new Date().toISOString(),
                })
                .select()
                .single()

              if (insertError) {
                console.error("Error creating user profile:", insertError)

                // If it's a network error, don't block the UI
                if (
                  insertError.message &&
                  (insertError.message.includes("Failed to fetch") || insertError.message.includes("NetworkError"))
                ) {
                  console.warn("Network error when creating user, proceeding with session user")
                  // Create a minimal user profile from the session
                  setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    first_name: userMetadata.first_name || "",
                    last_name: userMetadata.last_name || "",
                    role: userMetadata.role || "borrower",
                    created_at: new Date().toISOString(),
                  } as UserProfile)
                  setLoading(false)
                  return
                }

                setError("Failed to create user profile")
                setLoading(false)
                return
              }

              setUser(newUser as UserProfile)
            } catch (err) {
              console.error("Error creating user:", err)
              // Create a minimal user profile from the session as fallback
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                first_name: userMetadata.first_name || "",
                last_name: userMetadata.last_name || "",
                role: userMetadata.role || "borrower",
                created_at: new Date().toISOString(),
              } as UserProfile)
            }
          }
        } catch (err) {
          console.error("Error in user profile handling:", err)
          // Create a minimal user profile from the session as fallback
          setUser({
            id: session.user.id,
            email: session.user.email || "",
            first_name: session.user.user_metadata?.first_name || "",
            last_name: session.user.user_metadata?.last_name || "",
            role: session.user.user_metadata?.role || "borrower",
            created_at: new Date().toISOString(),
          } as UserProfile)
        }
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error("Unexpected error in auth provider:", err)
      setError("An unexpected authentication error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    
    // Initial session check
    const initializeAuth = async () => {
      const { data: { session } } = await clientSupabase.auth.getSession()
      if (session) {
        await fetchUser()
      }
    }
    
    initializeAuth()

    const { data: { subscription } } = clientSupabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            await fetchUser()
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Show error toast if there's an authentication error
  useEffect(() => {
    if (error && mounted) {
      toast({
        title: "Authentication Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast, mounted])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        dbInitialized,
        initializingDb,
        initializeDb,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
