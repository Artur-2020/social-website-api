# NestJS Project with PostgreSQL (No ORM)

## Architecture

This project is built using **NestJS** and **PostgreSQL** without an ORM. The architecture follows the **Repository Pattern**, which consists of the following layers:

- **Controllers** – Handle HTTP requests and call corresponding services.
- **Services** – Contain business logic.
- **Repositories** – Manage database access.
- **Database** – A module for database connection.

## Project Structure

The project is divided into separate modules, each contained within its own folder:

- `auth/` – Authentication module with **JWT authentication** and **refresh token implementation**.
- `users/` – User management module.
- `friends/` – Friend request handling module.
- `database/` – Database connection module.

The project includes both **global** and **local** interfaces and constants:

- **Global** – Stored in shared folders (`interfaces/`, `constants/`).
- **Local** – Located within each module (`auth/constants.ts`, `users/interfaces.ts`, etc.).

## Running the Project

### 1. Create the `.env` file

Before running the application, copy the `.env.example` file to `.env`:

```sh
cp .env.example .env
```

### 2. Database Setup

The project uses **node-pg-migrate** for database migrations. You need to create an empty database in your local **PostgreSQL** instance before proceeding.

#### Apply migrations:

```sh
npm run migrate:up
```

#### Rollback migrations:

```sh
npm run migrate:down
```

### 3. Start the Application

To start the server, run:

```sh
npm run start
```

For development mode with automatic reload:

```sh
npm run start:dev
```

Once started, the application will be available at:

```
http://localhost:<PORT>
```

The application api documentation will be available  at:

```
http://localhost:<PORT>/api
```

## Testing

The project includes unit tests for core functionality (services). Here's how to run the tests:

```bash
# Run all tests
npm run test


### Test Structure

The tests are organized by feature modules:

- `src/auth/auth.service.spec.ts` - Tests for authentication service
  - Login functionality
  - Registration process
  - Token refresh mechanism

- `src/auth/auth-tokens/auth-tokens.service.spec.ts` - Tests for auth token service
  - Generate tokens
  - Save Refresh token
  - Validate refresh token
  - Delete refresh token

- `src/friends/friends.service.spec.ts` - Tests for friends service
  - Friend request sending
  - Request management (accept/decline)
  - Friend list retrieval