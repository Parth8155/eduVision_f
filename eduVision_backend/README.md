# eduVision — Backend

About the project

eduVision is a student-focused note management and study assistant web application (built during a hackathon). The backend exposes REST APIs that handle user authentication, note storage, file uploads and processing (OCR and PDF handling), chat/AI-assisted study helpers, annotations, and study material management. It's designed to be lightweight and easily deployable to cloud platforms such as Azure or Heroku.

Key responsibilities:
- Serve REST endpoints under `/api/*` for the frontend.
- Store and retrieve notes and user data in MongoDB.
- Accept and process uploaded files (PDF/image -> OCR) and serve them from `/uploads`.
- Integrate with AI providers (OpenAI / Azure Computer Vision) when configured.

Lightweight tech stack: Node.js, Express, MongoDB (Mongoose), multer/sharp/pdf libraries, and optional OpenAI/Azure integrations.

Lightweight Express API for the eduVision application. Provides authentication, note storage, file uploads, chat/AI endpoints and OCR/study material processing.

## Quick summary
- Entry: `src/app.js`
- DB connector: `src/config/database.js` (reads `process.env.MONGODB_URI` or uses a default URI)
- API base: `/api` (routes mounted under `/api/*`)

## Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas or local)
- On Windows, native-image dependencies (e.g. `sharp`, `canvas`) may require build tools (Windows Build Tools / Visual Studio C++). If install fails, follow the packages' install docs.

## Install

1. Open a terminal in this folder:

```powershell
cd eduVision_backend
npm install
```

## Environment variables
Create a `.env` file in `eduVision_backend/` or set environment variables in your host. Example keys the project expects or uses:

```
# Server
PORT=3000

# MongoDB (if omitted a default is used inside src/config/database.js)
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/eduvision

# CORS
CORS_ORIGIN=http://localhost:5173

# Auth / tokens
JWT_SECRET=your_jwt_secret

# Optional (mail / 3rd party / AI)
OPENAI_API_KEY=sk-...
AZURE_CV_KEY=...
AZURE_CV_ENDPOINT=...
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=pass
```

Notes:
- `src/config/database.js` contains a fallback `MONGODB_URI` so the server can run without a `.env` in many cases, but you should provide your own credentials for production.

## Run
- Development (auto-restart):

```powershell
npm run dev
```

- Production:

```powershell
npm start
```

After startup the server listens on the `PORT` (default `3000`). Health check: `GET /`.

## Useful endpoints
- `POST /api/auth/login` — login
- `POST /api/auth/register` — register
- `GET /api/notes` — notes API (see `src/routes`)
- `POST /api/upload` — file uploads (files served statically from `/uploads`)

See the route files in `src/routes/` for the full list.

## Troubleshooting
- If `npm install` fails around `sharp`/`canvas`, install required build tools on Windows (Visual Studio Build Tools) and ensure Python 3 is available.
- If uploads aren't served, verify `app.use('/uploads', ...)` and that the `uploads/` directory exists and has proper permissions.

## License
MIT
