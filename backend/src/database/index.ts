import { Database } from "bun:sqlite"
import { drizzle } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { DB_DEV, DB_MEMORY, DB_PROD, OUT_DIR } from "./database.config"

const getDbFile = (env?: string) => {
  if (!env) throw new Error("NODE_ENV is not set")
  switch (env) {
    case "production":
      return DB_PROD
    case "development":
      return DB_DEV
    case "test":
      return DB_MEMORY
  }
}

export const sqlite = new Database(getDbFile(import.meta.env.NODE_ENV))
export const database = drizzle(sqlite)
migrate(database, { migrationsFolder: OUT_DIR })
