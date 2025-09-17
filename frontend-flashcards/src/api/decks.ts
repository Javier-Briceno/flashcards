// src/api/decks.ts
import { request } from './client';
import type { ApiDeck, ApiFlashcard } from '../types/api';

export function listDecks(params?: { category?: string; parent?: string | number }) {
  const q = new URLSearchParams();
  if (params?.category) q.set('category', params.category);
  if (params?.parent !== undefined) q.set('parent', String(params.parent));
  const qs = q.toString() ? `?${q.toString()}` : '';
  return request<ApiDeck[]>(`/decks${qs}`);
}

export function createDeck(payload: { name: string; category?: string; parent_deck_id?: number | null }) {
  return request<ApiDeck>('/decks', { method: 'POST', body: JSON.stringify(payload) });
}

/** Returns:
 * {
 *   deck: ApiDeck,
 *   children: ApiDeck[],
 *   flashcards: ApiFlashcard[]
 * }
 */
export function getDeck(deckId: string | number) {
  return request<{ deck: ApiDeck; children: ApiDeck[]; flashcards: ApiFlashcard[] }>(`/decks/${deckId}`);
}
