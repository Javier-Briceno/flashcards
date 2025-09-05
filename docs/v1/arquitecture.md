# Architecture – Version 1

This document describes the technical blueprint for the Flashcard App v1.

---

## 1) System Overview

- **Layers:** Frontend (React+TS) ↔ Backend (Node.js, API-only) ↔ Database (PostgreSQL).
- **Future:** Separate AI service (Python) to be added later.
- **Runtime:** Frontend and backend run on **separate ports**.
- **Description-first:** We keep this doc textual, with lightweight diagrams where useful.

### High-level data flow

User (Browser) → React (TS) → REST API (Node.js) → PostgreSQL  
(Return path is the reverse.)

---

## 2) Frontend Architecture

- **Stack:** React + TypeScript, React Router, plain CSS files per page/component.
- **Routing:** React Router with 3 main routes:
  - `/` → LibraryPage
  - `/deck/:deckId` → DeckPage
  - `/deck/:deckId/learn` → LearnPage
- **State:** Local component state + custom hooks (`useDecks`, `useFlashcards`).  
  (Session progress in LearnPage is **front-end only** in v1.)

### Project Structure

```batch
src/
├─ pages/
│ ├─ LibraryPage.tsx
│ ├─ LibraryPage.css
│ ├─ DeckPage.tsx
│ ├─ DeckPage.css
│ ├─ LearnPage.tsx
│ └─ LearnPage.css
├─ components/
│ ├─ DeckCard.tsx
│ ├─ DeckCard.css
│ ├─ Flashcard.tsx
│ ├─ Flashcard.css
│ ├─ ProgressBar.tsx
│ ├─ ProgressBar.css
│ ├─ Button.tsx
│ ├─ Button.css
│ ├─ Navbar.tsx
│ └─ Navbar.css
├─ hooks/
│ ├─ useDecks.ts // list/fetch/create/edit/delete decks (+ subdecks)
│ └─ useFlashcards.ts // CRUD for flashcards inside a deck
├─ api/
│ └─ client.ts // fetch helpers, baseURL, interceptors
├─ types/
│ ├─ deck.ts
│ └─ flashcard.ts
├─ utils/
│ ├─ shuffle.ts
│ └─ csv.ts
├─ main.tsx
└─ App.tsx
```

### Pages (v1)

- **LibraryPage**
  - Grid/list of decks (and top-level subdecks by parent).
  - Create deck, edit name, delete deck, assign category.
  - Search by deck name/category; sort by creation date.
- **DeckPage**
  - Shows **subdecks** and **flashcards** belonging to the deck.
  - Create subdeck, create/edit/delete flashcards.
  - Search within cards; sort by creation date.
  - “Start Learning” button.
- **LearnPage**
  - Shows one card at a time: **front → click → back → click → front** (toggle).
  - Buttons: **Right** / **Wrong**.
  - Progress bar: increments only on **Right**; **Wrong** reshuffles card back into queue.
  - Ends when **all cards have been answered correctly**.

### Shared Components

- **DeckCard** (deck tile in library and subdeck list)
- **Flashcard** (front/back rendering, optional image)
- **ProgressBar** (computed from “correct” count / total)
- **Button**, **Navbar**

### UX/Accessibility (v1)

- Desktop-only responsive layout.
- Min font size 14px, color contrast WCAG AA, keyboard focus on actionable elements.

---

## 3) Backend Architecture

- **Stack:** Node.js (API-only, returns JSON).
- **Style:** Moderately structured: **routes → services → DB**.
  - **Routes**: HTTP concern only (parse input, status codes, JSON).
  - **Services**: Business logic (validation, cascade deletes, CSV parsing).
  - **DB/ORM**: Services call SQL/DB directly (simple SQL in v1).

### Suggested Backend Structure

