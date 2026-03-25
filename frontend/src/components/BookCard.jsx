import { useNavigate } from 'react-router-dom';

const STATUS_LABELS = {
  want_to_read: 'Want to Read',
  reading: 'Reading',
  completed: 'Completed',
};

export default function BookCard({ book, onAddToShelf, shelfStatus, onStatusChange, compact = false }) {
  const navigate = useNavigate();
  const thumbnail = book.thumbnail || book.imageLinks?.thumbnail || '';
  const title = book.title || 'Unknown Title';
  const authors = book.authors || 'Unknown Author';
  const googleBookId = book.google_book_id || book.id || book.googleBookId;

  return (
    <div
      className="card"
      style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={() => navigate(`/book/${googleBookId}`, { state: { book } })}
    >
      {/* Cover */}
      <div style={{
        position: 'relative', aspectRatio: '2/3', overflow: 'hidden',
        background: 'var(--bg-secondary)',
      }}>
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: 'var(--gradient-primary)', fontSize: '3rem'
          }}>📖</div>
        )}
        {/* Status badge overlay */}
        {shelfStatus && (
          <div style={{ position: 'absolute', top: 8, right: 8 }}>
            <span className={`badge badge-${shelfStatus}`}>
              {STATUS_LABELS[shelfStatus] || shelfStatus}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{
          fontSize: compact ? '0.8rem' : '0.88rem', fontWeight: 700, color: 'var(--text-primary)',
          lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>{title}</h3>
        <p style={{
          fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>{authors}</p>

        {/* Actions */}
        <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }} onClick={e => e.stopPropagation()}>
          {onStatusChange && shelfStatus ? (
            <select
              value={shelfStatus}
              onChange={e => onStatusChange(e.target.value)}
              style={{
                width: '100%', padding: '0.4rem 0.5rem', borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-primary)', color: 'var(--text-primary)',
                border: '1px solid var(--border)', fontSize: '0.75rem', cursor: 'pointer'
              }}
            >
              <option value="want_to_read">Want to Read</option>
              <option value="reading">Reading</option>
              <option value="completed">Completed</option>
            </select>
          ) : onAddToShelf ? (
            <button
              onClick={() => onAddToShelf(book)}
              className="btn-primary"
              style={{ width: '100%', padding: '0.5rem', fontSize: '0.78rem' }}
            >
              + Add to Shelf
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
