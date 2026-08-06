import { Request, Response, NextFunction } from 'express';
import { Logger } from '../utils/logger';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  Logger.error(`[${req.method}] ${req.url} - ${message}`, err, 'ErrorHandler');

  res.status(statusCode).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
};
