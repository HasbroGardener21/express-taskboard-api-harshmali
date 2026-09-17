# Task Board API

A RESTful backend API for the Task Board application. Built with Node.js, Express, and MongoDB. Supports user authentication via JWT and full CRUD operations for tasks.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB Atlas account (or local MongoDB)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/HasbroGardener21/express-taskboard-api-harshmali.git
cd express-taskboard-api-harshmali
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Fill in your `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

5. Run the development server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

---

## Trial Account

For quick testing without registering:

- **Email:** trialuser123@gmail.com
- **Password:** trialuser123

---

## API Documentation

### Auth Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |

#### POST `/api/auth/register`
```json
Request:
{
  "email": "user@example.com",
  "password": "123456"
}

Response 201:
{
  "token": "eyJ...",
  "user": { "id": "...", "email": "user@example.com" }
}
```

#### POST `/api/auth/login`
```json
Request:
{
  "email": "user@example.com",
  "password": "123456"
}

Response 200:
{
  "token": "eyJ...",
  "user": { "id": "...", "email": "user@example.com" }
}
```

---

### Task Endpoints

All task endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:id` | Get a single task |
| PUT | `/api/tasks/:id` | Update a task |
| PATCH | `/api/tasks/:id/complete` | Toggle task completion |
| DELETE | `/api/tasks/:id` | Delete a task |

#### POST `/api/tasks`
```json
Request:
{
  "title": "Buy groceries",
  "project": "Inbox"
}

Response 201:
{
  "_id": "...",
  "title": "Buy groceries",
  "done": false,
  "project": "Inbox",
  "order": 0,
  "user": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### PUT `/api/tasks/:id`
```json
Request:
{
  "title": "Updated title",
  "project": "Work"
}

Response 200:
{
  "_id": "...",
  "title": "Updated title",
  "project": "Work",
  ...
}
```

---

## Error Response Format

All errors return a consistent JSON shape:

```json
{
  "message": "Description of the error"
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized / invalid token |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Known Limitations

- Projects are managed client-side (localStorage) — not stored in the database
- No pagination on task listing
- JWT tokens are long-lived (7 days) with no refresh mechanism