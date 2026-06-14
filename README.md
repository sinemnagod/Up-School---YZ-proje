# GlowLogic

A full-stack skincare intelligence web app that eliminates ingredient guesswork. Users can browse products publicly, decode ingredient lists, detect routine conflicts, get AI-powered skincare advice, and track their consistency with streaks and badges. Admins manage the entire product and ingredient catalog through a dedicated dashboard.

---

## Tech Stack

| Layer         | Technology                             |
| ------------- | -------------------------------------- |
| Frontend      | React 18 + Vite + TypeScript           |
| Routing       | React Router v6                        |
| Data Fetching | Axios                                  |
| Global State  | Zustand                                |
| Styling       | Tailwind CSS v3                        |
| Backend       | Node.js + Express + TypeScript         |
| ORM           | Prisma 5                               |
| Database      | PostgreSQL 16                          |
| Auth          | JWT (access + refresh tokens) + bcrypt |
| Image Storage | Cloudinary                             |
| AI            | Google Gemini API                      |

---

## Features

### Public (no account needed)

- **Landing page** — animated hero, feature overview, how it works, AI section
- **Product catalog** — browse and search all products
- **Product detail** — full ingredient list with irritation level badges and hover tooltips

### For Users

- **Trigger Blacklist** — add ingredients to avoid; flagged on every product automatically
- **Skin Type Profile** — set your skin type for personalised experience
- **AM/PM Routine Builder** — step-by-step daily routine with ordered slots
- **Conflict Detection** — real-time alerts when incompatible ingredients are in the same routine (e.g. AHA + Retinol)
- **Ingredient Overload Warning** — flags when the same active appears in 3+ products
- **AI Skin Consultant** — chat with an AI assistant for personalised skincare advice powered by Gemini
- **Streak Tracker** — daily check-ins with streak counts and milestone badges
- **Badges** — earned automatically at Day 3, 7, 15, 30, 50, 75, and 100 streaks
- **Challenges** — opt-in themed skincare goals with progress tracking

### For Admins

- **Product Management** — add, edit, publish/unpublish, and delete products with image upload to Cloudinary
- **Ingredient Database** — manage INCI names, comedogenic ratings, irritation levels, skin type flags, and functions
- **Conflict Rule Engine** — define ingredient conflict pairs, scope, severity, and user-facing explanations — no code required
- **Stats Dashboard** — total products, ingredients, and users at a glance

---

## Project Structure

```
glowlogic/
├── client/                          # React frontend (Vite)
│   └── src/
│       ├── api/client.ts            # Axios instance with auto token
│       ├── components/
│       │   ├── AiChat.tsx           # Floating AI chat widget
│       │   ├── EmptyState.tsx       # Empty state UI
│       │   ├── ErrorBoundary.tsx    # React error boundary
│       │   ├── ToastContainer.tsx   # Toast notifications
│       │   └── skeletons/           # Loading skeleton screens
│       ├── layouts/
│       │   ├── AppLayout.tsx        # Shared user page layout
│       │   └── AdminLayout.tsx      # Admin sidebar layout
│       ├── pages/
│       │   ├── LandingPage.tsx      # Public home page
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ProductsPage.tsx     # Public product catalog
│       │   ├── ProductDetailPage.tsx
│       │   ├── ProfilePage.tsx      # Skin type + trigger blacklist
│       │   ├── RoutinePage.tsx      # AM/PM routine builder
│       │   ├── ChallengesPage.tsx   # Streaks, badges, challenges
│       │   └── admin/
│       │       ├── AdminDashboardPage.tsx
│       │       ├── AdminProductsPage.tsx
│       │       ├── AdminProductFormPage.tsx
│       │       ├── AdminIngredientsPage.tsx
│       │       ├── AdminIngredientFormPage.tsx
│       │       ├── AdminConflictRulesPage.tsx
│       │       └── AdminConflictRuleFormPage.tsx
│       ├── store/
│       │   ├── authStore.ts         # Zustand auth state
│       │   └── toastStore.ts        # Zustand toast state
│       └── utils/apiError.ts
│
└── server/                          # Express backend (TypeScript)
    └── src/
        ├── config/db.ts             # Prisma client singleton
        ├── middleware/auth.ts       # JWT auth + admin guards
        ├── controllers/
        │   ├── auth.controller.ts
        │   └── product.controller.ts
        ├── services/auth.service.ts
        └── routes/
            ├── auth.routes.ts
            ├── product.routes.ts
            ├── admin.routes.ts
            ├── user.routes.ts
            ├── routine.routes.ts
            ├── streaks.routes.ts
            ├── challenges.routes.ts
            ├── ingredients.routes.ts
            └── ai.routes.ts         # Gemini AI chat endpoint
```

---

## Pages & Routes

### Public

| Route           | Page                                  |
| --------------- | ------------------------------------- |
| `/`             | Landing page                          |
| `/products`     | Product catalog (search + browse)     |
| `/products/:id` | Product detail with ingredient badges |
| `/login`        | Login                                 |
| `/register`     | Register                              |

### User (login required)

| Route         | Page                                     |
| ------------- | ---------------------------------------- |
| `/profile`    | Skin type + trigger blacklist            |
| `/routine`    | AM/PM routine builder + conflict checker |
| `/challenges` | Streaks, badges, challenges              |

