# Task Management System

## Project Overview

Task Management System is a full-stack web application for managing personal tasks. Users can sign in, view dashboard summary metrics, search/filter/sort tasks, create and edit tasks through a modal form, delete tasks, paginate the task list, and switch between light and dark mode.

The application is split into:

- `backend`: Express REST API with JWT authentication and MySQL persistence.
- `frontend`: React + Vite dashboard UI.
- `database`: SQL schema for the MySQL database.

## Technology Stack

### Backend

- Node.js
- TypeScript
- Express
- MySQL
- mysql2
- JWT authentication
- bcryptjs
- express-validator
- dotenv

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- React Toastify
- CSS

### Database

- MySQL

## Installation Instructions

Clone the repository and install dependencies separately for the backend and frontend.

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd install
```

## Environment Variables

Create `.env` files from the provided examples.

### Backend

Path: `backend/.env`

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_management_system

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=8h
```

### Frontend

Path: `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Database Setup

1. Start MySQL locally.
2. Run the SQL script:

```bash
mysql -u root -p < database/task_management_system.sql
```

3. Confirm that the database exists:

```sql
USE task_management_system;
SHOW TABLES;
```

The app requires at least one existing user to log in. Passwords stored in the `users` table must be bcrypt hashes because the backend compares passwords with `bcryptjs`.

Important: the backend currently expects task enum values in uppercase:

- Priority: `LOW`, `MEDIUM`, `HIGH`
- Status: `PENDING`, `IN_PROGRESS`, `COMPLETED`

If your SQL schema uses title-case enum values such as `Low` or `Pending`, update the database enum definitions or existing data to match the backend values.

## Running the Backend

From the `backend` directory:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:5000
```

Useful backend scripts:

```bash
npm run dev
npm run type-check
npm run build
npm start
```

## Running the Frontend

From the `frontend` directory:

```bash
npm run dev
```

The frontend usually runs at:

```text
http://localhost:5173
```

Useful frontend scripts:

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## API Documentation

Base API URL:

```text
http://localhost:5000/api
```

Protected task routes require:

```http
Authorization: Bearer <jwt_token>
```

### Health Check

```http
GET /
```

Returns API health status.

### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@example.com",
  "password": "password"
}
```

Successful response:

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "jwt_token",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@example.com"
    }
  }
}
```

### Get Task Summary

```http
GET /api/tasks/summary
```

Returns:

```json
{
  "success": true,
  "message": "Task summary retrieved successfully.",
  "data": {
    "totalTasks": 2,
    "pendingTasks": 1,
    "inProgressTasks": 0,
    "completedTasks": 1,
    "overdueTasks": 0
  }
}
```

### Get Tasks

```http
GET /api/tasks
```

Optional query parameters:

- `search`: search by task title
- `status`: `PENDING`, `IN_PROGRESS`, or `COMPLETED`
- `priority`: `LOW`, `MEDIUM`, or `HIGH`
- `sort`: `newest`, `oldest`, or `dueDate`

Example:

```http
GET /api/tasks?search=dashboard&status=PENDING&priority=HIGH&sort=dueDate
```

### Get Single Task

```http
GET /api/tasks/:id
```

### Create Task

```http
POST /api/tasks
```

Request body:

```json
{
  "title": "Complete dashboard",
  "description": "Create dashboard cards and task list",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2026-07-30"
}
```

Validation rules:

- `title` is required and cannot exceed 150 characters.
- `priority` must be `LOW`, `MEDIUM`, or `HIGH`.
- `status` must be `PENDING`, `IN_PROGRESS`, or `COMPLETED`.
- `dueDate` must use `YYYY-MM-DD` format and cannot be earlier than today.

### Update Task

```http
PUT /api/tasks/:id
```

Request body uses the same shape and validation rules as create task.

### Delete Task

```http
DELETE /api/tasks/:id
```

Deletes the selected task owned by the authenticated user.

## Assumptions Made

- Users already exist in the database; the current app includes login but not registration.
- Each task belongs to one authenticated user.
- Task pagination is handled on the frontend after the filtered task list is returned by the backend.
- JWT tokens are stored in `localStorage`.
- Dates are submitted as `YYYY-MM-DD`.
- The frontend is expected to call the backend through `VITE_API_URL`.

## Known Limitations

- There is no user registration screen or API endpoint.
- There is no password reset flow.
- Frontend pagination is client-side; very large task lists would benefit from backend pagination.
- The provided SQL file may need enum values updated to uppercase to match the current backend API contract.
- The app does not currently include automated unit or integration tests.
