import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { integrationController, teamController, teamMembershipController, userController } from "./controllers"

const app = new Elysia()
  .use(cors())
  .group("/api", app =>
    app.group("/v1", app =>
      app.use(userController).use(teamController).use(teamMembershipController).use(integrationController)
    )
  )
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: "Rmnr API Documentation",
          description: "A simple API to manage teams, users and integrations",
          version: "1.0.0",
        },
        tags: [
          { name: "Users", description: "User related endpoints" },
          { name: "Teams", description: "Team related endpoints" },
          { name: "Team Memberships", description: "Team membership related endpoints" },
          { name: "Integrations", description: "Integration related endpoints" },
        ],
      },
    })
  )
  .listen(3000)

console.log(`Server is running at ${app.server?.url}`)
console.log(`Visit the docs at ${app.server?.url}/docs`)
