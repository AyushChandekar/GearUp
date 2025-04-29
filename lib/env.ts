// Environment configuration file
// This file centralizes all environment variables and provides type safety

// Database configuration
export const env = {
  // Supabase configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    jwtSecret: process.env.SUPABASE_JWT_SECRET,
  },

  // PostgreSQL configuration
  postgres: {
    url: process.env.POSTGRES_URL,
    prismaUrl: process.env.POSTGRES_PRISMA_URL,
    nonPoolingUrl: process.env.POSTGRES_URL_NON_POOLING,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    host: process.env.POSTGRES_HOST,
  },

  // Application configuration
  app: {
    nodeEnv: process.env.NODE_ENV || "development",
    isDevelopment: process.env.NODE_ENV === "development",
    isProduction: process.env.NODE_ENV === "production",
  },
}

// Validate required environment variables
export function validateEnv() {
  const requiredVars = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", value: env.supabase.url },
    { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", value: env.supabase.anonKey },
  ]

  const missingVars = requiredVars.filter((v) => !v.value)

  if (missingVars.length > 0) {
    console.error(`Missing required environment variables: ${missingVars.map((v) => v.key).join(", ")}`)
    return false
  }

  return true
}

// Function to mask sensitive values for display
export function getMaskedEnv() {
  const masked = {
    supabase: {
      url: env.supabase.url,
      anonKey: maskString(env.supabase.anonKey),
      serviceRoleKey: maskString(env.supabase.serviceRoleKey),
      jwtSecret: maskString(env.supabase.jwtSecret),
    },
    postgres: {
      url: maskString(env.postgres.url),
      prismaUrl: maskString(env.postgres.prismaUrl),
      nonPoolingUrl: maskString(env.postgres.nonPoolingUrl),
      user: env.postgres.user,
      password: maskString(env.postgres.password),
      database: env.postgres.database,
      host: env.postgres.host,
    },
    app: { ...env.app },
  }

  return masked
}

// Helper function to mask sensitive strings
function maskString(str?: string): string {
  if (!str) return ""
  if (str.length <= 8) return "********"
  return str.substring(0, 4) + "********" + str.substring(str.length - 4)
}
