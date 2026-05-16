# GlowLogic Project Checkpoint

Last updated: 2026-05-16

## Current Status

**Demo milestone complete.** Frontend and backend are connected and working.

---

## What Is Built

### Backend (`server/`)

- ✅ Express server running on `http://localhost:3001`
- ✅ PostgreSQL database with all 16 tables migrated
- ✅ Prisma ORM connected (`server/src/config/db.ts`)
- ✅ Auth service (`server/src/services/auth.service.ts`)
  - Register new user (bcrypt password hashing)
  - Login (returns JWT access token + refresh token)
  - Logout (clears refresh token from DB)
- ✅ JWT auth middleware (`server/src/middleware/auth.ts`)
  - `requireAuth` — protects any route that needs login
  - `requireAdmin` — protects admin-only routes
- ✅ Auth controller + routes (`/api/v1/auth`)
  - `POST /api/v1/auth/register`
  - `POST /api/v1/auth/login`
  - `POST /api/v1/auth/logout`
- ✅ Products controller + routes
  - `GET /api/v1/products` — public, returns all published products
  - `GET /api/v1/products/:id` — public, returns one product with ingredients
  - `POST /api/v1/admin/products` — admin only, create product
  - `PUT /api/v1/admin/products/:id` — admin only, update product
  - `DELETE /api/v1/admin/products/:id` — admin only, delete product
- ✅ Refresh tokens stored in PostgreSQL (no Redis needed)
- ✅ Seed data: 3 sample products, admin account

### Frontend (`client/`)

- ✅ React 18 + Vite + TypeScript
- ✅ React Router v6 with protected routes
- ✅ Zustand auth store with localStorage persistence (`client/src/store/authStore.ts`)
- ✅ Axios API client with automatic token injection (`client/src/api/client.ts`)
- ✅ Login page (`/login`) — form, error handling, redirects to products on success
- ✅ Register page (`/register`) — form, error handling, redirects to login on success
- ✅ Products page (`/products`) — protected, fetches real data from backend, product cards
- ✅ Log out button — clears auth state, redirects to login
- ✅ Design system v2.0 (Bloom Palette) fully wired
  - Tailwind `gl-*` color tokens
  - Cormorant Garamond display font + DM Sans body font
  - Parchment background, Plum header, Softbloom cards

### Design System (`glowlogic_design_system_v2.md`)

- ✅ Full color palette (Nightbloom, Plum, Wild Rose, Dusty Petal, Blush, Soft Bloom, Petal Mist, Parchment)
- ✅ Button system (Moss = primary, Pollen = secondary, Lavender = ghost, Coral Flame = danger)
- ✅ Typography (Cormorant Garamond display, DM Sans UI)
- ✅ Component specs (cards, badges, alerts, navigation, footer)

---

## Admin Account (seeded)

```
Email:    admin@glowlogic.com
Password: Admin1234!
```

---

## File Structure (current)

```
server/src/
├── config/
│   └── db.ts                      ← Prisma client singleton
├── middleware/
│   └── auth.ts                    ← JWT auth + admin guards
├── routes/
│   ├── auth.routes.ts
│   └── product.routes.ts
├── controllers/
│   ├── auth.controller.ts
│   └── product.controller.ts
├── services/
│   └── auth.service.ts
├── app.ts
└── index.ts

client/src/
├── api/
│   └── client.ts                  ← Axios instance
├── store/
│   └── authStore.ts               ← Zustand auth state
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ProductsPage.tsx
├── App.tsx                        ← Router + protected routes
├── index.css                      ← Design system tokens
└── main.tsx
```

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
npx prisma migrate dev    # run migrations
npx prisma db seed        # seed starter data
npx prisma studio         # visual DB browser at localhost:5555
```

---

## What Is NOT Built Yet (post-demo roadmap)

### Phase 2 — Admin Core

- [ ] Admin dashboard page
- [ ] Ingredient CRUD (admin)
- [ ] Product CRUD with image upload (admin form UI)
- [ ] Conflict rule management (admin)

### Phase 3 — User Core

- [ ] Onboarding flow (skin type selection)
- [ ] Trigger blacklist (add/remove ingredients to avoid)
- [ ] Product detail page (ingredient list with badges)
- [ ] Smart product search + filters

### Phase 4 — Intelligence

- [ ] AM/PM routine builder
- [ ] Conflict check engine (AHA + Retinol alerts, etc.)
- [ ] Ingredient overload detector
- [ ] Safe alternatives suggestions
- [ ] Compatibility scoring per skin type

### Phase 5 — Engagement

- [ ] Daily check-in system
- [ ] Streak tracker (dynamic calculation)
- [ ] Badge milestones (Day 3, 7, 15, 30, 50, 75, 100)
- [ ] Challenges

### Phase 6 — Polish

- [ ] Admin analytics dashboard
- [ ] Mobile responsive layout
- [ ] Toast notifications
- [ ] Loading skeletons

---

## Resume Prompt (copy/paste into Cursor next session)

```
Continue from PROJECT_CHECKPOINT.md.
Use glowlogic_design_system_v2.md for all colors, fonts, and components.
Use glowlogic_cursor_guide.md for API structure, DB schema, and business logic.
Start from Phase 2 — Admin Core. Build one step at a time.
```
