# GlowLogic

A full-stack skincare intelligence web app that eliminates ingredient guesswork. Users check products against their personal trigger blacklist, build AM/PM routines with real-time conflict detection, and track consistency with streaks and badges. Admins manage the entire product and ingredient catalog through a dedicated dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| Data Fetching | TanStack Query v5 |
| Global State | Zustand |
| Styling | Tailwind CSS v3 |
| Backend | Node.js + Express + TypeScript |
| ORM | Prisma 5 |
| Database | PostgreSQL 16 |
| Auth | JWT (access + refresh tokens) + bcrypt |
| Validation | Zod |
| File Uploads | Multer + Cloudinary |

---

## Project Structure

```
glowlogic/
├── client/          # React frontend (Vite)
└── server/          # Express backend (TypeScript + Prisma)
    └── prisma/
        ├── schema.prisma
        └── seed.ts
```

---

## Prerequisites

Make sure the following are installed before you begin:

- [Node.js](https://nodejs.org) v20 or higher (LTS recommended)
- [PostgreSQL](https://www.postgresql.org/download) v16
- [Git](https://git-scm.com)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/sinemnagod/Up-School---YZ-proje.git
cd Up-School---YZ-proje
```

### 2. Set up environment variables

Create a `.env` file in the root of the project:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/glowlogic"

# JWT
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"

# Cloudinary (product images)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Server
PORT=3001
NODE_ENV="development"

# Client
VITE_API_URL="http://localhost:3001/api/v1"
```

> **Never commit `.env` to version control.** It is already in `.gitignore`.

### 3. Install dependencies

```bash
# Frontend
cd client && npm install

# Backend
cd ../server && npm install
```

### 4. Set up the database

Make sure PostgreSQL is running, then:

```bash
cd server

# Run migrations (creates all tables)
npx prisma migrate dev --name init

# Seed starter data (admin user, sample ingredients, products, conflict rules, badges)
npx prisma db seed
```

### 5. Run the development servers

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd server
npx nodemon src/index.ts

# Terminal 2 — Frontend (http://localhost:5173)
cd client
npm run dev
```

---

## Default Admin Account

Created by the seed script:

```
Email:    admin@glowlogic.com
Password: Admin1234!
```

> Change this password immediately after first login.

---

## Key Features

**For users**
- Personal trigger blacklist — flag ingredients to avoid and see them highlighted on every product
- Compatibility scoring — products scored 0–100 based on skin type compatibility
- AM/PM routine builder — ordered step-by-step routine with real-time conflict detection
- Conflict alerts — warns when incompatible ingredients (e.g. AHA + Retinol) are in the same slot
- Ingredient overload detection — flags when the same active appears in 3+ products
- Safe alternatives — suggests substitute products when a flagged product is detected
- Streak tracker — daily check-ins with milestone badges at days 3, 7, 15, 30, 50, 75, and 100
- Challenges — opt-in themed goals with progress tracking

**For admins (`/admin`)**
- Product catalog — add, edit, publish, and soft-delete products
- Ingredient master database — manage INCI names, functions, comedogenic ratings, irritation levels, and skin type flags
- Conflict rule engine — define ingredient conflict pairs, scope, severity, and user-facing explanations — no code required
- Challenge management — create and schedule community challenges
- Analytics dashboard — retention stats, most-flagged ingredients, badge completion rates, conflict frequency

---

## API Overview

Base URL: `http://localhost:3001/api/v1`

| Group | Base Path |
|-------|-----------|
| Auth | `/auth` |
| User profile & triggers | `/user` |
| Products | `/products` |
| Routine | `/routine` |
| Streaks & badges | `/streaks`, `/checkins`, `/badges` |
| Challenges | `/challenges` |
| Admin — products | `/admin/products` |
| Admin — ingredients | `/admin/ingredients` |
| Admin — conflict rules | `/admin/conflict-rules` |
| Admin — challenges | `/admin/challenges` |
| Admin — analytics | `/admin/analytics` |

All protected routes require: `Authorization: Bearer <accessToken>`

---

## Database

Prisma schema lives at `server/prisma/schema.prisma`.

To view and edit your data visually:

```bash
cd server
npx prisma studio
```

Opens at `http://localhost:5555`.

To create a new migration after changing the schema:

```bash
npx prisma migrate dev --name describe_your_change
```

---

## Environment Notes

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` | Secret for signing 15-minute access tokens |
| `JWT_REFRESH_SECRET` | Secret for signing 7-day refresh tokens |
| `CLOUDINARY_*` | Cloudinary credentials for product image uploads |
| `PORT` | Express server port (default: 3001) |
| `VITE_API_URL` | Backend base URL used by the React client |

---

## Scripts

### Backend (`server/`)

| Command | Description |
|---------|-------------|
| `npx nodemon src/index.ts` | Start dev server with hot reload |
| `npx ts-node src/index.ts` | Start without hot reload |
| `npx prisma migrate dev` | Run pending migrations |
| `npx prisma db seed` | Seed the database |
| `npx prisma studio` | Open visual DB browser |
| `npx prisma generate` | Regenerate Prisma client after schema changes |

### Frontend (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |

---

## Contributing

1. Create a branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. If you change `schema.prisma`, run `npx prisma migrate dev`
4. Commit: `git commit -m "feat: describe what you did"`
5. Push and open a pull request

---

## License

Private. All rights reserved.
