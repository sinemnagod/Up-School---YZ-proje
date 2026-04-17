# 🛡️ GlowLogic (v1.0)

### The Engineering Approach to Skincare Compatibility

**GlowLogic** is a full-stack web application designed to eliminate "chemical guesswork" in skincare. Built for users with high sensitivity and complex routines, it leverages a custom logic engine to cross-reference product ingredient decks (INCI) against personal triggers and active-ingredient conflicts.

---

## 🚀 Core Engineering Features

### 1. Personal Trigger Engine (The "Blacklist")

A high-precision filtering system. Users define specific ingredients or chemical families (e.g., _Hyaluronic Acid, Denatured Alcohol, Fragrance_) to blacklist. The engine performs a real-time scan of product databases to flag matches.

### 2. AM/PM Conflict Engine

A complex conditional logic layer that analyzes the user's "Skin Stack."

- **Validation:** Prevents the layering of incompatible actives (e.g., Vitamin C + Copper Peptides or Retinoids + AHAs).
- **Safety Alerts:** Triggers "Barrier Risk" warnings based on cumulative irritation scores.

### 3. Consistency Milestone Tracker

A gamified persistence system that tracks AM and PM routine compliance.

- **Logic:** Time-gated increments (1 check-in per 24h window).
- **Persistence:** Milestone badges awarded at 3, 7, 15, 30, 50, 75, and 100-day streaks to incentivize habit formation.

---

## 🛠️ Technical Stack (Planned)

- **Frontend:** React.js / Next.js (Responsive Web)
- **Backend:** Node.js (Express) or Python (FastAPI)
- **Database:** PostgreSQL (Relational mapping for Ingredients/Products/Users)
- **Authentication:** JWT / Firebase Auth

---

## 📊 Database Architecture (High-Level)

The project utilizes a many-to-many relational schema:

- `Users` ↔ `Blacklisted_Ingredients`
- `Products` ↔ `Ingredients`
- `Users` ↔ `Routines` (AM/PM Slots)
- `Routines` ↔ `Products`

---

## 📝 Roadmap

- [ ] Finalize Relational Database Schema
- [ ] Implement Ingredient Parsing Logic
- [ ] Build AM/PM Routine Conflict Matrix
- [ ] Develop Milestone/Badge Logic
- [ ] Frontend UI Implementation (Tailwind CSS)

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

**Author:** [Sinem]
**Major:** Software Engineering
