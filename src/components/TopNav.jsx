import { useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationsModal from './NotificationsModal';

export default function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center px-6 h-16 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest">
            <img 
              className="w-full h-full object-cover" 
              alt="User portrait" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCej-xC6k-cjGsFIx5F_u4GfJlR40SPUkEPSiNc6NAHgrIVhCLohmda3HwRaCgqqy6OkdzYBy33RR2xBVXecbJZ6U2XhCJKUDstRiohC7C2I9oqbxPG2JjxF46Qx_g9P4NW-63v9UiM8Npm__Jiv6U6f_a2doZIgJWnJV5SFmwJrEhGUuSLbTl-LQ9OLnSCwbo2sw_Dt5XurXKL5n_60SCW6yHrBG-vZTaFYS02mUunke6Cu6RDsPE_vBBWYhvyjieQIiGZL1YHz7vn"
            />
          </div>
          <Link to="/" className="text-xl font-black italic text-blue-400 font-headline uppercase tracking-tight">STADIUM</Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <button 
                onClick={() => setShowNotifications(true)}
                className="p-2 rounded-full hover:bg-slate-800/50 transition-colors active:scale-95 duration-150 text-slate-400 hover:text-white"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-error rounded-full animate-pulse border-2 border-slate-900 pointer-events-none"></span>
          </div>
        </div>
      </nav>

      <NotificationsModal 
        visible={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}
