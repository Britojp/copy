const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function buildUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL;
  return `${base.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function httpRequest<TResponse = unknown, TBody = unknown>(
  method: HttpMethod,
  path: string,
  body?: TBody,
  headers?: HeadersInit,
): Promise<TResponse> {
  const res = await fetch(buildUrl(path), {
    method,
    headers: { ...defaultHeaders, ...(headers ?? {}) },
    body: body == null ? undefined : JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok) {
    const error = typeof data === 'object' && data !== null ? data : { message: String(data ?? 'Erro na requisição') };
    throw error as unknown as Error;
  }
  return data as TResponse;
}

export function get<T = unknown>(path: string, headers?: HeadersInit) {
  return httpRequest<T>('GET', path, undefined, headers);
}

export function post<T = unknown, B = unknown>(path: string, body?: B, headers?: HeadersInit) {
  return httpRequest<T, B>('POST', path, body, headers);
}

export function put<T = unknown, B = unknown>(path: string, body?: B, headers?: HeadersInit) {
  return httpRequest<T, B>('PUT', path, body, headers);
}

export function del<T = unknown>(path: string, headers?: HeadersInit) {
  return httpRequest<T>('DELETE', path, undefined, headers);
}


