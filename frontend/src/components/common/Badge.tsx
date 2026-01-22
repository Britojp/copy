import React from 'react';
import { cn } from '../../lib/utils';

type Props = { 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
};

export function Badge({ children, variant = 'default', className }: Props) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium';
  const styles = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    outline: 'border border-border text-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  };
  return (
    <span className={cn(base, styles[variant], className)}>
      {children}
    </span>
  );
}


