# Expense Tracker Frontend (React + Vite)

This frontend connects to a Spring Boot backend or can run with mock data for static demos (e.g., GitHub Pages).

## Run Locally

- Backend: `./mvnw.cmd -DskipTests spring-boot:run` in `backend` (default `http://localhost:8081`).
- Frontend: `npm run dev --prefix frontend` then open `http://localhost:5173/`.

To point at a different backend, set `VITE_API_URL`:

```
VITE_API_URL=http://localhost:8081
```

## Mock vs Real API

- Toggle "Use mock data" in the UI header.
- When enabled, data loads from `/mockData.json` and persists to `localStorage`.
- When disabled, the app uses the REST API at `VITE_API_URL` (or `http://localhost:8081`).

## Deploying to GitHub Pages

For a static demo (no backend):
- Enable "Use mock data" once; the app will continue using `localStorage`.
- Commit `frontend/public/mockData.json` (already present).
- Build: `npm run build --prefix frontend` and deploy `frontend/dist` to GitHub Pages.

For a live API demo:
- Host the backend (e.g., Render, Railway, or your server).
- Set `VITE_API_URL` at build time to the public backend URL.

## Features

- Add, edit, delete expenses
- ZAR currency (`R`)
- Category bar chart with empty-state messaging
