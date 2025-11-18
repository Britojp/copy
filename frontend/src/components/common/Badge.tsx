import React from 'react';

type Props = { children: React.ReactNode; variant?: 'default' | 'muted' | 'outline' };

export function Badge({ children, variant = 'default' }: Props) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs';
  const styles =
    variant === 'muted'
      ? 'bg-muted text-foreground'
      : variant === 'outline'
      ? 'text-foreground'
      : 'bg-primary text-primary-foreground';
  return <span className={`${base} ${styles}`}>{children}</span>;
}


