import { db } from '../../utils/db';
import { Book, bookSchema, BookSearch } from '../../types/book';
import { toSQLiteDateTime } from '../../utils/date_format';

export class BookQuery {
  // Create new book
  static async createBook(bookData: Book): Promise<Book | null> {
    try {
      return await db.transaction(async (dbConn) => {
        const bookId = Math.random().toString(36).substring(2);
        const now = toSQLiteDateTime();

        const newBook = {
          id: bookId,
          ...bookData,
          created_at: now,
          updated_at: now
        };

        await dbConn.run(`
          INSERT INTO books (
            id, title, author, published_year, genre, 
            description, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          newBook.id,
          newBook.title,
          newBook.author,
          newBook.published_year,
          newBook.genre,
          newBook.description,
          newBook.created_at,
          newBook.updated_at
        ]);

        return this.findById(bookId);
      });
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }

  // Get books with filter and pagination
  static async getBooks(bookSearch: BookSearch): Promise<Book[] | null> {
    try {
      const { title, author, genre, year, page, limit } = bookSearch;

      const offset = (Number(page) - 1) * Number(limit);

      const query = `
        SELECT id, title FROM books 
        WHERE 1=1
        ${title ? `AND title LIKE '%${title}%'` : ''}
        ${author ? `AND author LIKE '%${author}%'` : ''}
        ${genre ? `AND genre LIKE '%${genre}%'` : ''}
        ${year ? `AND published_year = ${year}` : ''}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `;

      const dbConn = await db.getConnection();
      const rows = await dbConn.all(query, [limit, offset]);

      if (!rows) return null;

      return rows;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }


  // Find book by ID
  static async findById(id: string): Promise<Book | null> {
    try {
      const dbConn = await db.getConnection();
      const row = await dbConn.get(
        'SELECT * FROM books WHERE id = ?',
        [id]
      );

      if (!row) return null;

      const validationResult = bookSchema.safeParse(row);
      if (!validationResult.success) {
        console.error('Invalid book data from database:', validationResult.error);
        return null;
      }

      return validationResult.data;
    } catch (error) {
      console.error('Database error:', error);
      return null;
    }
  }
}
