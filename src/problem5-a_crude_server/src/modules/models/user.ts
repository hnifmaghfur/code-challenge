import { z } from 'zod';
import { db } from '../../utils/db';
import { userSchema } from '../../types/user';
import { toSQLiteDateTime } from '../../utils/date_format';
import logger from '../../utils/logger';

// User schema
type User = z.infer<typeof userSchema>;

export class UserQuery {
  // Find user by username
  static async findByUsername(username: string): Promise<User | null> {
    try {
      const dbConn = await db.getConnection();
      const row = await dbConn.get(
        'SELECT * FROM users WHERE username = ?',
        [username]
      );

      if (!row) return null;

      const validationResult = userSchema.safeParse(row);
      if (!validationResult.success) {
        logger.error('Invalid user data from database:', { error: validationResult.error });
        return null;
      }

      return validationResult.data;
    } catch (error) {
      logger.error('Database error:', { error });
      return null;
    }
  }

  // Create new user with transaction
  static async createUser(username: string, password: string): Promise<User | null> {
    try {
      return await db.transaction(async (dbConn) => {
        const userId = Math.random().toString(36).substring(2);
        const now = toSQLiteDateTime();

        await dbConn.run(
          'INSERT INTO users (id, username, password, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
          [userId, username, password, now, now]
        );

        return this.findByUsername(username);
      });
    } catch (error) {
      logger.error('Database error:', { error });
      return null;
    }
  }

  // Verify user credentials
  static async verifyCredentials(username: string, password: string): Promise<User | null> {
    try {
      const user = await this.findByUsername(username);
      if (!user || user.password !== password) {
        return null;
      }
      return user;
    } catch (error) {
      logger.error('Verification error:', { error });
      return null;
    }
  }
}
