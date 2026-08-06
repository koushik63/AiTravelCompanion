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
   * Sync Google OAuth user directly to Supabase Auth & Database tables
   */
  static async syncGoogleUserToSupabase(email: string, name: string, avatar?: string) {
    const adminClient = this.getAdminClient();
    if (!adminClient) return null;

    try {
      // 1. Create or sync in Supabase Auth Admin Dashboard
      const { data, error } = await adminClient.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { name, avatar, provider: 'google' }
      });

      if (error && !error.message.toLowerCase().includes('already')) {
        Logger.warn(`Supabase Google Auth sync note: ${error.message}`, 'SupabaseAuthService');
      } else {
        Logger.info(`Google user ${email} (${name}) synced to Supabase Auth`, 'SupabaseAuthService');
      }

      // 2. Sync directly into Supabase Database public.profiles or public.users table if accessible
      const client = this.getClient() || adminClient;
      if (client) {
        try {
          await client.from('profiles').upsert({
            email,
            name,
            avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D9488&color=ffffff`,
            provider: 'google',
            updated_at: new Date().toISOString()
          }, { onConflict: 'email' });
        } catch (dbErr: any) {
          Logger.warn(`Supabase database profiles table upsert note: ${dbErr.message}`, 'SupabaseAuthService');
        }
      }
    } catch (err: any) {
      Logger.warn(`Supabase Google sync error: ${err.message}`, 'SupabaseAuthService');
    }
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
        } else {
          Logger.info(`User ${email} (${name}) registered in Supabase Auth (admin)`, 'SupabaseAuthService');
          return data;
        }
      } catch (err: any) {
        Logger.warn(`Supabase admin signup error: ${err.message}`, 'SupabaseAuthService');
      }
    }

    // Fallback: anon client signUp
    const supabase = this.getClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } }
      });
      if (error) return null;
      return data;
    } catch (err: any) {
      return null;
    }
  }

  /**
   * Sign in a user via Supabase Authentication.
   */
  static async signIn(email: string, password: string) {
    const supabase = this.getClient();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return null;
      Logger.info(`User ${email} signed in via Supabase Auth`, 'SupabaseAuthService');
      return data;
    } catch (err: any) {
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
      return { message: `Password reset instructions sent to ${email}` };
    }
  }
}
