import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://wjkxpufkdwxwzwhxufaq.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indqa3hwdWZrZHd4d3p3aHh1ZmFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0ODQzMDQsImV4cCI6MjAzNjA2MDMwNH0.3O9qDyq1mr-CBoWL3gsKEsA7VlCJ9naTdGKhoA-Qm6Y"
);
