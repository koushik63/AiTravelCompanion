import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Mail, LogIn, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PasswordInput } from '../components/ui/PasswordInput';
import { OAuthButton } from '../components/ui/OAuthButton';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('alex.traveler@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await googleLogin('google.traveler@example.com', 'Google Traveler');
      navigate('/dashboard');
    } catch (err: any) {
      setError('Google Sign In failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 glass-panel space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-400">Sign in to manage your AI travel companion</p>
      </div>

      {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-800 text-sky-500" />
            Remember Me
          </label>
          <Link to="/forgot-password" className="text-sky-400 hover:underline">Forgot password?</Link>
        </div>

        <button type="submit" disabled={isLoading} className="w-full glass-button flex items-center justify-center gap-2 py-3 mt-2">
          <LogIn className="w-4 h-4" /> {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="space-y-3 pt-2">
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-500">Or continue with</span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        <OAuthButton provider="google" onClick={handleGoogleAuth} isLoading={isLoading} />

        <button
          onClick={() => {
            setEmail('alex.traveler@example.com');
            setPassword('password123');
            login('alex.traveler@example.com', 'password123').then(() => navigate('/dashboard'));
          }}
          className="w-full glass-button-secondary text-xs py-2 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> One-Click Demo Sign In
        </button>
      </div>

      <div className="pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-400">
          Don't have an account? <Link to="/register" className="text-sky-400 font-semibold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};
