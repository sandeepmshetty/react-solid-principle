// HTTP Client Types & Interfaces
// Single Responsibility Principle - Only defines types and interfaces

export interface HttpRequestOptions {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export interface HttpResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

export interface HttpClient {
  get<T>(url: string, options?: HttpRequestOptions): Promise<HttpResponse<T>>;
  post<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
  put<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
  delete<T>(
    url: string,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
  patch<T>(
    url: string,
    body: any,
    options?: HttpRequestOptions
  ): Promise<HttpResponse<T>>;
}
