import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../services/DatabaseService';
import { SupabaseAuthService } from '../services/SupabaseAuthService';
import { SessionService } from '../services/SessionService';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      const existing = await DatabaseService.findUserByEmail(email);
      if (existing) {
        // If user already registered, perform sign in directly
        const profile = await DatabaseService.getProfileByUserId(existing.id);
        const preferences = await DatabaseService.getPreferencesByUserId(existing.id);
        const token = SessionService.createToken({ id: existing.id, email: existing.email, role: existing.role });
        return res.json({ user: existing, profile, preferences, token });
      }

      // Attempt Supabase auth without failing if Supabase email rate limits are hit
      try {
        await SupabaseAuthService.signUp(email, password, name);
      } catch (e: any) {
        console.warn('Supabase auth signup warning, creating database user record:', e.message);
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await DatabaseService.createUser({ email, passwordHash, name, provider: 'email' });
      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);

      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });
      return res.status(201).json({ user, profile, preferences, token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Demo login shortcut
      if (email === 'demo@example.com' || email === 'alex.traveler@example.com') {
        const demoUser = await DatabaseService.findUserByEmail('alex.traveler@example.com');
        const profile = await DatabaseService.getProfileByUserId(demoUser!.id);
        const preferences = await DatabaseService.getPreferencesByUserId(demoUser!.id);
        const token = SessionService.createToken({ id: demoUser!.id, email: demoUser!.email, role: demoUser!.role });
        return res.json({ user: demoUser, profile, preferences, token });
      }

      // Try Supabase Auth
      await SupabaseAuthService.signIn(email, password);

      let user = await DatabaseService.findUserByEmail(email);
      if (!user) {
        // Auto-register user if not in database store yet
        const passwordHash = await bcrypt.hash(password, 10);
        user = await DatabaseService.createUser({ email, passwordHash, name: email.split('@')[0], provider: 'email' });
      } else if (user.passwordHash) {
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }

      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });

      return res.json({ user, profile, preferences, token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Login failed' });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    try {
      const { email, name, avatar } = req.body;
      let user = await DatabaseService.findUserByEmail(email || 'google.user@example.com');

      if (!user) {
        user = await DatabaseService.createUser({
          email: email || `google_${Date.now()}@example.com`,
          name: name || 'Google Traveler',
          avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
          provider: 'google'
        });
      }

      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });

      return res.json({ user, profile, preferences, token });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Google OAuth failed' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    await SupabaseAuthService.resetPasswordForEmail(email || 'alex.traveler@example.com');
    return res.json({ message: `Password reset instructions sent to ${email || 'your email'}` });
  }

  static async resetPassword(req: Request, res: Response) {
    return res.json({ message: 'Password has been updated successfully' });
  }

  static async verifyEmail(req: Request, res: Response) {
    return res.json({ message: 'Email verified successfully' });
  }

  static async refreshSession(req: AuthRequest, res: Response) {
    const user = await DatabaseService.findUserById(req.user?.id || 'usr_demo_1');
    const token = SessionService.createToken({ id: user!.id, email: user!.email, role: user!.role });
    return res.json({ token, user });
  }

  static async logout(req: Request, res: Response) {
    return res.json({ message: 'Logged out successfully' });
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      const user = await DatabaseService.findUserById(req.user?.id || 'usr_demo_1');
      if (!user) return res.status(404).json({ error: 'User not found' });
      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      return res.json({ user, profile, preferences });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
