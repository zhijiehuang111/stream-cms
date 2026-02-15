import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Direct connection (port 5432) for CLI operations (migrate, db push)
    url: process.env["DIRECT_URL"]!,
  },
});
