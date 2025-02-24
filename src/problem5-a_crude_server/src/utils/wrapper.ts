import { Response } from 'express';
import { SuccessResponse, ErrorResponse } from '../types/response';

export class ResponseWrapper {
  static success<T>(res: Response, data?: T, message?: string, status: number = 200): void {
    const response: SuccessResponse<T> = {
      success: true,
      message,
      data
    };
    res.status(status).json(response);
  }

  static error(res: Response, message: string, error?: any, status: number = 400): void {
    const response: ErrorResponse = {
      success: false,
      message,
      error
    };
    res.status(status).json(response);
  }
}
