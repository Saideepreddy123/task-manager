

## Project Structure

```
task-manager/
├── frontend/
│   ├── public/
│   └── src/
│       ├── api/api.js          # Axios API client
│       ├── components/         # TaskForm, TaskList, TaskItem
│       ├── pages/               # Login, Dashboard
│       ├── App.js               # Routes + auth guard
│       └── App.css / index.css
├── backend/
│   ├── routes/                  # taskRoutes.js, authRoutes.js
│   ├── controllers/             # taskController.js, authController.js
│   ├── db/
│   │   ├── db.js                # MySQL connection pool
│   │   └── schema.sql           # DB + table creation, sample data
│   └── server.js                # Express app entry point
└── README.md
```

## Features

- **Login page** — email/password, simple credential check (no advanced auth, per spec)
- **Task Dashboard** — list of tasks with title, description, status, edit/delete buttons, "Add Task" button
- **Add/Edit Task form** — title, description, status (Pending / In Progress / Completed)
- **Full CRUD** via REST API, backed by MySQL
- **Bonus features implemented:**
  - Search tasks by title/description
  - Filter tasks by status
  - Client + server-side form validation
  - Loading states
  - Error handling (both frontend and backend)
  - Responsive design (mobile-friendly table that reflows to cards)

## Prerequisites

- Node.js (v18+ recommended)
- MySQL Server running locally (or accessible remotely)

## 1. Database Setup

1. Log into MySQL:
   ```bash
   mysql -u root -p
   ```
2. Run the schema file to create the database, table, and sample data:
   ```bash
   mysql -u root -p < backend/db/schema.sql
   ```
   This creates a `task_manager` database with a `tasks` table:

   | Field | Type | Purpose |
   |---|---|---|
   | id | INT, auto-increment | Unique task ID |
   | title | VARCHAR(255) | Task name |
   | description | TEXT | Task details |
   | status | ENUM | Pending / In Progress / Completed |
   | created_at | TIMESTAMP | Task creation date |

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env     # edit DB_USER / DB_PASSWORD to match your MySQL setup
npm start                # or: npm run dev (with nodemon)
```

The API will run at `http://localhost:5000`.

### Environment variables (`backend/.env`)

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=task_manager
DEMO_EMAIL=admin@gmail.com
DEMO_PASSWORD=password123
```

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env     # defaults to http://localhost:5000/api, edit if needed
npm start
```

The app will run at `http://localhost:3000`.

### Demo Login

```
Email:    admin@gmail.com
Password: password123
```

## API Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint | Body | Description |
|---|---|---|---|
| POST | `/auth/login` | `{ email, password }` | Returns `{ token, user }` on success |

### Tasks

| Method | Endpoint | Body | Description |
|---|---|---|---|
| GET | `/tasks` | — | Get all tasks. Supports `?search=` and `?status=` query params |
| GET | `/tasks/:id` | — | Get a single task by ID |
| POST | `/tasks` | `{ title, description, status }` | Create a new task |
| PUT | `/tasks/:id` | `{ title, description, status }` | Update an existing task |
| DELETE | `/tasks/:id` | — | Delete a task |

Example — create a task:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","status":"Pending"}'
```

## Application Flow

1. User opens the app and is redirected to `/login`.
2. User logs in with demo credentials → app stores a mock token in `localStorage`.
3. User is redirected to `/dashboard`, which fetches tasks from `GET /api/tasks`.
4. User clicks **Add Task**, fills out the form, and submits → React sends `POST /api/tasks` → Express inserts into MySQL → the new task is returned and appended to the list.
5. Editing sends `PUT /api/tasks/:id`; deleting sends `DELETE /api/tasks/:id` (with a confirmation prompt).
6. Search and status filter re-query the API automatically (debounced).

