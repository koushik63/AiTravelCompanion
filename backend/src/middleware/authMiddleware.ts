import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Logger } from '../utils/logger';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const secret = process.env.JWT_SECRET || 'super_secret_ai_travel_companion_jwt_key_2026';
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      Logger.warn(`Invalid or expired JWT token: ${err.message}`, 'authMiddleware');
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    req.user = decoded;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};
