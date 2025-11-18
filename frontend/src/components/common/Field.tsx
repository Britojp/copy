import React from 'react';

type Props = { label: string; children: React.ReactNode };

export function Field({ label, children }: Props) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}


