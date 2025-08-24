# eduVision — Frontend

About the project

The eduVision frontend is a React + Vite single-page app that provides the user interface for uploading and viewing study material, managing notes, and interacting with an AI-powered study/chat assistant. It communicates with the backend API (configured with `VITE_API_BASE_URL`) for authentication, note storage, chat, and file uploads.

Key features:
- Upload and preview PDFs/images and extract text via backend OCR.
- Create, edit and browse notes.
- Chat/AI assistant for study questions and conversation about notes.
- Authentication flows (login/register/refresh) and token handling in `localStorage`.

Tech stack: React 19, Vite, Tailwind CSS, react-router, react-toastify, and various PDF/viewer libraries.

React + Vite single-page app for eduVision. Uses modern React 19 and Tailwind. The app talks to the backend API (configured via Vite env variables) and includes components for uploading, viewing and chatting with notes.

## Quick summary
- Entry: `index.html` / `src/main.jsx`
- Dev server: Vite (`npm run dev`)
- Build output: `dist/` (already a `build/` folder is present in the repo for a pre-built site)

## Prerequisites
- Node.js 18+ and npm

## Install

```powershell
cd eduVision_frontend
npm install
```

## Environment variables (Vite)
Create a `.env` or `.env.local` in `eduVision_frontend/`. Example:

```
# Base URL for API the frontend should call
VITE_API_BASE_URL=https://your-backend.example.com/api

# Optional: allow local dev to point to a local backend
# VITE_API_BASE_URL=http://localhost:3000/api
```

Notes:
- The frontend code defaults to a production backend URL if `VITE_API_BASE_URL` is not provided. Set it for local development.

## Scripts
- Start development server:

```powershell
npm run dev
```

- Build for production:

```powershell
npm run build
```

- Preview the production build locally:

```powershell
npm run preview
```

## Deploy
- The `build/` folder already contains a generated site. To rebuild, run `npm run build` and then deploy the contents of `dist/` (or the generated output folder) to your static host (Netlify, Vercel, Azure Static Web Apps, etc.).

## Troubleshooting
- If CORS errors occur while contacting the backend, ensure the backend's `CORS_ORIGIN` includes the origin shown in the browser console (for dev Vite runs the origin is usually `http://localhost:5173`).
- If authentication fails, confirm the backend `JWT_SECRET` and time synchronization between systems.

## Notes for contributors
- The frontend stores the access token in `localStorage` and uses cookies for refresh/token endpoints. See `src/services/*` for API client code.

## License
MIT
