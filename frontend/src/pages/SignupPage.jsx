import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', password: '', password2: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        setErrors(data);
      } else {
        setErrors({ non_field: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <input
        id={`signup-${name}`}
        type={type}
        className="input-field"
        placeholder={placeholder || label}
        value={form[name]}
        onChange={e => setForm({ ...form, [name]: e.target.value })}
        required={['username', 'email', 'password', 'password2'].includes(name)}
      />
      {errors[name] && (
        <p style={{ color: 'var(--accent-secondary)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
          {Array.isArray(errors[name]) ? errors[name][0] : errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at 70% 30%, rgba(255,107,157,0.1) 0%, transparent 60%), var(--bg-primary)',
      padding: '1rem',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }} className="page-enter">

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '16px', background: 'var(--gradient-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', margin: '0 auto 1rem', boxShadow: '0 8px 30px rgba(108,99,255,0.4)'
          }}>📚</div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.4rem' }}>
            Create your <span className="gradient-text">BookShelf</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Start tracking your reading today</p>
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-xl)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {field('first_name', 'First Name', 'text', 'John')}
              {field('last_name', 'Last Name', 'text', 'Doe')}
            </div>
            {field('username', 'Username', 'text', 'johndoe')}
            {field('email', 'Email', 'email', 'john@example.com')}
            {field('password', 'Password', 'password', '••••••••')}
            {field('password2', 'Confirm Password', 'password', '••••••••')}

            {errors.non_field && (
              <div style={{
                background: 'rgba(255,107,157,0.1)', border: '1px solid rgba(255,107,157,0.3)',
                borderRadius: 'var(--radius-sm)', padding: '0.75rem 1rem', color: 'var(--accent-secondary)', fontSize: '0.88rem'
              }}>
                {errors.non_field}
              </div>
            )}

            <button id="signup-submit" type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
