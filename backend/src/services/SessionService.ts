import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_ai_travel_companion_jwt_key_2026';

export class SessionService {
  static createToken(payload: { id: string; email: string; role: string }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    } catch {
      return null;
    }
  }
}
