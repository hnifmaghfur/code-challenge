import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ResponseWrapper } from '../utils/wrapper';
import { TokenPayload } from '../types/auth';
import { CONFIG } from '../global_config';

const JWT_SECRET = CONFIG.JWT_SECRET;
const JWT_EXPIRES_IN = Number(CONFIG.JWT_EXPIRES_IN);

export class JWTHandler {
  // Generate token
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN, // Token expires in 24 hours
    });
  }

  // Verify token middleware
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return ResponseWrapper.error(res, 'No token provided', null, 401);
      }

      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
      next();
    } catch (error) {
      return ResponseWrapper.error(res, 'Invalid or expired token', null, 401);
    }
  }
}
