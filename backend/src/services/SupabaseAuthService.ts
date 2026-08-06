import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Logger } from '../utils/logger';

export class SupabaseAuthService {
  private static client: SupabaseClient | null = null;

  static getClient(): SupabaseClient | null {
    if (this.client) return this.client;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      this.client = createClient(url, key);
      return this.client;
    }
    return null;
  }

  static async signUp(email: string, password: string, name: string) {
    const supabase = this.getClient();
    if (!supabase) {
      Logger.info(`Supabase credentials unconfigured, proceeding via Demo Auth Service for ${email}`, 'SupabaseAuthService');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      Logger.error('Supabase SignUp Error', err, 'SupabaseAuthService');
      throw err;
    }
  }

  static async signIn(email: string, password: string) {
    const supabase = this.getClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } catch (err) {
      Logger.error('Supabase SignIn Error', err, 'SupabaseAuthService');
      throw err;
    }
  }

  static async resetPasswordForEmail(email: string) {
    const supabase = this.getClient();
    if (!supabase) return { message: `Password reset link dispatched to ${email}` };
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return data;
    } catch (err) {
      Logger.error('Supabase Password Reset Error', err, 'SupabaseAuthService');
      throw err;
    }
  }
}
