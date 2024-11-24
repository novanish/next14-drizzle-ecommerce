import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
