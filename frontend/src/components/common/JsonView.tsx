import React from 'react';

export function JsonView({ data }: { data: unknown }) {
  return (
    <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 text-xs">
      {typeof data === 'string' ? data : JSON.stringify(data, null, 2)}
    </pre>
  );
}


