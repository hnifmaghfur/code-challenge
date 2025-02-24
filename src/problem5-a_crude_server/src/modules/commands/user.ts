import { z } from 'zod';
import { JWTHandler } from '../../auth/jwt';
import { Credentials, TokenPayload, tokenPayloadSchema } from '../../types/auth';
import { UserQuery } from '../models/user';
import { commandResponseSchema } from '../../types/response';

type CommandResponse = z.infer<typeof commandResponseSchema>;

export class UserCommands {
  // Authenticate user and generate token
  static async authenticate(credentials: Credentials): Promise<CommandResponse> {
    try {
      const { username, password } = credentials;

      // Verify credentials against database
      const user = await UserQuery.verifyCredentials(username, password);
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Create token payload
      const payload: TokenPayload = {
        userId: user.id,
        username: user.username
      };

      // Validate token payload
      const validatedPayload = tokenPayloadSchema.safeParse(payload);
      if (!validatedPayload.success) {
        return {
          success: false,
          error: validatedPayload.error.errors
        };
      }

      // Generate token
      const token = JWTHandler.generateToken(validatedPayload.data);

      return {
        success: true,
        data: token
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
}
