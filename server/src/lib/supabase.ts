import { createClient } from "@supabase/supabase-js";
import env from "../../env.ts";

const supabase = createClient(
  env.PUBLIC_SUPABASE_URL,
  env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
);

export default supabase;