```batch
backend/
├─ src/
│ ├─ server.js // createServer / minimal framework wrapper
│ ├─ routes/
│ │ ├─ decks.routes.js
│ │ ├─ flashcards.routes.js
│ │ ├─ importExport.routes.js
│ │ └─ learn.routes.js
│ ├─ services/
│ │ ├─ DeckService.js
│ │ ├─ FlashcardService.js
│ │ ├─ ImportExportService.js
│ │ └─ LearnService.js
│ ├─ db/
│ │ ├─ index.js // pg Pool/Client setup
│ │ └─ sql/
│ │ ├─ deck.sql // reusable queries
│ │ └─ flashcard.sql
│ ├─ middleware/
│ │ ├─ errorHandler.js
│ │ └─ validate.js
│ └─ utils/
│ ├─ csv.js
│ └─ sanitize.js
├─ .env.example
└─ package.json
```

> **CORS:** Enable CORS on the API (frontend & backend run on different ports).

### Endpoints (v1)

#### Decks (subdecks are decks with a `parent_deck_id`)

- `GET /decks?category=&parent=` → List decks; optional filter by category or `parent` (for subdecks).
- `POST /decks` → Create a new deck  
  **Body:** `{ "name": string, "category": string, "parent_deck_id"?: number }`
- `GET /decks/:deckId` → Get one deck **with its flashcards and subdecks**
- `PUT /decks/:deckId` → Update deck (rename, change category/parent)
- `DELETE /decks/:deckId` → Delete deck **and** its flashcards **and** all subdecks (recursive)

#### Flashcards

- `POST /decks/:deckId/flashcards` → Create flashcard  
  **Body:** `{ "front": string, "back": string, "image_url"?: string }`
- `PUT /flashcards/:cardId` → Update flashcard (front, back, image_url)
- `DELETE /flashcards/:cardId` → Delete flashcard

#### Import / Export (CSV for a single deck at a time)

- `POST /decks/import` → Import one deck from CSV (reject malformed)
- `GET /decks/:deckId/export` → Export one deck to CSV

#### Learning

- `GET /decks/:deckId/learn` → Get all flashcards (server may pre-shuffle or client can shuffle)

### API Conventions

- **Content-Type:** `application/json` (CSV endpoints return/accept `text/csv`).
- **Errors:** JSON shape `{ "error": { "code": string, "message": string } }` with proper HTTP status.
- **Input sanitization:** sanitize user-provided strings in services (and on render in FE).

---

## 4) Database Schema (PostgreSQL)

### Tables

#### `deck`

| column         | type      | constraints                               |
| -------------- | --------- | ----------------------------------------- |
| deck_id        | SERIAL PK |                                           |
| name           | VARCHAR   | NOT NULL                                  |
| category       | VARCHAR   | NULL allowed                              |
| parent_deck_id | INT       | NULL, FK → deck(deck_id) (self-reference) |
| created_at     | TIMESTAMP | DEFAULT NOW()                             |

- **Indexes:**
  - `idx_deck_parent` on (`parent_deck_id`)
  - `idx_deck_category` on (`category`)
  - `idx_deck_created_at` on (`created_at`)

#### `flashcard`

| column     | type      | constraints                  |
| ---------- | --------- | ---------------------------- |
| card_id    | SERIAL PK |                              |
| deck_id    | INT       | NOT NULL, FK → deck(deck_id) |
| front      | TEXT      | NOT NULL                     |
| back       | TEXT      | NOT NULL                     |
| image_url  | TEXT      | NULL                         |
| created_at | TIMESTAMP | DEFAULT NOW()                |

- **Indexes:**
  - `idx_card_deck` on (`deck_id`)
  - `idx_card_created_at` on (`created_at`)

### Relationships

- **Deck → Subdecks:** self-reference via `parent_deck_id` (1 → many)
- **Deck → Flashcards:** `flashcard.deck_id` (1 → many)

### Minimal DDL (Data Definition Language) (v1)

