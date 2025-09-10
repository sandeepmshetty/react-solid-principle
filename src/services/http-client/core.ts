// Core HTTP Client Implementation
// Single Responsibility Principle - Only implements the HttpClient interface

import { handleRequestError } from './error';
import { buildRequestOptions } from './request';
import { executeWithRetry } from './retry';
import type { HttpClient, HttpRequestOptions, HttpResponse } from './types';

export class HttpClientImpl implements HttpClient {
  async get<T>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('GET', url, undefined, options);
  }

  async post<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('POST', url, body, options);
  }

  async put<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PUT', url, body, options);
  }

  async delete<T>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('DELETE', url, undefined, options);
  }

  async patch<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>> {
    return this.request<T>('PATCH', url, body, options);
  }

  private async request<T>(
    method: string,
    url: string,
    body?: any,
    options?: Partial<HttpRequestOptions>
  ): Promise<HttpResponse<T>> {
    const requestOptions = buildRequestOptions(method, url, body, options);
    try {
      return await executeWithRetry<T>(requestOptions);
    } catch (error) {
      throw handleRequestError(error);
    }
  }
}
