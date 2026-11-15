# Full Stack Development – Programming Exercise
**Roll No.:** 04  **Topic:** College Event Registration  **Class:** B.E. (AI & DS), Sem V

| # | Folder | CO | What it is |
|---|--------|----|-----------|
| 1 | `program1-html-js` | CO1, CO2 | HTML/CSS/JS interface: DOM, events, validation, Fetch + async/await, search & filter |
| 2 | `program2-react` | CO3 | React app: components, props, state, useState/useEffect, Router |
| 3 | `program3-node` | CO4 | Node.js utility: fs, path, Streams, EventEmitter, HTTP server (no Express) |
| 4 | `program4-express-api` | CO5 | Express REST API: CRUD, middleware, error handler, JWT + bcrypt |
| 5 | `program5-fullstack` | CO6 | React + Express + PostgreSQL (Sequelize), CORS, env vars, Vercel/Render |

---
## Program 1 – HTML/CSS/JS
**Run:** `cd program1-html-js && npx serve .` (or `python3 -m http.server 8000`) → open http://localhost:8000
(Fetch needs a web server; opening the file directly with `file://` will block `events.json`.)

**Explanation:** The form is validated on blur and on submit (regex for name/email, required selects, year 1–4, duplicate check). Sample data is loaded with `fetch` (GET) + `async/await` from `events.json`. New registrations are sent with a JSON `POST`, deletes use `DELETE` (demo endpoint: jsonplaceholder). The table is rebuilt dynamically with DOM methods (`createElement`, `textContent`); the search box and event dropdown filter live.

## Program 2 – React
**Run:** `cd program2-react && npm install && npm run dev` → http://localhost:5173

**Explanation:** Routes: `/` Home, `/register` form, `/registrations` list (React Router). State is held in `App` and passed down via props. `useState` manages form values/errors/search; `useEffect` saves to localStorage. `FormField` is a reusable component. Conditional rendering is used for errors, success message and the empty list.

## Program 3 – Node.js (no Express)
**Run:** `cd program3-node && node server.js` → http://localhost:3000

| Method | URL | Purpose |
|---|---|---|
| GET | /registrations | list all |
| POST | /registrations | add (JSON body) |
| DELETE | /registrations/:id | remove |
| GET | /logs | activity log, streamed with `pipe` |

**Explanation:** `eventStore.js` extends `EventEmitter`, stores data in `data/registrations.json` using `fs` + `path`. The server listens for `registered` / `removed` events and writes them to `data/activity.log` using a write stream; `/logs` reads it back with a read stream.

Test: `curl -X POST localhost:3000/registrations -H "Content-Type: application/json" -d '{"name":"Test User","email":"t@c.edu","event":"Hackathon","department":"CS","year":3}'`

## Program 4 – Express REST API
**Run:** `cd program4-express-api && npm install && cp .env.example .env && npm start` → http://localhost:4000

| Method | URL | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | – | create user (bcrypt-hashed password) |
| POST | /api/auth/login | – | returns JWT |
| GET | /api/auth/profile | JWT | protected route |
| GET | /api/registrations | – | list (`?event=`, `?search=`) |
| GET | /api/registrations/:id | – | one record |
| POST | /api/registrations | – | create (validated) |
| PUT | /api/registrations/:id | – | update |
| DELETE | /api/registrations/:id | JWT | delete |

**Explanation:** Middleware: request logger, input validation, JWT verification. A `notFound` + central `errorHandler` return consistent JSON errors. Passwords are hashed with bcrypt; login returns a signed JWT sent as `Authorization: Bearer <token>`.

## Program 5 – Full stack (React + Express + PostgreSQL)
**Backend:** `cd program5-fullstack/backend && npm install && cp .env.example .env` (edit `DATABASE_URL`) `&& npm start`
**Frontend:** `cd program5-fullstack/frontend && npm install && cp .env.example .env && npm run dev`

**Schema (Sequelize model `Registration`, table `registrations`):** id (PK), name, email, event, department, year, createdAt, updatedAt; unique(email, event).
**Endpoints:** GET/POST `/api/registrations`, PUT/DELETE `/api/registrations/:id`.
**Explanation:** Sequelize `sync()` creates the table. CORS only allows origins in `CORS_ORIGIN`. The frontend reads `VITE_API_URL` and talks to the API through `src/api.js`. Server-side validation errors (e.g. duplicate registration) are shown in the form.

### Deployment
**Render (backend + DB):** New → PostgreSQL (copy the *Internal Database URL*). New → Web Service from your GitHub repo, Root Directory `program5-fullstack/backend`, Build `npm install`, Start `npm start`. Env vars: `DATABASE_URL`, `NODE_ENV=production`, `CORS_ORIGIN=https://<your-app>.vercel.app`.
**Vercel (frontend):** Import repo, Root Directory `program5-fullstack/frontend`, Framework Vite. Env var: `VITE_API_URL=https://<your-service>.onrender.com`. Redeploy, then update `CORS_ORIGIN` on Render if needed.

---
## Screenshot checklist for submission
1. P1: form with validation errors, table after adding, search/filter in action
2. P2: Home, Register form, Registrations list
3. P3: terminal with server + curl outputs, `/logs` in browser
4. P4: Postman/curl for login, DELETE without token (401) and with token (200)
5. P5: running frontend, Render dashboard, Vercel dashboard, deployed links
