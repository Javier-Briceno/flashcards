# 🎯 Scope – Version 1 (MVP)

## 1. In-Scope Features

Version 1 includes only the **Core Flashcard Features**:

- Create, edit, delete flashcards (text + images).
- Organize flashcards into decks, subdecks, and categories.
- Import/export decks (CSV only).
- Support for front/back format flashcards.
- Rich text editing (bold, italics, highlighting).
- Learn mode with option to learn a shuffled deck.
- Search, sort, and filter cards.

---

## 2. Out-of-Scope Features

The following features are **not included** in Version 1. They are planned for future releases:

- Flashcards with audio/video support.
- Import/export to/from Anki, Quizlet, etc.
- Additional formats (multiple choice, cloze deletions, true/false).
- Rich text editing with LaTeX formulas.
- Offline study mode.

### Learning & Study

- Spaced repetition system (SRS, Leitner, SM-2).
- Adaptive learning intervals.
- Alternative study modes (quiz/test, matching, typing, speech recognition).
- Study reminders & focus mode.
- Progressive difficulty scaling.

### Tracking & Analytics

- Study time tracking, streaks, reviews.
- Accuracy %, retention curve, heatmap.
- Goal setting (e.g., “50 cards/day”).
- AI insights (weak spots).

### AI / Smart Features

- Auto-generate flashcards from documents, transcripts, notes.
- Summarize chapters into Q&A.
- Personalized study plans.
- AI tutor / chat mode.
- Smart hints and explanations.
- Multilingual support & pronunciation feedback.

### Gamification

- Streaks, badges, levels, leaderboards.
- Unlockable themes & card backs.
- Coins/XP system, challenges, speed games.

### Collaboration & Community

- Deck sharing & collaborative decks.
- Deck marketplace.
- Classroom/teacher integration.
- Peer quizzes & group study rooms.

### Personalization

- Custom themes (dark/light, colors).
- Custom card templates.
- Advanced tagging & search.
- Audio notes, highlights.

### Cross-Platform & Integrations

- Mobile apps, offline sync.
- Integrations (Notion, Google Docs, Obsidian, OneNote).
- API access.
- Voice assistants & Chrome extension.

### Accessibility

- Text-to-speech, dyslexia fonts, font size adjustments.
- Voice input for creating cards.

### Advanced

- AR/VR flashcards.
- Adaptive testing.
- Study with music/soundscapes.
- Calendar integration.
- Smart revision scheduling.

---

## 3. Platforms

- **Web only.**
- **No offline mode** in v1.

---

## 4. Tech Scope

- **Frontend:** React + TypeScript
- **Backend:** Node.js
- **Database:** PostgreSQL

---

## 5. Success Criteria

Version 1 is considered complete when a user can:

- Create, edit, and delete decks.
- Create, edit, and delete flashcards inside a deck.
- Study a deck in **Learn Mode**, where:
  - The progress bar updates correctly.
  - Correct answers are marked as done and do not reappear until the end.
  - Incorrect answers are re-shuffled back into the deck.
  - Front/back flip works smoothly.
  - “Right” and “Wrong” buttons function as intended.

---

## 6. Limitations

- Only **text-based cards** supported.
- No account system.
- No cross-device sync.

---

## 7. Deliverables

- **Working web app (Version 1)**
- **Documentation of Version 1** (this `/docs` folder).
- **Demo deployment**: runs locally without errors after cloning repo.
- **Uploaded to GitHub** as open source / collaborative project.
