import { request } from './client';
import type { ApiDeck, ApiFlashcard } from '../types/api';

export function listDecks(params?: { category?: string; parent?: string | number }) {
  // 'URLSearchParams()' is a special string object for putting query parameters together
  // that you can modify with methods like .set(). 
  // In the path the section after a '?' is made with 'URLSearchParams'
  const q = new URLSearchParams();

  // includes filtering by category in the query if provided in params
  if (params?.category) q.set('category', params.category);

  // includes filtering by parent in the query if provided in params
  if (params?.parent !== undefined) q.set('parent', String(params.parent));

  // if the 'q' is empty, return an empty string ''
  const qs = q.toString() ? `?${q.toString()}` : '';

  // return the result of the query.
  // request() is from client.ts file
  return request<ApiDeck[]>(`/decks${qs}`);
}

// directly uses request() to send a query 
export function createDeck(payload: { name: string; category?: string; parent_deck_id?: number | null }) {
  return request<ApiDeck>('/decks', { method: 'POST', body: JSON.stringify(payload) });
}

export function deleteDeck(deckId: string | number) {
  console.log("goofy ahh");
  return request<ApiDeck>(`/decks/${deckId}`, { method: 'DELETE' });
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


// for later 

//handle creating a new flashcard in a specific deck
// export async function createFlashcard(deckId: string, flashcardData: { question: string; answer: string }) {
//   const response = await fetch(`/api/decks/${deckId}/flashcards`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(flashcardData),
//   });
  
//   if (!response.ok) {
//     throw new Error('Failed to create flashcard');
//   }
  
//   return response.json();
// }