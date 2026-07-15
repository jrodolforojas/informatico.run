export function safeNext(next?: string | null) {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/clasificacion";
}
