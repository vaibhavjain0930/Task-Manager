# Task Manager

A role-based task management app built with React, Vite, Express, MongoDB, and JWT authentication.

## Features

- User signup and login with `admin` and `member` roles
- Admin dashboard with project and task statistics
- Admin project creation
- Admin task creation with assigned member, project, status, and due date
- Members can view tasks assigned to them
- Members can view projects assigned to them through project tasks
- Task filters for all, important, completed, and incomplete tasks
- Role-based controls for admin-only actions

## Project Structure

```text
TaskManager-main/
  backend/
    connection/
    Models/
    routes/
    index.js
    .env.example
  frontend/
    src/
    package.json
    .env.example
```

## Environment Variables

Create real `.env` files from the examples before running locally.

Backend: `backend/.env`

```env
PORT=3000
MONGO_URL=mongodb://127.0.0.1:27017/task-manager
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
```

Frontend: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3000
```

Do not commit real `.env` files. They are ignored by git.

## Local Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd frontend
npm install
```

Start the backend:

```bash
cd backend
npm start
```

Start the frontend:

```bash
cd frontend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Role Guide

Admin users can:

- Create projects
- Create tasks
- Assign tasks to members
- Attach tasks to projects
- Mark tasks important
- Update and delete tasks
- View team members

Member users can:

- View their assigned tasks
- Update task status for their tasks
- View projects assigned to them

When an admin creates or updates a task with a project and assigned member, the member is automatically added to that project. The member can then see the project in the Projects section with the assigning admin shown on the project card.

## Deployment Notes

Set environment variables in your hosting platform instead of committing `.env` files.

Backend deployment variables:

- `PORT`
- `MONGO_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

Frontend deployment variables:

- `VITE_API_BASE_URL`

For production, set:

- `FRONTEND_URL` to your deployed frontend URL
- `VITE_API_BASE_URL` to your deployed backend URL
- `JWT_SECRET` to a strong private value
- `MONGO_URL` to your production MongoDB connection string

## Useful Commands

Backend syntax check:

```bash
node --check routes/task.js
node --check routes/user.js
node --check routes/auth.js
```

Frontend checks:

```bash
npm run lint
npm run build
```
