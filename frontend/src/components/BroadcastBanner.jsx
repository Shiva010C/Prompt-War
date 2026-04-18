import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function BroadcastBanner() {
  const [broadcasts, setBroadcasts] = useState([]);
  const location = useLocation();

  // Only show on specific pages
  const allowedPaths = ['/', '/food', '/ticket', '/map'];
  const isAdminPath = location.pathname.startsWith('/admin');
  const isVisible = allowedPaths.includes(location.pathname) && !isAdminPath;

  useEffect(() => {
    if (!isVisible) {
      setBroadcasts([]);
      return;
    }

    const q = query(collection(db, 'broadcasts'), orderBy('sentAt', 'desc'), limit(10));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) {
        setBroadcasts([]);
        return;
      }
      setBroadcasts(snap.docs.map(d => d.data()));
    });

    return () => unsub();
  }, [isVisible]);

  if (!isVisible || broadcasts.length === 0) return null;

  // Use the most severe type for the overall theme, default to the first one
  const mainType = broadcasts[0].type || 'info';
  
  const bgStyles = {
    info: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
    warning: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
    error: 'bg-error/10 text-error border-error/30',
    success: 'bg-tertiary/10 text-tertiary border-tertiary/30',
  };

  // Combine all messages into a single ticker string
  const combinedMessage = broadcasts.map(b => b.message).join('   •   ');
  // Double the content for a seamless loop
  const tickerContent = `•   ${combinedMessage}`;

  return (
    <div className="w-full relative z-[40] animate-in slide-in-from-top duration-300">
      <div className={`w-full h-10 flex items-center border-b border-slate-800 ${bgStyles[mainType]} backdrop-blur-md px-4 overflow-hidden`}>
        {/* Fixed Label Section */}
        <div className="flex-shrink-0 flex items-center gap-2 bg-slate-900 z-20 pr-6 relative shadow-[20px_0_30px_-5px_rgba(0,0,0,0.4)]">
          <span className="material-symbols-outlined text-[18px] text-secondary animate-pulse">campaign</span>
          <span className="uppercase text-[10px] font-black tracking-[0.2em] whitespace-nowrap text-secondary">Announcement</span>
        </div>

        {/* Scrolling Ticker Section */}
        <div className="flex-1 relative overflow-hidden h-full flex items-center">
          <div className="inline-block whitespace-nowrap animate-marquee">
            <span className="text-xs lg:text-sm font-bold tracking-tight px-4">
              {tickerContent}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
