import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import logger from './logger';

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database | null = null;
  private readonly dbPath: string;

  private constructor() {
    // Store database in the project root
    this.dbPath = path.resolve(process.cwd(), 'database.sqlite');
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // Initialize database connection
  public async initialize(): Promise<void> {
    try {
      this.db = await open({
        filename: this.dbPath,
        driver: sqlite3.Database
      });

      // Enable foreign keys
      await this.db.run('PRAGMA foreign_keys = ON');

      // Enable WAL mode for better concurrent access
      await this.db.run('PRAGMA journal_mode = WAL');

      logger.info('Database initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize database:', { error });
      throw error;
    }
  }

  // Get database connection
  public async getConnection(): Promise<Database> {
    if (!this.db) {
      await this.initialize();
    }
    return this.db!;
  }

  // Close database connection
  public async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  // Run migrations
  public async runMigrations(): Promise<void> {
    const db = await this.getConnection();
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        published_year INTEGER NOT NULL,
        genre TEXT NOT NULL,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
    `);
  }

  // Helper method for transactions
  public async transaction<T>(
    callback: (db: Database) => Promise<T>
  ): Promise<T> {
    const db = await this.getConnection();
    
    try {
      await db.run('BEGIN TRANSACTION');
      const result = await callback(db);
      await db.run('COMMIT');
      return result;
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }

  // Load SQL dump
  public async loadDump(): Promise<void> {
    try {
      const dumpPath = path.resolve(__dirname, './dump.sql');
      const sql = await fs.readFile(dumpPath, 'utf-8');
      
      const db = await this.getConnection();
      await db.exec(sql);
      
      logger.info('Database dump loaded successfully');
    } catch (error) {
      logger.error('Failed to load database dump:', { error });
      throw error;
    }
  }

  // Initialize with dump data
  public async initializeWithDump(): Promise<void> {
    await this.initialize();
    await this.runMigrations();
    await this.loadDump();
  }
}

// Export singleton instance
export const db = DatabaseService.getInstance();
