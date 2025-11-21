import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "prisma/config";

expand(config({ path: ".env.local" }));

// Placeholder URL for Prisma client generation when DATABASE_URL is not available
// This allows `prisma generate` to run during dependency installation
// The actual DATABASE_URL is required at runtime for database operations
const PLACEHOLDER_DATABASE_URL = "postgresql://localhost:5432/dev";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL || PLACEHOLDER_DATABASE_URL,
  },
});
