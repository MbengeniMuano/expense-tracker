# Expense Tracker (Spring Boot + React)

Minimal Expense Tracker with a Spring Boot REST API and a React frontend. Includes a mock-data mode for static demos (e.g., GitHub Pages) and a real API mode for full CRUD.

## Project Structure
- `backend/` — Spring Boot app with H2 (in-memory), JPA, REST endpoints
- `frontend/` — React + Vite app with a category bar chart (Recharts)

## Run Locally
1. Backend (port 8081):
   - `cd backend`
   - `./mvnw.cmd -DskipTests spring-boot:run`
2. Frontend (port 5173):
   - `cd ..`
   - `npm run dev --prefix frontend`
   - Open `http://localhost:5173/`

## Mock vs Real API
- Toggle "Use mock data" in the UI header.
- Mock ON: loads from `/frontend/public/mockData.json` and persists to `localStorage`.
- Real ON: calls the backend REST API (`VITE_API_URL` or `http://localhost:8081`).

## Deploying Frontend to GitHub Pages
- Automatic (recommended): GitHub Actions workflow `deploy-frontend.yml` builds and deploys on pushes to `main`.
- Static demo: enable mock mode once in the UI; the built site will work without a backend.
- Live API demo: host backend and set repository variable `VITE_API_URL` to your backend URL. The workflow will inject it during build.

## REST Endpoints (Backend)
- `GET /api/expenses` — list all
- `POST /api/expenses` — create
- `GET /api/expenses/{id}` — get by id
- `PUT /api/expenses/{id}` — update
- `DELETE /api/expenses/{id}` — delete

