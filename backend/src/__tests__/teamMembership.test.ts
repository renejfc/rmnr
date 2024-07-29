import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { teamMembershipController } from "../controllers/"
import { createEntity, deleteEntity, fetchEntity } from "./utils"

const app = new Elysia().use(teamMembershipController).listen(3333)

describe("Team Membership CRUD", () => {
  it("should create a team membership", async () => {
    const newMembership = {
      user_id: 2,
      team_id: 2,
    }

    const { response, responseBody } = await createEntity(app, "/team-memberships", newMembership)
    expect(response.status).toBe(201)
    expect(responseBody.data).toMatchObject(newMembership)
  })

  it("should get all team memberships", async () => {
    const { response, responseBody } = await fetchEntity(app, "/team-memberships")
    expect(response.status).toBe(200)
    expect(responseBody.data).toBeInstanceOf(Array)
  })

  it("should get team memberships by team ID", async () => {
    const { response, responseBody } = await fetchEntity(app, "/team-memberships?team_id=1")
    expect(response.status).toBe(200)
    expect(responseBody.data).toBeInstanceOf(Array)
    expect(responseBody.data[0]).toHaveProperty("team_id", 1)
  })

  it("should delete a team membership", async () => {
    const response = await deleteEntity(app, "/team-memberships/1")
    expect(response.status).toBe(200)
  })
})
