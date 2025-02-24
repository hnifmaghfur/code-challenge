import { db } from '../../utils/db';
import { Book, bookSchema } from '../../types/book';

export class BookQuery {
  // Create new book
  static async createBook(bookData: Book): Promise<Book | null> {
    try {
      return await db.transaction(async (dbConn) => {
        const bookId = Math.random().toString(36).substring(2);
        const now = new Date().toISOString();

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
