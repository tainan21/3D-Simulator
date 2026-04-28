// Cliente Neon serverless (compatível com Edge runtime).
// Usa @neondatabase/serverless via fetch — sem TCP, sem pool persistente.

import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let cached: NeonQueryFunction<false, false> | null = null;

export function sql(): NeonQueryFunction<false, false> {
  if (cached) return cached;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  cached = neon(url);
  return cached;
}
