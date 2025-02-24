import { z } from 'zod';
import { Book, bookSchema } from '../../types/book';
import { commandResponseSchema } from '../../types/response';
import { BookQuery } from '../models/book';

type CommandResponse = z.infer<typeof commandResponseSchema>;

export class BookCommands {
  static async createBook(bookData: Book): Promise<CommandResponse> {
    try {
      // Validate book data
      const validationResult = bookSchema.safeParse(bookData);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error.errors
        };
      }

      // Create book in database
      const book = await BookQuery.createBook(validationResult.data);
      if (!book) {
        return {
          success: false,
          error: 'Failed to create book'
        };
      }

      return {
        success: true,
        data: book
      };
    } catch (error) {
      return {
        success: false,
        error: 'Book creation failed'
      };
    }
  }
}
