'use client';

import { useState, useEffect } from 'react';
import {
  FiSearch,
  FiBook,
  FiUser,
  FiBookOpen,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import {
  bookService,
  categoryService,
  reservationService,
  transactionService,
} from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { formatDate, getBookStatusBadge } from '@/lib/utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const ASSET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  category: any;
  category_name?: string;
  status: string;
  available_copies: number;
  total_copies: number;
  description: string;
  publisher: string;
  publication_date: string;
  cover_image?: string;
}

interface NewBookForm {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  location: string;
  call_number: string;
  total_copies: number;
  available_copies: number;
  status: string;
  category: string;
}

const getCoverSrc = (cover?: string) => {
  if (!cover) return '';
  if (cover.startsWith('http://') || cover.startsWith('https://')) return cover;
  const needsSlash = !cover.startsWith('/');
  return `${ASSET_BASE_URL}${needsSlash ? '/' : ''}${cover}`;
};

function BookCover({
  coverImage,
  title,
  author,
}: {
  coverImage?: string;
  title: string;
  author: string;
}) {
  const [failed, setFailed] = useState(false);
  const coverSrc = getCoverSrc(coverImage);

  if (!coverSrc || failed) {
    return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center justify-center px-4 text-center">
      <FiBook className="text-3xl text-primary-400 mb-2" />
        <p className="text-sm font-semibold text-gray-800 line-clamp-2">{title}</p>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{author}</p>
      </div>
    );
  }

  return (
    <img
      src={coverSrc}
      alt={title}
      className="w-full h-full object-contain bg-white"
      onError={() => setFailed(true)}
    />
  );
}

