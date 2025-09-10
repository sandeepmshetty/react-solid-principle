// FetchHttpClient Implementation
// Single Responsibility Principle - Only implements HttpClient using fetch API

import type { HttpClient, RequestConfig } from '@/services/interfaces';
import type { ApiResponse } from '@/types';

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    try {
      const fetchOptions: RequestInit = {
        method: 'GET',
        ...(config?.headers && { headers: config.headers }),
        ...(config?.timeout && { signal: AbortSignal.timeout(config.timeout) }),
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        message: 'Request successful',
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const fetchOptions: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(config?.headers || {}),
        },
        ...(config?.timeout && { signal: AbortSignal.timeout(config.timeout) }),
      };

      if (data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return {
        data: responseData,
        message: 'Request successful',
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const fetchOptions: RequestInit = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(config?.headers || {}),
        },
        ...(config?.timeout && { signal: AbortSignal.timeout(config.timeout) }),
      };

      if (data) {
        fetchOptions.body = JSON.stringify(data);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return {
        data: responseData,
        message: 'Request successful',
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }

  async delete<T>(
    url: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const fetchOptions: RequestInit = {
        method: 'DELETE',
        ...(config?.headers && { headers: config.headers }),
        ...(config?.timeout && { signal: AbortSignal.timeout(config.timeout) }),
      };

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      return {
        data: responseData,
        message: 'Request successful',
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false,
      };
    }
  }
}
