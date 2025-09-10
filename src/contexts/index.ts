// Dependency Inversion Principle (DIP) - React Context for dependency injection
// Single Responsibility Principle (SRP) - Each context has one responsibility

'use client';

import type { Container } from '@/services/container';
import type { HttpClient, Logger, UserService } from '@/services/interfaces';
import { createContext, ReactNode, useContext } from 'react';

// ✅ DIP: Service contexts depend on abstractions
export const ServiceContext = createContext<Container | null>(null);

export interface ServiceProviderProps {
  container: Container;
  children: ReactNode;
}

// ✅ SRP: Each hook provides access to one service type
export function useContainer(): Container {
  const container = useContext(ServiceContext);
  if (!container) {
    throw new Error('useContainer must be used within a ServiceProvider');
  }
  return container;
}

export function useUserService(): UserService {
  const container = useContainer();
  return container.get<UserService>(Symbol.for('UserService'));
}

export function useLogger(): Logger {
  const container = useContainer();
  return container.get<Logger>(Symbol.for('Logger'));
}

export function useHttpClient(): HttpClient {
  const container = useContainer();
  return container.get<HttpClient>(Symbol.for('HttpClient'));
}

// ✅ SRP: Theme context only manages theme state
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
}

const defaultTheme: Theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    border: '#d1d5db',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: {
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
  },
};

export const ThemeContext = createContext<Theme>(defaultTheme);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}

// ✅ SRP: Authentication context only manages auth state
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// ✅ SRP: Notification context only manages notifications
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    );
  }
  return context;
}

// ✅ SRP: Modal context only manages modal state
export interface Modal {
  id: string;
  component: ReactNode;
  props?: Record<string, unknown>;
  closable?: boolean;
}

export interface ModalContextValue {
  modals: Modal[];
  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
}

export const ModalContext = createContext<ModalContextValue | null>(null);

export function useModal(): ModalContextValue {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
