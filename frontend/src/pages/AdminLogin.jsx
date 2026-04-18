import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  {
    label: 'Admin',
    role: 'Full dashboard access',
    icon: 'admin_panel_settings',
    color: 'from-blue-600/20 to-blue-500/10 border-blue-500/30 hover:border-blue-400/60',
    iconColor: 'text-blue-400',
    email: 'demo.admin@stadianlive.com',
    password: 'DemoAdmin@2024',
  },
  {
    label: 'Attendee',
    role: 'Food ordering & SOS',
    icon: 'person',
    color: 'from-secondary/20 to-secondary/10 border-secondary/30 hover:border-secondary/60',
    iconColor: 'text-secondary',
    email: 'demo.tester@stadianlive.com',
    password: 'DemoUser@2024',
  },
];

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [filledDemo, setFilledDemo] = useState(null);

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
    setFilledDemo(account.label);
  };

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
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">

        {/* Header Card */}
        <div className="bg-surface-container-high rounded-3xl p-10 shadow-2xl shadow-blue-900/20 border border-outline-variant/10">
          <div className="mb-8 text-center">
            <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-blue-400 text-3xl" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>stadium</span>
            </div>
            <h1 className="font-headline text-3xl font-black text-white uppercase tracking-tighter mb-1">Admin Access</h1>
            <p className="text-on-surface-variant text-sm">Smart Venue Navigator — Staff Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div role="alert" className="bg-error/10 border border-error/30 text-error text-sm px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="material-symbols-outlined text-sm shrink-0" aria-hidden="true">error</span>
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
                onChange={(e) => { setEmail(e.target.value); setFilledDemo(null); }}
                className="w-full bg-surface-container-highest border-0 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-400/50 transition-all"
                placeholder="email@example.com"
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
                onChange={(e) => { setPassword(e.target.value); setFilledDemo(null); }}
                className="w-full bg-surface-container-highest border-0 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 outline-none focus:ring-1 focus:ring-blue-400/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        {/* Demo Credentials Card */}
        <div className="bg-surface-container rounded-3xl p-6 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-tertiary text-sm" aria-hidden="true">science</span>
            <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Demo Access — Click to fill</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.label}
                type="button"
                onClick={() => fillDemo(account)}
                className={`relative bg-gradient-to-br ${account.color} border rounded-2xl p-4 text-left transition-all duration-200 active:scale-95 group`}
              >
                {filledDemo === account.label && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-tertiary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                    <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                  </span>
                )}
                <span className={`material-symbols-outlined ${account.iconColor} text-xl mb-2 block`} aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {account.icon}
                </span>
                <p className="font-black text-white text-sm">{account.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{account.role}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-[9px] font-mono text-slate-400 truncate">{account.email}</p>
                  <p className="text-[9px] font-mono text-slate-500">{account.password}</p>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-[10px] text-slate-600 mt-4">
            ⚠️ Demo accounts only — do not store real data
          </p>
        </div>

      </div>
    </div>
  );
}
