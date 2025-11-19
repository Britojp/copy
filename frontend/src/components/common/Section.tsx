import React from 'react';

type Props = { title?: string; children: React.ReactNode; actions?: React.ReactNode };

export function Section({ title, children, actions }: Props) {
  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm">
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2">
          {title && <h2 className="text-md" style={{ fontFamily: 'var(--font-logo)' }}>{title}</h2>}
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      )}
      <div className="p-3">{children}</div>
    </div>
  );
}


