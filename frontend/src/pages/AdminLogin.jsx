import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-surface-container-high rounded-3xl p-10 shadow-2xl shadow-blue-900/20 border border-outline-variant/10">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl font-black text-white uppercase tracking-tighter mb-2">Admin Access</h1>
          <p className="text-on-surface-variant text-sm">Smart Venue Navigator — Staff Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-highest border-0 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-400/50 transition-all"
              placeholder="admin@stadium.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-highest border-0 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-400/50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-full uppercase tracking-widest shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined" aria-hidden="true">lock_open</span>
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
