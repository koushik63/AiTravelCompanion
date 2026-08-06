import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { AuthService } from '../services/api';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await AuthService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {}
    finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 glass-panel space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Forgot Password</h2>
        <p className="text-xs text-slate-400">Enter your registered email to receive password reset instructions</p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <p className="font-semibold">Reset Email Dispatched!</p>
          <p className="text-[11px] text-slate-400">Check your inbox for the password reset verification link.</p>
        </div>
      ) : (
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
                placeholder="alex.traveler@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full glass-button py-3 text-xs flex items-center justify-center gap-2">
            Send Reset Instructions
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-slate-800 text-center">
        <Link to="/login" className="text-xs text-sky-400 font-semibold hover:underline inline-flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
        </Link>
      </div>
    </div>
  );
};
