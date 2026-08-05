import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number"),
});

export const SignUpFormSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/\d/, "Password must contain at least one number"),
});
