import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import React, { useState } from 'react';

interface UserFormData {
  email: string;
  name: string;
  role: string;
}

interface UserFormProps {
  isCreating: boolean;
  onSubmit: (data: UserFormData) => Promise<boolean>;
}

/**
 * User creation form component
 * Follows Single Responsibility Principle - only handles user form logic
 */
export function UserForm({ isCreating, onSubmit }: UserFormProps): JSX.Element {
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    name: '',
    role: 'user',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.name) return;

    const success = await onSubmit(formData);
    if (success) {
      // Reset form on successful creation
      setFormData({ email: '', name: '', role: 'user' });
    }
  };

  const updateField =
    (field: keyof UserFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Email
              </label>
              <input
                type='email'
                value={formData.email}
                onChange={updateField('email')}
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                required
                disabled={isCreating}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Name
              </label>
              <input
                type='text'
                value={formData.name}
                onChange={updateField('name')}
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                required
                disabled={isCreating}
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700'>
                Role
              </label>
              <select
                value={formData.role}
                onChange={updateField('role')}
                className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none'
                disabled={isCreating}
              >
                <option value='user'>User</option>
                <option value='admin'>Admin</option>
                <option value='moderator'>Moderator</option>
              </select>
            </div>
          </div>
          <button
            type='submit'
            disabled={isCreating || !formData.email || !formData.name}
            className='rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
          >
            {isCreating ? 'Creating...' : 'Create User'}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
