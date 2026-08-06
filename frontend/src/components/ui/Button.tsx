import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-500/25',
    secondary: 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80',
    outline: 'border border-sky-500/40 text-sky-400 hover:bg-sky-500/10',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-500/25',
    ghost: 'text-slate-300 hover:bg-slate-800/50'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-xs sm:text-sm px-4 py-2.5',
    lg: 'text-sm sm:text-base px-6 py-3.5'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin mr-2">🌀</span>
      ) : null}
      {children}
    </button>
  );
};
