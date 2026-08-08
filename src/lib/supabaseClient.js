import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vppmbfiwbfraoblifrwd.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwcG1iZml3YmZyYW9ibGlmcndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMjY2MzMsImV4cCI6MjA5ODYwMjYzM30.7vQo2G07NhCHzYAQxeUT_3noItGStl8r2jjEDO_mgps";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);