// HTTP Request Retry Logic
// Single Responsibility Principle - Only handles retrying failed requests

import { executeSingleRequest } from './request';
import type { HttpRequestOptions, HttpResponse } from './types';

export async function executeWithRetry<T>(
  options: HttpRequestOptions
): Promise<HttpResponse<T>> {
  let attempts = 0;
  const maxRetries = options.retries ?? 0;
  let lastError: any;

  while (attempts <= maxRetries) {
    try {
      return await executeSingleRequest<T>(options);
    } catch (error) {
      lastError = error;
      attempts++;
      if (attempts > maxRetries) break;
    }
  }
  throw lastError;
}
