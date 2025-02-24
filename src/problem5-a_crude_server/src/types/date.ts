import { z } from 'zod';

// Custom datetime validation for SQLite format
export const sqliteDatetime = z.string().refine(
    (value) => {
      // SQLite datetime format: YYYY-MM-DD HH:MM:SS
      const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
      return regex.test(value);
    },
    {
      message: "Invalid SQLite datetime format"
    }
  );