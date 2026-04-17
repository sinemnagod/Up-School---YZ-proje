# Product Requirements Document (PRD): GlowLogic Web v1.0

**Project Name:** GlowLogic
**Status:** Ready for Engineering
**Lead Engineer:** Sinem
**Target Launch:** Q2 2026

---

## 1. Product Vision

To provide a high-utility web platform that eliminates "skincare guesswork" by cross-referencing ingredient decks against personal sensitivities and existing routines. This is a data-first engineering solution, not a lifestyle blog.

## 2. Target User Personas

- **The Sensitive Consumer:** Requires 100% certainty in avoiding specific triggers (e.g., Hyaluronic Acid, Fragrance).
- **The Routine Minimalist:** Needs to ensure their AM and PM products are chemically compatible.
- **The Consistency Seeker:** Driven by gamified milestones to maintain skin health.

## 3. Functional Requirements (MVP)

### FR1: Personal Trigger Engine (The "Blacklist")

- **Description:** Users define a set of prohibited ingredients in their profile.
- **Engine Logic:** The system must parse product INCI lists and flag any user-defined "triggers."
- **Priority:** P0

### FR2: AM/PM Routine Conflict Checker

- **Description:** A slot-based routine builder (AM/PM) that checks for chemical incompatibilities.
- **Logic:** e.g., Throw a "High Irritation Alert" if high-strength AHA and Retinoids are assigned to the same PM slot.
- **Priority:** P0

### FR3: Milestone Streak Tracker

- **Description:** A daily check-in system for consistency.
- **Badges:** Earned at days 3, 7, 15, 30, 50, 75, and 100 for each track (AM/PM).
- **Constraint:** Only one check-in allowed per slot per 24-hour period.
- **Priority:** P1

## 4. Technical Constraints

- **Architecture:** Full-stack Web Application (Mobile-responsive).
- **Out of Scope:** Image processing/OCR, Price comparison, Social networking.
- **Data Integrity:** Must use a relational structure to manage the complex many-to-many relationship between Users, Products, and Ingredients.

## 5. Success Metrics

- **Retention:** 40% of users reaching the "7-Day" badge milestone.
- **System Efficacy:** Frequency of Conflict Alerts successfully preventing routine errors.
