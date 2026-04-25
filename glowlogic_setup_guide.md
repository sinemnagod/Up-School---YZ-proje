# GlowLogic — Setup Guide for First-Timers
# Follow these steps in exact order before touching Cursor.

---

## WHAT YOU WILL INSTALL

- Node.js — JavaScript runtime (runs your backend)
- npm — Package manager (comes with Node)
- PostgreSQL — Your database
- Git — Version control
- Cursor — Your AI code editor

---

## STEP 1 — Install Node.js

1. Go to https://nodejs.org
2. Download the **LTS version** (the one labeled "Recommended for most users")
3. Run the installer, click through defaults
4. Verify it worked — open Terminal (Mac) or Command Prompt (Windows) and run:
   ```
   node --version
   npm --version
   ```
   Both should print a version number (e.g., `v20.11.0` and `10.2.4`).

---

## STEP 2 — Install PostgreSQL

### Mac
1. Go to https://postgresapp.com
2. Download and install Postgres.app
3. Open the app, click **Initialize** to create a server
4. Click **Start** — the elephant icon in your menu bar means it's running
5. Click **Open psql** to open the database terminal
6. Run this to create your database:
   ```sql
   CREATE DATABASE glowlogic;
   ```
7. Type `\q` to exit

### Windows
1. Go to https://www.postgresql.org/download/windows/
2. Download the installer (version 16)
3. Run it — during setup, set a password for the `postgres` user. **Write this down.**
4. Default port is `5432` — leave it as-is
5. After install, open **pgAdmin** (installed automatically)
6. Right-click **Databases** → **Create** → **Database** → name it `glowlogic`

---

## STEP 3 — Install Git

### Mac
Git is likely already installed. Run `git --version` in Terminal. If not installed, it will prompt you to install it.

### Windows
1. Go to https://git-scm.com/download/win
2. Download and run the installer
3. During install, choose **"Git from the command line and also from 3rd-party software"**
4. All other defaults are fine
5. Verify: open Command Prompt and run `git --version`

---

## STEP 4 — Install Cursor

1. Go to https://cursor.com
2. Download and install
3. Open Cursor
4. Sign in or create an account
5. When asked to choose a model, select **Claude Sonnet** (most capable for coding)

---

## STEP 5 — Create a Cloudinary Account (for product images)

1. Go to https://cloudinary.com
2. Sign up for free
3. After signing in, go to **Dashboard**
4. Copy your **Cloud Name**, **API Key**, and **API Secret** — you'll need these for `.env`
5. Go to **Settings** → **Upload** → **Upload Presets**
6. Click **Add upload preset**
7. Set signing mode to **Unsigned**, name it `glowlogic_products`
8. Save

---

## STEP 6 — Set Up the Project

Open Terminal (Mac) or Command Prompt (Windows) and run each command one at a time:

```bash
# 1. Create the project folder
mkdir glowlogic
cd glowlogic

# 2. Initialize Git
git init

# 3. Create the monorepo package.json
npm init -y

# 4. Create the two main folders
mkdir client server

# 5. Set up the React frontend
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install react-router-dom @tanstack/react-query axios zustand react-hook-form zod @hookform/resolvers
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
cd ..

# 6. Set up the Express backend
cd server
npm init -y
npm install express prisma @prisma/client bcrypt jsonwebtoken zod multer cloudinary cors dotenv
npm install -D typescript ts-node nodemon @types/express @types/node @types/bcrypt @types/jsonwebtoken @types/multer @types/cors
npx tsc --init
npx prisma init
cd ..
```

---

## STEP 7 — Create the .env File

In the root `glowlogic/` folder, create a file named exactly `.env` (with the dot, no other extension):

```env
DATABASE_URL="postgresql://postgres:YOURPASSWORD@localhost:5432/glowlogic"
JWT_ACCESS_SECRET="make-this-long-and-random-abc123xyz"
JWT_REFRESH_SECRET="make-this-different-also-long-def456uvw"
JWT_ACCESS_EXPIRES="15m"
JWT_REFRESH_EXPIRES="7d"
CLOUDINARY_CLOUD_NAME="your-cloud-name-from-step-5"
CLOUDINARY_API_KEY="your-api-key-from-step-5"
CLOUDINARY_API_SECRET="your-api-secret-from-step-5"
PORT=3001
NODE_ENV="development"
VITE_API_URL="http://localhost:3001/api/v1"
```

