import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import * as gameSchema from "@shared/game-schema";
import * as adminSchema from "@shared/admin-schema";

neonConfig.webSocketConstructor = ws;

let pool: Pool | null = null;
let db: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema: { ...schema, ...gameSchema, ...adminSchema } });
} else {
  console.warn("DATABASE_URL not set, using memory storage");
}

export { pool, db };