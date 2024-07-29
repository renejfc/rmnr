import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { userController } from "../controllers/user.controller"
import { createEntity, deleteEntity, fetchEntity } from "./utils"

const app = new Elysia().use(userController).listen(3333)

describe("User CRUD", () => {
  it("should create a user", async () => {
    const newUser = {
      first_name: "Johny",
      last_name: "Doe",
      email: "john@example.com",
      status: "active",
    }
    const { response, responseBody } = await createEntity(app, "/users", newUser)
    expect(response.status).toBe(201)
    expect(responseBody.data).toMatchObject(newUser)
  })

  it("should get all users", async () => {
    const { response, responseBody } = await fetchEntity(app, "/users")
    expect(response.status).toBe(200)
    expect(responseBody.data).toBeInstanceOf(Array)
  })

  it("should get a user by ID", async () => {
    const { response, responseBody } = await fetchEntity(app, "/users/1")
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(1)
  })

  it("should update a user", async () => {
    const updateUser = {
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      status: "inactive",
    }
    const { response, responseBody } = await createEntity(app, "/users/1", updateUser, "PUT")
    expect(response.status).toBe(200)
    expect(responseBody.data).toMatchObject(updateUser)
  })

  it("should delete a user", async () => {
    const response = await deleteEntity(app, "/users/1")
    expect(response.status).toBe(200)
  })
})
