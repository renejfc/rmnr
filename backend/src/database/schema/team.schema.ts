import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema } from "drizzle-typebox"

export const teams = sqliteTable("teams", {
  team_id: integer("team_id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
})

export const createTeam = createInsertSchema(teams)
