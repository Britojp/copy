export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableErrors?: string[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 30000,
  backoffMultiplier: 2,
  retryableErrors: ['429', 'quota', 'rate limit', 'too many requests'],
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error: unknown, retryableErrors: string[]): boolean {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorString = errorMessage.toLowerCase();
  return retryableErrors.some((pattern) => errorString.includes(pattern.toLowerCase()));
}

function extractRetryDelay(error: unknown): number | null {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const retryMatch = errorMessage.match(/retry.*?(\d+(?:\.\d+)?)\s*s/i);
  if (retryMatch) {
    return Math.min(parseFloat(retryMatch[1]) * 1000, 60000);
  }
  return null;
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;
  let delay = opts.initialDelayMs;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === opts.maxRetries) {
        break;
      }

      if (!isRetryableError(error, opts.retryableErrors)) {
        throw error;
      }

      const retryDelay = extractRetryDelay(error) ?? delay;
      const actualDelay = Math.min(retryDelay, opts.maxDelayMs);

      await sleep(actualDelay);
      delay = Math.min(delay * opts.backoffMultiplier, opts.maxDelayMs);
    }
  }

  throw lastError;
}

