import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { integrationController } from "../controllers/"
import { createEntity, deleteEntity, fetchEntity } from "./utils"

const app = new Elysia().use(integrationController).listen(3333)

describe("Integration CRUD", () => {
  it("should create an integration", async () => {
    const newIntegration = {
      name: "GitHub",
      token: "ghp_123456789abcdef",
      user_id: 1,
      status: "active",
    }

    const { response, responseBody } = await createEntity(app, "/integrations", newIntegration)
    expect(response.status).toBe(201)
    expect(responseBody.data).toMatchObject(newIntegration)
  })

  it("should get all integrations", async () => {
    const { response, responseBody } = await fetchEntity(app, "/integrations")
    expect(response.status).toBe(200)
    expect(responseBody.data).toBeInstanceOf(Array)
  })

  it("should get an integration by ID", async () => {
    const { response, responseBody } = await fetchEntity(app, "/integrations/1")
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(1)
  })

  it("should update an integration", async () => {
    const updateIntegration = {
      name: "GitHub Updated",
      token: "ghp_updatedtoken",
      user_id: 1,
      status: "inactive",
    }
    const { response, responseBody } = await createEntity(app, "/integrations/1", updateIntegration, "PUT")
    expect(response.status).toBe(200)
    expect(responseBody.data).toMatchObject(updateIntegration)
  })

  it("should delete an integration", async () => {
    const response = await deleteEntity(app, "/integrations/1")
    expect(response.status).toBe(200)
  })
})
