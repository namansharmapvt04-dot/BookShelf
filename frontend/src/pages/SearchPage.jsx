import { useState, useCallback } from 'react';
import api from '../api/axios';
import BookCard from '../components/BookCard';
import Toast from '../components/Toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState(null);
  const [adding, setAdding] = useState(null);

  const handleSearch = useCallback(async (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await api.get(`/books/search/?q=${encodeURIComponent(query)}`);
      setResults(res.data.results || []);
    } catch {
      setToast({ message: 'Search failed. Check your connection.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [query]);

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
      setToast({ message: `"${book.title}" added to your shelf!`, type: 'success' });
    } catch (err) {
      const msg = err.response?.data?.non_field_errors?.[0] || 'Already on your shelf';
      setToast({ message: msg, type: 'error' });
    } finally {
      setAdding(null);
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
        Search <span className="gradient-text">Books</span>
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>
        Discover millions of books via Google Books
      </p>

      {/* Search Bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem' }}>
        <input
          id="search-input"
          type="text"
          className="input-field"
          placeholder='Try "Dune", "Harry Potter", "Science Fiction"...'
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ flex: 1, fontSize: '1rem' }}
          autoFocus
        />
        <button id="search-submit" type="submit" className="btn-primary" disabled={loading}
          style={{ padding: '0.85rem 2rem', whiteSpace: 'nowrap' }}>
          {loading ? '⏳' : '🔍 Search'}
        </button>
      </form>

      {/* Loading skeletons */}
      {loading && (
        <div className="books-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <div className="shimmer" style={{ aspectRatio: '2/3' }} />
              <div style={{ padding: '0.875rem', background: 'var(--bg-card)' }}>
                <div className="shimmer" style={{ height: 14, borderRadius: 4, marginBottom: 8 }} />
                <div className="shimmer" style={{ height: 12, borderRadius: 4, width: '70%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && results.length > 0 && (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Found {results.length} results for "{query}"
          </p>
          <div className="books-grid">
            {results.map(book => (
              <BookCard
                key={book.google_book_id}
                book={book}
                onAddToShelf={adding === book.google_book_id ? null : handleAddToShelf}
              />
            ))}
          </div>
        </>
      )}

      {/* No results */}
      {!loading && searched && results.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No books found</p>
          <p style={{ fontSize: '0.9rem' }}>Try a different search term</p>
        </div>
      )}

      {/* Initial state */}
      {!loading && !searched && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</p>
          <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Search for any book</p>
          <p style={{ fontSize: '0.9rem' }}>Powered by Google Books API</p>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
