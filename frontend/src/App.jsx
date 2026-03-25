import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import SearchPage from './pages/SearchPage';
import ShelfPage from './pages/ShelfPage';
import BookDetailPage from './pages/BookDetailPage';
import DiscoverPage from './pages/DiscoverPage';

function ProtectedLayout() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text-muted)', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', animation: 'pulse 1s infinite' }}>
        📚
      </div>
      <p style={{ fontSize: '0.9rem' }}>Loading BookShelf...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

function PublicLayoutWithSidebar() {
  const { user } = useAuth();
  return (
    <div className="app-layout">
      {user && <Sidebar />}
      <main className={user ? 'main-content' : ''} style={user ? {} : { padding: '2rem', maxWidth: '100vw', width: '100%' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth pages */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Book detail — public but shows sidebar if logged in */}
          <Route element={<PublicLayoutWithSidebar />}>
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/shelf" element={<ShelfPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
