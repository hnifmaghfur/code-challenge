import { Request, Response } from 'express';
import { ResponseWrapper } from '../utils/wrapper';
import { credentialsSchema } from '../types/auth';
import  { UserCommands } from '../modules/commands/user';
import { bookSchema } from '../types/book';
import { BookCommands } from '../modules/commands/book';
import { bookSearchSchema } from '../types/book';

export class APIHandlers {
  // Login handler
  static async handleLogin(req: Request, res: Response) {
    try {
      // Validate request body against credentials schema
      const validationResult = credentialsSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return ResponseWrapper.error(
          res, 
          'Invalid request data', 
          validationResult.error.errors, 
          400
        );
      }

      const result = await UserCommands.authenticate(validationResult.data);
      if(!result.success) { 
        return ResponseWrapper.error(res, result.error, result.error, 500);
      }
      return ResponseWrapper.success(res, { token: result.data });
    } catch (error) {
      return ResponseWrapper.error(res, 'Login failed', error, 500);
    }
  }

  // Create book handler
  static async handleCreateBook(req: Request, res: Response) {
    try {
      // Validate request body against book schema
      const validationResult = bookSchema.safeParse(req.body);
      if (!validationResult.success) {
        return ResponseWrapper.error(
          res, 
          'Invalid request data', 
          validationResult.error.errors, 
          400
        );
      }

      const result = await BookCommands.createBook(validationResult.data);
      if (!result.success) {
        return ResponseWrapper.error(res, result.error, result.error, 500);
      }
      return ResponseWrapper.success(res, { book: result.data }, 'Book created successfully', 201);
    } catch (error) {
      return ResponseWrapper.error(res, 'Create book failed', error, 500);
    }
  }

  // Get books with filter and pagination handler
  static async handleGetBooks(req: Request, res: Response) {
    try {
      const validationResult = bookSearchSchema.safeParse(req.query);

      if (!validationResult.success) {
        return ResponseWrapper.error(res, 'Invalid query parameters', validationResult.error.errors, 400);
      }

      const result = await BookCommands.getBooks(validationResult.data);
      if (!result.success) {
        return ResponseWrapper.error(res, result.error, result.error, 500);
      }
      return ResponseWrapper.success(res, { books: result.data });
    } catch (error) {
      return ResponseWrapper.error(res, 'Get books failed', error, 500);
    }
  }

  // Get book by id handler
  static async handleGetBookById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await BookCommands.getBookById(id);
      if (!result.success) {
        return ResponseWrapper.error(res, result.error, result.error, 500);
      }
      return ResponseWrapper.success(res, { book: result.data });
    } catch (error) {
      return ResponseWrapper.error(res, 'Get book by id failed', error, 500);
    }
  }
}