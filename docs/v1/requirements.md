# 📋 Requirements – Version 1

This document defines the functional and non-functional requirements for Version 1 of the Flashcard App.

---

## 🔹 Functional Requirements (FR)

### FR-1 Deck Management

- Users can:
  - Create a deck.
  - Edit a deck name.
  - Delete a deck.
  - Assign a category to a deck.
  - Click a deck to view the flashcards it contains.
- Deck metadata:
  - Title (deck name).
  - Category.
  - Created_at timestamp.
- Subdecks are supported (a deck can contain another deck).

**Acceptance Criteria:**

- Creating a deck requires a title and optional category.
- Editing updates the name inline or via modal.
- Deleting removes the deck and all flashcards within.
- Deck view displays all flashcards and subdecks.

---

### FR-2 Flashcard Management

- Within a deck, users can:
  - Create a subdeck.
  - Create flashcards.
  - Edit flashcards (front and back).
  - Delete flashcards.
- Fields per flashcard:
  - Front text (string).
  - Back text (string).
  - Optional image (URL or upload).
- Search, filter, and sort flashcards inside a deck.

**Acceptance Criteria:**

- Flashcard creation requires at least front + back text.
- Editing allows modification of front/back text and optional image.
- Deleted flashcards are removed permanently.
- Flashcards are displayed in a list; no manual reordering.

---

### FR-3 Learning Mode

- Behavior:
  - Show front → on click → show back.
  - Clicking again flips back to front.
  - Buttons: **Right** or **Wrong**.
  - If **Right**: progress bar updates, card marked as correct and not shown again until end.
  - If **Wrong**: progress bar does not update, card reshuffled into remaining unseen cards.
- Progress bar tracks number of correctly answered cards vs. total.

**Acceptance Criteria:**

- Learning session iterates through all flashcards in the deck.
- Incorrect cards reappear until eventually marked correct.
- Session ends only when all cards are answered correctly.

---

### FR-4 Import / Export

- Import/export works only for entire decks (not single flashcards).
- Exported CSV format:
  - Deck name.
  - Category.
  - List of flashcards (front, back).
  - Images not included.
- One deck at a time.
- Malformed CSV imports are rejected with an error message.

**Acceptance Criteria:**

- Export generates a valid CSV that can be imported back without errors.
- Import validates CSV structure before creating deck + flashcards.
- Error feedback is shown inline.

---

### FR-5 Search / Sort / Filter

- Search supported by:
  - Deck name.
  - Flashcard content.
  - Category.
- Sorting:
  - By creation date.
- No filters in Version 1.

**Acceptance Criteria:**

- Search returns matching decks and cards.
- Sorting updates the list order by newest/oldest.

---

## 🔹 Non-Functional Requirements (NFR)

### NFR-1 Performance

- The app must remain responsive with decks up to **500 flashcards**.

### NFR-2 Usability

- Responsive design for **desktop/laptop only** (no mobile support yet).
- Accessibility standards:
  - Minimum 14px font size.
  - Clear color contrast (WCAG AA).
  - Keyboard navigation support.

### NFR-3 Reliability

- Unsaved work is not auto-saved.
- Errors are displayed inline (no popups).

### NFR-4 Security

- No authentication in Version 1.
- All inputs must be sanitized to prevent XSS or injection attacks.

### NFR-5 Compatibility

- Supported browsers: **Chrome, Firefox, Safari, Edge**.
- Minimum versions: last **2 major versions** of each browser.

---

## ✅ Completion Criteria

Version 1 is complete when:

- A user can create/edit/delete decks.
- A user can create/edit/delete flashcards inside a deck.
- A learning session runs as described and progress bar updates correctly.
- Import/export works reliably for single decks in CSV format.
- App supports up to 500 flashcards per deck without performance issues.
- The app runs locally after cloning the repo with no errors.
