import { z } from 'zod';

export const credentialsSchema = z.object({
  username: z.string(),
  password: z.string()
});

export const tokenPayloadSchema = z.object({
  userId: z.string(),
  username: z.string()
});

export type Credentials = z.infer<typeof credentialsSchema>;
export type TokenPayload = z.infer<typeof tokenPayloadSchema>; 