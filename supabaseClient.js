import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseURL = "https://ghzfpwdivvezmbsfaonn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoemZwd2RpdnZlem1ic2Zhb25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwNzEzMzcsImV4cCI6MjAzOTY0NzMzN30.B4drrT_iuBlP4X-V2s8CBUPEkhryRrOM9O51IVi3Uzg";
export const supabase = createClient(supabaseURL, supabaseAnonKey);

console.log("Supabase URL:", supabaseURL);
console.log("Supabase Key:", supabaseAnonKey);
