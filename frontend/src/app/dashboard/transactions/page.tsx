'use client';

import { useState, useEffect } from 'react';
import { FiClock, FiCheckCircle, FiAlertCircle, FiBook, FiCalendar } from 'react-icons/fi';
import { transactionService } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate, formatDateTime, getTransactionStatusBadge, getDaysUntil } from '@/lib/utils';

interface Transaction {
  id: number;
  book: any;
  user: any;
  issue_date: string;
  due_date: string;
  return_date?: string;
  status: string;
  fine_amount: number;
  fine_paid: boolean;
  is_overdue: boolean;
  days_overdue: number;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'overdue' | 'returned'>('active');
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTransactions();
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (activeTab) {
        case 'active':
          data = await transactionService.getActiveTransactions();
          break;
        case 'overdue':
          data = await transactionService.getOverdueTransactions();
          break;
        case 'returned':
          data = await transactionService.getTransactions({ status: 'returned' });
          break;
        default:
          data = await transactionService.getTransactions();
      }
      
      setTransactions(data.results || data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId: number) => {
    if (!confirm('Are you sure you want to mark this book as returned?')) return;
    
    try {
      await transactionService.returnBook(transactionId);
      fetchTransactions();
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  const tabs = [
    { id: 'active', label: 'Active', icon: <FiClock /> },
    { id: 'overdue', label: 'Overdue', icon: <FiAlertCircle /> },
    { id: 'returned', label: 'Returned', icon: <FiCheckCircle /> },
    { id: 'all', label: 'All', icon: <FiBook /> },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">View and manage book transactions</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Transactions List */}
        <div className="p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-6 animate-pulse h-32"></div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <FiBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No transactions found</h3>
              <p className="text-gray-500">There are no {activeTab} transactions</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => {
                const statusBadge = getTransactionStatusBadge(transaction.status);
                const daysUntilDue = getDaysUntil(transaction.due_date);
                
                return (
                  <div
                    key={transaction.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* Book Icon */}
                          <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FiBook className="text-2xl text-primary-600" />
                          </div>

                          {/* Transaction Details */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900">
                                {transaction.book?.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                by {transaction.book?.author}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm">
                              {user?.is_staff && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <span className="font-medium">User:</span>
                                  {transaction.user?.first_name} {transaction.user?.last_name}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-1 text-gray-600">
                                <FiCalendar className="text-xs" />
                                <span className="font-medium">Issued:</span>
                                {formatDate(transaction.issue_date)}
                              </div>

                              <div className="flex items-center gap-1 text-gray-600">
                                <FiCalendar className="text-xs" />
                                <span className="font-medium">Due:</span>
                                {formatDate(transaction.due_date)}
                                {!transaction.return_date && (
                                  <span className={`ml-1 ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                                    ({daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days left`})
                                  </span>
                                )}
                              </div>

                              {transaction.return_date && (
                                <div className="flex items-center gap-1 text-gray-600">
                                  <FiCheckCircle className="text-xs" />
                                  <span className="font-medium">Returned:</span>
                                  {formatDate(transaction.return_date)}
                                </div>
                              )}
                            </div>

                            {transaction.fine_amount > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="badge badge-danger">
                                  Fine: ${transaction.fine_amount.toFixed(2)}
                                  {transaction.fine_paid && ' (Paid)'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex flex-col items-end gap-3">
                        <span className={`badge ${statusBadge.className}`}>
                          {statusBadge.text}
                        </span>

                        {user?.is_staff && !transaction.return_date && (
                          <button
                            onClick={() => handleReturn(transaction.id)}
                            className="btn btn-primary text-sm px-4 py-2"
                          >
                            Mark as Returned
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
