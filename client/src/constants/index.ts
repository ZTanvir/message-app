import viteEnv from "../../env";

export const maxFileSize = 2 * 1024 * 1024; // 2MB
export const supabaseBucketUrl = `${viteEnv.VITE_SUPABASE_PUBLIC_URL}/message_app`;
