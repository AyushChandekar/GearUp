"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import ThemeToggle from "@/components/theme-toggle"
import Image from "next/image"

export default function LoginPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [mobileNumber, setMobileNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpField, setShowOtpField] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userRole, setUserRole] = useState("borrower")

  const handleMobileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileNumber.length !== 10) {
      toast({
        title: "Invalid mobile number",
        description: "Please enter a valid 10-digit mobile number",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would call an API to send OTP
    setShowOtpField(true)
    toast({
      title: "OTP Sent",
      description: `OTP sent to ${mobileNumber}. Valid for 10 minutes.`,
    })
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would verify the OTP with an API
    toast({
      title: "Login Successful",
      description: "You have been logged in successfully",
    })

    // Redirect based on user role
    if (userRole === "borrower") {
      router.push("/dashboard/borrower")
    } else {
      router.push("/dashboard/renter")
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would verify credentials with an API
    toast({
      title: "Login Successful",
      description: "You have been logged in successfully",
    })

    // Redirect based on user role
    if (userRole === "borrower") {
      router.push("/dashboard/borrower")
    } else {
      router.push("/dashboard/renter")
    }
  }

  const handleGoogleSignIn = () => {
    // In a real app, you would implement Google Sign-In
    toast({
      title: "Google Sign-In",
      description: "Google Sign-In would be triggered here",
    })

    // Redirect based on user role
    if (userRole === "borrower") {
      router.push("/dashboard/borrower")
    } else {
      router.push("/dashboard/renter")
    }
  }

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} />
            <span className="text-xl font-bold text-primary">GEARUP</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <motion.div
          className="w-full max-w-md space-y-6 bg-card p-6 md:p-8 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>

          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>I want to:</Label>
              <RadioGroup defaultValue="borrower" className="flex gap-4" value={userRole} onValueChange={setUserRole}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="borrower" id="borrower" />
                  <Label htmlFor="borrower" className="cursor-pointer">
                    Borrow Items
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="renter" id="renter" />
                  <Label htmlFor="renter" className="cursor-pointer">
                    Rent Out My Items
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Tabs defaultValue="mobile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobile">Mobile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
            </TabsList>

            <TabsContent value="mobile" className="space-y-4">
              {!showOtpField ? (
                <motion.form
                  onSubmit={handleMobileSubmit}
                  className="space-y-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  <motion.div className="space-y-2" variants={item}>
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex">
                      <div className="flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-muted">
                        +91
                      </div>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="Enter your 10-digit mobile number"
                        className="rounded-l-none"
                        value={mobileNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          if (value.length <= 10) {
                            setMobileNumber(value)
                          }
                        }}
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={item}>
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                    >
                      Send OTP
                    </Button>
                  </motion.div>
                </motion.form>
              ) : (
                <motion.form
                  onSubmit={handleOtpSubmit}
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={() => {
                          toast({
                            title: "OTP Resent",
                            description: `New OTP sent to ${mobileNumber}. Valid for 10 minutes.`,
                          })
                        }}
                      >
                        Resend OTP
                      </button>
                    </div>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "")
                        if (value.length <= 6) {
                          setOtp(value)
                        }
                      }}
                      required
                      className="text-center tracking-widest text-lg"
                    />
                    <p className="text-xs text-muted-foreground">OTP sent to +91 {mobileNumber}</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                  >
                    Verify & Login
                  </Button>

                  <Button type="button" variant="outline" className="w-full" onClick={() => setShowOtpField(false)}>
                    Change Number
                  </Button>
                </motion.form>
              )}
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <motion.form
                onSubmit={handleEmailSubmit}
                className="space-y-4"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div className="space-y-2" variants={item}>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div className="space-y-2" variants={item}>
                  <div className="flex justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </motion.div>

                <motion.div variants={item}>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 text-white"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.form>
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
