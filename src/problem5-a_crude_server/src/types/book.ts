import { z } from 'zod';
import { sqliteDatetime } from './date';

export const bookSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for updates
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author must be less than 100 characters'),
  published_year: z.number()
    .min(1000, 'Invalid year')
    .max(new Date().getFullYear(), 'Year cannot be in the future'),
  genre: z.string()
    .min(1, 'Genre is required')
    .max(50, 'Genre must be less than 50 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  created_at: sqliteDatetime.optional(),
  updated_at: sqliteDatetime.optional()
});

// Search filters schema
export const bookSearchSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z.string().optional(),
  year: z.string().optional(),
  page: z.string(),
  limit: z.string(),
});

// Response with pagination
export const bookPaginatedResponseSchema = z.object({
  data: z.array(bookSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number()
  })
});

export type Book = z.infer<typeof bookSchema>;
export type BookSearch = z.infer<typeof bookSearchSchema>;
export type BookPaginatedResponse = z.infer<typeof bookPaginatedResponseSchema>;
