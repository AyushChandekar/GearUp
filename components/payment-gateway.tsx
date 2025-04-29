"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { CreditCard } from "lucide-react"
import { processPayment } from "@/lib/actions"

interface PaymentGatewayProps {
  totalAmount: number
  depositAmount: number
  rentalId: number
  onSuccess: (transactionId: string) => void
  onError: (error: string) => void
}

export default function PaymentGateway({
  totalAmount,
  depositAmount,
  rentalId,
  onSuccess,
  onError,
}: PaymentGatewayProps) {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("total_amount", totalAmount.toString())
      formData.append("deposit_amount", depositAmount.toString())
      formData.append("rental_id", rentalId.toString())

      const result = await processPayment(formData)

      if (result.error) {
        toast({
          title: "Payment Failed",
          description: result.error,
          variant: "destructive",
        })
        onError(result.error)
      } else {
        toast({
          title: "Payment Successful",
          description: `Transaction ID: ${result.transaction_id}`,
        })
        onSuccess(result.transaction_id)
      }
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
      onError("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment to confirm the rental</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border rounded-md p-4 mb-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Credit / Debit Card
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4 mb-3">
                <RadioGroupItem value="upi" id="upi" />
                <Label htmlFor="upi" className="cursor-pointer">
                  UPI
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod" className="cursor-pointer">
                  Cash on Delivery
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry date</Label>
                    <Input id="expiry" placeholder="MM/YY" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name-on-card">Name on card</Label>
                  <Input id="name-on-card" required />
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div className="mt-4 space-y-2">
                <Label htmlFor="upi-id">UPI ID</Label>
                <Input id="upi-id" placeholder="name@bank" required />
              </div>
            )}

            <div className="mt-6 space-y-2">
              <div className="flex justify-between">
                <span>Rental Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Security Deposit</span>
                <span>₹{depositAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{(totalAmount + depositAmount).toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-secondary to-accent text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay ₹${(totalAmount + depositAmount).toFixed(2)}`}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Your payment information is secure. We use industry-standard encryption to protect your data.
      </CardFooter>
    </Card>
  )
}
