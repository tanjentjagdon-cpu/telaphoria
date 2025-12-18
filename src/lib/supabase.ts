import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anon)

let client: SupabaseClient | undefined
if (isSupabaseConfigured) {
  client = createClient(url as string, anon as string)
}

export const supabase = client

