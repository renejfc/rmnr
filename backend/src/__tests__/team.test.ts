import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { teamController } from "../controllers/"
import { createEntity, deleteEntity, fetchEntity } from "./utils"

const app = new Elysia().use(teamController).listen(3333)

describe("Team CRUD", () => {
  it("should create a team", async () => {
    const newTeam = { name: "Team A" }
    const { response, responseBody } = await createEntity(app, "/teams", newTeam)
    expect(response.status).toBe(201)
    expect(responseBody.data).toMatchObject(newTeam)
  })

  it("should get all teams", async () => {
    const { response, responseBody } = await fetchEntity(app, "/teams")
    expect(response.status).toBe(200)
    expect(responseBody.data).toBeInstanceOf(Array)
  })

  it("should get a team by ID", async () => {
    const { response, responseBody } = await fetchEntity(app, "/teams/1")
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(1)
  })

  it("should update a team", async () => {
    const updateTeam = { name: "Team B" }
    const { response, responseBody } = await createEntity(app, "/teams/1", updateTeam, "PUT")
    expect(response.status).toBe(200)
    expect(responseBody.data).toMatchObject(updateTeam)
  })

  it("should delete a team", async () => {
    const response = await deleteEntity(app, "/teams/1")
    expect(response.status).toBe(200)
  })
})
