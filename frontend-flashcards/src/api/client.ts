// Saves the http path to the backend server in a const. 
// Uses a custom path if it's defined.
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

// Reusable function that can take data from backend of any type T
// All it needs is the path and the options
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Fetches data from a path combined from the default backend
  // path and the path that we need the data from.
  // For example 'http://localhost:3001/decks/1'
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  // Handling error of not reaching the backend
  if (!res.ok) {
    let detail: unknown = undefined;
    try { detail = await res.json(); } catch {}
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    (err as any).detail = detail;
    throw err;
  }
  // Handling error of reaching the backend, but not getting any data (204 No Content)
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// exports, so other files can call request() logic
export { API_URL, request };
