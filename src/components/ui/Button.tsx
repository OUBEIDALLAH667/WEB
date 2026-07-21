import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const variants = {
    primary: 'btn-electric text-white font-semibold',
    secondary: 'glass-light text-white hover:bg-white/10 border border-white/10',
    ghost: 'text-dark-100 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30',
    orange: 'btn-orange text-white font-semibold',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-sm rounded-xl',
    lg: 'px-8 py-4 text-base rounded-xl',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
