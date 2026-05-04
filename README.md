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

## Deploy Backend On Render

Create a new Render Web Service and point it to this repository.

Use these settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Set these Render environment variables:

```env
MONGO_URL=mongodb+srv://username:password@cluster-name.mongodb.net/task-manager
JWT_SECRET=replace-with-a-long-random-secret
```

Render provides `PORT` automatically, so you do not need to set it there. The backend uses open CORS, so you do not need to add your Vercel frontend URL to Render.

After deployment, copy your Render backend URL. It will look like:

```text
https://your-render-service.onrender.com
```

## Deploy Frontend On Vercel

Create a new Vercel project and point it to this repository.

Use these settings:

- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

Set this Vercel environment variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com
```

This is the only frontend-to-backend connection setting needed for Vercel.

## Deployment Variables

Backend variables:

- `MONGO_URL`
- `JWT_SECRET`

Frontend deployment variables:

- `VITE_API_BASE_URL`

Do not commit real `.env` files. Add these values only in Render and Vercel dashboards.

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
