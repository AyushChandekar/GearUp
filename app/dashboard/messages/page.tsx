"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"
import type { UserProfile } from "@/lib/supabase"
import DashboardLayout from "@/components/dashboard/dashboard-layout"
import ConversationList from "@/components/messaging/conversation-list"
import ChatInterface from "@/components/messaging/chat-interface"

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<{
    id: string
    name: string
    avatar?: string
  } | null>(null)

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true)
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/auth/login")
          return
        }

        const { data, error } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (error) {
          console.error("Error fetching user profile:", error)
          toast({
            title: "Error",
            description: "Failed to load your profile. Please try again later.",
            variant: "destructive",
          })
          return
        }

        setUser(data)
      } catch (error) {
        console.error("Error in fetchUserProfile:", error)
        toast({
          title: "Error",
          description: "Something went wrong. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [router])

  const handleSelectConversation = (userId: string, userName: string, avatarUrl?: string) => {
    setSelectedUser({
      id: userId,
      name: userName,
      avatar: avatarUrl,
    })
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">
            {user?.role === "borrower" ? "Communicate with item owners" : "Communicate with borrowers"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          <div className="lg:col-span-1 h-full">
            <ConversationList onSelectConversation={handleSelectConversation} selectedUserId={selectedUser?.id} />
          </div>
          <div className="lg:col-span-2 h-full">
            {selectedUser ? (
              <ChatInterface
                otherUserId={selectedUser.id}
                otherUserName={selectedUser.name}
                otherUserAvatar={selectedUser.avatar}
              />
            ) : (
              <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg border">
                <div className="text-center">
                  <h3 className="font-medium text-lg">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
