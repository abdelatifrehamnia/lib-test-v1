import sqlite3 from "sqlite3";
import { open } from "sqlite";

// Initialize the database
async function initDb() {
  const db = await open({
    filename: "./database.db", // SQLite database file
    driver: sqlite3.Database,
  });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Brands (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Models (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      designation TEXT NOT NULL,
      brand_id INTEGER,
      model_id INTEGER,
      criterion TEXT,
      article_code TEXT UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (brand_id) REFERENCES Brands(id) ON DELETE SET NULL,
      FOREIGN KEY (model_id) REFERENCES Models(id) ON DELETE SET NULL
    );
  `);

  return db;
}

export default initDb();
