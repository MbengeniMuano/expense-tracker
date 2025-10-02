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
- For a static demo (no backend): enable mock mode once in the UI; build and deploy `frontend/dist`.
- For a live API demo: host backend publicly and set `VITE_API_URL` at build time to that URL.

## REST Endpoints (Backend)
- `GET /api/expenses` — list all
- `POST /api/expenses` — create
- `GET /api/expenses/{id}` — get by id
- `PUT /api/expenses/{id}` — update
- `DELETE /api/expenses/{id}` — delete

