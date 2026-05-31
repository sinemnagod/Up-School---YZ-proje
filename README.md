# GlowLogic

A full-stack skincare intelligence web app that eliminates ingredient guesswork. Users check products against their personal ingredient trigger blacklist, build AM/PM routines with real-time conflict detection, and track consistency with streaks and badges. Admins manage the entire product and ingredient catalog through a dedicated dashboard.

---

## Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Frontend      | React 18 + Vite + TypeScript           |
| Routing       | React Router v6                        |
| Data Fetching | Axios + TanStack Query                 |
| Global State  | Zustand                                |
| Styling       | Tailwind CSS v3                        |
| Backend       | Node.js + Express + TypeScript         |
| ORM           | Prisma 5                               |
| Database      | PostgreSQL 16                          |
| Auth          | JWT (access + refresh tokens) + bcrypt |
| Image Storage | Cloudinary                             |

---

## Features

### For Users

- **Trigger Blacklist** — add ingredients to avoid and see them flagged on every product
- **Product Catalog** — search and browse products with skin type tags and category filters
- **Product Detail** — full ingredient list with irritation badges and hover tooltips
- **Skin Type Profile** — set your skin type to personalise your experience
- **AM/PM Routine Builder** — build a step-by-step daily routine with ordered slots
- **Conflict Detection** — real-time alerts when incompatible ingredients are in the same routine (e.g. AHA + Retinol)
- **Ingredient Overload Warning** — flags when the same active appears in 3+ products
- **Streak Tracker** — daily check-ins with streak counts and milestone badges
- **Badges** — earned automatically at Day 3, 7, 15, 30, 50, 75, and 100 streaks
- **Challenges** — opt-in themed skincare goals with progress tracking

### For Admins

- **Product Management** — add, edit, publish/unpublish, and delete products with image upload
- **Ingredient Database** — manage INCI names, comedogenic ratings, irritation levels, and skin type flags
- **Conflict Rule Engine** — define ingredient conflict pairs, scope, severity, and user-facing explanations — no code required
- **Stats Dashboard** — total products, ingredients, and users at a glance

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

- Node.js v20 or higher
- PostgreSQL 16
- Git

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
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/glowlogic"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
PORT=3001
NODE_ENV="development"
VITE_API_URL="http://localhost:3001/api/v1"
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### 3. Install dependencies

```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 4. Set up the database

```bash
cd server
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the development servers

```bash
# Terminal 1 — Backend (http://localhost:3001)
cd server && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd client && npm run dev
```

---

## Admin Access

The admin panel is at `/admin` — there is no navigation link to it by design. Admins access it directly via URL.

Default admin account created by seed:

```
Email:    admin@glowlogic.com
Password: Admin1234!
```

Change this password after first login.

---

## API Overview

Base URL: `http://localhost:3001/api/v1`

All protected routes require: `Authorization: Bearer <accessToken>`

| Group                        | Base Path               |
| ---------------------------- | ----------------------- |
| Auth                         | `/auth`                 |
| User profile + triggers      | `/user`                 |
| Products (public)            | `/products`             |
| Routine                      | `/routine`              |
| Streaks + check-ins + badges | `/streaks`              |
| Challenges                   | `/challenges`           |
| Admin — products             | `/admin/products`       |
| Admin — ingredients          | `/admin/ingredients`    |
| Admin — conflict rules       | `/admin/conflict-rules` |
| Admin — stats                | `/admin/stats`          |

---

## Database

Prisma schema at `server/prisma/schema.prisma`. 16 tables covering users, products, ingredients, routines, streaks, badges, and challenges.

```bash
cd server
npx prisma studio   # visual DB browser at localhost:5555
```

---

## Scripts

### Backend (`server/`)

| Command                  | Description                      |
| ------------------------ | -------------------------------- |
| `npm run dev`            | Start dev server with hot reload |
| `npx prisma migrate dev` | Run pending migrations           |
| `npx prisma db seed`     | Seed the database                |
| `npx prisma studio`      | Open visual DB browser           |

### Frontend (`client/`)

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |

---

## Design System

GlowLogic uses a custom **Bloom Palette** design system inspired by a botanical painting.

| Token       | Color     | Role                                 |
| ----------- | --------- | ------------------------------------ |
| Nightbloom  | `#3C1828` | Footer, logo, streak card background |
| Plum Rose   | `#7A3548` | Header                               |
| Wild Rose   | `#A85068` | Active states, hover, progress bars  |
| Parchment   | `#F0E4D0` | Page background                      |
| Soft Bloom  | `#ECC8D0` | Card backgrounds                     |
| Moss        | `#8A9860` | Primary buttons                      |
| Pollen      | `#C8A844` | Secondary buttons                    |
| Coral Flame | `#C85840` | Danger / alerts                      |

Typography: **Cormorant Garamond** (display) + **DM Sans** (UI)

---

## License

Private. All rights reserved.
