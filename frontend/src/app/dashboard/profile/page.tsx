'use client';

import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiBook, FiClock, FiEdit } from 'react-icons/fi';
import { useAuthStore } from '@/lib/store';
import { authService, transactionService } from '@/lib/api';
import { formatDate, getUserTypeBadge } from '@/lib/utils';

export default function ProfilePage() {
  const { user, loadUser } = useAuthStore();
  const [stats, setStats] = useState({
    activeTransactions: 0,
    totalTransactions: 0,
    overdueBooks: 0,
    totalFines: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone_number: user.phone_number || '',
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
  try {
    const res = await transactionService.getTransactions();
    const transactions = Array.isArray(res) ? res : res.results || [];

    const active = transactions.filter((t: any) => !t.return_date);
    const overdue = transactions.filter((t: any) => t.is_overdue);
    const totalFines = transactions.reduce(
      (sum: number, t: any) => sum + parseFloat(t.fine_amount || 0),
      0
    );

    setStats({
      activeTransactions: active.length,
      totalTransactions: transactions.length,
      overdueBooks: overdue.length,
      totalFines,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    // fallback in case of error
    setStats({
      activeTransactions: 0,
      totalTransactions: 0,
      overdueBooks: 0,
      totalFines: 0,
    });
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.updateProfile(formData);
      await loadUser();
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const userTypeBadge = getUserTypeBadge(user.user_type);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your account information and view your library activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.first_name[0]}{user.last_name[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600">@{user.username}</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="btn btn-outline flex items-center gap-2"
            >
              <FiEdit />
              {editMode ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {editMode ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="input"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full">
                Save Changes
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiMail className="text-lg" />
                    Email
                  </label>
                  <p className="text-gray-900 mt-1">{user.email}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiPhone className="text-lg" />
                    Phone
                  </label>
                  <p className="text-gray-900 mt-1">{user.phone_number || 'Not provided'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiUser className="text-lg" />
                    User Type
                  </label>
                  <span className={`badge ${userTypeBadge.className} mt-1`}>
                    {userTypeBadge.text}
                  </span>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiBook className="text-lg" />
                    Library Card
                  </label>
                  <p className="text-gray-900 mt-1">{user.library_card_number || 'Not assigned'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiCalendar className="text-lg" />
                    Member Since
                  </label>
                  <p className="text-gray-900 mt-1">{formatDate(user.membership_start_date)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <FiBook className="text-lg" />
                    Books Limit
                  </label>
                  <p className="text-gray-900 mt-1">{user.max_books_allowed} books</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Library Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Active Books</p>
                  <p className="text-2xl font-bold text-primary-600">{stats.activeTransactions}</p>
                </div>
                <FiBook className="text-3xl text-primary-600" />
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-green-600">{stats.totalTransactions}</p>
                </div>
                <FiClock className="text-3xl text-green-600" />
              </div>

              {stats.overdueBooks > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Overdue Books</p>
                    <p className="text-2xl font-bold text-red-600">{stats.overdueBooks}</p>
                  </div>
                  <FiClock className="text-3xl text-red-600" />
                </div>
              )}

              {stats.totalFines > 0 && (
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Fines</p>
                    <p className="text-2xl font-bold text-yellow-600">${stats.totalFines.toFixed(2)}</p>
                  </div>
                  <FiClock className="text-3xl text-yellow-600" />
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Available Books</h3>
            <p className="text-3xl font-bold mb-2">
              {Math.max(
                  0,
                  (Number(user?.max_books_allowed) || 0) -
                  (Number(stats?.activeTransactions) || 0)
              )}
            </p>
            <p className="text-sm opacity-90">
              You can borrow {user.max_books_allowed - stats.activeTransactions} more book(s)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
