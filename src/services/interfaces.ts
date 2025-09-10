// Dependency Inversion Principle (DIP) - Abstract interfaces for services

import type {
  ApiResponse,
  AuthCredentials,
  AuthToken,
  AuthUser,
  CreateUserRequest,
  PaginatedResponse,
  Repository,
  UpdateUserRequest,
  User,
} from '@/types';

// ✅ Abstract Logger interface - High-level modules depend on this abstraction
export interface Logger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  debug(message: string, meta?: Record<string, unknown>): void;
}

// ✅ Abstract HTTP Client interface
export interface HttpClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

// ✅ Abstract Cache interface
export interface Cache {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// ✅ Abstract Storage interface
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

// ✅ Abstract Validator interface
export interface Validator<T> {
  validate(data: unknown): ValidationResult<T>;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// ✅ Abstract Event Bus interface
export interface EventBus {
  emit<T>(event: string, data: T): void;
  on<T>(event: string, handler: (data: T) => void): () => void;
  off(event: string, handler: (...args: unknown[]) => void): void;
}

// ✅ Business logic interfaces
export interface UserService {
  getUsers(page?: number, limit?: number): Promise<PaginatedResponse<User>>;
  getUserById(id: string): Promise<User>;
  createUser(data: CreateUserRequest): Promise<User>;
  updateUser(id: string, data: UpdateUserRequest): Promise<User>;
  deleteUser(id: string): Promise<void>;
  searchUsers(query: string): Promise<User[]>;
}

export interface AuthService {
  login(credentials: AuthCredentials): Promise<AuthToken>;
  logout(): Promise<void>;
  refresh(refreshToken: string): Promise<AuthToken>;
  getCurrentUser(): Promise<AuthUser>;
  verifyToken(token: string): Promise<boolean>;
}

export interface NotificationService {
  send(message: NotificationMessage): Promise<void>;
  sendBulk(messages: NotificationMessage[]): Promise<void>;
}

export interface NotificationMessage {
  id: string;
  type: 'email' | 'sms' | 'push';
  recipient: string;
  subject?: string;
  content: string;
  metadata?: Record<string, unknown>;
}

// ✅ Repository interfaces (implementing Repository pattern)
export interface UserRepository extends Repository<User> {
  findByEmail(email: string): Promise<User | null>;
  findByRole(role: string): Promise<User[]>;
}

// ✅ Configuration interface
export interface AppConfig {
  api: {
    baseUrl: string;
    timeout: number;
    retries: number;
  };
  auth: {
    tokenKey: string;
    refreshTokenKey: string;
  };
  features: {
    enableAnalytics: boolean;
    enableNotifications: boolean;
  };
}

// ✅ Analytics interface
export interface Analytics {
  track(event: string, properties?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
}

// ✅ File Upload interface
export interface FileUploadService {
  upload(file: File, options?: UploadOptions): Promise<UploadResult>;
  uploadMultiple(
    files: File[],
    options?: UploadOptions
  ): Promise<UploadResult[]>;
  delete(fileId: string): Promise<void>;
}

export interface UploadOptions {
  folder?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface UploadResult {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}
