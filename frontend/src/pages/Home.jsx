import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import DesktopLayout from '../components/DesktopLayout';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { reportIncident } from '../lib/api.js';

export default function Home() {
  const navigate = useNavigate();
  const { showNotification } = useToast();
  const { user: _user } = useAuth();
  const [showSosModal, setShowSosModal] = useState(false);
  const [waitTimes, setWaitTimes] = useState(null);

  useEffect(() => {
    const q = collection(db, 'wait_times');
    const unsub = onSnapshot(q, {
      next: (snap) => {
        const data = {};
        snap.forEach(doc => {
          data[doc.id] = doc.data();
        });
        setWaitTimes(data);
      },
      error: (err) => {
        console.error('Firestore WaitTimes Error:', err);
        setWaitTimes({});
      }
    });
    return () => unsub();
  }, []);

  const handleSosTrigger = () => {
    setShowSosModal(true);
  };

  const getStatusInfo = (minutes, type) => {
    if (minutes === undefined || minutes === null) return { label: 'Unknown', classes: 'bg-surface-container text-slate-500' };
    const mins = Number(minutes);
    
    if (mins <= 5) {
      let label = 'Fast Flow';
      if (type === 'food') label = 'Short Queue';
      if (type === 'restroom') label = 'Cleaned';
      if (type === 'shop') label = 'Open';
      return { label, classes: 'bg-tertiary-container text-on-tertiary-container' };
    }
    
    if (mins <= 15) {
      return { label: 'Moderate', classes: 'bg-secondary-container text-on-secondary-container' };
    }
    
    return { label: 'Busy', classes: 'bg-error-container text-on-error-container' };
  };

  const confirmSos = async () => {
    setShowSosModal(false);
    try {
      await reportIncident('sos', 'Section 102');
      showNotification('EMERGENCY SERVICES DISPATCHED', 'error');
    } catch {
      // If not logged in, still show notification (guest SOS)
      showNotification('EMERGENCY SERVICES DISPATCHED', 'error');
    }
  };

  const handleEmergencyAlert = async (type, message) => {
    try {
      await reportIncident(type, 'Section 102');
    } catch { /* silent fail for guests */ }
    showNotification(message, 'info');
  };

  const content = (
    <>
      {/* SOS Confirmation Modal */}
      {showSosModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" role="dialog" aria-modal="true" aria-labelledby="sos-title">
          <div className="bg-surface-container-highest rounded-3xl p-8 max-w-sm w-full border border-error/30 shadow-[0_0_50px_rgba(255,113,108,0.2)] animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-error/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="material-symbols-outlined text-error text-3xl" aria-hidden="true">warning</span>
            </div>
            <h3 id="sos-title" className="text-2xl font-black font-headline text-center text-white tracking-tight mb-2">Confirm SOS</h3>
            <p className="text-center text-on-surface-variant text-sm mb-8">This will immediately share your location with stadium security and medical services.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSosModal(false)}
                className="flex-1 py-3 bg-surface-container rounded-xl font-bold text-slate-300 hover:bg-surface-container-high transition-colors"
                aria-label="Cancel Emergency Signal"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSos}
                className="flex-1 py-3 bg-error text-white font-black rounded-xl hover:bg-error/90 active:scale-95 transition-all uppercase tracking-widest text-xs"
                aria-label="Confirm Emergency Signal"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Match Banner */}
      <section className="relative overflow-hidden rounded-3xl h-48 lg:h-[400px] flex flex-col justify-end p-6 lg:p-12 group mb-12">
        <div className="absolute inset-0 z-0">
          <img 
            decoding="async"
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700 pointer-events-none" 
            alt="stadium view full of fans" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8fTQA1y4SFQmp9jFM03Yf45HFGlYJbgm0xRTqz0zc0LKKRs9ngwoVIBJ_fAbW-Y9RTdSa0U16pulqeLvtYkrveLlT0ODWhcOjjnEorg4B0deCynwVkHW-VKwSffdUEIID1j7-UVJZefKKPA2R1zdQL0ioLcmR632rMrE2ZzTqAM4ISLzG0txl0NdKjCzOvG0JEoKWqOccdJjSF0LEmJBemusDQouEMmJ-FjrDW2an8Kj7_sVBW0izrUHh8eTY7yAA3MDR4xUmiK8r"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent hidden lg:block"></div>
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-md px-4 py-2 rounded-full w-fit mb-auto">
              <span className="w-2 h-2 bg-error rounded-full animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-white">Live Match - Final Quarter</span>
            </div>
            <div className="text-right hidden lg:block">
              <p className="text-slate-400 text-sm font-headline mb-1">Attendance</p>
              <p className="text-2xl font-black text-white">52,401</p>
            </div>
          </div>
          <div className="flex justify-between items-end lg:items-center lg:gap-12 w-full mt-auto px-2 lg:px-0">
            <div className="flex lg:flex-col items-center gap-2 lg:gap-4 shrink-0">
              <div className="hidden lg:flex w-24 h-24 bg-surface-container-highest rounded-2xl items-center justify-center p-4">
                <img alt="Home Team Warriors Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7sQnsPaTluaX4pglcMTm6WAFCtM8f-7_HgL_jeRbBbScGIOjQzl6qpzrDsOgT6ExaSO1aeRH9EE9Est5gIYbUO_NOg0aMj9lzehsWvfcTxsn1sXbBUB7hYYXHhUNUP5Tu4YqwYi9U4mFe16AZK0HY5CYY3tIIw2SXnFZLmMGar3TcxO9TdgaECj9jPJ9SeoLKvNsSEXLY-ga_hMcp86H4ak-xGR9tsUqWKzo_JICew_Va0cuB2IrYthJXLCBCbH_v7bjHTH_ZVhLy"/>
              </div>
              <div className="flex flex-col lg:items-center">
                <span className="text-lg lg:text-3xl font-black font-headline leading-none text-white tracking-tighter">WARRIORS</span>
                <span className="text-[10px] text-slate-400 lg:hidden">HOME</span>
              </div>
            </div>
            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1.5 lg:gap-8 mb-2" aria-label="Score: Warriors 104, Titans 98">
                <span className="text-2xl lg:text-7xl font-black font-headline text-white tracking-tighter" aria-hidden="true">104</span>
                <span className="text-lg lg:text-3xl font-black text-primary opacity-50" aria-hidden="true">:</span>
                <span className="text-2xl lg:text-7xl font-black font-headline text-white tracking-tighter" aria-hidden="true">98</span>
              </div>
              <button 
                onClick={() => showNotification("Starting Broadcast Stream...", "info")}
                className="hidden lg:block bg-primary/20 hover:bg-primary/30 transition-colors px-6 py-2 rounded-full mt-2 cursor-pointer active:scale-95"
              >
                <span className="text-primary font-bold tracking-widest text-sm">MATCH DAY BROADCAST</span>
              </button>
            </div>
            <div className="flex lg:flex-col items-center gap-2 lg:gap-4 shrink-0">
              <div className="hidden lg:flex w-24 h-24 bg-surface-container-highest rounded-2xl items-center justify-center p-4">
                <img alt="Away Team Titans Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAVXaiK0e7IrUCSbOnMgDmdGqDqVQd6YGKLuh5YTe-qGnmIBqtDvrmJ96qeAaLbgG9RJKXDkUBipFyYCfgqru5X-3jrMI23h9m_S0_wZyKTb_ahKHOzDh6XdGomWz3cLF0bsYk_AvsbLnsXdvO5wi9NejdLLpRueQYtukAjNk00AAnqYIOAOyQ5cBDfr8TyW3fDzepu0ZNr_f0IeZ-NYhYWhIJQcqfDtBfwPsj0QfI041yJeo7yM-yYkQbilTMiYHMR4VWN7xcmuyYK"/>
              </div>
              <div className="flex flex-col items-end lg:items-center">
                <span className="text-lg lg:text-3xl font-black font-headline leading-none text-white tracking-tighter">TITANS</span>
                <span className="text-[10px] text-slate-400 lg:hidden">AWAY</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Near You / Facilities */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xl lg:text-3xl font-black tracking-tight mb-1 lg:mb-2 text-white">Facilities Near You</h2>
            <p className="text-on-surface-variant text-sm lg:text-base">Gate A - Section 102 Area</p>
          </div>
          <button 
            onClick={() => navigate('/map')}
            className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all text-xs lg:text-sm"
          >
            Full Map <span className="material-symbols-outlined text-sm lg:text-base" aria-hidden="true">arrow_forward</span>
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <button 
            onClick={() => navigate('/map')}
            className="bg-surface-container rounded-3xl p-4 lg:p-6 hover:bg-surface-container-high transition-all group cursor-pointer relative overflow-hidden text-left"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform hidden lg:block"></div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4 lg:mb-6">
              <span className="material-symbols-outlined" aria-hidden="true">door_front</span>
            </div>
            <h4 className="font-headline font-bold lg:text-xl mb-1 text-white">Gate A</h4>
            <div className="flex items-center justify-between mt-4 lg:mt-6">
              {(() => {
                const status = getStatusInfo(waitTimes?.gateA?.estimatedWaitMinutes, 'gate');
                return (
                  <span className={`${status.classes} px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest transition-colors duration-500`}>
                    {status.label}
                  </span>
                );
              })()}
              <span className="font-headline font-bold text-primary text-xs lg:text-sm">
                {waitTimes === null ? '–' : waitTimes.gateA ? `${waitTimes.gateA.estimatedWaitMinutes}m` : '–'}
              </span>
            </div>
          </button>
          
          <button 
            onClick={() => navigate('/food')}
            className="bg-surface-container rounded-3xl p-4 lg:p-6 hover:bg-surface-container-high transition-all group cursor-pointer relative overflow-hidden text-left"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mb-4 lg:mb-6">
              <span className="material-symbols-outlined" aria-hidden="true">lunch_dining</span>
            </div>
            <h4 className="font-headline font-bold lg:text-xl mb-1 text-white">Grill & Chill</h4>
            <div className="flex items-center justify-between mt-4 lg:mt-6">
              {(() => {
                const status = getStatusInfo(waitTimes?.grillChill?.estimatedWaitMinutes, 'food');
                return (
                  <span className={`${status.classes} px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest transition-colors duration-500`}>
                    {status.label}
                  </span>
                );
              })()}
              <span className="font-headline font-bold text-secondary text-xs lg:text-sm">
                {waitTimes === null ? '–' : waitTimes.grillChill ? `${waitTimes.grillChill.estimatedWaitMinutes}m` : '–'}
              </span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/map')}
            className="bg-surface-container rounded-3xl p-4 lg:p-6 hover:bg-surface-container-high transition-all group cursor-pointer relative overflow-hidden text-left"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary-dim mb-4 lg:mb-6">
              <span className="material-symbols-outlined" aria-hidden="true">wc</span>
            </div>
            <h4 className="font-headline font-bold lg:text-xl mb-1 text-white">Restrooms</h4>
            <div className="flex items-center justify-between mt-4 lg:mt-6">
              {(() => {
                const status = getStatusInfo(waitTimes?.restrooms?.estimatedWaitMinutes, 'restroom');
                return (
                  <span className={`${status.classes} px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest transition-colors duration-500`}>
                    {status.label}
                  </span>
                );
              })()}
              <span className="font-headline font-bold text-tertiary-dim text-xs lg:text-sm">
                {waitTimes === null ? '–' : waitTimes.restrooms ? `${waitTimes.restrooms.estimatedWaitMinutes}m` : '–'}
              </span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/map')}
            className="bg-surface-container rounded-3xl p-4 lg:p-6 hover:bg-surface-container-high transition-all group cursor-pointer relative overflow-hidden text-left"
          >
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-primary-container/10 rounded-2xl flex items-center justify-center text-primary-dim mb-4 lg:mb-6">
              <span className="material-symbols-outlined" aria-hidden="true">shopping_bag</span>
            </div>
            <h4 className="font-headline font-bold lg:text-xl mb-1 text-white">Team Shop</h4>
            <div className="flex items-center justify-between mt-4 lg:mt-6">
              {(() => {
                const status = getStatusInfo(waitTimes?.teamShop?.estimatedWaitMinutes, 'shop');
                return (
                  <span className={`${status.classes} px-2 lg:px-3 py-1 rounded-full text-[8px] lg:text-[10px] font-black uppercase tracking-widest transition-colors duration-500`}>
                    {status.label}
                  </span>
                );
              })()}
              <span className="font-headline font-bold text-primary-dim text-xs lg:text-sm">
                {waitTimes === null ? '–' : waitTimes.teamShop ? `${waitTimes.teamShop.estimatedWaitMinutes}m` : '–'}
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Emergency Support */}
      <section className="bg-surface-container-highest rounded-[2rem] lg:rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-error via-secondary to-error"></div>
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12">
          <div className="flex-shrink-0 relative">
            <button 
              onClick={handleSosTrigger}
              aria-label="Trigger SOS Emergency"
              className="w-20 h-20 lg:w-32 lg:h-32 bg-error rounded-full flex flex-col items-center justify-center shadow-[0_0_40px_rgba(255,113,108,0.4)] hover:scale-105 active:scale-95 transition-all group z-10 relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-white text-3xl lg:text-4xl mb-1 group-hover:animate-pulse" style={{fontVariationSettings: "'FILL' 1"}} aria-hidden="true">emergency_home</span>
              <span className="text-white font-black text-[10px] lg:text-xs uppercase tracking-tighter">SOS</span>
            </button>
            <div className="absolute inset-0 bg-error/20 rounded-full animate-ping pointer-events-none"></div>
          </div>
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl lg:text-4xl font-black font-headline tracking-tighter text-white mb-2">EMERGENCY ASSISTANCE</h2>
            <p className="text-on-surface-variant text-sm lg:text-lg">Help is just a button press away. Your location will be shared automatically.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full lg:w-auto h-full">
            <button 
              onClick={() => handleEmergencyAlert('medical', 'Medical team alerted to your location.')}
              className="flex flex-col items-center gap-3 p-4 lg:p-6 bg-surface-variant/40 rounded-2xl lg:rounded-3xl hover:bg-surface-variant transition-colors border-b-4 border-transparent hover:border-error cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-error" aria-hidden="true">medical_services</span>
              <span className="font-headline font-bold text-[10px] lg:text-sm text-white uppercase lg:capitalize">Medical</span>
            </button>
            <button 
              onClick={() => handleEmergencyAlert('security', 'Security notified. Please stay where you are.')}
              className="flex flex-col items-center gap-3 p-4 lg:p-6 bg-surface-variant/40 rounded-2xl lg:rounded-3xl hover:bg-surface-variant transition-colors border-b-4 border-transparent hover:border-secondary cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">shield_with_heart</span>
              <span className="font-headline font-bold text-[10px] lg:text-sm text-white uppercase lg:capitalize">Security</span>
            </button>
            <button 
              onClick={() => handleEmergencyAlert('lost', 'Guest services alerted for Lost & Found item.')}
              className="flex flex-col items-center gap-3 p-4 lg:p-6 bg-surface-variant/40 rounded-2xl lg:rounded-3xl hover:bg-surface-variant transition-colors border-b-4 border-transparent hover:border-primary cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-primary" aria-hidden="true">search_check</span>
              <span className="font-headline font-bold text-[10px] lg:text-sm text-white uppercase lg:capitalize">Lost</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <DesktopLayout>
      {content}
    </DesktopLayout>
  );
}
