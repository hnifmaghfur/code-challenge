import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(), 
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
  });

export type User = z.infer<typeof userSchema>;