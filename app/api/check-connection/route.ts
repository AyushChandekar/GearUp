import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      if (error.message.includes('relation "users" does not exist')) {
        return NextResponse.json({
          status: "database-exists",
          message: "Connected to Supabase but tables don't exist yet",
          error: null,
        })
      }
      return NextResponse.json(
        {
          status: "error",
          message: "Failed to connect to database",
          error: error.message,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "success",
      message: "Successfully connected to Supabase",
      data,
    })
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to database",
        error: err.message,
      },
      { status: 500 },
    )
  }
}
