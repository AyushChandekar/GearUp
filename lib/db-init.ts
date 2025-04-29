import { supabase } from "@/lib/supabase"

// Read the schema SQL
const schema = `
-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL CHECK (role IN ('borrower', 'renter')),
  bio TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  notifications_email BOOLEAN DEFAULT TRUE,
  notifications_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('day', 'week', 'month')),
  deposit DECIMAL(10, 2) NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.users(id),
  location TEXT NOT NULL,
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  policies JSONB NOT NULL DEFAULT '[]'::JSONB,
  images JSONB NOT NULL DEFAULT '[]'::JSONB,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id),
  borrower_id UUID NOT NULL REFERENCES public.users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id),
  user_id UUID NOT NULL REFERENCES public.users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.users(id),
  receiver_id UUID NOT NULL REFERENCES public.users(id),
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create function to get conversations
CREATE OR REPLACE FUNCTION public.get_conversations(user_id UUID)
RETURNS TABLE (
  user_id UUID,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $
BEGIN
  RETURN QUERY
  WITH conversations AS (
    SELECT
      CASE
        WHEN m.sender_id = user_id THEN m.receiver_id
        ELSE m.sender_id
      END AS other_user_id,
      m.content,
      m.created_at,
      m.read
    FROM
      public.messages m
    WHERE
      m.sender_id = user_id OR m.receiver_id = user_id
  ),
  latest_messages AS (
    SELECT
      c.other_user_id,
      c.content,
      c.created_at,
      c.read,
      ROW_NUMBER() OVER (PARTITION BY c.other_user_id ORDER BY c.created_at DESC) AS rn
    FROM
      conversations c
  ),
  unread_counts AS (
    SELECT
      c.other_user_id,
      COUNT(*) AS unread_count
    FROM
      conversations c
    WHERE
      c.read = FALSE AND c.sender_id = c.other_user_id
    GROUP BY
      c.other_user_id
  )
  SELECT
    u.id AS user_id,
    u.first_name,
    u.last_name,
    u.avatar_url,
    lm.content AS last_message,
    lm.created_at AS last_message_time,
    COALESCE(uc.unread_count, 0) AS unread_count
  FROM
    latest_messages lm
  JOIN
    public.users u ON u.id = lm.other_user_id
  LEFT JOIN
    unread_counts uc ON uc.other_user_id = lm.other_user_id
  WHERE
    lm.rn = 1
  ORDER BY
    lm.created_at DESC;
END;
$ LANGUAGE plpgsql;
`

export async function initializeDatabase() {
  try {
    // Execute the schema SQL
    const { error } = await supabase.rpc("exec_sql", { sql: schema })

    if (error) {
      console.error("Error initializing database:", error)

      // Try alternative approach if RPC method is not available
      const statements = schema.split(";").filter((stmt) => stmt.trim())

      for (const statement of statements) {
        const { error } = await supabase.sql(statement)
        if (error) {
          console.error("Error executing SQL statement:", error)
        }
      }
    }

    return { success: true }
  } catch (err) {
    console.error("Failed to initialize database:", err)
    return { success: false, error: err }
  }
}

// Check if tables exist with improved error handling
export async function checkTablesExist() {
  try {
    // Use a simple query with timeout to check if tables exist
    const { data, error } = (await Promise.race([
      supabase.from("users").select("id").limit(1),
      new Promise<{ data: null; error: Error }>((resolve) =>
        setTimeout(
          () =>
            resolve({
              data: null,
              error: new Error("Database query timed out"),
            }),
          5000,
        ),
      ),
    ])) as any

    // If no error, table exists
    if (!error) {
      return true
    }

    // If error is about relation not existing, table doesn't exist
    if (error.message && error.message.includes("relation") && error.message.includes("does not exist")) {
      return false
    }

    // For network errors, assume we can't connect to the database
    if (error.message && (error.message.includes("Failed to fetch") || error.message.includes("NetworkError"))) {
      console.error("Network error when checking tables:", error)
      // Return true to prevent unnecessary initialization attempts that would also fail
      return true
    }

    // For other errors, log and assume table might not exist
    console.error("Error checking if tables exist:", error)
    return false
  } catch (err) {
    console.error("Failed to check if tables exist:", err)
    // Return true to prevent unnecessary initialization attempts that would also fail
    return true
  }
}
