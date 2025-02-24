import { z } from 'zod';
import { sqliteDatetime } from './date';

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  created_at: sqliteDatetime,
  updated_at: sqliteDatetime
});

export type User = z.infer<typeof userSchema>;