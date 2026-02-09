'use client';

import { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiBook,
  FiUsers,
  FiClock,
  FiDollarSign,
  FiArrowUp,
  FiArrowDown,
  FiCalendar,
  FiActivity,
} from 'react-icons/fi';
import { bookService, transactionService } from '@/lib/api';

interface Stats {
  totalBooks: number;
  availableBooks: number;
  issuedBooks: number;
  totalMembers: number;
  activeTransactions: number;
  overdueBooks: number;
  totalFines: number;
  thisMonthIssues: number;
  trend: {
    books: number;
    members: number;
    issues: number;
  };
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    availableBooks: 0,
    issuedBooks: 0,
    totalMembers: 0,
    activeTransactions: 0,
    overdueBooks: 0,
    totalFines: 0,
    thisMonthIssues: 0,
    trend: { books: 0, members: 0, issues: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [bookStats, transStats] = await Promise.all([
        bookService.getStatistics(),
        transactionService.getStatistics(),
      ]);

      setStats({
        totalBooks: bookStats.total_books || 0,
        availableBooks: bookStats.available_books || 0,
        issuedBooks: bookStats.issued_books || 0,
        totalMembers: 1234, // Mock data
        activeTransactions: transStats.active_transactions || 0,
        overdueBooks: transStats.overdue_transactions || 0,
        totalFines: transStats.total_unpaid_fines || 0,
        thisMonthIssues: 245, // Mock data
        trend: {
          books: 12.5,
          members: 8.3,
          issues: -3.2,
        },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Books',
      value: stats.totalBooks,
      change: stats.trend.books,
      icon: <FiBook className="text-2xl" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Active Members',
      value: stats.totalMembers,
      change: stats.trend.members,
      icon: <FiUsers className="text-2xl" />,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Books Issued',
      value: stats.issuedBooks,
      change: stats.trend.issues,
      icon: <FiClock className="text-2xl" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Overdue Books',
      value: stats.overdueBooks,
      change: -15.2,
      icon: <FiActivity className="text-2xl" />,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your library's performance and insights</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="input px-4 py-2 pr-10"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
            <button className="btn btn-primary flex items-center gap-2">
              <FiCalendar />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <div className={card.textColor}>{card.icon}</div>
              </div>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  card.change >= 0
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {card.change >= 0 ? (
                  <FiArrowUp className="text-sm" />
                ) : (
                  <FiArrowDown className="text-sm" />
                )}
                {Math.abs(card.change)}%
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : card.value.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Available Books</p>
                <p className="text-2xl font-bold text-green-600">{stats.availableBooks}</p>
              </div>
              <div className="text-3xl text-green-600">📚</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Pending Fines</p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${stats.totalFines.toFixed(2)}
                </p>
              </div>
              <FiDollarSign className="text-3xl text-yellow-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-indigo-600">{stats.thisMonthIssues}</p>
              </div>
              <FiTrendingUp className="text-3xl text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              {
                action: 'Book Issued',
                book: 'The Great Gatsby',
                user: 'John Doe',
                time: '5 minutes ago',
                type: 'issue',
              },
              {
                action: 'Book Returned',
                book: 'To Kill a Mockingbird',
                user: 'Jane Smith',
                time: '1 hour ago',
                type: 'return',
              },
              {
                action: 'New Member',
                book: 'Registration',
                user: 'Mike Johnson',
                time: '2 hours ago',
                type: 'member',
              },
              {
                action: 'Book Reserved',
                book: '1984',
                user: 'Sarah Wilson',
                time: '3 hours ago',
                type: 'reserve',
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'issue'
                        ? 'bg-blue-100 text-blue-600'
                        : activity.type === 'return'
                        ? 'bg-green-100 text-green-600'
                        : activity.type === 'member'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-orange-100 text-orange-600'
                    }`}
                  >
                    {activity.type === 'issue' ? '📤' : activity.type === 'return' ? '📥' : activity.type === 'member' ? '👤' : '🔖'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">
                      {activity.book} • {activity.user}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Books & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Books */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Most Borrowed Books</h3>
          <div className="space-y-3">
            {[
              { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', count: 45 },
              { title: 'To Kill a Mockingbird', author: 'Harper Lee', count: 38 },
              { title: '1984', author: 'George Orwell', count: 32 },
              { title: 'Pride and Prejudice', author: 'Jane Austen', count: 28 },
              { title: 'The Catcher in the Rye', author: 'J.D. Salinger', count: 24 },
            ].map((book, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary-600">{book.count} issues</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Categories</h3>
          <div className="space-y-4">
            {[
              { name: 'Fiction', count: 1245, percentage: 35, color: 'bg-blue-500' },
              { name: 'Science', count: 892, percentage: 25, color: 'bg-green-500' },
              { name: 'History', count: 654, percentage: 18, color: 'bg-purple-500' },
              { name: 'Technology', count: 445, percentage: 12, color: 'bg-orange-500' },
              { name: 'Arts', count: 356, percentage: 10, color: 'bg-pink-500' },
            ].map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  <span className="text-sm text-gray-600">
                    {category.count} books ({category.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
