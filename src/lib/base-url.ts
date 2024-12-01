export function getBaseURL() {
  if (typeof window !== "undefined") return "";
  if (process.env.BASE_URL) return process.env.BASE_URL;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
