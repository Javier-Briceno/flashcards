const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let detail: unknown = undefined;
    try { detail = await res.json(); } catch {}
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    (err as any).detail = detail;
    throw err;
  }
  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export { API_URL, request };
