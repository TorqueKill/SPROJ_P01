import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("SUPABASE_URL or ANON_KEY environment variable is missing");
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase