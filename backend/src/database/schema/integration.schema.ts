import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-typebox"
import { users } from "./user.schema"

export const integrations = sqliteTable("integrations", {
  integration_id: integer("integration_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  token: text("token").notNull(),
  user_id: integer("user_id")
    .references(() => users.user_id)
    .notNull(),
  status: text("status").notNull(),
})

export const createIntegration = createInsertSchema(integrations)