export default function BooksPage() {
  const { user } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [bookSubmitLoading, setBookSubmitLoading] = useState(false);
  const [bookSubmitError, setBookSubmitError] = useState('');
  const [newBookForm, setNewBookForm] = useState<NewBookForm>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    location: '',
    call_number: '',
    total_copies: 1,
    available_copies: 1,
    status: 'available',
    category: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      if (selectedStatus) params.status = selectedStatus;
      
      const data = await bookService.getBooks(params);
      setBooks(data.results || data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data.results || data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    setActionError('');
    setActionSuccess('');
  }, [selectedBook?.id]);

  const handleIssueBook = async () => {
    if (!selectedBook || !user) {
      setActionError('Please sign in to issue a book.');
      return;
    }

    setActionError('');
    setActionSuccess('');
    setActionLoading(true);
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      if (user.is_staff) {
        await transactionService.issueBook({
          user: user.id,
          book: selectedBook.id,
          due_date: dueDate.toISOString().slice(0, 10),
        });
      } else {
        await transactionService.createTransaction({
          user: user.id,
          book: selectedBook.id,
          due_date: dueDate.toISOString().slice(0, 10),
        });
      }

      await fetchBooks();
      setActionSuccess('Book issued successfully.');
      setSelectedBook(null);
    } catch (error: any) {
      const message = error?.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to issue book. Please try again.';
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserveBook = async () => {
    if (!selectedBook || !user) {
      setActionError('Please sign in to reserve a book.');
      return;
    }

    setActionError('');
    setActionSuccess('');
    setActionLoading(true);
    try {
      await reservationService.createReservation(selectedBook.id);
      setActionSuccess('Book added to your waitlist successfully.');
      await fetchBooks();
    } catch (error: any) {
      const message = error?.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to add to waitlist. Please try again.';
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const resetBookForm = () => {
    setNewBookForm({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      location: '',
      call_number: '',
      total_copies: 1,
      available_copies: 1,
      status: 'available',
      category: '',
    });
    setBookSubmitError('');
  };

  const handleCreateBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBookSubmitError('');
    setBookSubmitLoading(true);

    const availableCopies = Math.min(newBookForm.available_copies, newBookForm.total_copies);

    try {
      await bookService.createBook({
        title: newBookForm.title,
        author: newBookForm.author,
        isbn: newBookForm.isbn,
        publisher: newBookForm.publisher,
        location: newBookForm.location,
        call_number: newBookForm.call_number,
        total_copies: newBookForm.total_copies,
        available_copies: availableCopies,
        status: newBookForm.status,
        category: newBookForm.category ? Number(newBookForm.category) : null,
      });

      await fetchBooks();
      setShowAddBookModal(false);
      resetBookForm();
    } catch (error: any) {
      const message = error?.response?.data
        ? JSON.stringify(error.response.data)
        : 'Failed to add book.';
      setBookSubmitError(message);
    } finally {
      setBookSubmitLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!user?.is_staff) {
      alert('Only staff users can delete books.');
      return;
    }
    if (!confirm('Delete this book from catalog?')) return;

    try {
      await bookService.deleteBook(bookId);
      await fetchBooks();
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Catalog</h1>
          <p className="text-gray-600">Browse and search our extensive book collection</p>
        </div>
        <button
          className="btn btn-primary inline-flex items-center gap-2"
          onClick={() => {
            if (!user?.is_staff) {
              alert('Only staff users can add books.');
              return;
            }
            setShowAddBookModal(true);
            setBookSubmitError('');
          }}
        >
          <FiPlus />
          Add Book
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, author, ISBN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="issued">Issued</option>
              <option value="reserved">Reserved</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-12">
          <FiBookOpen className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => {
            const statusBadge = getBookStatusBadge(book.status);
            return (
              <div
                key={book.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden group"
                onClick={() => setSelectedBook(book)}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center relative overflow-hidden">
                  <BookCover
                    coverImage={book.cover_image}
                    title={book.title}
                    author={book.author}
                  />
                  <button
                    type="button"
                    className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center shadow ${
                      user?.is_staff
                        ? 'bg-white/90 hover:bg-red-50 text-gray-600 hover:text-red-600'
                        : 'bg-white/70 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteBook(book.id);
                    }}
                    title={user?.is_staff ? 'Delete book' : 'Only staff can delete books'}
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <div className="absolute top-2 right-2">
                    <span className={`badge ${statusBadge.className}`}>
                      {statusBadge.text}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary-600 transition">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <FiUser className="text-xs" />
                    {book.author}
                  </p>
                  
                  {book.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {book.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      Available: <span className="font-semibold text-primary-600">
                        {book.available_copies}/{book.total_copies}
                      </span>
                    </span>
                    {(book.category?.name || book.category_name) && (
                      <span className="badge badge-info text-xs">
                        {book.category?.name || book.category_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedBook(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedBook.title}</h2>
                <button
                  onClick={() => setSelectedBook(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <div className="aspect-[3/4] max-w-xs mx-auto bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg overflow-hidden shadow-sm">
                  <BookCover
                    coverImage={selectedBook.cover_image}
                    title={selectedBook.title}
                    author={selectedBook.author}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {actionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {actionError}
                  </div>
                )}
                {actionSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {actionSuccess}
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Author</label>
                  <p className="text-gray-900">{selectedBook.author}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">ISBN</label>
                    <p className="text-gray-900">{selectedBook.isbn}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Publisher</label>
                    <p className="text-gray-900">{selectedBook.publisher}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Publication Date</label>
                    <p className="text-gray-900">{formatDate(selectedBook.publication_date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">
                      {selectedBook.category?.name || selectedBook.category_name || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <p>
                      <span className={`badge ${getBookStatusBadge(selectedBook.status).className}`}>
                        {getBookStatusBadge(selectedBook.status).text}
                      </span>
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Copies</label>
                    <p className="text-gray-900">
                      {selectedBook.available_copies} available of {selectedBook.total_copies}
                    </p>
                  </div>
                </div>

                {selectedBook.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900 leading-relaxed">{selectedBook.description}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {selectedBook.available_copies > 0 ? (
                    <>
                      <button
                        className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleIssueBook}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Issuing...' : 'Issue Book'}
                      </button>
                      <button
                        className="btn btn-outline flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={actionLoading}
                        onClick={handleReserveBook}
                      >
                        {actionLoading ? 'Please wait...' : 'Reserve'}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-outline w-full disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleReserveBook}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Adding...' : 'Add to Waitlist'}
                    </button>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    className={`btn w-full border-2 ${
                      user?.is_staff
                        ? 'border-red-500 text-red-600 hover:bg-red-50'
                        : 'border-gray-300 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => handleDeleteBook(selectedBook.id)}
                  >
                    <FiTrash2 className="inline-block mr-2" />
                    Delete Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddBookModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowAddBookModal(false);
            resetBookForm();
          }}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Book</h2>
                <button
                  onClick={() => {
                    setShowAddBookModal(false);
                    resetBookForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={handleCreateBook}>
                {bookSubmitError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {bookSubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Title"
                    value={newBookForm.title}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <input
                    className="input"
                    placeholder="Author"
                    value={newBookForm.author}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, author: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="ISBN (13 digits)"
                    value={newBookForm.isbn}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, isbn: e.target.value }))}
                    required
                  />
                  <input
                    className="input"
                    placeholder="Publisher"
                    value={newBookForm.publisher}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, publisher: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    className="input"
                    placeholder="Location (Shelf)"
                    value={newBookForm.location}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, location: e.target.value }))}
                    required
                  />
                  <input
                    className="input"
                    placeholder="Call Number"
                    value={newBookForm.call_number}
                    onChange={(e) => setNewBookForm((prev) => ({ ...prev, call_number: e.target.value }))}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      className="input"
                      value={newBookForm.category}
                      onChange={(e) => setNewBookForm((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="">None</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
                    <input
                      className="input"
                      type="number"
                      min={1}
                      value={newBookForm.total_copies}
                      onChange={(e) =>
                        setNewBookForm((prev) => ({
                          ...prev,
                          total_copies: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Available Copies</label>
                    <input
                      className="input"
                      type="number"
                      min={0}
                      value={newBookForm.available_copies}
                      onChange={(e) =>
                        setNewBookForm((prev) => ({
                          ...prev,
                          available_copies: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowAddBookModal(false);
                      resetBookForm();
                    }}
                    disabled={bookSubmitLoading}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={bookSubmitLoading}>
                    {bookSubmitLoading ? 'Adding...' : 'Add Book'}
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
