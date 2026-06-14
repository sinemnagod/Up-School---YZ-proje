# GlowLogic

A full-stack skincare intelligence web app that eliminates ingredient guesswork. Users can browse products publicly, decode ingredient lists, detect routine conflicts, get AI-powered skincare advice, and track their consistency with streaks and badges. Admins manage the entire product and ingredient catalog through a dedicated dashboard.

🌸 **Live at:** [up-glowlogic.netlify.app](https://up-glowlogic.netlify.app)

---

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | React 18 + Vite + TypeScript           |
| Routing    | React Router v6                        |
| State      | Zustand + TanStack Query               |
| Styling    | Tailwind CSS v3 (custom Bloom Palette) |
| Backend    | Node.js + Express + TypeScript         |
| ORM        | Prisma 5                               |
| Database   | PostgreSQL 16 (Supabase)               |
| Auth       | JWT (bcrypt + access/refresh tokens)   |
| Images     | Cloudinary                             |
| AI         | Google Gemini API                      |
| Deployment | Netlify (frontend) + Render (backend)  |

---

## Features

### Public (no account needed)

- Animated landing page with botanical design
- Browse and search the full product catalog
- View product detail pages with full ingredient lists, irritation badges and hover tooltips

### For Users

- **Trigger Blacklist** — add ingredients to avoid, flagged automatically on every product
- **Skin Type Profile** — set your skin type for a personalised experience
- **AM/PM Routine Builder** — build a step-by-step daily routine with ordered slots
- **Conflict Detection** — real-time alerts when incompatible ingredients appear in the same routine slot (e.g. AHA + Retinol)
- **Ingredient Overload Warning** — flags when the same active ingredient appears in 3+ products
- **AI Skin Consultant** — chat powered by Google Gemini API, personalised to your skin profile
- **Streak Tracker** — daily check-ins with streak counts calculated dynamically
- **Badges** — earned at Day 3, 7, 15, 30, 50, 75, and 100 streaks
- **Challenges** — opt-in skincare goals with progress tracking

### For Admins

- Product management — add, edit, publish/unpublish, delete with Cloudinary image upload
- Ingredient database — manage INCI names, comedogenic ratings, irritation levels, skin type flags
- Conflict rule engine — define ingredient conflict pairs with scope, severity and user-facing explanations (no code required)
- Stats dashboard — total products, ingredients, users

---

## Project Structure

```
glowlogic/
├── client/                        # React frontend
│   └── src/
│       ├── api/client.ts          # Axios with auto token injection
│       ├── components/
│       │   ├── AiChat.tsx         # Floating AI chat widget
│       │   ├── EmptyState.tsx
│       │   ├── ErrorBoundary.tsx
│       │   ├── ToastContainer.tsx
│       │   └── skeletons/
│       ├── layouts/
│       │   ├── AppLayout.tsx      # User nav + mobile tabs
│       │   └── AdminLayout.tsx    # Admin sidebar
│       ├── pages/
│       │   ├── LandingPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ProductsPage.tsx
│       │   ├── ProductDetailPage.tsx
│       │   ├── ProfilePage.tsx
│       │   ├── RoutinePage.tsx
│       │   ├── ChallengesPage.tsx
│       │   └── admin/
│       │       ├── AdminDashboardPage.tsx
│       │       ├── AdminProductsPage.tsx
│       │       ├── AdminProductFormPage.tsx
│       │       ├── AdminIngredientsPage.tsx
│       │       ├── AdminIngredientFormPage.tsx
│       │       ├── AdminConflictRulesPage.tsx
│       │       └── AdminConflictRuleFormPage.tsx
│       └── store/
│           ├── authStore.ts       # Zustand auth state
│           └── toastStore.ts
│
└── server/                        # Express backend
    ├── prisma/
    │   ├── schema.prisma          # 16-table database schema
    │   └── seed.ts
    ├── scripts/
    │   ├── seed-ingredients.ts    # Bulk ingredient seeder
    │   ├── seed-products.ts       # Product seeder
    │   └── seed-rules.ts          # Conflict rule seeder
    └── src/
        ├── config/db.ts
        ├── middleware/auth.ts     # JWT + admin guards
        ├── controllers/
        ├── services/
        └── routes/
            ├── auth.routes.ts
            ├── product.routes.ts
            ├── admin.routes.ts
            ├── user.routes.ts
            ├── routine.routes.ts
            ├── streaks.routes.ts
            ├── challenges.routes.ts
            ├── ingredients.routes.ts
            └── ai.routes.ts
```

---

## Pages & Routes

### Public

| Route           | Page            |
| --------------- | --------------- |
| `/`             | Landing page    |
| `/products`     | Product catalog |
| `/products/:id` | Product detail  |
| `/login`        | Login           |
| `/register`     | Register        |

### User (login required)

| Route         | Page                          |
| ------------- | ----------------------------- |
| `/profile`    | Skin type + trigger blacklist |
| `/routine`    | AM/PM routine builder         |
| `/challenges` | Streaks, badges, challenges   |

### Admin (direct URL access — no nav link by design)

| Route                   | Page                |
| ----------------------- | ------------------- |
| `/admin`                | Stats dashboard     |
| `/admin/products`       | Product management  |
| `/admin/ingredients`    | Ingredient database |
| `/admin/conflict-rules` | Rule engine         |

---

## API Overview

Base URL: `https://glowlogic-api.onrender.com/api/v1`

| Group             | Endpoints                                                                     |
| ----------------- | ----------------------------------------------------------------------------- |
| Auth              | `/auth/register` `/auth/login` `/auth/logout`                                 |
| Products (public) | `GET /products` `GET /products/:id`                                           |
| User              | `/user/profile` `/user/triggers`                                              |
| Routine           | `GET/PUT /routine` `GET /routine/conflicts`                                   |
| Streaks           | `GET /streaks` `POST /streaks` `GET /streaks/badges`                          |
| Challenges        | `GET /challenges` `GET /challenges/mine` `POST /challenges/:id/enroll`        |
| AI Chat           | `POST /ai/chat`                                                               |
| Admin             | `/admin/products` `/admin/ingredients` `/admin/conflict-rules` `/admin/stats` |

---

## Getting Started Locally

### Prerequisites

- Node.js v20+
- PostgreSQL 16 (or a Supabase project)
- Git

### 1. Clone

```bash
git clone https://github.com/sinemnagod/Up-School---YZ-proje.git
cd Up-School---YZ-proje
```

### 2. Environment Variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/glowlogic"
DIRECT_URL="postgresql://postgres:password@localhost:5432/glowlogic"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
GEMINI_API_KEY="your-gemini-key"
PORT=3001
NODE_ENV="development"
```

Create `client/.env`:

```env
VITE_API_URL="http://localhost:3001/api/v1"
VITE_CLOUDINARY_CLOUD_NAME="your-cloud-name"
```

### 3. Install & Run

```bash
# Backend
cd server
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev        # http://localhost:3001

# Frontend (new terminal)
cd client
npm install
npm run dev        # http://localhost:5173
```

### 4. Seed Data (optional bulk)

```bash
cd server
npx tsx scripts/seed-ingredients.ts   # 50+ ingredients
npx tsx scripts/seed-products.ts      # sample products
npx tsx scripts/seed-rules.ts         # conflict rules
```

---

## Admin Access

Admin panel: `/admin` — no nav link by design, access directly via URL.

```
Email:    ***
Password: ***
```

---

## Design System

Custom **Bloom Palette** — inspired by a botanical painting.

| Token       | Color     | Role                                |
| ----------- | --------- | ----------------------------------- |
| Nightbloom  | `#3C1828` | Footer, logo, streak cards          |
| Plum Rose   | `#7A3548` | Header / admin header               |
| Wild Rose   | `#A85068` | Active states, hover, progress bars |
| Parchment   | `#F0E4D0` | Page background                     |
| Soft Bloom  | `#ECC8D0` | Card surfaces                       |
| Moss        | `#8A9860` | Primary buttons (save, confirm)     |
| Pollen      | `#C8A844` | Secondary buttons (add, explore)    |
| Lavender    | `#B8A8C4` | Ghost buttons (cancel, dismiss)     |
| Coral Flame | `#C85840` | Danger / alerts only                |

Typography: **Cormorant Garamond** (display) + **DM Sans** (UI)

---

## How AI Was Used

This project was built with Claude (Anthropic) as a development partner:

- **Architecture** — database schema design, API structure, authentication flow
- **Design** — Bloom Palette extracted from a botanical painting using Claude's image analysis
- **Implementation** — backend routes, frontend components, seed scripts
- **AI Feature** — Google Gemini API integrated for the Skin Consultant chat
- **Documentation** — PRD, tech stack, design system, README

See `tech-stack.md` for a full breakdown of AI usage.

---

## License

Private. All rights reserved.
