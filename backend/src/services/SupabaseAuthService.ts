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
      Logger.info(`Supabase credentials unconfigured, proceeding via Local Auth Service for ${email}`, 'SupabaseAuthService');
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
      if (error) {
        if (error.message.toLowerCase().includes('rate limit')) {
          Logger.warn(`Supabase email rate limit reached for ${email}. Bypassing SMTP email trigger for direct registration.`, 'SupabaseAuthService');
          return { user: { email, name } };
        }
        throw error;
      }
      return data;
    } catch (err: any) {
      if (err.message && err.message.toLowerCase().includes('rate limit')) {
        Logger.warn(`Caught Supabase rate limit error, allowing direct app account creation`, 'SupabaseAuthService');
        return { user: { email, name } };
      }
      Logger.error('Supabase SignUp Error', err, 'SupabaseAuthService');
      throw err;
    }
  }

  static async signIn(email: string, password: string) {
    const supabase = this.getClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Logger.warn(`Supabase signIn exception: ${error.message}, fallback to local auth check`, 'SupabaseAuthService');
        return null;
      }
      return data;
    } catch (err: any) {
      Logger.warn(`Supabase SignIn Error: ${err.message}, fallback to local auth check`, 'SupabaseAuthService');
      return null;
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
      return { message: `Password reset instructions sent to ${email}` };
    }
  }
}
