'use client';

import { ErrorDisplay } from '@/components/ui';
import { ArchitectureInfo } from '@/components/users/ArchitectureInfo';
import { SOLIDPrinciplesDemo } from '@/components/users/SOLIDPrinciplesDemo';
import { UserForm } from '@/components/users/UserForm';
import { UserList } from '@/components/users/UserList';
import { useUserManagement } from '@/hooks/useUserManagement';
import { useEffect } from 'react';

// Opt out of static generation for this page
export const dynamic = 'force-dynamic';

/**
 * Users page component - now follows Single Responsibility Principle
 * Responsibility: Orchestrate user management UI components
 */
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
    role: string;
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

      <ArchitectureInfo />

      <ErrorDisplay error={error} onDismiss={clearError} />

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
