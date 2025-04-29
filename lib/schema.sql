-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(20) NOT NULL CHECK (role IN ('borrower', 'renter')),
  bio TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  notifications_email BOOLEAN DEFAULT TRUE,
  notifications_sms BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  period VARCHAR(20) NOT NULL CHECK (period IN ('day', 'week', 'month')),
  deposit DECIMAL(10, 2),
  owner_id UUID NOT NULL REFERENCES users(id),
  location VARCHAR(255),
  features JSONB,
  policies JSONB,
  images JSONB,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create rentals table if it doesn't exist
CREATE TABLE IF NOT EXISTS rentals (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  borrower_id UUID NOT NULL REFERENCES users(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  deposit_amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id UUID NOT NULL REFERENCES users(id),
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES users(id),
  receiver_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create function to get conversations
CREATE OR REPLACE FUNCTION get_conversations(user_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_name TEXT,
  avatar_url TEXT,
  last_message TEXT,
  last_message_time TIMESTAMP WITH TIME ZONE,
  unread_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH latest_messages AS (
    SELECT
      CASE
        WHEN m.sender_id = user_id THEN m.receiver_id
        ELSE m.sender_id
      END AS other_user_id,
      m.content,
      m.created_at,
      ROW_NUMBER() OVER (
        PARTITION BY 
          CASE
            WHEN m.sender_id = user_id THEN m.receiver_id
            ELSE m.sender_id
          END
        ORDER BY m.created_at DESC
      ) AS rn
    FROM messages m
    WHERE m.sender_id = user_id OR m.receiver_id = user_id
  ),
  unread_counts AS (
    SELECT
      sender_id,
      COUNT(*) AS unread
    FROM messages
    WHERE receiver_id = user_id AND read = FALSE
    GROUP BY sender_id
  )
  SELECT
    u.id AS user_id,
    CONCAT(u.first_name, ' ', u.last_name) AS user_name,
    u.avatar_url,
    lm.content AS last_message,
    lm.created_at AS last_message_time,
    COALESCE(uc.unread, 0) AS unread_count
  FROM latest_messages lm
  JOIN users u ON u.id = lm.other_user_id
  LEFT JOIN unread_counts uc ON uc.sender_id = u.id
  WHERE lm.rn = 1
  ORDER BY lm.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create storage bucket for avatars if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_catalog.pg_policies WHERE policyname = 'Allow public access to avatars'
  ) THEN
    -- This would normally be done through Supabase dashboard or API
    -- but we're including it here for completeness
    -- Note: This SQL won't actually create the bucket, it's just a placeholder
    RAISE NOTICE 'Remember to create an "avatars" storage bucket in Supabase dashboard';
  END IF;
END $$;
