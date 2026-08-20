# Task Management App

A private multi-user task management application built with Next.js, NestJS, PostgreSQL, and Prisma.

## Project Structure

```text
frontend/   Next.js web application
backend/    NestJS REST API
backend/prisma/  Database schema and migrations
```

The backend API uses the `/api/v1` prefix. Tasks are private and are always scoped to the authenticated user's JWT subject.

## Requirements

- Node.js 20 or newer
- npm
- PostgreSQL database
- Git

Optional services:

- Resend for email notifications
- Cloudinary for task attachments
- OpenWeather for task location weather

## Local Setup

Run these commands from the repository root:

```powershell
npm.cmd install
Copy-Item backend\.env.example backend\.env
npm.cmd run prisma:generate --workspace backend
npm.cmd run prisma:migrate --workspace backend
npm.cmd run dev
```

Open:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api/v1

## Environment Variables

Edit `backend/.env` for local development. Never commit `.env` files or real credentials.

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://username:password@localhost:5432/task_management
JWT_SECRET=generate-a-long-random-value
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:3000
APP_URL=http://localhost:3000
RESEND_API_KEY=
EMAIL_FROM="Task Management <onboarding@resend.dev>"
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
OPENWEATHER_API_KEY=
MAX_UPLOAD_BYTES=5242880
ALLOWED_UPLOAD_MIME_TYPES="image/jpeg,image/png,image/webp,application/pdf"
```

Generate a JWT secret with Node.js:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

`EMAIL_FROM` is a sender address, not an API key. The `onboarding@resend.dev` sender is suitable for Resend testing. Production email should use a verified domain.

## Database

Generate the Prisma client after dependency installation:

```powershell
npm.cmd run prisma:generate --workspace backend
```

Create and apply a development migration:

```powershell
npm.cmd run prisma:migrate --workspace backend
```

Apply committed migrations in production:

```powershell
npx prisma migrate deploy --schema backend/prisma/schema.prisma
```

Do not run `prisma migrate dev` against the production database.

## Quality Checks

```powershell
npm.cmd run test
npm.cmd run build
npm.cmd run lint
```

## Deploy the Backend to Render

Create a Render Web Service connected to this repository.

Set:

```text
Root Directory: backend
Build Command: npm install && npx prisma generate && npx prisma migrate deploy && npm run build
Start Command: npm run start
```

Add these Render environment variables:

```env
NODE_ENV=production
DATABASE_URL=your-production-postgresql-url
JWT_SECRET=your-production-jwt-secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=https://your-frontend.vercel.app
APP_URL=https://your-frontend.vercel.app
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=Task Management <noreply@your-verified-domain.com>
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
OPENWEATHER_API_KEY=your-openweather-api-key
MAX_UPLOAD_BYTES=5242880
ALLOWED_UPLOAD_MIME_TYPES=image/jpeg,image/png,image/webp,application/pdf
```

Render provides the public backend URL, for example:

```text
https://task-management-api.onrender.com
```

The frontend API URL is that address with `/api/v1` appended:

```text
https://task-management-api.onrender.com/api/v1
```

## Deploy the Frontend to Vercel

Create a Vercel project connected to this repository.

Set:

```text
Root Directory: frontend
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
```

Add this Vercel environment variable:

```env
NEXT_PUBLIC_API_BASE_URL=https://task-management-api.onrender.com/api/v1
```

Deploy the project and copy the final Vercel URL. Update these Render variables with the exact URL, then redeploy the backend:

```env
CORS_ORIGIN=https://your-frontend.vercel.app
APP_URL=https://your-frontend.vercel.app
```

## Verify Production

1. Open the Vercel URL.
2. Register a new account.
3. Sign in and create a task.
4. Update and delete a task.
5. Upload an image or PDF attachment.
6. Test weather lookup for a task with a location.
7. Check the browser console and Render logs for CORS or database errors.

The public authentication endpoints are:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
```

Task endpoints require an `Authorization: Bearer <token>` header.

## Git Push Checklist

Build output and environment files must not be committed. From the repository root:

```cmd
git add package.json package-lock.json pnpm-lock.yaml backend frontend
git diff --cached --name-only
git commit -m "Prepare application for deployment"
git push origin HEAD
```

Before committing, confirm that the staged file list does not contain:

```text
.env
backend/.env
frontend/.next/
node_modules/
```

If `frontend/.next` appears, exit the Git pager with `q`, add `frontend/.next/` to `frontend/.gitignore`, and remove it from the index with `git rm -r --cached frontend/.next`.

## Security

The database, Resend, Cloudinary, and OpenWeather credentials must be stored only in local ignored files or hosting-provider environment settings. Any credential shared in chat, screenshots, commits, or logs should be rotated immediately.