import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2 } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-12 p-8 glass-panel text-center space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 mx-auto flex items-center justify-center border border-sky-500/20">
        <Mail className="w-6 h-6" />
      </div>
      <h2 className="text-2xl font-bold text-slate-100">Verify Your Email</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        We sent a verification link to your email address. Please click the link in your email to activate your account.
      </p>
      <div className="pt-4 border-t border-slate-800">
        <Link to="/login" className="glass-button text-xs py-2.5 px-6 inline-flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Proceed to Login
        </Link>
      </div>
    </div>
  );
};
