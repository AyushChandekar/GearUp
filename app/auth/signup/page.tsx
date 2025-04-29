"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import type { UserRole } from "@/lib/supabase"
import { Loader2 } from "lucide-react"
import Image from "next/image"

export default function SignupPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [role, setRole] = useState<UserRole>("borrower")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if user already exists in auth
      const { data: existingAuth, error: authCheckError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (existingAuth?.user) {
        // User already exists and password is correct, just redirect them
        toast({
          title: "Account exists",
          description: "You already have an account. Redirecting to dashboard.",
        })

        // Get user role from the users table
        const { data: userData } = await supabase.from("users").select("role").eq("id", existingAuth.user.id).single()

        const userRole = userData?.role || "borrower"
        router.push(`/dashboard/${userRole}`)
        return
      }

      // Check if email exists in users table
      const { data: existingUser } = await supabase.from("users").select("email").eq("email", email).maybeSingle()

      if (existingUser) {
        toast({
          title: "Email already in use",
          description: "This email is already registered. Please use a different email or try logging in.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create auth user
      const { data, error } = await supabase.auth.signUp({
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

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from("users").upsert(
          {
            id: data.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone: phone || null,
            role,
            created_at: new Date().toISOString(),
          },
          {
            onConflict: "email",
            ignoreDuplicates: false,
          },
        )

        if (profileError) {
          console.error("Error creating user profile:", profileError)
          toast({
            title: "Profile creation failed",
            description: profileError.message,
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        })

        // Redirect based on role
        router.push(`/dashboard/${role}`)
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image src="/logo.jpeg" alt="GearUp Logo" width={32} height={32} />
                <span className="text-xl font-bold">GearUp</span>
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>I want to</Label>
              <RadioGroup
                defaultValue="borrower"
                value={role}
                onValueChange={(value) => setRole(value as UserRole)}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="borrower" id="borrower" />
                  <Label htmlFor="borrower" className="font-normal">
                    Borrow items (Borrower)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="renter" id="renter" />
                  <Label htmlFor="renter" className="font-normal">
                    Rent out my items (Renter)
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
