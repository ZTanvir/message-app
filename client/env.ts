import z from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url(),
});

const result = envSchema.safeParse(import.meta.env);

if (!result.success) {
  const formatError = z.prettifyError(result.error);
  console.error(formatError);
}

const viteEnv = result.data;

export default viteEnv;
