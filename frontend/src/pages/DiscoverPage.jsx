import { useState, useEffect } from 'react';
import api from '../api/axios';
import BookCard, { BookCardSkeleton } from '../components/BookCard';
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

  if (loading) {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ marginBottom: '16px' }}>
          <div className="shimmer" style={{ width: '200px', height: '32px', marginBottom: '8px', borderRadius: '4px' }} />
          <div className="shimmer" style={{ width: '300px', height: '16px', borderRadius: '4px' }} />
        </div>
        <section>
          <div className="shimmer" style={{ width: '150px', height: '24px', marginBottom: '16px', borderRadius: '4px' }} />
          <div className="horizontal-scroll">
            {[1, 2, 3, 4, 5].map(i => <BookCardSkeleton key={i} />)}
          </div>
        </section>
        <section>
          <div className="shimmer" style={{ width: '180px', height: '24px', marginBottom: '16px', borderRadius: '4px' }} />
          <div className="horizontal-scroll">
            {[1, 2, 3, 4, 5].map(i => <BookCardSkeleton key={i} />)}
          </div>
        </section>
      </div>
    );
  }

  // Determine empty overall state
  const hasPopular = data?.popular_in_community?.length > 0;
  const hasRecommendations = data?.recommendations?.length > 0;

  if (!hasPopular && !hasRecommendations) {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
        <svg style={{ width: '48px', height: '48px', marginBottom: '16px', opacity: 0.5 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <p style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Build your recommendations
        </p>
        <p style={{ fontSize: '14px' }}>
          Complete more books to get smart, personalized suggestions based on your reading.
        </p>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '-16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Discover
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Smart suggestions based on your reading history and community trends.
        </p>
        
        {data?.based_on_categories?.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>Influenced by:</span>
            {data.based_on_categories.map((cat, i) => (
              <span key={i} style={{
                padding: '4px 12px', borderRadius: '100px',
                background: 'var(--bg-surface)', color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)', fontSize: '12px', fontWeight: 600
              }}>
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Popular in community mapped as Trending */}
      {hasPopular && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Trending</h2>
          </div>
          <div className="horizontal-scroll">
            {data.popular_in_community.slice(0, 10).map((book, i) => (
              <div key={book.google_book_id} style={{ minWidth: '160px', maxWidth: '180px', flexShrink: 0, position: 'relative' }}>
                <BookCard 
                  book={book} 
                  onAddToShelf={adding === book.google_book_id ? null : handleAddToShelf} 
                />
                <span style={{
                  position: 'absolute', top: -10, left: -10, zIndex: 5,
                  background: 'var(--bg-surface)', color: 'var(--text-primary)',
                  width: '28px', height: '28px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, border: '1px solid var(--border-subtle)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)', fontSize: '13px'
                }}>
                  {i + 1}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations grid mapped as Based on Your Reading */}
      {hasRecommendations && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Based on Your Reading</h2>
          </div>
          <div className="books-grid">
            {data.recommendations.map(book => (
              <BookCard
                key={book.google_book_id}
                book={book}
                onAddToShelf={adding === book.google_book_id ? null : handleAddToShelf}
              />
            ))}
          </div>
        </section>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
