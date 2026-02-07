'use client';

import { useState, useEffect } from 'react';
import { FiCalendar, FiBook, FiClock, FiX } from 'react-icons/fi';
import { reservationService } from '@/lib/api';
import { formatDateTime, formatDate } from '@/lib/utils';

interface Reservation {
  id: number;
  book: any;
  user: any;
  reservation_date: string;
  expiry_date: string;
  status: string;
  notified: boolean;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'fulfilled' | 'cancelled'>('active');

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const params = filter === 'all' ? {} : { status: filter };
      const data = await reservationService.getReservations(params);
      setReservations(data.results || data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
      await reservationService.cancelReservation(id);
      fetchReservations();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Failed to cancel reservation');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { text: string; className: string }> = {
      active: { text: 'Active', className: 'badge-info' },
      fulfilled: { text: 'Fulfilled', className: 'badge-success' },
      cancelled: { text: 'Cancelled', className: 'badge-danger' },
      expired: { text: 'Expired', className: 'badge-warning' },
    };
    return badges[status] || { text: status, className: 'badge-secondary' };
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservations</h1>
        <p className="text-gray-600">Manage your book reservations</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex gap-2">
          {(['all', 'active', 'fulfilled', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))
        ) : reservations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiCalendar className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No reservations found</h3>
            <p className="text-gray-500">You don't have any {filter !== 'all' && filter} reservations</p>
          </div>
        ) : (
          reservations.map((reservation) => {
            const statusBadge = getStatusBadge(reservation.status);
            
            return (
              <div
                key={reservation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FiBook className="text-2xl text-primary-600" />
                    </div>

                    <div className="flex-1 space-y-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {reservation.book?.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {reservation.book?.author}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiCalendar className="text-xs" />
                          <span className="font-medium">Reserved:</span>
                          {formatDate(reservation.reservation_date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiClock className="text-xs" />
                          <span className="font-medium">Expires:</span>
                          {formatDate(reservation.expiry_date)}
                        </div>
                      </div>

                      {reservation.notified && (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <FiCalendar />
                          Notification sent
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <span className={`badge ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>

                    {reservation.status === 'active' && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        className="btn btn-outline text-sm px-4 py-2 flex items-center gap-1 text-red-600 hover:bg-red-50"
                      >
                        <FiX />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
