import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
//hjhjhjhjhhjhjh
const supabaseURL = "https://ghzfpwdivvezmbsfaonn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
export const supabase = createClient(supabaseURL, supabaseAnonKey);