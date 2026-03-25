import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProgressBar from '../components/ProgressBar';

const STAT_CARDS = [
  { key: 'total_books', label: 'Total Books', icon: '📚', color: '#6c63ff' },
  { key: 'reading', label: 'Reading', icon: '📖', color: '#00d4aa' },
  { key: 'completed', label: 'Completed', icon: '✅', color: '#6c63ff' },
  { key: 'want_to_read', label: 'Want to Read', icon: '🔖', color: '#ff6b9d' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="page-enter">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="shimmer" style={{ height: 120, borderRadius: 'var(--radius-lg)' }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-enter">
      {/* Welcome */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
          Good reading, <span className="gradient-text">{user?.username || 'Reader'}!</span> 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Here's your reading summary
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {STAT_CARDS.map(({ key, label, icon, color }) => (
          <div key={key} className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem' }}>{icon}</span>
              <span style={{
                fontSize: '1.8rem', fontWeight: 800,
                background: `linear-gradient(135deg, ${color}, ${color}aa)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
              }}>
                {data?.[key] ?? 0}
              </span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Reading goal */}
      {data && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>📎 Annual Reading Goal</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {data.completed} / {data.reading_goal} books
            </span>
          </div>
          <ProgressBar percent={data.goal_progress_percent} label={`${data.goal_progress_percent}% of your goal`} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent Activity */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>⚡ Recent Activity</h3>
          {data?.recent_activity?.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.recent_activity.map((a, i) => (
                <div key={i} style={{
                  padding: '0.75rem', background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--accent-primary)'
                }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {a.book_title}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Read {a.pages_read} pages · {new Date(a.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</p>
              <p style={{ fontSize: '0.88rem' }}>No reading sessions yet</p>
              <Link to="/search" style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                Find a book to start →
              </Link>
            </div>
          )}
        </div>

        {/* Top Categories */}
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>🏷️ Top Categories</h3>
          {data?.top_categories?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {data.top_categories.map((cat, i) => (
                <span key={i} style={{
                  padding: '0.4rem 0.875rem', borderRadius: '100px',
                  background: `rgba(108, 99, 255, ${0.1 + i * 0.05})`,
                  color: 'var(--accent-primary)', border: '1px solid rgba(108,99,255,0.25)',
                  fontSize: '0.82rem', fontWeight: 600
                }}>
                  {cat}
                </span>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Complete some books to see your favorite categories
            </p>
          )}

          {/* Quick links */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/search" className="btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.65rem' }}>
              Search Books
            </Link>
            <Link to="/discover" className="btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', padding: '0.65rem' }}>
              Discover →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
