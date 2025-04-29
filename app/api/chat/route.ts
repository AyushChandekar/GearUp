import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyCjfY-Gcg6s1PubhZn85TGQ_3Zlg-h5wOw"
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Format conversation history for Gemini API
    const formattedHistory = history.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }))

    // Add the new user message
    formattedHistory.push({
      role: "user",
      parts: [{ text: message }],
    })

    // Prepare the system prompt
    const systemPrompt = {
      role: "system",
      parts: [
        {
          text: `You are the GEARUP assistant, a helpful chatbot for a rental marketplace in Pune, Maharashtra, India. 
          GEARUP allows users to rent items like furniture, electronics, vehicles, and more.
          
          Important information:
          - GEARUP currently only operates in Pune, Maharashtra
          - Users can either be borrowers (who rent items) or renters (who list items for rent)
          - All prices are in Indian Rupees (₹)
          - Be friendly, concise, and helpful
          - If asked about locations outside Pune, politely mention that GEARUP only operates in Pune currently
          - Focus on providing information about rental services, pricing, policies, and how the platform works
          
          Keep your responses brief, friendly, and focused on helping users with their rental needs.`,
        },
      ],
    }

    // Add system prompt to the beginning of the conversation
    const conversationWithSystemPrompt = [systemPrompt, ...formattedHistory]

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: conversationWithSystemPrompt,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't process that request. How else can I help you with GEARUP's rental services in Pune?"

    return NextResponse.json({ response: generatedText })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
