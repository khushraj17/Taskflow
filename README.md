# TaskFlow — Full-Stack Task Management App

A full-stack task management application built to learn backend engineering, database integration, authentication, and real-world deployment.

**Live Demo:** [TaskFlow](https://taskflow-bay-eight.vercel.app/)  
**API Documentation:** [FastAPI Swagger UI](https://taskflow-api-zawc.onrender.com/docs)

---

## About the Project

TaskFlow started as a way to move beyond writing individual APIs and understand how a complete application works in a real deployment environment.

While building it, I worked with a React frontend, a FastAPI backend, SQLAlchemy for database operations, PostgreSQL for persistent storage, and JWT-based authentication.

The main goal was not just to make the application work locally, but to understand how its frontend, backend, and database communicate after deployment.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Frontend development and build tooling |
| Python | Backend programming |
| FastAPI | Building REST APIs |
| SQLAlchemy | ORM and database operations |
| PostgreSQL | Persistent relational data storage |
| Neon | Managed cloud PostgreSQL database |
| JWT | Authentication and access tokens |
| Pydantic | Request validation and response schemas |
| Git & GitHub | Version control and source code management |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## What I Learned

### 1. Backend Development with FastAPI

- Building REST API endpoints using HTTP methods such as `GET`, `POST`, `PATCH`, and `DELETE`.
- Structuring API routes for tasks and authentication.
- Using path parameters, query parameters, and request bodies.
- Validating incoming data with Pydantic schemas.
- Returning structured responses with response models.
- Understanding HTTP status codes and API error handling.
- Exploring middleware and request-processing behavior.
- Testing APIs through Swagger UI.

### 2. Database Engineering

- Connecting FastAPI to PostgreSQL.
- Using SQLAlchemy models to represent database tables.
- Understanding ORM-based CRUD operations.
- Defining primary keys, foreign keys, and relationships between users and tasks.
- Using SQLAlchemy sessions to manage database operations.
- Understanding dependency injection with FastAPI's `Depends()`.
- Using a `get_db()` generator to provide and close database sessions.
- Moving from a local PostgreSQL database to a managed cloud database with Neon.
- Creating database tables from SQLAlchemy metadata.
- Verifying persisted data with SQL queries.

### 3. Authentication and Security

- Hashing passwords instead of storing plain-text passwords.
- Verifying passwords during login.
- Generating and decoding JWT access tokens.
- Understanding token expiration and authentication dependencies.
- Using `OAuth2PasswordBearer` to extract bearer tokens.
- Identifying the importance of protecting routes with authenticated users.
- Learning why task ownership checks are necessary to prevent users from accessing other users' data.
- Keeping secrets and database credentials in environment variables.

### 4. Frontend–Backend Integration

- Connecting a React application to a FastAPI backend.
- Sending HTTP requests from the frontend.
- Managing API base URLs using Vite environment variables.
- Understanding why `localhost` URLs must be replaced with deployed service URLs in production.
- Learning how browser CORS restrictions affect cross-origin API requests.
- Configuring FastAPI CORS to allow requests from the deployed frontend.
- Debugging failed requests using browser developer tools.

### 5. Deployment and Production Configuration

- Pushing project code to GitHub.
- Deploying the frontend on Vercel.
- Deploying the backend on Render.
- Connecting the deployed backend to Neon PostgreSQL.
- Configuring environment variables in a hosting dashboard.
- Understanding why `.env` files and credentials must not be committed to GitHub.
- Configuring production build and start commands.
- Reading deployment logs and debugging startup failures.
- Resolving missing Python dependencies such as `email-validator`, `PyJWT`, and `pwdlib`.
- Understanding the difference between a successful build and a successfully running application.

### 6. Debugging and Problem Solving

During deployment, I encountered and investigated issues including:

- Missing environment variables.
- Incorrect imports after changing configuration.
- Missing Python dependencies.
- Database connectivity and schema setup.
- CORS configuration between separate deployed services.
- HTTP `404` responses for routes that were not defined.

These issues helped me understand that successful software development involves configuration, dependency management, debugging, and verification—not just writing application code.

---

## Features

- User registration and login.
- Password hashing and JWT-based authentication.
- Create, view, update, complete, and delete tasks.
- Task filtering and search.
- Pagination for task listings.
- User-specific task handling.
- PostgreSQL-backed persistent storage.
- Interactive API documentation through Swagger UI.

---

## Architecture

```text
                  ┌──────────────────────┐
                  │   React + Vite UI    │
                  │       Vercel         │
                  └──────────┬───────────┘
                             │
                         HTTPS / REST
                             │
                  ┌──────────▼───────────┐
                  │     FastAPI API      │
                  │       Render         │
                  └──────────┬───────────┘
                             │
                         SQLAlchemy
                             │
                  ┌──────────▼───────────┐
                  │  PostgreSQL Database│
                  │        Neon          │
                  └──────────────────────┘
```

The frontend sends HTTP requests to the FastAPI backend. The backend validates requests, handles authentication, and interacts with PostgreSQL through SQLAlchemy.

---

## Challenges That Improved My Understanding

### Connecting a Cloud Backend to a Cloud Database

I learned that a database running on my local machine is separate from a cloud database. Deploying the backend requires configuring the correct database URL and ensuring that the database schema exists remotely.

### Fixing Deployment Failures

I learned how missing dependencies and environment variables can prevent a Python application from starting, even when the application works locally.

### Configuring CORS

I learned that a browser treats the deployed frontend and backend as different origins. The backend must explicitly allow requests from the frontend's domain.

### Understanding Production vs. Local Development

I learned to separate local environment configuration from production settings, use deployment-specific environment variables, and verify the live application rather than relying only on local tests.

---

## What I Want to Improve Next

This project is a learning milestone, not the end of the development process. My next improvements include:

- [ ] Add comprehensive automated tests for authentication and task endpoints.
- [ ] Verify task ownership across every read, update, and delete endpoint.
- [ ] Introduce database migrations with Alembic.
- [ ] Improve error handling and structured logging.
- [ ] Add stronger production configuration validation.
- [ ] Review database connection pooling and deployment behavior.
- [ ] Add CI checks and automated deployment validation.
- [ ] Improve API documentation and project setup instructions.

---

## Key Takeaway

Building TaskFlow helped me connect concepts that I had previously studied separately: REST APIs, authentication, relational databases, environment variables, frontend integration, and deployment.

The most valuable lesson was learning to debug the complete system—from a browser request to the API, database, and hosting configuration—rather than treating each technology as an isolated topic.

**TaskFlow represents my progress toward becoming an industry-ready backend and AI engineer.**

---

## Live Links

- **Application:** https://taskflow-bay-eight.vercel.app/
- **API Documentation:** https://taskflow-api-zawc.onrender.com/docs

