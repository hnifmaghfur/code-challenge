import { z } from 'zod';
import { commandResponseSchema } from '../../types/response';
import { BookQuery } from '../models/book';
import { Book, BookSearch } from '../../types/book';
import logger from '../../utils/logger';
type CommandResponse = z.infer<typeof commandResponseSchema>;

export class BookCommands {
  static async createBook(bookData: Book): Promise<CommandResponse> {
    try {
      // Create book in database
      const book = await BookQuery.createBook(bookData);
      if (!book) {
        logger.warn('Failed to create book in database');
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
      logger.error('Book creation failed:', { error });
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
        logger.warn(`Book not found for update with id: ${id}`);
        return {
          success: false,
          error: 'Failed to update book'
        };
      }
      
      // Merge existing data with updates
      const updateData = { ...existingBook.data, ...bookData };
      const book = await BookQuery.updateBook(updateData);
      if(!book) {
        logger.warn(`Failed to update book with id: ${id}`);
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
      logger.error('Failed to update book:', { error });
      return {
        success: false,
        error: 'Failed to update book'
      };
    }
  }

  static async deleteBook(id: string): Promise<CommandResponse> {
    try {
      const book = await BookQuery.deleteBook(id);
      if(!book) {
        logger.warn(`Failed to delete book with id: ${id}`);
        return {
          success: false,
          error: 'Failed to delete book'
        };
      }

      return {
        success: true,
        data: { message: `BookId : ${id} deleted successfully` }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to delete book'
      };
    }
  }

  static async getBooks(bookSearch: BookSearch): Promise<CommandResponse> {
    try {
        const books = await BookQuery.getBooks(bookSearch);
        if(!books) {
            logger.warn('Failed to fetch books from database');
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
        logger.warn(`Book not found with id: ${id}`);
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
