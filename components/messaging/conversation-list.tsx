"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getConversations } from "@/lib/actions"

interface Conversation {
  user_id: string
  user_name: string
  avatar_url?: string
  last_message: string
  last_message_time: string
  unread_count: number
}

interface ConversationListProps {
  onSelectConversation: (userId: string, userName: string, avatarUrl?: string) => void
  selectedUserId?: string
}

export default function ConversationList({ onSelectConversation, selectedUserId }: ConversationListProps) {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fetchConversations = async () => {
      setIsLoading(true)
      try {
        const result = await getConversations()
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          })
        } else if (result.conversations) {
          setConversations(result.conversations)
          setFilteredConversations(result.conversations)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchConversations()

    // Set up polling for new messages
    const interval = setInterval(fetchConversations, 30000)

    return () => clearInterval(interval)
  }, [toast, isMounted])

  useEffect(() => {
    if (!isMounted) return

    if (searchQuery) {
      const filtered = conversations.filter((conversation) =>
        conversation.user_name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredConversations(filtered)
    } else {
      setFilteredConversations(conversations)
    }
  }, [searchQuery, conversations, isMounted])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  if (!isMounted) {
    return null
  }

  return (
    <Card className="h-full">
      <CardHeader className="border-b">
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <CardContent className="p-0 overflow-y-auto h-[calc(100%-8rem)]">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex justify-center items-center h-40 text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        ) : (
          <div className="divide-y">
            {filteredConversations.map((conversation) => (
              <Button
                key={conversation.user_id}
                variant="ghost"
                className={`w-full justify-start px-4 py-3 h-auto ${
                  selectedUserId === conversation.user_id ? "bg-muted" : ""
                }`}
                onClick={() =>
                  onSelectConversation(conversation.user_id, conversation.user_name, conversation.avatar_url)
                }
              >
                <div className="flex items-center gap-3 w-full">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.avatar_url || "/placeholder.svg"} alt={conversation.user_name} />
                      <AvatarFallback>{getInitials(conversation.user_name)}</AvatarFallback>
                    </Avatar>
                    {conversation.unread_count > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversation.user_name}</p>
                      <p className="text-xs text-muted-foreground">{formatTime(conversation.last_message_time)}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.last_message}</p>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
