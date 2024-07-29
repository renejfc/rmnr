# 🛠️ Project Setup

_**In order to get the apps running with the expected behaviour you'll need these:**_

## Bun
Works as runtime for TypeScript and package manager.

You can [get it here](https://bun.sh/).

---

## ⚡ Start the apps (package.json for more info)

- Frontend (cd into the folder)

First, you need to install the dependencies:
```shell
bun install
```

Then, you can run the app by using:
```shell
bun run dev
```

- Backend (cd into the folder)

First, you need to install the dependencies:
```shell
bun install
```

Then, you can run the app by using:
```shell
bun run dev
```

For testing, you can run:
```shell
bun test
```

Also you can access to the backend docs at the `/docs` route

---

# 🏗️ Architecture

## Backend
- Folder Structure:
  - `/src`:
    - `/controllers`: Using the Elysiajs framework, I decided to go for the builder-pattern-like instances approach. So basically it's a new instance per controller.
    - `/database`: Contains the database connection and the migrations. For simplicity and the app's scope, I decided to go for the built-in bun's sqlite integration with drizzle as the ORM.

## Frontend
- Folder Structure:
  - `/src`:
    - `/api`: Contains the custom api client with type-safety and more control over the requests and responses. As well as the api calls we need to make to the backend.
    - `/stores`: Global stores used to share data and actions needed across the app.
---

# 💭 Final Thoughts

Honestly this is a basic use case but of course there's a lot of room for improvement. Here's a list of things I'd like to improve:
- Authentication and authorization: This is not implemented at all.
- Rate limiting for the api.
- Extensive error handling and logging systems. I believe this is crucial for any serious project.
- Better architecture: Currently everything is just in controllers but of course a better approach would be to have a few more layers of abstraction like services and repositories.
- Better testing: There are still a few use cases that are not tested.
- Containerization