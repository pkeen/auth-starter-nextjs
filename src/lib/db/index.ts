import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";

const db = drizzle(env.DATABASE_URL, { logger: true });

export type db = typeof db;

export default db;
