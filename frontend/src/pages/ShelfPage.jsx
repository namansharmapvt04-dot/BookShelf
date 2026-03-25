import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Toast from '../components/Toast';

const FILTERS = [
  { value: '', label: 'All Books' },
  { value: 'reading', label: '📖 Reading' },
  { value: 'want_to_read', label: '🔖 Want to Read' },
  { value: 'completed', label: '✅ Completed' },
];

export default function ShelfPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [toast, setToast] = useState(null);

  const fetchShelf = async (statusFilter = filter) => {
    setLoading(true);
    try {
      const url = statusFilter ? `/shelf/?status=${statusFilter}` : '/shelf/';
      const res = await api.get(url);
      setBooks(res.data);
    } catch (err) {
      setToast({ message: 'Failed to load shelf', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchShelf(filter); }, [filter]);

  const handleStatusChange = async (bookId, newStatus) => {
    try {
      await api.patch(`/shelf/${bookId}/`, { status: newStatus });
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b));
      setToast({ message: 'Status updated!', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleDelete = async (bookId, title) => {
    if (!window.confirm(`Remove "${title}" from your shelf?`)) return;
    try {
      await api.delete(`/shelf/${bookId}/`);
      setBooks(prev => prev.filter(b => b.id !== bookId));
      setToast({ message: 'Book removed from shelf', type: 'success' });
    } catch {
      setToast({ message: 'Failed to remove book', type: 'error' });
    }
  };

  const displayed = filter ? books : books;

  return (
    <div className="page-enter">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            My <span className="gradient-text">Shelf</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {books.length} book{books.length !== 1 ? 's' : ''} on your shelf
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', cursor: 'pointer',
                fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.2s ease',
                background: filter === f.value ? 'var(--gradient-primary)' : 'var(--bg-card)',
                color: filter === f.value ? 'white' : 'var(--text-secondary)',
                border: `1px solid ${filter === f.value ? 'transparent' : 'var(--border)'}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="books-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div className="shimmer" style={{ aspectRatio: '2/3' }} />
              <div style={{ padding: '0.875rem', background: 'var(--bg-card)' }}>
                <div className="shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
                <div className="shimmer" style={{ height: 12, borderRadius: 4, width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>
            {filter ? `No books with status "${filter}"` : 'Your shelf is empty'}
          </p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Search for books to add them here
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {displayed.map(book => (
            <div key={book.id} style={{ position: 'relative' }}>
              <BookCard
                book={{ ...book, google_book_id: book.google_book_id }}
                shelfStatus={book.status}
                onStatusChange={(newStatus) => handleStatusChange(book.id, newStatus)}
              />
              <button
                onClick={() => handleDelete(book.id, book.title)}
                style={{
                  position: 'absolute', top: 44, right: 6,
                  background: 'rgba(255,107,157,0.15)', border: '1px solid rgba(255,107,157,0.3)',
                  color: 'var(--accent-secondary)', borderRadius: '6px',
                  width: 28, height: 28, cursor: 'pointer', fontSize: '0.8rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Remove from shelf"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
