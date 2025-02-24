import { Router, Request, Response } from 'express';
import { JWTHandler } from '../auth/jwt';
import { BasicAuthHandler } from '../auth/basic_auth';
import { APIHandlers } from '../handlers/api_handlers';

const app = Router();

// Public route
app.get('/', (_: Request, res: Response) => {
  res.send('Hello World!');
});

// Login with validation
app.post('/login', BasicAuthHandler.validateLoginInput, APIHandlers.handleLogin);


// API Book
app.post('/books', JWTHandler.verifyToken, APIHandlers.handleCreateBook); // Create book
app.get('/books', JWTHandler.verifyToken, APIHandlers.handleGetBooks); // Get all books
app.get('/books/:id', JWTHandler.verifyToken, APIHandlers.handleGetBookById); // Get book by id


export default app; 