import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };

export const hasDb = Boolean(process.env.DATABASE_URL);

export const prisma: PrismaClient = g.prisma ?? new PrismaClient({ log: ["error"] });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

/** Runs a DB query; returns the fallback when no database is configured or the query fails. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDb) return fallback;
  try {
    return await fn();
  } catch (e) {
    console.error("[db]", e);
    return fallback;
  }
}
