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

## License

Private. All rights reserved.
