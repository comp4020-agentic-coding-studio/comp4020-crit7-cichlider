import { sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// The schema is the ground truth for the database. To change it: edit here,
// run `pnpm db:generate` to turn the diff into a migration under drizzle/,
// and commit both — the migration applies automatically when the server
// boots (see src/lib/db.ts), locally and deployed. Never edit the database
// by hand: state on the deployed volume outlives every deploy, and the
// migration trail is what keeps old state and new code compatible.
//
// A plan is the one piece of user-entered state: which major, and which
// courses the student has already completed or is currently taking.
// Everything else (the major's requirement structure, the recommendation
// itself) is derived at render time from src/lib/majors.ts and
// src/lib/planner.ts — only the student's own input needs to survive a
// reload, so that's all that's stored.
export const plans = sqliteTable("plans", {
  id: int().primaryKey({ autoIncrement: true }),
  majorCode: text("major_code").notNull(),
  completed: text().notNull(), // JSON string[]
  inProgress: text("in_progress").notNull(), // JSON string[]
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Plan = typeof plans.$inferSelect;
