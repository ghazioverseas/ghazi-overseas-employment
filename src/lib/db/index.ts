import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

// Connection pool or HTTP Neon client wrapper
const sql = neon(connectionString || "postgresql://placeholder:placeholder@localhost:5432/placeholder");

export const db = drizzle(sql, { schema });
