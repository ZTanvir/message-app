import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

if (isDevelopment) {
  dotenv.config({
    path: path.join(__dirname, `/.env`),
  });
} else if (isTest) {
  dotenv.config({
    path: path.join(__dirname, `/.env.${process.env.NODE_ENV}`),
  });
} else if (isProduction) {
  dotenv.config({
    path: path.join(__dirname, `/.env.${process.env.NODE_ENV}`),
  });
}
const envSchema = z.object({
  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_STAGE: z
    .enum(["development", "production", "test"])
    .default("development"),
  //   Server configuration
  PORT: z.coerce.number().positive(),
  //   Database
  DATABASE_URL: z.string().startsWith("postgresql://"),
  JWT_SECRET: z.string().min(32, "Jwt secret must contain 32 characters"),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Invalid environment variable");
    const formatError = z.prettifyError(error);
    console.error(formatError);
    process.exit(1);
  }
  throw error;
}

export default env;
