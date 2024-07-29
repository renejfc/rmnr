import { count, eq } from "drizzle-orm"
import { Elysia, t } from "elysia"
import { database } from "../database"
import { integrations } from "../database/schema/integration.schema"
import { createUser, users } from "../database/schema/user.schema"

export const userController = new Elysia({ prefix: "/users", tags: ["Users"] })
  .get("/", async () => {
    const result = await database.select().from(users)

    return {
      data: result,
    }
  })
  .get(
    "/:id",
    async ({ params: { id } }) => {
      const user = await database.select().from(users).where(eq(users.user_id, id))
      return {
        data: user,
      }
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .post(
    "/",
    async ({ body: data, set, error }) => {
      const result = await database.insert(users).values(data).returning()

      if (!result[0]) return error("Bad Request")

      set.status = "Created"
      return { data: result[0] }
    },
    { body: t.Omit(createUser, ["user_id"]) }
  )
  .put(
    "/:id",
    async ({ params: { id }, body: data, set, error }) => {
      const result = await database.update(users).set(data).where(eq(users.user_id, id)).returning()

      if (!result[0]) return error("Bad Request")
      set.status = "OK"
      return { data: result[0] }
    },
    { params: t.Object({ id: t.Numeric() }), body: t.Omit(createUser, ["user_id"]) }
  )
  .delete(
    "/:id",
    async ({ params: { id }, set, error }) => {
      await database.delete(integrations).where(eq(integrations.user_id, id))
      const result = await database.delete(users).where(eq(users.user_id, id)).returning()
      if (!result[0]) return error("Bad Request")
      set.status = "OK"
    },
    { params: t.Object({ id: t.Numeric() }) }
  )
  .get("/count", async () => {
    const [{ count: result }] = await database.select({ count: count() }).from(users)
    return result
  })
