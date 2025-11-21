import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("tasks.db");

// Initialize the tasks table if not exists
export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      due_date TEXT,
      is_important INTEGER
    );
  `);
}
