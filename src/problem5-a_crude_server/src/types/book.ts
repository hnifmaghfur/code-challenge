import { z } from 'zod';

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
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional()
});

export type Book = z.infer<typeof bookSchema>;
