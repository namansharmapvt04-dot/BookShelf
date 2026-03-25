import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Toast from '../components/Toast';

export default function DiscoverPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [adding, setAdding] = useState(null);

  useEffect(() => {
    api.get('/discover/')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAddToShelf = async (book) => {
    setAdding(book.google_book_id);
    try {
      await api.post('/shelf/', {
        google_book_id: book.google_book_id,
        title: book.title,
        authors: book.authors,
        thumbnail: book.thumbnail,
        page_count: book.page_count || 0,
        categories: book.categories || '',
        status: 'want_to_read',
      });
      setToast({ message: `"${book.title}" added to shelf!`, type: 'success' });
    } catch {
      setToast({ message: 'Already on your shelf', type: 'error' });
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="page-enter">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          ✦ <span className="gradient-text">Discover</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Personalized recommendations based on your reading history
        </p>
        {data?.based_on_categories?.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Based on:</span>
            {data.based_on_categories.map((cat, i) => (
              <span key={i} style={{
                padding: '0.2rem 0.65rem', borderRadius: 100,
                background: 'rgba(108,99,255,0.12)', color: 'var(--accent-primary)',
                border: '1px solid rgba(108,99,255,0.2)', fontSize: '0.78rem', fontWeight: 600
              }}>
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Popular in community */}
      {data?.popular_in_community?.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
            🔥 Popular in the Community
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.popular_in_community.slice(0, 5).map((book, i) => (
              <div key={book.google_book_id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{
                  fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-muted)',
                  minWidth: 28, textAlign: 'center'
                }}>
                  #{i + 1}
                </span>
                {book.thumbnail ? (
                  <img src={book.thumbnail} alt={book.title} style={{ width: 44, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                ) : (
                  <div style={{ width: 44, height: 60, borderRadius: 6, background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>📖</div>
                )}
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {book.title}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{book.authors}</p>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {book.count} readers
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations grid */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-secondary)' }}>
        📋 Recommended For You
      </h3>

      {loading ? (
        <div className="books-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div className="shimmer" style={{ aspectRatio: '2/3' }} />
              <div style={{ padding: '0.875rem', background: 'var(--bg-card)' }}>
                <div className="shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
                <div className="shimmer" style={{ height: 12, borderRadius: 4, width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : data?.recommendations?.length > 0 ? (
        <div className="books-grid">
          {data.recommendations.map(book => (
            <BookCard
              key={book.google_book_id}
              book={book}
              onAddToShelf={adding === book.google_book_id ? null : handleAddToShelf}
            />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>✦</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Build your recommendations</p>
          <p style={{ fontSize: '0.9rem' }}>Complete more books to get personalized suggestions</p>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
