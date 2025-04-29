// IMPORTANT: This file contains hardcoded credentials for development purposes only
// In production, these should be set as environment variables

export const supabaseConfig = {
  // Supabase configuration
  url: "https://emowoecrrzcwtztuaxlg.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb3dvZWNycnpjd3R6dHVheGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5ODkxOTksImV4cCI6MjA2MDU2NTE5OX0.7PqskJoMfhGoQOSYpuyURS0EJ_IHDmf8DMYQZNPB-oU",
  serviceRoleKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb3dvZWNycnpjd3R6dHVheGxnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NDk4OTE5OSwiZXhwIjoyMDYwNTY1MTk5fQ._dIGSmSNxHYaKcbfVDfIxSzk9Tdzy03DChV13pSJLSg",
  jwtSecret: "EpWXLhYvz750yvby255kjsq1dkVevcmEwe7tKBEcVP9IKW64N0OeQbxaWDD/n6dngN4EuRI/3W/XnphfwE1fUg==",
}

export const postgresConfig = {
  // PostgreSQL configuration
  url: "postgres://postgres.emowoecrrzcwtztuaxlg:WrMxZ8ncpHn6jNPk@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x",
  prismaUrl:
    "postgres://postgres.emowoecrrzcwtztuaxlg:WrMxZ8ncpHn6jNPk@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x",
  nonPoolingUrl:
    "postgres://postgres.emowoecrrzcwtztuaxlg:WrMxZ8ncpHn6jNPk@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require",
  user: "postgres",
  password: "WrMxZ8ncpHn6jNPk",
  database: "postgres",
  host: "db.emowoecrrzcwtztuaxlg.supabase.co",
}
