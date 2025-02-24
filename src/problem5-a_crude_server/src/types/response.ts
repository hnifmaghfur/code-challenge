import { z } from 'zod';

export const successResponseSchema = <T extends z.ZodType>(dataSchema: T) => 
  z.object({
    success: z.literal(true),
    message: z.string().optional(),
    data: dataSchema.optional()
  });

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  error: z.any().optional()
});

// Command response type
export const commandResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.any().optional()
});

export type SuccessResponse<T> = z.infer<ReturnType<typeof successResponseSchema<z.ZodType<T>>>>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>; 