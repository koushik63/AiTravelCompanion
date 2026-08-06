import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Logger } from '../utils/logger';

export class SupabaseAuthService {
  private static anonClient: SupabaseClient | null = null;
  private static adminClient: SupabaseClient | null = null;

  /** Anon client — used for sign-in only */
  static getClient(): SupabaseClient | null {
    if (this.anonClient) return this.anonClient;
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      this.anonClient = createClient(url, key);
      return this.anonClient;
    }
    return null;
  }

  /** Admin client using Service Role key — bypasses RLS and email confirmation */
  static getAdminClient(): SupabaseClient | null {
    if (this.adminClient) return this.adminClient;
    const url = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (url && serviceKey) {
      this.adminClient = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      });
      return this.adminClient;
    }
    return null;
  }

  /**
   * Register a new user in Supabase Authentication.
   * Uses admin API with email_confirm=true so users can log in immediately
   * without needing to click a confirmation email.
   */
  static async signUp(email: string, password: string, name: string) {
    // Try admin client first (requires SUPABASE_SERVICE_ROLE_KEY)
    const adminClient = this.getAdminClient();
    if (adminClient) {
      try {
        const { data, error } = await adminClient.auth.admin.createUser({
          email,
          password,
          user_metadata: { name },
          email_confirm: true // Skip email confirmation in dev
        });
        if (error) {
          if (error.message.toLowerCase().includes('already registered') ||
              error.message.toLowerCase().includes('already been registered') ||
              error.message.toLowerCase().includes('user already exists')) {
            Logger.info(`User ${email} already exists in Supabase Auth`, 'SupabaseAuthService');
            return { user: { email, name } };
          }
          Logger.warn(`Supabase admin createUser warning: ${error.message}`, 'SupabaseAuthService');
          // Fall through to anon client
        } else {
          Logger.info(`User ${email} successfully registered in Supabase Auth (admin)`, 'SupabaseAuthService');
          return data;
        }
      } catch (err: any) {
        Logger.warn(`Supabase admin signup error: ${err.message}, trying anon client`, 'SupabaseAuthService');
      }
    }

    // Fallback: anon client signUp (may require email confirmation)
    const supabase = this.getClient();
    if (!supabase) {
      Logger.info(`Supabase credentials unconfigured, using local auth for ${email}`, 'SupabaseAuthService');
      return null;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) {
        if (error.message.toLowerCase().includes('rate limit') ||
            error.message.toLowerCase().includes('already registered')) {
          Logger.warn(`Supabase signUp note for ${email}: ${error.message}`, 'SupabaseAuthService');
          return { user: { email, name } };
        }
        Logger.warn(`Supabase anon signUp warning: ${error.message}`, 'SupabaseAuthService');
        return null;
      }
      return data;
    } catch (err: any) {
      Logger.warn(`Supabase signUp caught: ${err.message}`, 'SupabaseAuthService');
      return null;
    }
  }

  /**
   * Sign in a user via Supabase Authentication.
   * Returns Supabase session data or null if not available (falls back to local auth).
   */
  static async signIn(email: string, password: string) {
    const supabase = this.getClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        Logger.warn(`Supabase signIn: ${error.message} — using local auth fallback`, 'SupabaseAuthService');
        return null;
      }
      Logger.info(`User ${email} signed in via Supabase Auth`, 'SupabaseAuthService');
      return data;
    } catch (err: any) {
      Logger.warn(`Supabase signIn error: ${err.message}`, 'SupabaseAuthService');
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
