import { integer, sqliteTable, unique } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-typebox"
import { teams } from "./team.schema"
import { users } from "./user.schema"

export const teams_memberships = sqliteTable(
  "teams_memberships",
  {
    membership_id: integer("membership_id").primaryKey({ autoIncrement: true }),
    user_id: integer("user_id")
      .references(() => users.user_id)
      .notNull(),
    team_id: integer("team_id")
      .references(() => teams.team_id)
      .notNull(),
  },
  teams_memberships => ({
    uniqueUserTeam: unique().on(teams_memberships.user_id, teams_memberships.team_id),
  })
)

export const createTeamMembership = createInsertSchema(teams_memberships)
