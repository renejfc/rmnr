import { count, eq } from "drizzle-orm"
import { Elysia, t } from "elysia"
import { database } from "../database"
import { createIntegration, integrations } from "../database/schema/integration.schema"

export const integrationController = new Elysia({ prefix: "/integrations", tags: ["Integrations"] })
  .get("/", async () => {
    const result = await database.select().from(integrations)
    return {
      data: result,
    }
  })
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const integration = await database.select().from(integrations).where(eq(integrations.integration_id, id))
      return {
        data: integration,
      }
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    "/",
    async ({ body: data, set, error }) => {
      const result = await database.insert(integrations).values(data).returning()
      if (!result[0]) return error("Bad Request")
      set.status = "Created"
      return { data: result[0] }
    },
    { body: t.Omit(createIntegration, ["integration_id"]) }
  )
  .put(
    "/:id",
    async ({ params: { id }, body: data, set, error }) => {
      const result = await database
        .update(integrations)
        .set(data)
        .where(eq(integrations.integration_id, id))
        .returning()
      if (!result[0]) return error("Bad Request")
      set.status = "OK"
      return { data: result[0] }
    },
    { params: t.Object({ id: t.Numeric() }), body: t.Omit(createIntegration, ["integration_id"]) }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set, error }) => {
      const result = await database.delete(integrations).where(eq(integrations.integration_id, id)).returning()
      if (!result[0]) return error("Bad Request")
      set.status = "OK"
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .get("/count", async () => {
    const [{ count: result }] = await database.select({ count: count() }).from(integrations)
    return result
  })
