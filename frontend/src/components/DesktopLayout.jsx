import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import NotificationsModal from './NotificationsModal';
import BroadcastBanner from './BroadcastBanner';

export default function DesktopLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen overflow-hidden bg-surface selection:bg-primary selection:text-on-primary">
      <NotificationsModal 
        visible={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-full bg-slate-900 flex-col border-r border-slate-800 shrink-0">
        <div className="p-6 mb-8 pt-10">
          <h2 className="text-blue-400 font-headline font-black text-lg tracking-tight">Electric Stadium</h2>
          <p className="text-slate-500 text-[10px] font-headline uppercase tracking-widest">Gate A - Section 102</p>
        </div>
        <nav className="flex-1 text-left">
          <Link to="/" className={`${isActive('/') ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'} flex items-center gap-4 px-6 py-4 transition-colors duration-200`}>
            <span className="material-symbols-outlined">home</span>
            <span className="font-lexend uppercase tracking-widest text-xs">Home</span>
          </Link>
          <Link to="/ticket" className={`${isActive('/ticket') ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'} flex items-center gap-4 px-6 py-4 transition-colors duration-200`}>
            <span className="material-symbols-outlined">local_activity</span>
            <span className="font-lexend uppercase tracking-widest text-xs">Tickets</span>
          </Link>
          <Link to="/food" className={`${isActive('/food') ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'} flex items-center gap-4 px-6 py-4 transition-colors duration-200`}>
            <span className="material-symbols-outlined">fastfood</span>
            <span className="font-lexend uppercase tracking-widest text-xs">Food</span>
          </Link>
          <Link to="/map" className={`${isActive('/map') ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'} flex items-center gap-4 px-6 py-4 transition-colors duration-200`}>
            <span className="material-symbols-outlined">map</span>
            <span className="font-lexend uppercase tracking-widest text-xs">Map</span>
          </Link>
        </nav>
        <div className="p-6 mt-auto">
          <button 
            onClick={() => navigate('/food')}
            className="w-full py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            Order Refreshments
          </button>
        </div>
      </aside>

      {/* Main Container Layer */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Desktop Top Header Bar */}
        <header className="hidden lg:flex w-full h-20 bg-slate-950/60 backdrop-blur-xl border-b border-slate-800 shrink-0 justify-between items-center px-8 z-50">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-black italic text-blue-400 tracking-tighter font-headline">StadiaLive Dashboard</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <span onClick={() => setShowNotifications(true)} className="material-symbols-outlined text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">notifications</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error rounded-full animate-pulse border-2 border-slate-950"></span>
            </div>
            <div className="w-10 h-10 rounded-full border border-blue-400/30 overflow-hidden">
              <img alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-QjQAJox2yzxDPpdl09mSC0OOrpZ1iz4fJNYHlAOJi81JmZtxQGEdJXicF2fhooy6yH1OnuUZrlIyInwyrW0yvw7blfQ-DxXKrna7TobkvcMlRAptwbY9GnTc0AWcqKtbyBSQIU4y1qf7ZReLg3W0vjlDhFFDYDr6oQAAFqLJRKaNJI-AZMrh4rjumRc-CD5Z4KZQ_fDPCTCXN73WB0JSTTYFRPlPY-JpLKFI3EzBJG0jbmndjSlayM-Wo0kguUA3Mp3_ycEg9TUM" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 pb-24 lg:pb-0">
          <div className="w-full relative z-30">
            <BroadcastBanner />
          </div>
          <div className="w-full max-w-7xl mx-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
