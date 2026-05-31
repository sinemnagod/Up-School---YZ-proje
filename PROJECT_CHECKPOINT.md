# GlowLogic Project Checkpoint

Last updated: 2026-05-31

## Current Status

**Phases 1–5 complete.** Full-stack application built and connected. All user-facing pages, admin panel, backend API, and database are working.

---

## What Is Built

### Backend (`server/`)

- ✅ Express server running on `http://localhost:3001`
- ✅ PostgreSQL database with all 16 tables migrated
- ✅ Prisma ORM connected (`server/src/config/db.ts`)
- ✅ Auth service with bcrypt + JWT (access token 15min, refresh token 7d)
- ✅ Refresh tokens stored in PostgreSQL (no Redis)
- ✅ JWT middleware — `requireAuth` + `requireAdmin` guards

#### API Endpoints

**Auth**

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`

**Products (public)**

- `GET /api/v1/products` — all published products
- `GET /api/v1/products/:id` — single product with ingredients

**User**

- `GET /api/v1/user/profile`
- `PUT /api/v1/user/profile`
- `GET /api/v1/user/triggers`
- `POST /api/v1/user/triggers`
- `DELETE /api/v1/user/triggers/:id`

**Routine**

- `GET /api/v1/routine`
- `PUT /api/v1/routine`
- `GET /api/v1/routine/conflicts`

**Streaks & Engagement**

- `GET /api/v1/streaks`
- `POST /api/v1/streaks` ← check-in endpoint
- `GET /api/v1/streaks/badges`
- `GET /api/v1/challenges`
- `GET /api/v1/challenges/mine`
- `POST /api/v1/challenges/:id/enroll`

**Admin (all require admin role)**

- `GET/POST /api/v1/admin/products`
- `GET/PUT/DELETE /api/v1/admin/products/:id`
- `GET/POST /api/v1/admin/ingredients`
- `GET/PUT/DELETE /api/v1/admin/ingredients/:id`
- `GET/POST /api/v1/admin/conflict-rules`
- `GET/PUT/DELETE /api/v1/admin/conflict-rules/:id`
- `PATCH /api/v1/admin/conflict-rules/:id/toggle`
- `GET /api/v1/admin/stats`

---

### Frontend (`client/`)

- ✅ React 18 + Vite + TypeScript
- ✅ React Router v6 with protected + admin-only routes
- ✅ Zustand auth store with localStorage persistence
- ✅ Axios API client with automatic token injection
- ✅ Design system v2.0 (Bloom Palette) fully wired

#### Pages Built

**User facing**

- ✅ `/login` — login form with error handling
- ✅ `/register` — register form with error handling
- ✅ `/products` — product catalog with search, clickable cards
- ✅ `/products/:id` — product detail with full ingredient list, irritation badges, hover tooltips
- ✅ `/profile` — skin type selector + trigger blacklist (add/remove ingredients to avoid)
- ✅ `/dashboard` — AM/PM streak cards, check-in buttons, badges, challenges progress
- ✅ `/routine` — AM/PM routine builder, product search modal, conflict alerts, overload warnings
- ✅ `/challenges` — browse challenges, enroll, track progress

**Admin panel (access via `localhost:5173/admin` — no nav link by design)**

- ✅ `/admin` — dashboard with product/ingredient/user stats
- ✅ `/admin/products` — product table with publish toggle, edit, delete
- ✅ `/admin/products/new` — add product form (name, brand, category, description, image upload to Cloudinary, ingredients multi-select, skin types, publish toggle)
- ✅ `/admin/products/:id/edit` — edit product form
- ✅ `/admin/ingredients` — ingredient table with status badges
- ✅ `/admin/ingredients/new` — add ingredient form (INCI name, common name, functions, comedogenic rating, irritation level, skin type flags, notes)
- ✅ `/admin/ingredients/:id/edit` — edit ingredient form
- ✅ `/admin/conflict-rules` — conflict rule table with toggle active/inactive
- ✅ `/admin/conflict-rules/new` — add rule form (ingredient A + B, scope, alert type, severity, explanation)
- ✅ `/admin/conflict-rules/:id/edit` — edit rule form

---

## File Structure (current)

```
server/src/
├── config/
│   └── db.ts
├── middleware/
│   └── auth.ts
├── routes/
│   ├── auth.routes.ts
│   ├── product.routes.ts
│   ├── admin.routes.ts
│   ├── user.routes.ts
│   ├── routine.routes.ts
│   ├── streaks.routes.ts
│   └── challenges.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   └── product.controller.ts
├── services/
│   └── auth.service.ts
├── app.ts
└── index.ts

client/src/
├── api/
│   └── client.ts
├── store/
│   └── authStore.ts
├── layouts/
│   └── AdminLayout.tsx
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── ProfilePage.tsx
│   ├── DashboardPage.tsx
│   ├── RoutinePage.tsx
│   ├── ChallengesPage.tsx
│   └── admin/
│       ├── AdminDashboardPage.tsx
│       ├── AdminProductsPage.tsx
│       ├── AdminProductFormPage.tsx
│       ├── AdminIngredientsPage.tsx
│       ├── AdminIngredientFormPage.tsx
│       ├── AdminConflictRulesPage.tsx
│       └── AdminConflictRuleFormPage.tsx
├── App.tsx
├── index.css
└── main.tsx
```

---

## Admin Account (seeded)

```
Email:    admin@glowlogic.com
Password: Admin1234!
```

Access the admin panel at: `localhost:5173/admin`
There is no nav link to the admin panel by design — admins access it directly via URL.

---

## How to Run Locally

**Terminal 1 — Backend:**

```bash
cd server
npm run dev
```

Runs at: `http://localhost:3001`
Health check: `http://localhost:3001/api/v1/health`

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

Runs at: `http://localhost:5173`

**Database:**

```bash
cd server
npx prisma migrate dev     # run migrations
npx prisma db seed         # seed starter data
npx prisma studio          # visual DB browser at localhost:5555
```

---

## What Is NOT Built Yet (Phase 6)

### Polish

- [ ] Safe alternatives engine (suggest products when trigger is hit)
- [ ] Compatibility scoring per skin type (shown on product cards)
- [ ] Toast notifications (success/error feedback)
- [ ] Mobile responsive layout
- [ ] Loading skeletons
- [ ] Admin analytics dashboard (most flagged ingredients, badge completion rates)

### Deployment

- [ ] Switch database from local PostgreSQL to Supabase ← **reminder: do this first**
- [ ] Deploy backend (Railway or Render)
- [ ] Deploy frontend (Vercel)
- [ ] Set up environment variables on hosting platforms
- [ ] Update README with live URLs

---

## Resume Prompt (copy/paste to start next session)

```
Continue GlowLogic from PROJECT_CHECKPOINT.md.
Phases 1–5 are complete. We are now on Phase 6 — Polish + Deployment.
Use glowlogic_design_system_v2.md for all colors, fonts, and components.
Use glowlogic_cursor_guide.md for API structure and business logic.
First task: switch database to Supabase, then deploy.
```
