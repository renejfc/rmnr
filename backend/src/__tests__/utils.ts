import type Elysia from "elysia"

export async function createEntity(app: Elysia, endpoint: string, data: any, method: "POST" | "PUT" = "POST") {
  const response = await app.handle(
    new Request(`http://localhost${endpoint}`, {
      method,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    })
  )

  const responseBody = await response.json()
  return { response, responseBody }
}

export async function fetchEntity(app: Elysia, endpoint: string) {
  const response = await app.handle(new Request(`http://localhost${endpoint}`))
  const responseBody = await response.json()
  return { response, responseBody }
}

export async function deleteEntity(app: Elysia, endpoint: string) {
  const response = await app.handle(new Request(`http://localhost${endpoint}`, { method: "DELETE" }))
  return response
}
