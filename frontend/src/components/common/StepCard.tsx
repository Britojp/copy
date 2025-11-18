import React from 'react';
import { Badge } from './Badge';

type Props = {
  index: number;
  title: string;
  runId?: string | null;
  children: React.ReactNode;
  loading?: boolean;
  emptyText?: string;
};

export function StepCard({ index, title, runId, children, loading, emptyText }: Props) {
  return (
    <div className="relative rounded-lg bg-card text-card-foreground shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground flex-shrink-0">{index}</div>
          <h3 className="text-sm" style={{ fontFamily: 'var(--font-logo)' }}>{title}</h3>
        </div>
        {runId ? <span className="text-xs text-muted-foreground break-all sm:break-normal">{runId}</span> : null}
      </div>
      <div className="p-4">
        {loading ? <div className="text-sm text-muted-foreground">Carregando...</div> : children ?? <div className="text-sm text-muted-foreground">{emptyText ?? 'Sem dados'}</div>}
      </div>
    </div>
  );
}


