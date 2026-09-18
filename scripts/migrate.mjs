/**
 * Applies db/migrations/*.sql to the Neon database in DATABASE_URL.
 * Usage:  npm run db:migrate
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { neon } from "@neondatabase/serverless";

// Load .env.local / .env without a dependency.
for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* file may not exist */
  }
}

if (!process.env.DATABASE_URL) {
  console.error(
    "DATABASE_URL is not set.\n" +
      "Add it to .env.local (Neon → Vercel Marketplace gives you the value),\n" +
      "or keep running locally without a database: progress falls back to .data/.",
  );
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const dir = join(process.cwd(), "db", "migrations");

for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
  const text = readFileSync(join(dir, file), "utf8");
  console.log(`→ ${file}`);
  // Neon's HTTP driver runs one statement per call.
  const statements = text
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s && !/^--/.test(s.replace(/\s+/g, " ")));
  for (const statement of statements) {
    await sql.query(statement);
  }
}

console.log("Migrations applied.");
