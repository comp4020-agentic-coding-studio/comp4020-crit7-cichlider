import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { type Plan, plans } from "./schema";

// One SQLite file is the app's whole persistent state. In production
// fly.toml points DATABASE_PATH at the machine's volume (/data), which is
// how state survives a reload and a redeploy; locally it defaults to an
// untracked file in .data/.
const path = process.env.DATABASE_PATH ?? "./.data/app.db";
mkdirSync(dirname(path), { recursive: true });

const client = new Database(path);
client.pragma("journal_mode = WAL");

export const db = drizzle(client);

// Migrations run at boot, on whatever machine holds the volume — the
// recommended shape for SQLite on Fly, where there's no separate machine to
// run them from. The flow: edit src/lib/schema.ts, `pnpm db:generate`,
// commit the migration it writes to drizzle/.
migrate(db, { migrationsFolder: "./drizzle" });

export type { Plan };

export function listPlans(): Plan[] {
  return db.select().from(plans).orderBy(desc(plans.id)).limit(50).all();
}

export function getPlan(id: number): Plan | undefined {
  return db.select().from(plans).where(eq(plans.id, id)).get();
}

export function createPlan(majorCode: string, completed: string[], inProgress: string[]): Plan {
  return db
    .insert(plans)
    .values({
      majorCode,
      completed: JSON.stringify(completed),
      inProgress: JSON.stringify(inProgress),
    })
    .returning()
    .get();
}
