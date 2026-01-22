export interface BackendErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  code?: string;
  details?: unknown;
}

export class ApiError extends Error {
  public readonly statusCode?: number;
  public readonly code?: string;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode?: number,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static fromBackendResponse(response: BackendErrorResponse): ApiError {
    return new ApiError(response.message, response.statusCode, response.code, response.details);
  }
}

export class NetworkError extends Error {
  public readonly originalError?: unknown;

  constructor(message: string, originalError?: unknown) {
    super(message);
    this.name = 'NetworkError';
    this.originalError = originalError;
  }
}

export class TimeoutError extends Error {
  constructor(message: string = 'A requisição demorou muito para responder') {
    super(message);
    this.name = 'TimeoutError';
  }
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.code === 'GEMINI_QUOTA_EXCEEDED' || error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('limite')) {
      return 'Limite de requisições da API excedido. Por favor, aguarde alguns minutos e tente novamente.';
    }
    return error.message;
  }

  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof TimeoutError) {
    return error.message;
  }

  if (error instanceof Error) {
    if (error.message === 'Failed to fetch') {
      return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando e acessível.';
    }
    const errorLower = error.message.toLowerCase();
    if (errorLower.includes('429') || errorLower.includes('quota') || errorLower.includes('rate limit') || errorLower.includes('limite')) {
      return 'Limite de requisições da API excedido. Por favor, aguarde alguns minutos e tente novamente.';
    }
    return error.message;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.message === 'string') {
      const messageLower = errorObj.message.toLowerCase();
      if (messageLower.includes('429') || messageLower.includes('quota') || messageLower.includes('rate limit') || messageLower.includes('limite')) {
        return 'Limite de requisições da API excedido. Por favor, aguarde alguns minutos e tente novamente.';
      }
      return errorObj.message;
    }
  }

  return 'Ocorreu um erro inesperado. Tente novamente mais tarde.';
}

export function extractErrorDetails(error: unknown): string | undefined {
  if (error instanceof ApiError && error.details) {
    if (typeof error.details === 'string') {
      return error.details;
    }
    if (Array.isArray(error.details)) {
      return error.details.join(', ');
    }
    if (typeof error.details === 'object') {
      return JSON.stringify(error.details, null, 2);
    }
  }

  return undefined;
}

