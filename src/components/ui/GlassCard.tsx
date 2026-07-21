import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlassCard({ children, className = '', hover = false, onClick }: GlassCardProps) {
  const base = hover ? 'glass-card' : 'glass';
  return (
    <div
      className={`${base} rounded-2xl ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
