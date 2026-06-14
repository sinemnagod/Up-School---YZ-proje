# GlowLogic — Tech Stack

> This document explains every technology used in GlowLogic, why it was chosen, and how AI was used throughout the development process.

---

## Frontend

### React 18 + Vite + TypeScript

**What it is:** React is the most widely used JavaScript library for building user interfaces. Vite is the build tool that makes development fast. TypeScript adds type safety.

**Why we chose it:**

- React's component model fits GlowLogic perfectly — every ingredient badge, product card, and conflict alert is a reusable component
- Vite starts in under a second compared to older tools like Create React App
- TypeScript catches bugs before they reach production — especially important when dealing with complex data like ingredient lists and routine slots

### React Router v6

**What it is:** Handles navigation between pages in a React app without full page reloads.

**Why we chose it:** GlowLogic has two completely separate sides — the user app (`/products`, `/routine`, `/profile`) and the admin panel (`/admin/*`). React Router v6 lets us define nested routes and protect admin routes with a role guard, so regular users can never access admin pages.

### TanStack Query (React Query)

**What it is:** A data fetching and caching library for React.

**Why we chose it:** Product lists, routine data, and streak information all need to stay in sync with the server. TanStack Query handles caching, background refetching, and loading states automatically, which removes a lot of manual state management.

### Zustand

**What it is:** A lightweight global state management library.

**Why we chose it:** GlowLogic needs to remember who is logged in across every page. Zustand stores the user's identity and access token with `persist` middleware so the user stays logged in even after refreshing the page. It's far simpler than Redux for this use case.

### Tailwind CSS v3

**What it is:** A utility-first CSS framework that lets you style directly in JSX.

**Why we chose it:** GlowLogic has a custom design system with a specific color palette (Bloom Palette). Tailwind's configuration file lets us define custom tokens (`gl-plum`, `gl-moss`, `gl-parchment`) and use them as utility classes throughout the entire codebase. This keeps the design consistent without writing separate CSS files.

### Axios

**What it is:** An HTTP client for making API requests.

**Why we chose it:** Axios has request interceptors — a function that runs before every request. We use this to automatically attach the user's JWT access token to every API call, so no individual page has to worry about authentication headers.

---

## Backend

### Node.js + Express + TypeScript

**What it is:** Node.js is a JavaScript runtime for server-side code. Express is the web framework that handles HTTP requests. TypeScript adds type safety.

**Why we chose it:**

- Same language as the frontend (TypeScript) — no context switching between languages
- Express is minimal and flexible — we control exactly what middleware runs and in what order
- The Node.js ecosystem has packages for everything we needed: bcrypt, jsonwebtoken, multer, Cloudinary SDK

### Prisma ORM

**What it is:** A type-safe database client that generates TypeScript types from your database schema.

**Why we chose it:**

- Prisma's schema file (`schema.prisma`) is the single source of truth for the entire database structure — 16 tables defined in one readable file
- Auto-generated TypeScript types mean the compiler catches database query errors before runtime
- Migration system (`prisma migrate dev`) tracks every schema change with version control
- Prisma Studio gives a visual browser for the database during development

### JWT Authentication (jsonwebtoken + bcrypt)

**What it is:** JSON Web Tokens for stateless authentication. bcrypt for password hashing.

**Why we chose it:**

- JWTs are self-contained — the server doesn't need to look up session data on every request, it just verifies the token signature
- Two-token system: short-lived access tokens (15 minutes) + long-lived refresh tokens (7 days) stored as bcrypt hashes in the database
- No Redis needed — refresh tokens are stored in PostgreSQL, keeping the infrastructure simple
- bcrypt with 12 salt rounds makes brute-force attacks computationally infeasible

### Zod

**What it is:** A TypeScript-first schema validation library.

**Why we chose it:** Every API endpoint receives user input that could be malformed or malicious. Zod validates the shape and types of incoming data before it touches the database, and the same schemas are reusable on the frontend for form validation.

---

## Database

### PostgreSQL 16 (via Supabase)

**What it is:** A relational database. Supabase is a cloud platform that hosts PostgreSQL.

**Why we chose it:**

- GlowLogic has complex many-to-many relationships: Products ↔ Ingredients, Users ↔ Triggers, Users ↔ Badges. PostgreSQL handles these with foreign keys and join tables
- Native JSON column support for `skin_type_flags` on the Ingredient table
- Supabase hosts the database in the cloud so it's accessible from both the deployed backend and local development
- Free tier is sufficient for the current scale of the project

**Database design decisions:**

- `ProductIngredient` join table stores `order_index` to preserve INCI ingredient order
- `RefreshToken` table stores bcrypt hashes (never the raw token) with expiry timestamps
- Streak calculations are done dynamically from `CheckIn` records — no stored counter that can drift out of sync
- Conflict rules are stored in the database and evaluated at runtime — admin can add new rules without any code changes

---

## Cloud Services

### Supabase

**Role:** Cloud PostgreSQL database hosting

