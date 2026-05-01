import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard, { BookCardSkeleton } from '../components/BookCard';
import Toast from '../components/Toast';

const FILTERS = [
  { value: '', label: 'All Books' },
  { value: 'reading', label: 'Reading' },
  { value: 'want_to_read', label: 'Want to Read' },
  { value: 'completed', label: 'Completed' },
];

export default function ShelfPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState(null);

  const fetchShelf = async (statusFilter = filter) => {
    setLoading(true);
    try {
      const url = statusFilter ? `shelf/?status=${statusFilter}` : 'shelf/';
      const res = await api.get(url);
      setBooks(res.data);
    } catch {
      setToast({ message: 'Failed to load library', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShelf(filter); }, [filter]);

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await api.patch(`shelf/${bookId}/`, { status: newStatus });
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b));
      setToast({ message: 'Status updated!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const displayed = filter ? books : books; // In original it re-filtered, but the API query actually handled it

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your Library
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {books.length} book{books.length !== 1 ? 's' : ''} on your shelf
          </p>
        </div>

        {/* Filter Pill Segment */}
        <div style={{
          display: 'flex', gap: '4px', background: 'var(--bg-surface)', 
          padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)'
        }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '6px 16px', borderRadius: '4px',
                border: 'none', cursor: 'pointer', fontSize: '13px',
                fontWeight: 600, transition: 'all 0.2s ease',
                background: filter === f.value ? 'var(--bg-surface-active)' : 'transparent',
                color: filter === f.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: filter === f.value ? '0 1px 3px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        {loading ? (
          <div className="books-grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
            <svg style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              {filter ? `No books with status "${filter}"` : 'Your shelf is empty'}
            </p>
            <p style={{ fontSize: '14px' }}>
              Search for books to add them here.
            </p>
          </div>
        ) : (
          <div className="books-grid page-enter">
            {displayed.map(book => (
              <BookCard
                key={book.id}
                book={{ ...book, google_book_id: book.google_book_id }}
                shelfStatus={book.status}
                onStatusChange={(newStatus) => handleStatusChange(book.id, newStatus)}
              />
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
