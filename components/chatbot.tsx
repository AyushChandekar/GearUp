"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Predefined Q&A for quick responses
const predefinedQA: Record<string, string> = {
  "hi": "Hello! How can I help you with GEARUP today?",
  "hello": "Hi there! Looking for something to rent in Pune?",
  "what is gearup": "GEARUP is a rental platform in Pune where you can rent various items like furniture, appliances, electronics, and more.",
  "how does it work": "It's simple! Browse our catalog, select what you need, choose a rental duration, and we'll deliver it to your doorstep in Pune.",
  "pricing": "Our pricing varies based on the item and rental duration. You can check specific prices in our catalog. We offer daily, weekly, and monthly rental plans.",
  "delivery": "We offer free delivery for orders above ₹1000 within Pune city limits. For other areas, a nominal delivery fee applies.",
  "contact": "You can reach our customer support at support@gearup.in or call us at +91-1234567890.",
  "rental duration": "We offer flexible rental durations starting from 1 day to several months depending on the product category.",
  "security deposit": "A refundable security deposit is required for most items, which will be returned when you return the item in good condition.",
  "cancellation policy": "Free cancellation up to 24 hours before your scheduled delivery. After that, a cancellation fee may apply.",
  "available locations": "Currently we serve all areas in Pune. We're planning to expand to other cities soon!",
  "payment methods": "We accept all major credit/debit cards, UPI, netbanking, and cash on delivery."
}

// Keywords mapping to questions for better matching
const keywordMap: Record<string, string[]> = {
  "work": ["how does it work"],
  "rent": ["how does it work", "rental duration"],
  "return": ["security deposit", "cancellation policy"],
  "cost": ["pricing"],
  "pay": ["payment methods", "pricing"],
  "ship": ["delivery"],
  "deliver": ["delivery"],
  "deposit": ["security deposit"],
  "cancel": ["cancellation policy"],
  "fee": ["pricing", "delivery"],
  "price": ["pricing"],
  "pune": ["available locations"],
  "location": ["available locations"],
  "contact": ["contact"],
  "phone": ["contact"],
  "email": ["contact"],
  "call": ["contact"],
  "support": ["contact"],
  "about": ["what is gearup"],
  "duration": ["rental duration"],
  "period": ["rental duration"],
  "time": ["rental duration"],
  "refund": ["cancellation policy", "security deposit"],
  "service": ["what is gearup", "how does it work"],
  "catalog": ["how does it work"]
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm the GEARUP assistant. How can I help you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if there's a predefined answer for the user's question
  const checkPredefinedAnswers = (userMessage: string): string | null => {
    const normalizedInput = userMessage.toLowerCase().trim()
    
    // Check for exact matches
    if (predefinedQA[normalizedInput]) {
      return predefinedQA[normalizedInput]
    }
    
    // Check for partial matches in the keys
    for (const [question, answer] of Object.entries(predefinedQA)) {
      if (normalizedInput.includes(question) || question.includes(normalizedInput)) {
        return answer
      }
    }
    
    // Check for keyword matches
    const words = normalizedInput.split(/\s+/)
    for (const word of words) {
      if (keywordMap[word]) {
        // Get the first matching predefined question
        const matchedQuestion = keywordMap[word][0]
        return predefinedQA[matchedQuestion]
      }
    }
    
    // Get answer for general inquiries about how it works
    if (normalizedInput.includes("working") || 
        normalizedInput.includes("function") || 
        normalizedInput.includes("steps") ||
        normalizedInput.includes("process") ||
        (normalizedInput.includes("how") && normalizedInput.includes("use"))) {
      return predefinedQA["how does it work"]
    }
    
    return null
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!input.trim()) return

    const userMessage = input
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    // Check for predefined answers first
    const predefinedAnswer = checkPredefinedAnswers(userMessage)
    
    if (predefinedAnswer) {
      // Use predefined answer if available
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "assistant", content: predefinedAnswer }])
        setIsLoading(false)
      }, 500) // Small delay to simulate typing
    } else {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            history: messages,
          }),
        })

        if (!response.ok) {
          throw new Error("Failed to get response")
        }

        const data = await response.json()
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }])
      } catch (error) {
        // Fallback response if API call fails
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I can help you find rental items in Pune or answer questions about GEARUP services. What are you looking for today?",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-20 right-4 md:right-6 z-50 w-[90vw] max-w-[400px] shadow-xl"
          >
            <Card className="overflow-hidden flex flex-col h-[500px] max-h-[80vh]">
              <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="GEARUP Assistant" />
                    <AvatarFallback>GA</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">GEARUP Assistant</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Typing...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-6 z-50 rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary/90 shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </>
  )
}
