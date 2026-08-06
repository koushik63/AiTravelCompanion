import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, CheckCircle2 } from 'lucide-react';
import { PasswordInput } from '../components/ui/PasswordInput';
import { Button } from '../components/ui/Button';

export const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setSuccess(true);
    setTimeout(() => navigate('/login'), 2000);
  };

  return (
    <div className="max-w-md mx-auto my-12 p-6 glass-panel space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 mx-auto flex items-center justify-center shadow-lg shadow-sky-500/30">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Set New Password</h2>
        <p className="text-xs text-slate-400">Enter a secure new password for your WanderAI account</p>
      </div>

      {error && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs">{error}</div>}

      {success ? (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2 text-xs text-emerald-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
          <p className="font-semibold">Password Reset Successful!</p>
          <p className="text-[11px] text-slate-400">Redirecting to sign in...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full py-3">
            Update Password
          </Button>
        </form>
      )}
    </div>
  );
};
