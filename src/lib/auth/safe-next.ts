export function safeNext(next?: string | null, fallback = "/clasificacion") {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return fallback;
}
