import { ApiError, NetworkError, TimeoutError, type BackendErrorResponse } from './errors';

const defaultHeaders: HeadersInit = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};

const DEFAULT_REQUEST_TIMEOUT = 30000;
const AI_REQUEST_TIMEOUT = 120000;
const AI_ESCRITOR_DESCRICAO_TIMEOUT = 240000;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

function buildUrl(path: string): string {
  const base = import.meta.env.VITE_API_URL;
  if (!base) {
    throw new NetworkError('URL da API não configurada. Verifique a variável VITE_API_URL.');
  }
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

function isBackendErrorResponse(data: unknown): data is BackendErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'statusCode' in data &&
    'message' in data &&
    typeof (data as BackendErrorResponse).message === 'string'
  );
}

async function handleResponse<TResponse>(res: Response): Promise<TResponse> {
  const data = await parseJson(res);

  if (!res.ok) {
    if (isBackendErrorResponse(data)) {
      throw ApiError.fromBackendResponse(data);
    }

    const message =
      typeof data === 'object' && data !== null && 'message' in data
        ? String((data as { message: unknown }).message)
        : `Erro ${res.status}: ${res.statusText || 'Erro na requisição'}`;

    throw new ApiError(message, res.status);
  }

  return data as TResponse;
}

export async function httpRequest<TResponse = unknown, TBody = unknown>(
  method: HttpMethod,
  path: string,
  body?: TBody,
  headers?: HeadersInit,
  timeout?: number,
): Promise<TResponse> {
  let url: string;
  try {
    url = buildUrl(path);
  } catch (error) {
    throw error;
  }

  const requestTimeout = timeout ?? DEFAULT_REQUEST_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), requestTimeout);

  try {
    const res = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...(headers ?? {}) },
      body: body == null ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    return await handleResponse<TResponse>(res);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new TimeoutError();
      }

      if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
        throw new NetworkError(
          'Não foi possível conectar ao servidor. Verifique se o backend está rodando e acessível.',
          error,
        );
      }

      if (error.message.includes('CORS')) {
        throw new NetworkError(
          'Erro de CORS. Verifique se o backend está configurado para aceitar requisições do frontend.',
          error,
        );
      }
    }

    throw new NetworkError('Erro de conexão. Tente novamente mais tarde.', error);
  } finally {
    clearTimeout(timeoutId);
  }
}

export function get<T = unknown>(path: string, headers?: HeadersInit, timeout?: number) {
  return httpRequest<T>('GET', path, undefined, headers, timeout);
}

export function post<T = unknown, B = unknown>(path: string, body?: B, headers?: HeadersInit, timeout?: number) {
  return httpRequest<T, B>('POST', path, body, headers, timeout);
}

export function put<T = unknown, B = unknown>(path: string, body?: B, headers?: HeadersInit, timeout?: number) {
  return httpRequest<T, B>('PUT', path, body, headers, timeout);
}

export function del<T = unknown>(path: string, headers?: HeadersInit, timeout?: number) {
  return httpRequest<T>('DELETE', path, undefined, headers, timeout);
}

export { AI_REQUEST_TIMEOUT, AI_ESCRITOR_DESCRICAO_TIMEOUT };