### Admin (admin role required — access via URL)

| Route                            | Page               |
| -------------------------------- | ------------------ |
| `/admin`                         | Stats dashboard    |
| `/admin/products`                | Product list       |
| `/admin/products/new`            | Add product        |
| `/admin/products/:id/edit`       | Edit product       |
| `/admin/ingredients`             | Ingredient list    |
| `/admin/ingredients/new`         | Add ingredient     |
| `/admin/ingredients/:id/edit`    | Edit ingredient    |
| `/admin/conflict-rules`          | Conflict rule list |
| `/admin/conflict-rules/new`      | Add conflict rule  |
| `/admin/conflict-rules/:id/edit` | Edit conflict rule |

---

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

Protected routes require: `Authorization: Bearer <accessToken>`

| Method         | Endpoint                           | Auth  | Description                     |
| -------------- | ---------------------------------- | ----- | ------------------------------- |
| POST           | `/auth/register`                   | —     | Create account                  |
| POST           | `/auth/login`                      | —     | Login, returns tokens           |
| POST           | `/auth/logout`                     | ✓     | Logout                          |
| GET            | `/products`                        | —     | All published products          |
| GET            | `/products/:id`                    | —     | Single product with ingredients |
| GET            | `/user/profile`                    | ✓     | Get skin type                   |
| PUT            | `/user/profile`                    | ✓     | Update skin type                |
| GET            | `/user/triggers`                   | ✓     | Get trigger blacklist           |
| POST           | `/user/triggers`                   | ✓     | Add trigger                     |
| DELETE         | `/user/triggers/:id`               | ✓     | Remove trigger                  |
| GET            | `/routine`                         | ✓     | Get user routine                |
| PUT            | `/routine`                         | ✓     | Save routine                    |
| GET            | `/routine/conflicts`               | ✓     | Run conflict check              |
| GET            | `/streaks`                         | ✓     | AM/PM streak data               |
| POST           | `/streaks`                         | ✓     | Daily check-in                  |
| GET            | `/streaks/badges`                  | ✓     | Earned badges                   |
| GET            | `/challenges`                      | ✓     | All active challenges           |
| GET            | `/challenges/mine`                 | ✓     | Enrolled challenges             |
| POST           | `/challenges/:id/enroll`           | ✓     | Enroll in challenge             |
| POST           | `/ai/chat`                         | ✓     | AI skin consultant chat         |
| GET            | `/admin/stats`                     | Admin | Dashboard stats                 |
| GET/POST       | `/admin/products`                  | Admin | Product CRUD                    |
| GET/PUT/DELETE | `/admin/products/:id`              | Admin | Product CRUD                    |
| GET/POST       | `/admin/ingredients`               | Admin | Ingredient CRUD                 |
| GET/PUT/DELETE | `/admin/ingredients/:id`           | Admin | Ingredient CRUD                 |
| GET/POST       | `/admin/conflict-rules`            | Admin | Rule CRUD                       |
| GET/PUT/DELETE | `/admin/conflict-rules/:id`        | Admin | Rule CRUD                       |
| PATCH          | `/admin/conflict-rules/:id/toggle` | Admin | Toggle rule active              |

---

## Prerequisites

- Node.js v20+
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

Create a `.env` file in the `server/` folder:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/glowlogic"
JWT_ACCESS_SECRET="your-access-secret"
JWT_REFRESH_SECRET="your-refresh-secret"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
GEMINI_API_KEY="your-gemini-api-key"
PORT=3001
NODE_ENV="development"
```

Create a `.env` file in the `client/` folder:

```env
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

The admin panel is at `/admin` — there is no navigation link by design. Admins access it directly via URL.

Default admin account (created by seed):

```
Email:    admin@glowlogic.com
Password: Admin1234!
```

---

## Database

Prisma schema at `server/prisma/schema.prisma`. 16 tables covering users, products, ingredients, routines, streaks, badges, and challenges.

```bash
cd server
npx prisma studio   # Visual DB browser at localhost:5555
```

---

## Design System

GlowLogic uses a custom **Bloom Palette** inspired by a botanical painting.

| Token       | Color     | Role                           |
| ----------- | --------- | ------------------------------ |
| Nightbloom  | `#3C1828` | Footer, logo, streak card      |
| Plum Rose   | `#7A3548` | Header                         |
| Wild Rose   | `#A85068` | Active states, hover, progress |
| Parchment   | `#F0E4D0` | Page background                |
| Soft Bloom  | `#ECC8D0` | Card backgrounds               |
| Moss        | `#8A9860` | Primary buttons                |
| Pollen      | `#C8A844` | Secondary buttons              |
| Coral Flame | `#C85840` | Danger / alerts                |

Typography: **Cormorant Garamond** (display) + **DM Sans** (UI)

---

## What's Next

- [ ] Fix AI chat Gemini API integration
- [ ] Deploy database to Supabase
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Netlify
- [ ] Add email verification
- [ ] Add password reset flow
- [ ] SEO meta tags
- [ ] Compatibility scoring per skin type
- [ ] Safe alternatives engine

---

## License

Private. All rights reserved.
