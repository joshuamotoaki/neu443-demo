import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://<your_supabase_url>.supabase.co",
    "<your_supabase_key>"
);
