import { z } from 'zod';
import { commandResponseSchema } from '../../types/response';
import { BookQuery } from '../models/book';
import { Book, BookSearch } from '../../types/book';
type CommandResponse = z.infer<typeof commandResponseSchema>;

export class BookCommands {
  static async createBook(bookData: Book): Promise<CommandResponse> {
    try {
      // Create book in database
      const book = await BookQuery.createBook(bookData);
      if (!book) {
        return {
          success: false,
          error: 'Failed to create book'
        };
      }

      return {
        success: true,
        data: { id: book.id }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Book creation failed'
      };
    }
  }

  static async updateBook(bookData: Book, id:string): Promise<CommandResponse> {
    try {
      // Get existing book data
      const existingBook = await BookCommands.getBookById(id);
      if (!existingBook.success) {
        return {
          success: false,
          error: 'Failed to update book'
        };
      }
      
      // Merge existing data with updates
      const updateData = { ...existingBook.data, ...bookData };
      const book = await BookQuery.updateBook(updateData);
      if(!book) {
        return {
          success: false,
          error: 'Failed to update book'
        };
      }

      return {
        success: true,
        data: book
      };
    } catch (error){
      return {
        success: false,
        error: 'Failed to update book'
      };
    }
  }

  static async getBooks(bookSearch: BookSearch): Promise<CommandResponse> {
    try {
        const books = await BookQuery.getBooks(bookSearch);
        if(!books) {
            return {
            success: false,
            error: 'Failed to get books'
            };
        }

        return {
            success: true,
            data: books
        };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get books'
      };
    }
  }

  static async getBookById(id: string): Promise<CommandResponse> {
    try {
      const book = await BookQuery.findById(id);
      if(!book) {
        return {
          success: false,
          error: 'Book not found'
        };
      }

      return {
        success: true,
        data: book
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get book by id'
      };
    }
  }
}
