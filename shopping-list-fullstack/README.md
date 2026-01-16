# Shopping List – Full Stack Test

Simple shopping list app: add items, mark as bought, delete.

**Tech:** React + TypeScript (Frontend), Express + TypeScript (Backend), MongoDB + Mongoose.

## Project structure

- `frontend/` – React (Vite) + TS
- `backend/` – Express + TS + Mongoose

## Requirements

- Node.js 18+ (recommended)
- MongoDB (local) **or** MongoDB Atlas

## Setup (Backend)

```bash
cd backend
cp .env.example .env
# edit MONGO_URI if needed
npm install
npm run dev
```

Backend runs on `http://localhost:4000`.

### API Endpoints

- `GET /items` – list items
- `POST /items` – create: `{ "name": string }`
- `PUT /items/:id` – update: `{ "bought": boolean }`
- `DELETE /items/:id` – delete

## Setup (Frontend)

```bash
cd frontend
cp .env.example .env   # optional
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## UI / Libraries

- No external UI toolkit used.
- Styling is based on the provided HTML/CSS template (ported into React).

## Notes

- No authentication.
- Frontend state: `useState` + `useEffect`.
- Basic request validation in the backend via `zod`.
