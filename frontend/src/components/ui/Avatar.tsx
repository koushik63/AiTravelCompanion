import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base'
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-xl object-cover ring-2 ring-sky-500/40`}
      />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 font-bold text-white flex items-center justify-center ring-2 ring-sky-500/40`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
};
