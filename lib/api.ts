const API_BASE = "https://api.socratic.pro";

export async function apiRequest(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

export async function extractData<T = unknown>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message || err.error?.message || err.error || `API error: ${res.status}`
    );
  }
  const json = await res.json();
  // Handle both { data: ... } envelope and bare responses
  return (json.data !== undefined ? json.data : json) as T;
}
