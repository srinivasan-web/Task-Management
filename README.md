# Task Management App

A private multi-user task management application built with NestJS, PostgreSQL/Prisma, and Next.js.

## Security Model

Every task belongs to exactly one JWT-authenticated user. The API derives ownership from the JWT subject and scopes task reads/mutations by both task ID and `userId`. A foreign task returns `404` to prevent resource enumeration.

## Local Setup

```powershell
npm.cmd install
Copy-Item backend\.env.example backend\.env
npm.cmd run prisma:generate --workspace backend
npm.cmd run prisma:migrate --workspace backend
npm.cmd run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000/api/v1`

## Configuration

See `backend/.env.example` for database, JWT, email, Cloudinary, weather, upload, and CORS settings. Never commit real environment credentials.

## Quality Checks

```powershell
npm.cmd run test
npm.cmd run build
```

## Architecture and Demo

- `docs/phase-1-architecture.md`
- `docs/frontend-security.md`
- `docs/phase-8-testing.md`
- `docs/final-demo.md`


NODE_ENV=development
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/task_management"
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
CORS_ORIGIN=http://localhost:3000
APP_URL=http://localhost:3000
RESEND_API_KEY=
EMAIL_FROM="Task Management <onboarding@resend.dev>"

MAX_UPLOAD_BYTES=5242880
ALLOWED_UPLOAD_MIME_TYPES="image/jpeg,image/png,image/webp,application/pdf"