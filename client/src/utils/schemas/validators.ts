import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number"),
});
