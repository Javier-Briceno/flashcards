CREATE TABLE IF NOT EXISTS deck (
  deck_id SERIAL PRIMARY KEY, -- Unique identifier for each deck
  name VARCHAR NOT NULL, -- Name of the deck
  category VARCHAR, -- Category of the deck
  parent_deck_id INT REFERENCES deck(deck_id) ON DELETE CASCADE, -- Parent deck ID for nested decks
  created_at TIMESTAMP DEFAULT NOW() -- Timestamp for when the deck was created
);

CREATE INDEX IF NOT EXISTS idx_deck_parent ON deck(parent_deck_id); -- Index for parent_deck_id to optimize queries
CREATE INDEX IF NOT EXISTS idx_deck_category ON deck(category); -- Index for category to optimize queries
CREATE INDEX IF NOT EXISTS idx_deck_created_at ON deck(created_at); -- Index for created_at to optimize queries

CREATE TABLE IF NOT EXISTS flashcard (
  card_id SERIAL PRIMARY KEY, -- Unique identifier for each flashcard
  deck_id INT NOT NULL REFERENCES deck(deck_id) ON DELETE CASCADE, -- Foreign key to the deck the flashcard belongs to
  front TEXT NOT NULL, -- Text on the front of the flashcard
  back TEXT NOT NULL, -- Text on the back of the flashcard
  image_url TEXT, -- URL of the image associated with the flashcard
  created_at TIMESTAMP DEFAULT NOW() -- Timestamp for when the flashcard was created
);

CREATE INDEX IF NOT EXISTS idx_card_deck ON flashcard(deck_id); -- Index for deck_id to optimize queries
CREATE INDEX IF NOT EXISTS idx_card_created_at ON flashcard(created_at); -- Index for created_at to optimize queries
