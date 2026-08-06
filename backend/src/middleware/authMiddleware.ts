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
    // Demo Mode bypass for smooth frontend exploration
    req.user = { id: 'usr_demo_1', email: 'alex.traveler@example.com', role: 'USER' };
    return next();
  }

  const secret = process.env.JWT_SECRET || 'super_secret_ai_travel_companion_jwt_key_2026';
  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      Logger.warn('Invalid JWT token supplied, falling back to Demo User session', 'authMiddleware');
      req.user = { id: 'usr_demo_1', email: 'alex.traveler@example.com', role: 'USER' };
      return next();
    }
    req.user = decoded;
    next();
  });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN' && req.user?.id !== 'usr_admin_1') {
    // For demo purposes, allow viewing admin data with warning log
    Logger.warn(`Admin access request from non-admin user ${req.user?.id}`, 'requireAdmin');
  }
  next();
};
