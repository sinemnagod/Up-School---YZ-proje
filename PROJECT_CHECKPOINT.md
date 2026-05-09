# GlowLogic Project Checkpoint

Last updated: 2026-05-10

## Where We Stopped

- Backend setup is complete and running.
- Frontend scaffold is ready.
- Design system **v2.0 (“Bloom Palette”)** is wired: global CSS + Tailwind `gl-*` tokens + starter `App.css` aligned to tokens.

## Completed Work

### Backend (`server/`)

- Dependencies installed (`express`, `prisma`, `@prisma/client`, `bcrypt`, `jsonwebtoken`, `zod`, `multer`, `cloudinary`, etc.).
- Prisma stack aligned to v5 (`prisma@5`, `@prisma/client@5`).
- Prisma schema created at `server/prisma/schema.prisma`.
- Migration applied successfully.
- Seed script created and executed: `server/prisma/seed.ts`.
- Admin account seeded:
  - Email: `admin@glowlogic.com`
  - Password: `Admin1234!`
- Server entry files created:
  - `server/src/app.ts`
  - `server/src/index.ts`
- Health check verified:
  - `GET http://localhost:3001/api/v1/health` -> `{"status":"ok"}`

### Frontend (`client/`)

- React + Vite + TypeScript project created.
- Core dependencies installed (React Router, TanStack Query, Axios, Zustand, RHF, Zod).
- Tailwind v3 installed and configured.

### Design System Integration (v2.0)

- Authoritative doc in repo: `glowlogic_design_system_v2.md`
- **`client/src/index.css`** — full **Section 14** (imports, `@tailwind` layers, `:root`, base body, scrollbar, `:focus-visible`).
- **`client/tailwind.config.ts`** — **Section 13** palette (`nightbloom`, `plum`, `wildrose`, `dustypetal`, `blush`, `softbloom`, `petalmist`, `parchment`, `moss`, `pollen`, `lavender`, `danger`, derived tokens, fonts, typography sizes, radii).
- **`client/src/App.css`** — migrated from old Vite template variables (`--accent`, `--border`, etc.) to **`--gl-*`** / **`--ff-*`** only.

## Palette migration (v1 → v2)

| Old mental model | New token(s) |
|------------------|---------------|
| `forest` / primary green | **`moss`** |
| `sage` / secondary green | **`pollen`** (secondary / caution — not a 1:1 hue match) |
| `mist` / light green surface | **`softbloom`** (card surfaces) |
| `snow` page bg | **`parchment`** |
| darkest text anchor | **`ink`** (= **nightbloom** hex in v2) |

## Rules to Keep Applying

- Use GlowLogic design system **v2** consistently.
- Page background: **`gl-parchment`**. Prefer **`gl-softbloom`** for cards (not arbitrary white/warm grays outside `gl-white`).
- Colors in UI should use **`gl-*`** Tailwind classes or **`var(--gl-*)`** in CSS.
- Display headings: **`font-display`**. Body / UI copy: **`font-body`**.

## Next Step

Continue **Phase 1** implementation:

1. Express foundation hardening (error middleware, route composition).
2. Auth routes/controller (`register`, `login`, `refresh`, `logout`).
3. JWT auth middleware.
4. React routing skeleton + auth store.
5. Login / Register pages (using v2 buttons / inputs from design doc).

## Useful Commands

### Backend

```bash
cd "/Users/sinemdogan/Desktop/Up School - YZ Proje/server"
npm run dev
```

### Frontend

```bash
cd "/Users/sinemdogan/Desktop/Up School - YZ Proje/client"
npm run dev
```

### Database

```bash
cd "/Users/sinemdogan/Desktop/Up School - YZ Proje/server"
npx prisma migrate dev
npx prisma db seed
```

## Resume Prompt (copy/paste next time)

`Continue from PROJECT_CHECKPOINT.md. Use glowlogic_design_system_v2.md. Start from the "Next Step" section and proceed slowly, step by step.`
