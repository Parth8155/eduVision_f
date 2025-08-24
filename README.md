# eduVision (monorepo)

This repository contains the eduVision project — a student-focused note management and study assistant app. It has two separate subprojects:

- `eduVision_backend/` — Node.js + Express REST API (MongoDB, file uploads, OCR, AI integrations).
- `eduVision_frontend/` — React + Vite single-page application (UI for uploads, notes, chat/AI assistant).

See the README in each subfolder for full setup and environment details.

Quick start

1. Backend (API)

```powershell
cd eduVision_backend
npm install
# copy or create .env (see eduVision_backend/README.md)
npm run dev      # development server (nodemon)
```

2. Frontend (web app)

```powershell
cd eduVision_frontend
npm install
# create .env with VITE_API_BASE_URL pointing to backend (see eduVision_frontend/README.md)
npm run dev
```

Run both in separate terminals to develop locally. By default the frontend runs on Vite's port (usually `5173`) and the backend on port `3000`.

Repository layout

```
eduVision_backend/      # Express API
eduVision_frontend/     # React + Vite app
```

Contributing & notes

- The backend includes example fallbacks for a MongoDB URI but you should provide your own credentials for production via `.env`.
- The frontend reads `VITE_API_BASE_URL` to locate the backend API.
- If native modules fail to install on Windows (e.g. `sharp` or `canvas`), install the Visual Studio Build Tools and Python 3.

License

MIT
