import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters')
    .max(50, 'Password must be less than 50 characters'),
});

// Token payload validation schema
export const tokenPayloadSchema = z.object({
  userId: z.string(),
  username: z.string(),
});

// Protected data response schema
export const protectedDataSchema = z.object({
  message: z.string(),
  timestamp: z.string().datetime(),
});

// Types derived from schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type TokenPayload = z.infer<typeof tokenPayloadSchema>;
export type ProtectedData = z.infer<typeof protectedDataSchema>;

// Validation helper functions
export class Validation {
  static validateLogin(data: unknown) {
    return loginSchema.safeParse(data);
  }

  static validateTokenPayload(data: unknown) {
    return tokenPayloadSchema.safeParse(data);
  }

  static validateProtectedData(data: unknown) {
    return protectedDataSchema.safeParse(data);
  }
}
