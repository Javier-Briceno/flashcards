import { request } from './client';
import type { ApiFlashcard } from '../types/api';

// reguest() is from client.ts

export function createFlashcard(deckId: string | number, payload: { front: string; back: string; image_url?: string | null }) {
  return request<ApiFlashcard>(`/decks/${deckId}/flashcards`, { method: 'POST', body: JSON.stringify(payload) });
}

export function updateFlashcard(cardId: string | number, payload: Partial<{ front: string; back: string; image_url: string | null }>) {
  return request<ApiFlashcard>(`/flashcards/${cardId}`, { method: 'PUT', body: JSON.stringify(payload) });
}

export function deleteFlashcard(cardId: string | number) {
  return request<{ ok: true }>(`/flashcards/${cardId}`, { method: 'DELETE' });
}
