import { count, eq } from "drizzle-orm"
import { Elysia, t } from "elysia"
import { database } from "../database"
import { createTeamMembership, teams_memberships } from "../database/schema/team_membership.schema"

export const teamMembershipController = new Elysia({ prefix: "/team-memberships", tags: ["Teams Memberships"] })
  .get(
    "/",
    async ({ query: { team_id, user_id } }) => {
      if (team_id) {
        const result = await database.select().from(teams_memberships).where(eq(teams_memberships.team_id, team_id))
        return { data: result }
      }

      if (user_id) {
        const result = await database.select().from(teams_memberships).where(eq(teams_memberships.user_id, user_id))
        return { data: result }
      }

      const result = await database.select().from(teams_memberships)
      return { data: result }
    },
    { query: t.Optional(t.Object({ team_id: t.Optional(t.Numeric()), user_id: t.Optional(t.Numeric()) })) }
  )
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const membership = await database.select().from(teams_memberships).where(eq(teams_memberships.membership_id, id))
      return {
        data: membership,
      }
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    "/",
    async ({ body: data, set, error }) => {
      const result = await database.insert(teams_memberships).values(data).returning()
      if (!result[0]) return error("Bad Request")

      set.status = "Created"
      return { data: result[0] }
    },
    { body: t.Omit(createTeamMembership, ["membership_id"]) }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set, error }) => {
      const result = await database.delete(teams_memberships).where(eq(teams_memberships.membership_id, id)).returning()
      if (!result[0]) return error("Bad Request")

      set.status = "OK"
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
