import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopLayout from '../components/DesktopLayout';
import Toast from '../components/Toast';

export default function Ticket() {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const [showScanner, setShowScanner] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showNotification = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleShare = () => {
    // Simulate native share API
    showNotification('Opening share dialog...', 'info');
  };

  const handleRefreshBarcode = (e) => {
    e.stopPropagation();
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showNotification('Barcode refreshed for security', 'success');
    }, 800);
  };

  const content = (
    <div className="pt-24 px-6 max-w-2xl mx-auto space-y-8 pb-24 w-full">
      <Toast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      {/* Fullscreen Scanner Modal */}
      {showScanner && (
        <div 
          className="fixed inset-0 z-[200] bg-white flex flex-col justify-center items-center p-8 animate-in fade-in slide-in-from-bottom-8 duration-300"
          onClick={() => setShowScanner(false)}
        >
          <div className="flex flex-col items-center justify-center w-full max-w-sm">
            <h2 className="font-headline font-black text-3xl text-slate-900 mb-2 uppercase text-center">Scan to Enter</h2>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-12 text-center">Present tracking code at Gate 4</p>
            
            <div className="relative p-8 bg-slate-100 rounded-3xl w-full aspect-square flex items-center justify-center">
              <img 
                alt="QR Code" 
                className={`w-full h-full object-cover grayscale contrast-125 ${isRefreshing ? 'opacity-50 blur-sm scale-95' : 'opacity-100 scale-100'} transition-all duration-300`} 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6LhapHJ6NktKKe472WitIWiLt2-Q48zVIFNphAHxHqu_0UIaZHqEXy12qepxKIMHPclHG5GvzsRkybF_jP1gJEtTh4T0-W2IXxblD-MlcZxLPuy7vt5LBvMqzVAibpHtCgmBQVC2JQcBq-bhcquJuRUm-34K2xh_BJ8yUr_Iegws4j1_cMENdhKVWZ6ADTER-MMAScibSeacVqm7asejSFfZd_lytkfIACbXZX3VefWnV72lx4rkp4vF1ACWvtNw8hXkzEwcKM8CW"
              />
              {/* Scanning Guide Corners */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-primary rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-primary rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-primary rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-primary rounded-br-2xl"></div>
            </div>
            
            <p className="mt-8 font-headline text-slate-400 text-sm tracking-[0.3em] uppercase font-bold">XJF9-2024</p>
            
            <button 
              onClick={handleRefreshBarcode}
              className="mt-8 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-3 rounded-full flex items-center gap-2 active:scale-95 transition-all"
            >
              <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`}>refresh</span>
              Refresh Code
            </button>

            <button className="absolute top-8 right-8 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Broadcaster Section */}
      <header className="relative overflow-hidden rounded-3xl bg-surface-container-low p-8 bg-[#000411]">
        <div className="absolute inset-0" style={{
            backgroundImage: "radial-gradient(at 0% 0%, hsla(223,83%,18%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,100%,15%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(22,100%,15%,1) 0, transparent 50%)"
        }}></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-headline text-tertiary-dim text-xs uppercase tracking-[0.2em] mb-1">Live Matchday</p>
              <h1 className="font-headline text-4xl font-black text-white leading-none uppercase">CHAMPIONS<br/>FINAL 2024</h1>
            </div>
            <div className="bg-secondary px-3 py-1 rounded-full">
              <span className="font-headline text-[10px] font-bold text-on-secondary uppercase">Premium Access</span>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Starts In</span>
              <span className="font-headline text-3xl font-bold text-white tabular-nums">00:42:18</span>
            </div>
            <div className="h-10 w-[1px] bg-outline-variant/30"></div>
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">Kick-off</span>
              <span className="font-headline text-3xl font-bold text-white uppercase">20:45</span>
            </div>
          </div>
        </div>
      </header>

      {/* Digital Ticket Card (The Anchor) */}
      <section className="relative group perspective">
        <div className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-blue-500/10 transition-transform duration-500 hover:rotate-x-2">
          {/* High Contrast QR Area */}
          <div 
            onClick={() => setShowScanner(true)}
            className="bg-white p-8 flex flex-col items-center justify-center border-b-2 border-dashed border-slate-100 relative cursor-pointer group-hover:bg-slate-50 transition-colors"
          >
            {/* Ticket Punch Holes */}
            <div className="absolute -bottom-4 -left-8 w-8 h-8 bg-background rounded-full"></div>
            <div className="absolute -bottom-4 -right-8 w-8 h-8 bg-background rounded-full"></div>
            <div className="relative p-4 bg-white rounded-2xl group-hover:scale-105 transition-transform duration-300">
              <img alt="QR Code" className="w-56 h-56 grayscale contrast-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD6LhapHJ6NktKKe472WitIWiLt2-Q48zVIFNphAHxHqu_0UIaZHqEXy12qepxKIMHPclHG5GvzsRkybF_jP1gJEtTh4T0-W2IXxblD-MlcZxLPuy7vt5LBvMqzVAibpHtCgmBQVC2JQcBq-bhcquJuRUm-34K2xh_BJ8yUr_Iegws4j1_cMENdhKVWZ6ADTER-MMAScibSeacVqm7asejSFfZd_lytkfIACbXZX3VefWnV72lx4rkp4vF1ACWvtNw8hXkzEwcKM8CW"/>
              {/* Scanning Guide Corners */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors rounded-2xl"></div>
            </div>
            <p className="mt-6 font-headline text-slate-400 text-[10px] tracking-[0.3em] uppercase font-bold">Fast Entry Code: XJF9-2024</p>
            <div className="absolute top-4 right-4 bg-slate-100 text-slate-400 px-2 py-1 rounded-full text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">zoom_out_map</span> Enlarge
            </div>
          </div>
          {/* Seat Information - Editorial Layout */}
          <div className="p-8 space-y-8 bg-slate-50 rounded-b-[2rem]">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Section</span>
                <span className="block font-headline text-3xl font-black text-slate-900 leading-none">102</span>
              </div>
              <div className="space-y-1 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Row</span>
                <span className="block font-headline text-3xl font-black text-slate-900 leading-none">G</span>
              </div>
              <div className="space-y-1 text-right">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Seat</span>
                <span className="block font-headline text-3xl font-black text-slate-900 leading-none text-primary">04</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <span className="material-symbols-outlined text-slate-600">meeting_room</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Gate Entrance</span>
                  <span className="block font-headline font-bold text-slate-800">North West Gate 4</span>
                </div>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 font-label">Date</span>
                <span className="block font-headline font-bold text-slate-800">MAY 24, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Action Chips */}
      <div className="flex gap-4">
        <button 
          onClick={() => navigate('/map')}
          className="flex-1 bg-gradient-to-br from-primary to-primary-container text-on-primary h-14 rounded-full flex items-center justify-center gap-3 active:scale-95 duration-150 shadow-xl shadow-primary/20"
        >
          <span className="material-symbols-outlined text-xl">directions</span>
          <span className="font-label font-extrabold uppercase tracking-widest text-xs">How to get there</span>
        </button>
        <button 
          onClick={handleShare}
          className="w-14 h-14 bg-surface-container-highest rounded-full flex items-center justify-center active:scale-95 duration-150 hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-primary">share</span>
        </button>
      </div>

      {/* Wayfinding Quick Card */}
      <div 
        onClick={() => navigate('/map')}
        className="bg-surface-container-high rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:bg-surface-container-highest transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-on-tertiary-container">map</span>
          </div>
          <div>
            <h3 className="font-headline font-bold text-white text-sm">Stadium Level 1</h3>
            <p className="text-on-surface-variant text-xs font-label">Closest Amenities: Food Court A, Restroom 12</p>
          </div>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform">chevron_right</span>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden">
        {content}
      </div>
      <DesktopLayout>
        {content}
      </DesktopLayout>
    </>
  );
}
