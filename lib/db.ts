import 'server-only';
import Database from 'better-sqlite3';
import { DATABASE_PATH } from './env';

let db: Database.Database | null = null;
export function getDB() {
  if (!db) {
    db = new Database(DATABASE_PATH);
    db.pragma('journal_mode = WAL');
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        title TEXT,
        model TEXT,
        source TEXT
      );
      CREATE TABLE IF NOT EXISTS chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT,
        chunk_index INTEGER,
        text TEXT,
        page INTEGER,
        embedding TEXT,
        FOREIGN KEY(document_id) REFERENCES documents(id)
      );
    `);
  }
  return db;
}
