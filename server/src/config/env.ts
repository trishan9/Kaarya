import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().optional(),
  NODE_ENV: z.string().optional(),
  CLIENT_BASE_URL: z.string().url(),
  POSTGRESQL_URL: z.string().startsWith("postgres"),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  GMAIL_ADDRESS: z.string().email(),
  GMAIL_PASSWORD: z.string(),
  STREAM_API_KEY: z.string(),
  STREAM_API_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
