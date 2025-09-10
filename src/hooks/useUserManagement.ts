import type { UserSummaryReadModel } from '@/application/queries/user.queries';
import type { UserApplicationService } from '@/application/services/user.application-service';
import { createDevelopmentContainer, TYPES } from '@/infrastructure/container';
import React, { useCallback, useState } from 'react';

export interface UseUserManagementReturn {
  users: UserSummaryReadModel[];
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  loadUsers: () => Promise<void>;
  createUser: (email: string, name: string, role: string) => Promise<boolean>;
  deactivateUser: (userId: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for user management operations
 * Follows Single Responsibility Principle - handles only user state and operations
 */
export function useUserManagement(): UseUserManagementReturn {
  const [users, setUsers] = useState<UserSummaryReadModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Initialize our modular architecture
  const container = React.useMemo(() => createDevelopmentContainer(), []);
  const userService = React.useMemo(
    () => container.get<UserApplicationService>(TYPES.UserApplicationService),
    [container]
  );

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await userService.getUsers(
        { page: 1, limit: 10 },
        { isActive: true }
      );

      setUsers(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [userService]);

  const createUser = useCallback(
    async (email: string, name: string, role: string): Promise<boolean> => {
      try {
        setIsCreating(true);
        setError(null);

        const result = await userService.createUser(email, name, role);

        if (result.isSuccess) {
          await loadUsers();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create user');
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [userService, loadUsers]
  );

  const deactivateUser = useCallback(
    async (userId: string): Promise<boolean> => {
      try {
        setError(null);

        const result = await userService.deactivateUser(
          userId,
          'Deactivated from UI'
        );

        if (result.isSuccess) {
          await loadUsers();
          return true;
        } else {
          setError(result.error);
          return false;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to deactivate user'
        );
        return false;
      }
    },
    [userService, loadUsers]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    users,
    loading,
    error,
    isCreating,
    loadUsers,
    createUser,
    deactivateUser,
    clearError,
  };
}