```sql
CREATE TABLE deck (
  deck_id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  category VARCHAR,
  parent_deck_id INT REFERENCES deck(deck_id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_deck_parent ON deck(parent_deck_id);
CREATE INDEX idx_deck_category ON deck(category);
CREATE INDEX idx_deck_created_at ON deck(created_at);

CREATE TABLE flashcard (
  card_id SERIAL PRIMARY KEY,
  deck_id INT NOT NULL REFERENCES deck(deck_id) ON DELETE CASCADE,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_card_deck ON flashcard(deck_id);
CREATE INDEX idx_card_created_at ON flashcard(created_at);
```

## 5) Data Flow

### Deck lifecycle

1. **Create Deck**

   - FE (Frontend) → `POST /decks` (`{ name, category, parent_deck_id? }`)
   - Service validates (non-empty name, parent exists if provided)
   - DB insert → returns `{ deck_id, name, category, parent_deck_id, created_at }`
   - FE updates state via `useDecks`

2. **Edit Deck**

   - FE → `PUT /decks/:deckId` (`{ name?, category?, parent_deck_id? }`)
   - Service validates + updates
   - FE re-renders card

3. **Delete Deck**
   - FE → `DELETE /decks/:deckId`
   - Service deletes **flashcards**, **subdecks recursively**, then the **deck**
   - FE removes deck from list

### Flashcard lifecycle

- **Create/Edit/Delete** within DeckPage using respective endpoints; FE list updates via `useFlashcards`.

### Learning session (v1)

1. **Start**

   - FE → `GET /decks/:deckId/learn` → returns all cards
   - FE initializes session queue (shuffled)

2. **During**

   - Toggle front/back by click
   - **Right:** increment “correct” count; remove card from queue
   - **Wrong:** reinsert card randomly into queue (shuffle back)
   - Progress bar = `correct / total`

3. **End**
   - When all cards answered correctly → show “Session complete”
   - **No DB writes** (progress is ephemeral in v1)

---

## 6) Infrastructure

- **Local only in v1:** No containers.
- **Environment:** `.env` files for both FE and BE.

  **Backend `.env.example`:**

  ```env
  PORT=5000
  PGHOST=localhost
  PGUSER=your_user
  PGPASSWORD=your_password
  PGDATABASE=flashcards
  PGPORT=5432
  CORS_ORIGIN=http://localhost:5173
  ```

  **Frontend `.env.example`:**

  ```env
  VITE_API_BASE_URL=http://localhost:5000
  ```

- **Startup:**

  - Start Postgres locally (create DB `flashcards`).

  - Run backend migrations/DDL (see schema above).

  - Start backend server → then frontend dev server.

---

## 7) Scalability & Future

- **AI Service (Python):** Add a separate microservice for parsing/creating cards from documents; communicate via REST or gRPC; queue if needed.

- **Mobile (React Native):** Keep API stateless and well-defined for future clients.

- **API Versioning:** Not needed now; reserve `/api/v1/*` path for painless future versioning.

- **Search/Sort in v1:** Done on client (500 cards max); server-side search can be added later if needed.

---

## 8) CSV Import/Export (v1 spec)

**Scope:** one deck at a time; no images; no subdecks in CSV; includes deck name & category.

**Columns (per row):** `deck_name, category, front, back`

**Export example:**

```csv
deck_name,category,front,back
"Biology Basics","Science","Cell","Basic unit of life"
"Biology Basics","Science","DNA","Genetic material"
```

**Import rules:**

- All rows must share the same `deck_name` (the created deck’s name).

- If `category` varies, first non-empty wins (or reject if mismatch—define in service).

- Malformed CSV → **reject** with inline error message.

---

## 9) Security & Validation (v1)

- **No auth** (open app for local demo).

- **Sanitize inputs** (backend) and **sanitize render** (frontend) for any rich text:

  - Restrict to allowed formatting (bold, italics, highlight).

  - Strip scripts and dangerous HTML.

- **CORS:** allow only the local frontend origin.

---

## 10) Assumptions & Limitations (v1)

- Desktop-focused UI; mobile not supported yet.

- No persistence for learning progress (session-only).

- Search/sort performed client-side after fetching deck contents.

- Max practical deck size: **500 flashcards** (must remain responsive).
