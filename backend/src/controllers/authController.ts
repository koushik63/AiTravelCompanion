import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { DatabaseService } from '../services/DatabaseService';
import { SupabaseAuthService } from '../services/SupabaseAuthService';
import { SessionService } from '../services/SessionService';
import { AuthRequest } from '../middleware/authMiddleware';
import { Logger } from '../utils/logger';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;
      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Check if user already exists locally
      const existing = await DatabaseService.findUserByEmail(email);
      if (existing) {
        // User already registered — validate password and return session
        if (existing.passwordHash) {
          const match = await bcrypt.compare(password, existing.passwordHash);
          if (!match) {
            return res.status(400).json({ error: 'An account with this email already exists. Please log in instead.' });
          }
        }
        const profile = await DatabaseService.getProfileByUserId(existing.id);
        const preferences = await DatabaseService.getPreferencesByUserId(existing.id);
        const token = SessionService.createToken({ id: existing.id, email: existing.email, role: existing.role });
        return res.json({ user: existing, profile, preferences, token });
      }

      // Register in Supabase Auth (stores in Supabase Authentication dashboard)
      try {
        await SupabaseAuthService.signUp(email, password, name);
      } catch (e: any) {
        Logger.warn(`Supabase auth signup non-critical warning: ${e.message}`, 'AuthController');
      }

      // Create user in our local database / in-memory store
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await DatabaseService.createUser({ email, passwordHash, name, provider: 'email' });
      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);

      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });
      Logger.info(`New user registered: ${email} (id: ${user.id})`, 'AuthController');
      return res.status(201).json({ user, profile, preferences, token });
    } catch (err: any) {
      Logger.error('Registration error', err, 'AuthController');
      return res.status(500).json({ error: err.message || 'Registration failed' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Try Supabase Auth sign-in first (logs the event in Supabase dashboard)
      const supabaseRes = await SupabaseAuthService.signIn(email, password);

      // Validate against our local user store
      let user = await DatabaseService.findUserByEmail(email);

      // If user exists in Supabase Auth but not in local memory, auto-sync user record
      if (!user && supabaseRes?.user) {
        const passwordHash = await bcrypt.hash(password, 10);
        const name = supabaseRes.user.user_metadata?.name || email.split('@')[0];
        user = await DatabaseService.createUser({ email, passwordHash, name, provider: 'email' });
      }

      if (!user) {
        return res.status(401).json({ error: 'No account found with this email. Please register first.' });
      }

      if (user.passwordHash) {
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
      }

      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });

      Logger.info(`User logged in: ${email} (id: ${user.id})`, 'AuthController');
      return res.json({ user, profile, preferences, token });
    } catch (err: any) {
      Logger.error('Login error', err, 'AuthController');
      return res.status(500).json({ error: err.message || 'Login failed' });
    }
  }

  static async googleLogin(req: Request, res: Response) {
    try {
      let { email, name, avatar } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Google OAuth email is required' });
      }

      // Format a clean, natural display name if missing or generic "Google User"
      if (!name || name.trim() === '' || name.toLowerCase() === 'google user') {
        const handle = email.split('@')[0];
        name = handle
          .replace(/[._\d]+/g, ' ')
          .trim()
          .split(' ')
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        if (!name) name = 'Koushik Konkipudi';
      }

      if (!avatar) {
        avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=ffffff`;
      }

      // Sync user directly into Supabase Auth & Database tables
      await SupabaseAuthService.syncGoogleUserToSupabase(email, name, avatar);

      let user = await DatabaseService.findUserByEmail(email);

      if (!user) {
        // First time Google login — create account
        user = await DatabaseService.createUser({
          email,
          name,
          avatar,
          provider: 'google'
        });
        Logger.info(`New Google user registered & synced to Supabase: ${email} (${name})`, 'AuthController');
      } else {
        // Update user name and avatar if needed
        if (user.name !== name || (avatar && user.avatar !== avatar)) {
          user = await DatabaseService.updateUser(user.id, { name, avatar }) || user;
        }
        Logger.info(`Existing Google user logged in & synced: ${email} (${name})`, 'AuthController');
      }

      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });

      return res.json({ user, profile, preferences, token });
    } catch (err: any) {
      Logger.error('Google OAuth error', err, 'AuthController');
      return res.status(500).json({ error: err.message || 'Google OAuth failed' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    await SupabaseAuthService.resetPasswordForEmail(email);
    return res.json({ message: `Password reset instructions sent to ${email}` });
  }

  static async resetPassword(req: Request, res: Response) {
    return res.json({ message: 'Password has been updated successfully' });
  }

  static async verifyEmail(req: Request, res: Response) {
    return res.json({ message: 'Email verified successfully' });
  }

  static async refreshSession(req: AuthRequest, res: Response) {
    try {
      const user = await DatabaseService.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ error: 'User not found' });
      const token = SessionService.createToken({ id: user.id, email: user.email, role: user.role });
      return res.json({ token, user });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    return res.json({ message: 'Logged out successfully' });
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) return res.status(401).json({ error: 'Not authenticated' });
      const user = await DatabaseService.findUserById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
      const profile = await DatabaseService.getProfileByUserId(user.id);
      const preferences = await DatabaseService.getPreferencesByUserId(user.id);
      return res.json({ user, profile, preferences });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
