'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiSearch, FiTrash2, FiUsers } from 'react-icons/fi';
import { userService } from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface LibraryUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  status: string;
  date_joined: string;
}

interface NewUserForm {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  password: string;
  password2: string;
}

export default function UsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    user_type: 'student',
    password: '',
    password2: '',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers(searchQuery ? { search: searchQuery } : undefined);
      setUsers(data.results || data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.is_staff) return;

    const timer = setTimeout(() => {
      fetchUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, user?.is_staff]);

  const resetForm = () => {
    setNewUserForm({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      user_type: 'student',
      password: '',
      password2: '',
    });
    setSubmitError('');
  };

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError('');

    try {
      await userService.createUser(newUserForm);
      await fetchUsers();
      setShowAddModal(false);
      resetForm();
    } catch (error: any) {
      const message = error?.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to create user.';
      setSubmitError(message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Delete this user?')) return;

    try {
      await userService.deleteUser(id);
      await fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  if (!user?.is_staff) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Only staff can manage users.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Add and manage library users</p>
        </div>
        <button
          className="btn btn-primary inline-flex items-center gap-2"
          onClick={() => {
            setShowAddModal(true);
            setSubmitError('');
          }}
        >
          <FiPlus />
          Add User
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative max-w-lg">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="mx-auto text-5xl text-gray-300 mb-3" />
            <h3 className="text-xl font-semibold text-gray-700">No users found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-3 pr-3">Name</th>
                  <th className="py-3 pr-3">Username</th>
                  <th className="py-3 pr-3">Email</th>
                  <th className="py-3 pr-3">Type</th>
                  <th className="py-3 pr-3">Status</th>
                  <th className="py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((rowUser) => (
                  <tr key={rowUser.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-3 text-gray-900 font-medium">
                      {rowUser.first_name} {rowUser.last_name}
                    </td>
                    <td className="py-3 pr-3 text-gray-700">{rowUser.username}</td>
                    <td className="py-3 pr-3 text-gray-700">{rowUser.email}</td>
                    <td className="py-3 pr-3 text-gray-700 capitalize">{rowUser.user_type}</td>
                    <td className="py-3 pr-3">
                      <span
                        className={`badge ${
                          rowUser.status === 'active' ? 'badge-success' : 'badge-warning'
                        }`}
                      >
                        {rowUser.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteUser(rowUser.id)}
                        title="Delete user"
                        disabled={rowUser.id === user.id}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowAddModal(false);
            resetForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add User</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleCreateUser}>
                {submitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="First name"
                    value={newUserForm.first_name}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, first_name: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    placeholder="Last name"
                    value={newUserForm.last_name}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, last_name: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Username"
                    value={newUserForm.username}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, username: e.target.value }))
                    }
                    required
                  />
                  <select
                    className="input"
                    value={newUserForm.user_type}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, user_type: e.target.value }))
                    }
                    required
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="external">External</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>

                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    type="password"
                    placeholder="Password"
                    value={newUserForm.password}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    required
                  />
                  <input
                    className="input"
                    type="password"
                    placeholder="Confirm password"
                    value={newUserForm.password2}
                    onChange={(e) =>
                      setNewUserForm((prev) => ({ ...prev, password2: e.target.value }))
                    }
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitLoading}>
                    {submitLoading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
