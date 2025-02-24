import { Request, Response, NextFunction } from 'express';
import { ResponseWrapper } from '../utils/wrapper';
import { CONFIG } from '../global_config';

export class BasicAuthHandler {
  static validateLoginInput(req: Request, res: Response, next: NextFunction) {
    try {
      // Get Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Basic ')) {
        ResponseWrapper.error(res, 'Basic authentication required', null, 401);
        return;
      }

      // Decode base64 credentials
      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      // Check if fields exist
      if (!username || !password) {
        ResponseWrapper.error(res, 'Unauthorized invalid credentials - no auth header');
        return;
      }

      // Validate username format
      if (username.length < 3) {
        ResponseWrapper.error(res, 'Unauthorized invalid credentials - username');
        return;
      }

      // Validate password strength
      if (password.length < 6) {
        ResponseWrapper.error(res, 'Unauthorized invalid credentials - password');
        return;
      }

      if(username !== CONFIG.ADMIN_USERNAME || password !== CONFIG.ADMIN_PASSWORD) {
        ResponseWrapper.error(res, 'Unauthorized invalid credentials', null, 401);
        return;
      }

      next();
    } catch (error) {
      ResponseWrapper.error(res, 'Error validating login input', error, 500);
      return;
    }
  }
} 