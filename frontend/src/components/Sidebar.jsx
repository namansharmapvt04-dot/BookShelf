import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⊞' },
  { to: '/search', label: 'Search Books', icon: '⊕' },
  { to: '/shelf', label: 'My Shelf', icon: '◫' },
  { to: '/discover', label: 'Discover', icon: '✦' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40, borderRadius: '10px',
            background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem', boxShadow: '0 4px 15px rgba(108,99,255,0.4)'
          }}>📚</div>
          <div>
            <h1 className="gradient-text" style={{ fontSize: '1.1rem', fontWeight: 800, lineHeight: 1.2 }}>
              BookShelf
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              READING TRACKER
            </p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--gradient-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', fontWeight: 700, color: 'white', flexShrink: 0
            }}>
              {user.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.username}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Goal: {user.reading_goal || 12} books/yr
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 0.875rem', borderRadius: 'var(--radius-sm)',
              marginBottom: '0.25rem', textDecoration: 'none', fontWeight: 500,
              fontSize: '0.9rem', transition: 'all 0.2s ease',
              background: isActive ? 'rgba(108, 99, 255, 0.15)' : 'transparent',
              color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
              borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
            })}>
            <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', textAlign: 'center', fontSize: '0.85rem' }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
