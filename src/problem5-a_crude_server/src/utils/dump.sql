-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create books table
CREATE TABLE books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  published_year INTEGER NOT NULL,
  genre TEXT NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deleted_at DATETIME DEFAULT NULL
);

-- Create index for username lookups
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);

-- Insert sample users
INSERT INTO users (id, username, password, created_at, updated_at) VALUES
  ('usr_001', 'hanifmaghfur', 'password', DATETIME('now'), DATETIME('now'));

-- Insert sample books
INSERT INTO books (id, title, author, published_year, genre, description, created_at, updated_at, deleted_at) VALUES
  ('book_001', 'The Great Gatsby', 'F. Scott Fitzgerald', 1925, 'Fiction', 'A story of decadence and excess.', DATETIME('now'), DATETIME('now'), NULL),
  ('book_002', '1984', 'George Orwell', 1949, 'Science Fiction', 'A dystopian social science fiction novel.', DATETIME('now'), DATETIME('now'), NULL);

-- Add any other sample data here 