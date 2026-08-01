'use client';

import { SOLIDPrinciplesDemo } from '@/components/users/SOLIDPrinciplesDemo';
import { UserForm } from '@/components/users/UserForm';
import { UserList } from '@/components/users/UserList';
import type { UserRole } from '@/domain/user/entities';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useEffect } from 'react';

export default function UsersPage(): JSX.Element {
  const {
    users,
    loading,
    error,
    isCreating,
    loadUsers,
    createUser,
    deactivateUser,
    clearError,
  } = useUserManagement();

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (data: {
    email: string;
    name: string;
    role: UserRole;
  }) => {
    return await createUser(data.email, data.name, data.role);
  };

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h1 className='mb-4 text-4xl font-bold text-gray-900'>
          User Management
        </h1>
        <p className='mx-auto max-w-3xl text-xl text-gray-600'>
          Demonstrating our modular architecture with CQRS, Domain-Driven
          Design, and SOLID principles in action.
        </p>
      </div>

      {error && (
        <div className='rounded-md bg-red-50 p-4 border border-red-200'>
          <div className='flex items-center justify-between'>
            <div className='text-sm text-red-700'>{error}</div>
            <button
              onClick={clearError}
              className='text-sm text-red-500 hover:text-red-700'
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <UserForm isCreating={isCreating} onSubmit={handleCreateUser} />

      <UserList
        users={users}
        loading={loading}
        onDeactivateUser={deactivateUser}
      />

      <SOLIDPrinciplesDemo />
    </div>
  );
}
