// HTTP Request Builder & Executor
// Single Responsibility Principle - Only handles request construction and execution

import type { HttpRequestOptions, HttpResponse } from './types';

export function buildRequestOptions(
  method: string,
  url: string,
  body?: any,
  options?: Partial<HttpRequestOptions>
): HttpRequestOptions {
  return {
    method,
    url,
    headers: options?.headers || {},
    body,
    timeout: options?.timeout || 10000,
    retries: options?.retries || 0,
  };
}

export async function executeSingleRequest<T>(
  _options: HttpRequestOptions
): Promise<HttpResponse<T>> {
  // ...actual fetch/axios logic here...
  // This is a placeholder for demonstration
  throw new Error('Not implemented');
}
