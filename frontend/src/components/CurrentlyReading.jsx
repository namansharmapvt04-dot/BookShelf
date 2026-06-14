import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ProgressBar from './ProgressBar';

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Dashboard hero for books the user is actively reading.
 * Shows progress and lets the user log pages inline without leaving the page.
 */
export default function CurrentlyReading({ books, onUpdate, onToast }) {
  if (!books || books.length === 0) return null;

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Currently Reading</h2>
        <Link to="/shelf" style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
          View All →
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {books.map(book => (
          <ReadingCard key={book.id} book={book} onUpdate={onUpdate} onToast={onToast} />
        ))}
      </div>
    </section>
  );
}

function ReadingCard({ book, onUpdate, onToast }) {
  const [pages, setPages] = useState('');
  const [saving, setSaving] = useState(false);

  const pagesRead = book.total_pages_read || 0;
  const pageCount = book.page_count || 0;
  const percent = book.progress_percent || 0;
  const remaining = pageCount > 0 ? Math.max(pageCount - pagesRead, 0) : null;

  const logPages = async (e) => {
    e.preventDefault();
    const n = parseInt(pages, 10);
    if (!n || n < 1) return;
    setSaving(true);
    try {
      const res = await api.post('tracker/', {
        user_book: book.id,
        pages_read: n,
        date: today(),
        notes: '',
      });
      onUpdate(book.id, {
        total_pages_read: res.data.total_pages_read,
        progress_percent: res.data.progress_percent,
      });
      setPages('');
      const done = res.data.progress_percent >= 100;
      onToast?.({
        message: done ? `🎉 You finished ${book.title}!` : `Logged ${n} pages of ${book.title}`,
        type: 'success',
      });
    } catch {
      onToast?.({ message: 'Failed to log pages', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card" style={{ padding: '16px', display: 'flex', gap: '14px' }}>
      <Link
        to={`/book/${book.google_book_id}`}
        state={{ book }}
        style={{ flexShrink: 0, width: '72px', height: '108px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-secondary)', display: 'block' }}
      >
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem' }}>📖</div>
        )}
      </Link>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Link to={`/book/${book.google_book_id}`} state={{ book }} style={{ textDecoration: 'none', color: 'inherit' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.title}
          </h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {book.authors || 'Unknown Author'}
          </p>
        </Link>

        {pageCount > 0 ? (
          <ProgressBar percent={percent} label={`${pagesRead} / ${pageCount} pages`} />
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{pagesRead} pages read</p>
        )}

        {remaining !== null && remaining > 0 && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{remaining} pages left</p>
        )}

        <form onSubmit={logPages} style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
          <input
            type="number"
            min={1}
            value={pages}
            onChange={e => setPages(e.target.value)}
            placeholder="+ pages"
            className="input-field"
            style={{ flex: 1, padding: '6px 10px', fontSize: '13px' }}
          />
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || !pages}
            style={{ padding: '6px 14px', fontSize: '13px', opacity: saving || !pages ? 0.6 : 1 }}
          >
            {saving ? '...' : 'Log'}
          </button>
        </form>
      </div>
    </div>
  );
}
