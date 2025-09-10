// Single Responsibility Principle (SRP) - useUsers only manages user data operations
// Dependency Inversion Principle (DIP) - Hook depends on service abstraction

import type { UserService } from '@/services/interfaces';
import type { CreateUserRequest, UpdateUserRequest, User } from '@/types';
import { useCallback, useEffect } from 'react';
import { useAsyncState } from '../state/useAsyncState';

export function useUsers(userService: UserService) {
  const [usersState, executeUsersOperation] = useAsyncState<User[]>([]);
  const [userState, executeUserOperation] = useAsyncState<User>();

  const fetchUsers = useCallback(
    async (page = 1, limit = 10) => {
      const response = await userService.getUsers(page, limit);
      return response.data;
    },
    [userService]
  );

  const fetchUser = useCallback(
    async (id: string) => {
      return userService.getUserById(id);
    },
    [userService]
  );

  const createUser = useCallback(
    async (userData: CreateUserRequest) => {
      return userService.createUser(userData);
    },
    [userService]
  );

  const updateUser = useCallback(
    async (id: string, userData: UpdateUserRequest) => {
      return userService.updateUser(id, userData);
    },
    [userService]
  );

  const deleteUser = useCallback(
    async (id: string) => {
      await userService.deleteUser(id);
      // Refresh users list after deletion
      if (usersState.data) {
        const updatedUsers = usersState.data.filter(user => user.id !== id);
        executeUsersOperation(Promise.resolve(updatedUsers));
      }
    },
    [userService, usersState.data, executeUsersOperation]
  );

  const searchUsers = useCallback(
    async (query: string) => {
      return userService.searchUsers(query);
    },
    [userService]
  );

  // Load users on mount
  useEffect(() => {
    executeUsersOperation(fetchUsers());
  }, [executeUsersOperation, fetchUsers]);

  return {
    // State
    users: usersState.data,
    isLoadingUsers: usersState.isLoading,
    usersError: usersState.error,

    currentUser: userState.data,
    isLoadingUser: userState.isLoading,
    userError: userState.error,

    // Actions
    fetchUsers: (page?: number, limit?: number) =>
      executeUsersOperation(fetchUsers(page, limit)),
    fetchUser: (id: string) => executeUserOperation(fetchUser(id)),
    createUser: (userData: CreateUserRequest) =>
      executeUserOperation(createUser(userData)),
    updateUser: (id: string, userData: UpdateUserRequest) =>
      executeUserOperation(updateUser(id, userData)),
    deleteUser,
    searchUsers: (query: string) => executeUsersOperation(searchUsers(query)),
  };
}
