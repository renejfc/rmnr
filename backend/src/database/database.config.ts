import type { Config } from "drizzle-kit"

export const DB_PROD = "./src/database/database.prod.db"
export const DB_DEV = "./src/database/database.dev.db"
export const DB_MEMORY = ":memory:"
export const OUT_DIR = "./src/database/drizzle"

export default {
  dialect: "sqlite",
  out: OUT_DIR,
  schema: "./src/database/schema/*.schema.ts",
} satisfies Config
