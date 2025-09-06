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