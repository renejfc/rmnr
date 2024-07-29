import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-typebox"

export const users = sqliteTable("users", {
  user_id: integer("user_id").primaryKey({ autoIncrement: true }),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").unique().notNull(),
  status: text("status").notNull(),
})

export const createUser = createInsertSchema(users)
