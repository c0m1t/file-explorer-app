import z from "zod";

const envSchema = z.object({
  X_SECRET_API_KEY: z.string(),
  API_URL: z.string(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const ENV = envSchema.parse(process.env);
