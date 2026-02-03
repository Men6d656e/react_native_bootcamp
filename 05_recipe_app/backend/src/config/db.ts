import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import config from "./env.js";
import * as schema from "../db/schema.js";

const sql = neon(config.DATABASE_URL);

/**
 * Drizzle ORM instance configured with Neon HTTP driver and schema.
 */
export const db = drizzle(sql, { schema });
