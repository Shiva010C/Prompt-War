import { useState } from 'react';
import DesktopLayout from '../components/DesktopLayout';

export default function Map() {
  const [activeLevel, setActiveLevel] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [recenterAnim, setRecenterAnim] = useState('');

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 1));
  };

  const handleRecenter = () => {
    setZoom(1);
    setShowTooltip(false);
    setRecenterAnim('animate-ping');
    setTimeout(() => setRecenterAnim(''), 1000);
  };

  const content = (
    <div className="pt-4 px-2 max-w-5xl mx-auto space-y-8 pb-6 w-full flex flex-col h-screen">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h2 className="text-3xl font-black tracking-tight mb-2 text-white transition-all">Full Venue Map</h2>
          <p className="text-on-surface-variant font-medium">Electric Stadium Level {activeLevel}</p>
        </div>
        <div className="flex gap-2 bg-surface-container rounded-full p-1 border border-outline-variant/10" role="tablist">
            <button 
                role="tab"
                aria-selected={activeLevel === 1}
                onClick={() => setActiveLevel(1)}
                className={`${activeLevel === 1 ? 'bg-surface-container-highest text-white shadow-md' : 'text-slate-400 hover:text-white'} px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition-all`}
            >
                Level 1
            </button>
            <button 
                role="tab"
                aria-selected={activeLevel === 2}
                onClick={() => setActiveLevel(2)}
                className={`${activeLevel === 2 ? 'bg-surface-container-highest text-white shadow-md' : 'text-slate-400 hover:text-white'} px-4 py-2 rounded-full text-xs font-bold active:scale-95 transition-all`}
            >
                Level 2
            </button>
        </div>
      </div>
      
      <div className="flex-1 bg-surface-container rounded-3xl overflow-hidden relative min-h-[400px] border border-outline-variant/10 shadow-2xl shadow-primary/5">
        <div 
            className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
        >
            <div className="absolute inset-0 grayscale contrast-125 brightness-50">
                <img 
                    loading="lazy" 
                    decoding="async"
                    alt={`Full Venue Map Level ${activeLevel}`} 
                    className={`w-full h-full object-cover transition-opacity duration-500`}
                    src={activeLevel === 1 
                        ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_PLVODVVPpnEIDHifWhcly5tMpsEzzGHRUcMHQS3AnAlJ9xUusF66ezUaMC_ovlIBpnn8UFYCVi5uK-Jlgr09GCHO2BZLsN4GcJQbO8phjw2S-1O0GKiZ6hyTnbuVR1XKKwAvOjHjwre6YaDb8og2uhfjZvosfeJ03vQCvHGMm-oYJnupcvRz9Dege8olam8ll6rYOCRkYhqHi-q-HXJ0mQ654T-n_aTaTwDyOxsNWybCVypWiJaYiw0_5ab7QxX0Unj2rPVWS7G5'
                        : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLOFcAMS-_PtgsQhs3hk4nyNjOZs5dhWXI1FPNgNMCqgfsDET7vZHKIKbsLCcQn6la9y8gdAUrlS3dLAQeqkh2NRt4qnAvmiw15iyUI9sVj12K3TZ_QUFdlcUuX12iNI8G4u0-tbBRpqlm7TDRTgAlrn1kbRQzhwllhpN6j6zOBBlKs_cpD-jdUhgg5SUyUGP4IqJiXKXJhjVTaa2zEv19z8Tjlp0ohvoPTgSsNJhvvh40uyvOg2FtlvOaO2kezOVGZOrpy6j9xnvA'
                    }
                />
            </div>
            
            {/* Interactive map points */}
            {activeLevel === 1 && (
                <>
                    <div className="absolute top-[30%] left-[40%] group z-10 w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center animate-bounce">
                        <div className={`absolute inset-0 bg-primary/30 rounded-full ${recenterAnim || 'animate-ping'}`}></div>
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/40 relative z-10 cursor-default">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>my_location</span>
                        </div>
                        <div className="absolute top-14 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-surface-bright backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold border border-white/10 pointer-events-none">
                            You are here (Sec 102)
                        </div>
                    </div>
                    
                    <button 
                        aria-label="View Grill & Chill Food Stand details"
                        className="absolute top-[45%] left-[20%] z-10 cursor-pointer border-none bg-transparent outline-none p-0"
                        onClick={(e) => { e.stopPropagation(); setShowTooltip(!showTooltip); }}
                    >
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg shadow-secondary/40 hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-sm" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>lunch_dining</span>
                        </div>
                        {showTooltip && (
                            <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-bright/90 backdrop-blur-xl px-4 py-2 rounded-xl text-xs font-bold border border-white/20 shadow-2xl text-center z-20 animate-in fade-in zoom-in duration-200">
                                Grill & Chill
                                <span className="block text-[10px] text-primary mt-1 bg-primary/10 px-2 py-0.5 rounded-md">15m wait</span>
                            </div>
                        )}
                    </button>
                </>
            )}

            {activeLevel === 2 && (
                <div className="absolute top-[60%] left-[55%] z-10">
                    <div className="w-10 h-10 rounded-full bg-tertiary flex items-center justify-center text-white shadow-lg shadow-tertiary/40">
                        <span className="material-symbols-outlined text-sm" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>shopping_bag</span>
                    </div>
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-bright/90 backdrop-blur-xl px-4 py-2 rounded-xl text-xs font-bold border border-white/20 shadow-2xl text-center z-20">
                        Team Shop North
                        <span className="block text-[10px] text-tertiary mt-1">Open</span>
                    </div>
                </div>
            )}
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30">
            <button 
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                aria-label="Zoom in"
                className="w-10 h-10 bg-surface-bright/80 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-surface-bright transition-colors border border-white/10 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
                <span className="material-symbols-outlined" aria-hidden="true">add</span>
            </button>
            <button 
                onClick={handleZoomOut}
                disabled={zoom <= 1}
                aria-label="Zoom out"
                className="w-10 h-10 bg-surface-bright/80 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-surface-bright transition-colors border border-white/10 shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
                <span className="material-symbols-outlined" aria-hidden="true">remove</span>
            </button>
            <button 
                onClick={handleRecenter}
                aria-label="Recenter map"
                className="w-10 h-10 bg-primary/20 backdrop-blur-xl rounded-xl flex items-center justify-center hover:bg-primary/30 text-primary transition-colors mt-2 shadow-lg active:scale-95"
            >
                <span className="material-symbols-outlined" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>my_location</span>
            </button>
        </div>
        
        {/* Categories Legend */}
        <div className="absolute bottom-6 left-6 flex flex-wrap gap-2 z-30 max-w-[calc(100%-80px)] pointer-events-none" aria-hidden="true">
            <div className="bg-surface-bright/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_var(--tw-colors-primary)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Gates</span>
            </div>
            <div className="bg-surface-bright/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary shadow-[0_0_8px_var(--tw-colors-secondary)]"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Food</span>
            </div>
            <div className="bg-surface-bright/80 backdrop-blur-xl px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-tertiary-dim"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">Washrooms</span>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <DesktopLayout>
      {content}
    </DesktopLayout>
  );
}
