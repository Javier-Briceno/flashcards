// src/hooks/useDecks.ts
import { useEffect, useState, useCallback } from 'react';
import { listDecks, createDeck, getDeck } from '../api/decks';
import { mapDeck, mapCard } from '../types/api';
import type { Deck } from '../types/Deck';
import type { Flashcard } from '../types/Flashcard';

export function useDecks() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listDecks();
      setDecks(data.map(mapDeck));
      setError(null);
    } catch (e) { setError(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const onCreateDeck = useCallback(async (form: { title: string; description?: string; category?: string }) => {
    console.log('on create deck')
    // backend expects "name"
    const created = await createDeck({ name: form.title, category: form.category ?? undefined });
    // append newly created deck
    setDecks(prev => [mapDeck(created), ...prev]);
    return created;
  }, []);

  return { decks, loading, error, refresh, onCreateDeck };
}

export function useDeckDetails(deckId: string) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [children, setChildren] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDeck(deckId);
      const uiDeck = mapDeck(data.deck);
      setDeck(uiDeck);
      setChildren(data.children.map(mapDeck));
      setFlashcards(data.flashcards.map(c => mapCard(c, uiDeck.title)));
      setError(null);
    } catch (e) { setError(e); }
    finally { setLoading(false); }
  }, [deckId]);

  useEffect(() => { void refresh(); }, [refresh]);

  return { deck, children, flashcards, loading, error, refresh };
}
