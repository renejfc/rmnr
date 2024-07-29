import { describe, expect, it } from "bun:test"
import { Elysia } from "elysia"
import { integrationController, teamController, teamMembershipController, userController } from "../controllers/"
import { createEntity, deleteEntity, fetchEntity } from "./utils"

const app = new Elysia()
  .use(userController)
  .use(teamController)
  .use(teamMembershipController)
  .use(integrationController)
  .listen(3333)

async function createUser(userData: { first_name: string; last_name: string; email: string; status: string }) {
  const { response, responseBody } = await createEntity(app, "/users", userData)
  expect(response.status).toBe(201)
  console.log(response.status)
  expect(responseBody.data).toHaveProperty("user_id")
  return responseBody.data
}

async function createTeam() {
  const teamData = { name: "Development" }
  const { response, responseBody } = await createEntity(app, "/teams", teamData)
  expect(response.status).toBe(201)
  expect(responseBody.data).toHaveProperty("team_id")
  return responseBody.data
}

async function addUserToTeam(userId: number, teamId: number) {
  const membershipData = { user_id: userId, team_id: teamId }
  const { response, responseBody } = await createEntity(app, "/team-memberships", membershipData)
  expect(response.status).toBe(201)
  expect(responseBody.data).toHaveProperty("membership_id")
  return responseBody.data
}

async function removeMembership(membershipId: number) {
  const response = await deleteEntity(app, `/team-memberships/${membershipId}`)
  expect(response.status).toBe(200)
}

async function createIntegration(integrationData: { name: string; token: string; user_id: number; status: string }) {
  const { response, responseBody } = await createEntity(app, "/integrations", integrationData)
  expect(response.status).toBe(201)
  expect(responseBody.data).toHaveProperty("integration_id")
  return responseBody.data
}

describe("User, Team, and Team Membership Use Cases", () => {
  it("should create a team and add members", async () => {
    const user = await createUser({
      first_name: "Jane",
      last_name: "Doe",
      email: "jane.doe@example.com",
      status: "active",
    })
    const team = await createTeam()

    await addUserToTeam(user.user_id, team.team_id)

    const { response, responseBody } = await fetchEntity(app, `/team-memberships?team_id=${team.team_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(1)
  })

  it("should remove a member from a team", async () => {
    const user = await createUser({
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      status: "active",
    })
    const team = await createTeam()
    const membership = await addUserToTeam(user.user_id, team.team_id)

    await removeMembership(membership.membership_id)

    const { response, responseBody } = await fetchEntity(app, `/team-memberships?team_id=${team.team_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(0)
  })

  it("should add multiple users to a team", async () => {
    const user1 = await createUser({
      first_name: "Alice",
      last_name: "Smith",
      email: "alice.smith@example.com",
      status: "active",
    })

    const user2 = await createUser({
      first_name: "Bob",
      last_name: "Johnson",
      email: "bob.johnson@example.com",
      status: "active",
    })

    const team = await createTeam()

    await addUserToTeam(user1.user_id, team.team_id)
    await addUserToTeam(user2.user_id, team.team_id)

    const { response, responseBody } = await fetchEntity(app, `/team-memberships?team_id=${team.team_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(2)
  })

  it("should fetch all memberships for a user", async () => {
    const user = await createUser({
      first_name: "Frank",
      last_name: "Wright",
      email: "frank.wright@example.com",
      status: "active",
    })

    const team1 = await createTeam()
    const team2 = await createTeam()

    await addUserToTeam(user.user_id, team1.team_id)
    await addUserToTeam(user.user_id, team2.team_id)

    const { response, responseBody } = await fetchEntity(app, `/team-memberships?user_id=${user.user_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(2)
  })

  it("should remove a team and ensure memberships are deleted", async () => {
    const user = await createUser({
      first_name: "Charlie",
      last_name: "Brown",
      email: "charlie.brown@example.com",
      status: "active",
    })

    const team = await createTeam()
    await addUserToTeam(user.user_id, team.team_id)

    const deleteTeamResponse = await deleteEntity(app, `/teams/${team.team_id}`)
    expect(deleteTeamResponse.status).toBe(200)

    const { response, responseBody } = await fetchEntity(app, `/team-memberships?team_id=${team.team_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(0)
  })

  it("should update a team and verify memberships remain", async () => {
    const user = await createUser({
      first_name: "Eve",
      last_name: "Smith",
      email: "eve.smith@example.com",
      status: "active",
    })

    const team = await createTeam()
    await addUserToTeam(user.user_id, team.team_id)

    const updatedTeamData = { name: "Updated Team Name" }
    const { response: updateTeamResponse, responseBody: updateTeamBody } = await createEntity(
      app,
      `/teams/${team.team_id}`,
      updatedTeamData,
      "PUT"
    )
    expect(updateTeamResponse.status).toBe(200)
    expect(updateTeamBody.data.name).toBe(updatedTeamData.name)

    const { response: fetchMembershipResponse, responseBody: fetchMembershipBody } = await fetchEntity(
      app,
      `/team-memberships?team_id=${team.team_id}`
    )
    expect(fetchMembershipResponse.status).toBe(200)
    expect(fetchMembershipBody.data).toHaveLength(1)
  })

  it("should create multiple integrations for a user", async () => {
    const user = await createUser({
      first_name: "Damni",
      last_name: "Smith",
      email: "Damni.Damni@example.com",
      status: "active",
    })

    const integration1 = await createIntegration({
      name: "GitHub",
      token: "ghp_123456789abcdef",
      user_id: user.user_id,
      status: "active",
    })

    const integration2 = await createIntegration({
      name: "Slack",
      token: "xoxb-987654321fedcba",
      user_id: user.user_id,
      status: "active",
    })

    const { response, responseBody } = await fetchEntity(app, `/integrations?user_id=${user.user_id}`)
    expect(response.status).toBe(200)
    expect(responseBody.data).toHaveLength(2)
  })

  it("should update integration status", async () => {
    const user = await createUser({
      first_name: "Bobb",
      last_name: "Johnsonn",
      email: "bob.johnsonn@example.com",
      status: "active",
    })

    const integration = await createIntegration({
      name: "Jira",
      token: "jira_token_123",
      user_id: user.user_id,
      status: "active",
    })

    const updateData = { ...integration, status: "inactive" }
    const { response, responseBody } = await createEntity(
      app,
      `/integrations/${integration.integration_id}`,
      updateData,
      "PUT"
    )

    expect(response.status).toBe(200)
    expect(responseBody.data.status).toBe("inactive")
  })
})
