import * as z from "zod";

export const LoginData = z.object({
  email: z.email(),
  password: z.string().min(8),
});