**Why:** Supabase gives a fully managed PostgreSQL instance with a visual table editor, making it easy to inspect data during development. Free tier covers the project's needs completely. When the app scales, Supabase handles connection pooling automatically.

### Cloudinary

**Role:** Image storage and delivery for product images

**Why:** Product images uploaded through the admin panel are sent directly to Cloudinary, which stores them and returns a CDN URL. Storing images in a dedicated media service means the database stays lean (only URLs, not binary data) and images load fast globally via CDN.

### Render

**Role:** Backend hosting (Express server)

**Why:** Render supports Node.js deployments directly from a GitHub repository. It automatically redeploys when new code is pushed to the `main` branch. The free tier is sufficient for a portfolio project with low traffic.

### Netlify

**Role:** Frontend hosting (React app)

**Why:** Netlify deploys static React builds from GitHub with zero configuration. The `_redirects` file handles SPA routing (all URLs return `index.html` so React Router works correctly). Automatic HTTPS, global CDN, and instant cache invalidation on deploy.

---

## AI Integration

### Google Gemini API (`gemini-1.5-flash`)

**Role:** Powers the AI Skin Consultant chat feature

**Why Gemini:**

- Free tier with generous limits — no credit card required to get started
- `gemini-1.5-flash` model is fast and cost-efficient for conversational responses
- Supports multi-turn conversations with history — the chat remembers what was said earlier in the session

**How it works:**

1. User sends a message in the chat widget
2. Frontend sends the full conversation history to `POST /api/v1/ai/chat`
3. Backend fetches the user's skin type and trigger blacklist from the database
4. A personalised system prompt is constructed with this context
5. The Gemini API generates a response tailored to that specific user
6. Response is returned to the frontend and displayed in the chat UI

**Why this satisfies the external API requirement:**
The Gemini integration is a real external API call to Google's infrastructure on every chat message. It is not mocked or simulated — it requires an API key, makes a network request, and returns a dynamically generated response based on the user's personal skin profile.

---

## How AI Was Used in Development

AI (Claude, Anthropic) was used as a development partner throughout the entire project, not just for code generation.

### Planning & Architecture

- The Product Requirements Document (PRD) was developed collaboratively with Claude, which helped identify missing features, edge cases, and technical constraints
- The database schema was designed with Claude's input — decisions like dynamic streak calculation (no stored counter) and bcrypt-hashed refresh tokens in PostgreSQL came from these conversations
- The build order (Phase 1 → 6) was planned with Claude to ensure dependencies were built in the right sequence

### Design System

- The Bloom Palette color system was developed by uploading a botanical painting image to Claude and extracting colors from it
- Every color was given a semantic role (Moss = primary action, Coral Flame = danger only, Parchment = page background) with clear rules to prevent misuse
- Typography pairing (Cormorant Garamond + DM Sans) was chosen with Claude's guidance based on the editorial skincare aesthetic

### Implementation

- All backend routes, controllers, and services were written with Claude's assistance
- Frontend components were built file by file with explanations at each step
- Debugging was done collaboratively — error messages were pasted into the conversation and Claude identified root causes
- Seed scripts for ingredients, products, and conflict rules were generated by Claude based on real skincare knowledge

### Documentation

- This tech stack document, the PRD, the design system, and the README were all written with Claude
- The checkpoint file was maintained throughout development to track progress and enable resuming work across sessions

### What AI Did NOT Do

- AI did not make decisions autonomously — every suggestion was reviewed and approved
- The product vision, brand identity, color inspiration, and feature priorities were decided by the human developer
- Real product data (brands, ingredients, descriptions) came from real skincare knowledge and research on Korendy

---

## Deployment Architecture

```
User Browser
     │
     ▼
Netlify (React SPA)
  up-glowlogic.netlify.app
     │
     │ API calls (HTTPS)
     ▼
Render (Express API)
  glowlogic-api.onrender.com
     │
     ├── Supabase (PostgreSQL)
     │   Database queries via Prisma
     │
     ├── Cloudinary
     │   Image upload & delivery
     │
     └── Google Gemini API
         AI chat responses
```

---

## Key Technical Decisions

| Decision                   | Choice                           | Reason                                                                   |
| -------------------------- | -------------------------------- | ------------------------------------------------------------------------ |
| Monorepo vs separate repos | Monorepo (`client/` + `server/`) | Easier to manage, single git history, shared types possible              |
| ORM                        | Prisma                           | Type safety, migration system, visual studio                             |
| Session storage            | PostgreSQL (no Redis)            | Simpler infrastructure, refresh tokens don't need sub-millisecond lookup |
| Streak calculation         | Dynamic from CheckIn records     | No background jobs, no counter drift, always accurate                    |
| Image storage              | Cloudinary                       | Purpose-built for images, CDN delivery, free tier sufficient             |
| Deployment                 | Render + Netlify                 | Both have GitHub auto-deploy, free tiers, zero config                    |
| Database hosting           | Supabase                         | Managed PostgreSQL, visual editor, free tier                             |
| AI model                   | Gemini 1.5 Flash                 | Free tier, fast responses, supports conversation history                 |
