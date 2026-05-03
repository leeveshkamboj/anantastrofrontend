/**
 * Calls backend POST /api/translate (via same-origin or NEXT_PUBLIC_API_URL in Docker).
 * Use for dynamic text; UI chrome should use next-intl messages.
 */

export type TranslateResponse = {
  translatedText: string;
  cached: boolean;
  fallback: boolean;
};

function apiBase(): string {
  if (typeof window !== "undefined") {
    const env = process.env.NEXT_PUBLIC_API_URL;
    if (env) return env.replace(/\/$/, "");
    return "";
  }
  return "";
}

export async function translateText(
  text: string,
  source: string,
  target: string,
  init?: RequestInit,
): Promise<TranslateResponse> {
  const base = apiBase();
  const url = `${base}/api/translate`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...init?.headers },
    body: JSON.stringify({ text, source, target }),
    credentials: "include",
    ...init,
  });
  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(err || `Translate failed: ${res.status}`);
  }
  return res.json() as Promise<TranslateResponse>;
}
