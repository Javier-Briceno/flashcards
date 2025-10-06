// src/types/api.ts
import type { Deck as UIDeck } from './Deck';
import type { Flashcard as UIFlashcard } from './Flashcard';

export type ApiDeck = {
  deck_id: number;
  name: string;
  category: string | null;
  parent_deck_id: number | null;
  created_at: string;
  card_count?: number; // some endpoints include this
};

export type ApiFlashcard = {
  card_id: number;
  deck_id: number;
  front: string;
  back: string;
  image_url?: string | null;
  created_at?: string;
};

export function mapDeck(d: ApiDeck): UIDeck {
  return {
    id: String(d.deck_id),
    title: d.name,
    description: '', // backend doesn't store this; keep empty or add later in DB
    cardCount: d.card_count ?? 0,
    category: d.category ?? undefined,
  };
}

export function mapCard(c: ApiFlashcard, deckName = ''): UIFlashcard {
  return {
    id: c.card_id,
    question: c.front,
    answer: c.back,
    belongsToDeck: deckName,
    belongsToDeckId: String(c.deck_id),
  };
}
