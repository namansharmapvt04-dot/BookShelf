import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookCard, { BookCardSkeleton } from '../components/BookCard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [discoverData, setDiscoverData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/shelf/').catch(() => ({ data: [] })),
      api.get('/discover/').catch(() => ({ data: { recommendations: [] } }))
    ])
      .then(([shelfRes, discoverRes]) => {
        setBooks(shelfRes.data || []);
        // Safely extract recommendations specifically for the Dashboard
        setDiscoverData(discoverRes.data?.recommendations || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const currentlyReading = books.filter(b => b.status === 'reading');
  const wantToRead = books.filter(b => b.status === 'want_to_read');
  const recentlyAdded = [...books].reverse().slice(0, 8); // Mocking recent for visual layout

  if (loading) {
    return (
      <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <section>
          <div className="shimmer" style={{ width: '200px', height: '24px', marginBottom: '16px', borderRadius: '4px' }} />
          <div className="horizontal-scroll">
            {[1, 2, 3, 4, 5].map(i => <BookCardSkeleton key={i} />)}
          </div>
        </section>
      </div>
    );
  }

  // --- Empty State ---
  if (books.length === 0) {
    return (
      <div className="page-enter" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: '440px' }}>
          <svg style={{ width: '64px', height: '64px', margin: '0 auto 24px', color: 'var(--text-muted)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Your library is empty
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.5 }}>
            Discover millions of books, track your reading progress, and build your digital shelf.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/search" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 24px' }}>
              Explore Books
            </Link>
            <Link to="/discover" className="btn-primary" style={{ display: 'inline-block', textDecoration: 'none', padding: '12px 24px' }}>
              Discover Recommendations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
      
      {/* Header Profile Greeting */}
      <div style={{ marginBottom: '-16px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
          Welcome back, {user?.username || 'Reader'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Ready to dive back in?
        </p>
      </div>

      {currentlyReading.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Continue Reading</h2>
          </div>
          <div className="horizontal-scroll">
            {currentlyReading.map(book => (
              <div key={book.id} style={{ minWidth: '160px', maxWidth: '180px', flexShrink: 0 }}>
                <BookCard book={book} shelfStatus={book.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {wantToRead.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Up Next</h2>
            <Link to="/shelf" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>View All →</Link>
          </div>
          <div className="horizontal-scroll">
            {wantToRead.map(book => (
              <div key={book.id} style={{ minWidth: '160px', maxWidth: '180px', flexShrink: 0 }}>
                <BookCard book={book} shelfStatus={book.status} />
              </div>
            ))}
          </div>
        </section>
      )}

      {discoverData.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Discover New Books</h2>
            <Link to="/discover" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>More Suggestions →</Link>
          </div>
          <div className="horizontal-scroll">
            {discoverData.map(book => (
              <div key={book.google_book_id} style={{ minWidth: '160px', maxWidth: '180px', flexShrink: 0 }}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </section>
      )}

      {recentlyAdded.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Recently Added</h2>
            <Link to="/shelf" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>Library →</Link>
          </div>
          <div className="books-grid">
            {recentlyAdded.map(book => (
              <BookCard key={book.id} book={book} shelfStatus={book.status} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
