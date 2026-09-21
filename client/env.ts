import z from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_SUPABASE_PUBLIC_URL: z.string("Supabase image public url is missing."),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  const formatError = z.prettifyError(result.error);
  throw new Error(formatError);
}

const viteEnv = result.data;

export default viteEnv;
