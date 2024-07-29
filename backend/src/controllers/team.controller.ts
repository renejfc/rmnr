import { count, eq } from "drizzle-orm"
import { Elysia, t } from "elysia"
import { database } from "../database"
import { createTeam, teams } from "../database/schema/team.schema"
import { teams_memberships } from "../database/schema/team_membership.schema"

export const teamController = new Elysia({ prefix: "/teams", tags: ["Teams"] })
  .get("/", async () => {
    const result = await database.select().from(teams)
    return { data: result }
  })
  .get(
    "/:id",
    async ({ params: { id }, error }) => {
      const team = await database.select().from(teams).where(eq(teams.team_id, id))
      if (!team[0]) return error("Not Found")

      return { data: team }
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    "/",
    async ({ body: data, set, error }) => {
      const result = await database.insert(teams).values(data).returning()
      if (!result[0]) return error("Bad Request")

      set.status = "Created"
      return { data: result[0] }
    },
    { body: t.Omit(createTeam, ["team_id"]) }
  )
  .put(
    "/:id",
    async ({ params: { id }, body: data, set, error }) => {
      const result = await database.update(teams).set(data).where(eq(teams.team_id, id)).returning()
      if (!result[0]) return error("Bad Request")

      set.status = "OK"
      return { data: result[0] }
    },
    { params: t.Object({ id: t.Numeric() }), body: t.Omit(createTeam, ["team_id"]) }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set, error }) => {
      await database.delete(teams_memberships).where(eq(teams_memberships.team_id, id))
      const result = await database.delete(teams).where(eq(teams.team_id, id)).returning()
      if (!result[0]) return error("Bad Request")

      set.status = "OK"
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .get("/count", async () => {
    const [{ count: result }] = await database.select({ count: count() }).from(teams)
    return result
  })
