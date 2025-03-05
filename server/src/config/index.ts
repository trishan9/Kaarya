import { CorsOptions } from "cors";
import { env } from "./env";

const isProduction = env.NODE_ENV === "production";

export default {
  app: {
    isProduction,
    port: env.PORT || 8080,
  },
  cors: {
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      env.CLIENT_BASE_URL,
    ],
    credentials: true,
  } as CorsOptions,
  database: {
    postgres: {
      url: env.POSTGRESQL_URL,
    },
  },
  jwt: {
    access: {
      secret: env.JWT_ACCESS_SECRET,
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    },
    refresh: {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
  },
  cloudinary: {
    cloud_name: env.CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  },
  gmail: {
    emailAddress: env.GMAIL_ADDRESS,
    password: env.GMAIL_PASSWORD,
  },
  stream: {
    apiKey: env.STREAM_API_KEY,
    apiSecret: env.STREAM_API_SECRET,
  },
} as const;