Replace `YOURPASSWORD` with the PostgreSQL password you set in Step 2.
Replace the Cloudinary values with what you copied in Step 6.

---

## STEP 8 — Create .gitignore

In the root folder, create a file named `.gitignore`:

```
node_modules/
.env
dist/
build/
.DS_Store
```

---

## STEP 9 — Set Up the Database Schema

```bash
# From the server/ folder:
cd server

# Paste the Prisma schema from the Cursor guide into server/prisma/schema.prisma

# Then run:
npx prisma migrate dev --name init

# This creates all your tables in PostgreSQL automatically.
# You should see: "Your database is now in sync with your schema."

# Then run the seed file to create starter data:
npx prisma db seed
```

---

## STEP 10 — Open in Cursor

1. Open Cursor
2. File → Open Folder → select the `glowlogic/` folder
3. You'll see the full project tree on the left
4. Open the chat panel (Cmd+L on Mac, Ctrl+L on Windows)
5. Paste the contents of `glowlogic_cursor_guide.md` as your first message
6. Then say: **"Use this as the project spec. Start by building the Express server entry point, middleware, and auth routes."**

---

## STEP 11 — Running the App During Development

You'll need two terminals open at the same time:

**Terminal 1 — Backend:**
```bash
cd glowlogic/server
npx nodemon src/index.ts
```
Backend runs at: http://localhost:3001

**Terminal 2 — Frontend:**
```bash
cd glowlogic/client
npm run dev
```
Frontend runs at: http://localhost:5173

---

## STEP 12 — Verify Everything Is Connected

1. Open http://localhost:5173 — you should see the React app
2. Open http://localhost:3001/api/v1/health — should return `{ "status": "ok" }`
   (you'll build this endpoint first as a smoke test)
3. Open pgAdmin or run `psql -d glowlogic -c "\dt"` to confirm your tables were created

---

## RECOMMENDED BUILD ORDER (tell this to Cursor)

Build features in this order — each one depends on the previous:

```
Phase 1 — Foundation
  1. Express server setup (app.ts, index.ts, error middleware)
  2. Database connection (config/db.ts with Prisma)
  3. Auth routes + controller (register, login, refresh, logout)
  4. JWT middleware (auth.middleware.ts)
  5. React app skeleton (layouts, routing, auth store)
  6. Login + Register pages

Phase 2 — Admin Core
  7. Admin middleware
  8. Ingredient CRUD (admin routes + form)
  9. Product CRUD (admin routes + form with IngredientMultiSelect)
  10. Conflict Rule CRUD

Phase 3 — User Core
  11. User profile + skin type (onboarding)
  12. Trigger blacklist (add/remove)
  13. Product catalog page (search + filters)
  14. Product detail page (ingredient badges + compatibility score)

Phase 4 — Intelligence
  15. Routine builder (AM/PM columns)
  16. Conflict check service + alerts
  17. Ingredient overload detector
  18. Safe alternatives engine

Phase 5 — Engagement
  19. Check-in system + streak calculation
  20. Badge award logic
  21. Challenges

Phase 6 — Polish
  22. Admin analytics dashboard
  23. Responsive mobile layout
  24. Toast notifications
  25. Loading skeletons
```

---

## USEFUL COMMANDS CHEATSHEET

| What | Command |
|------|---------|
| Start backend | `cd server && npx nodemon src/index.ts` |
| Start frontend | `cd client && npm run dev` |
| Add a DB migration | `cd server && npx prisma migrate dev --name your_change_name` |
| View DB in browser | `cd server && npx prisma studio` |
| Re-run seed data | `cd server && npx prisma db seed` |
| Install a new package (backend) | `cd server && npm install package-name` |
| Install a new package (frontend) | `cd client && npm install package-name` |
| Check what's running on port 3001 | Mac: `lsof -i :3001` / Windows: `netstat -ano | findstr :3001` |
| Kill a port (Mac) | `kill -9 $(lsof -ti:3001)` |

---

## IF SOMETHING BREAKS

**"Cannot connect to database"**
→ Make sure PostgreSQL is running (Postgres.app icon on Mac, or Services on Windows)
→ Double-check `DATABASE_URL` in `.env` — password and database name must match

**"Module not found"**
→ Run `npm install` in the folder where the error appears (client/ or server/)

**"Prisma: table does not exist"**
→ Run `npx prisma migrate dev` from the server/ folder

**Port already in use**
→ Either stop the other process or change the PORT in `.env`
