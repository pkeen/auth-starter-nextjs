import { drizzle } from "drizzle-orm/neon-http";
import { env } from "@/env";

const db = drizzle(env.DATABASE_URL, { logger: true, casing: "snake_case" });

export type db = typeof db;

export default db;
