import * as z from "zod";

export const LoginValidationSchema = z.object({
  email: z.email().trim(),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be with in 255 characters")
    .regex(/\d/, "Password must contain at least one number"),
});

export const SignUpValidationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(50, "First name must be with in 50 characters"),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(50, "Last name must be with in 50 characters"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be with in 255 characters")
    .regex(/\d/, "Password must contain at least one number"),
});
