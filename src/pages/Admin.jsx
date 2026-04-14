import { useState } from 'react';
import Toast from '../components/Toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [broadcastText, setBroadcastText] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  
  // Wait Time States
  const [waitTimes, setWaitTimes] = useState({
    restroomNorth: 12,
    restroomSouth: 4,
    foodMain: 25,
    foodUpper: 2
  });

  const showNotification = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleBroadcast = () => {
    if (!broadcastText.trim()) {
      showNotification('Please enter an announcement first.', 'error');
      return;
    }
    showNotification('Global broadcast sent successfully!', 'success');
    setBroadcastText('');
  };

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden absolute inset-0 z-[100]">
      <Toast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      {/* NavigationDrawer (From JSON) */}
      <aside className="h-full w-64 border-r border-slate-800 bg-slate-900 flex flex-col py-8 shrink-0 relative z-20">
        <div className="px-6 mb-10">
          <h2 className="text-blue-400 font-bold tracking-tighter text-xl font-headline">ADMIN CONTROL</h2>
        </div>
        <nav className="flex-1">
          <div className="space-y-1">
            {[
              { id: 'Dashboard', icon: 'dashboard' },
              { id: 'Crowds', icon: 'groups' },
              { id: 'Announcements', icon: 'campaign' },
              { id: 'Settings', icon: 'settings' }
            ].map(tab => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 ease-in-out cursor-pointer ${activeTab === tab.id ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="font-headline font-medium">{tab.id}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="px-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden">
              <img className="w-full h-full object-cover" alt="Admin portrait" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpMEakMmk1sqMQP0CYjg4hQNBWLHP8_ZC9hOBnAim9KYCbyKygt0lst3-dE0ZL18v0PMbEUbsJD-Z3c3qWKz32BqFtcku3yR6AvqyHnLwhKE1X50SedYT7uNtWiT5Zl4LW9QMgv3esEF4a26coOtMJhrGm3WACo222o-z_dq2Rn6EkPbmRXoMJEaLvFCNErXFvVmyepMBz_BDxwqj-KbiGsWeZ5LLjxJLf6cWY-BZoP0B5uKcl2uw1lgZntT84ACuVv2f3hCRyp8CP"/>
            </div>
            <div>
              <p className="text-sm font-bold">Marcus Chen</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Head of Ops</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col relative overflow-y-auto">
        <header className="fixed top-0 right-0 lg:left-64 left-0 z-50 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center px-4 lg:px-8 h-16 w-full lg:w-[calc(100%-16rem)]">
          <h1 className="text-xl font-black italic text-blue-400 font-headline tracking-tight uppercase">STADIUM</h1>
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_#cafd00] animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Live Mode</span>
            </div>
            <button className="text-slate-400 hover:bg-slate-800/50 transition-colors p-2 rounded-full active:scale-95 duration-150">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="mt-16 p-4 lg:p-8 grid grid-cols-12 gap-6 pb-24">
          {/* Hero Metric: Map with Heat Overlay */}
          <section className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-3xl overflow-hidden relative group h-[300px] lg:h-[480px]">
            <div className="absolute inset-0 z-0">
              <img className="w-full h-full object-cover opacity-30 grayscale contrast-125 pointer-events-none" alt="Blueprint map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLOFcAMS-_PtgsQhs3hk4nyNjOZs5dhWXI1FPNgNMCqgfsDET7vZHKIKbsLCcQn6la9y8gdAUrlS3dLAQeqkh2NRt4qnAvmiw15iyUI9sVj12K3TZ_QUFdlcUuX12iNI8G4u0-tbBRpqlm7TDRTgAlrn1kbRQzhwllhpN6j6zOBBlKs_cpD-jdUhgg5SUyUGP4IqJiXKXJhjVTaa2zEv19z8Tjlp0ohvoPTgSsNJhvvh40uyvOg2FtlvOaO2kezOVGZOrpy6j9xnvA"/>
              {/* Heatmap Overlay Elements */}
              <div className="absolute top-1/4 left-1/3 w-32 lg:w-48 h-32 lg:h-48 bg-error rounded-full blur-[40px] opacity-60 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-48 lg:w-64 h-48 lg:h-64 bg-secondary rounded-full blur-[40px] opacity-60"></div>
              <div className="absolute top-1/2 left-1/2 w-24 lg:w-32 h-24 lg:h-32 bg-tertiary rounded-full blur-[40px] opacity-60"></div>
            </div>
            <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
              <div className="flex justify-between items-start pointer-events-auto">
                <div>
                  <h3 className="text-lg lg:text-2xl font-headline font-black tracking-tight uppercase">Zone Density Map</h3>
                  <p className="text-on-surface-variant text-xs lg:text-sm">Real-time attendance tracking</p>
                </div>
                <div className="hidden lg:flex bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl flex-col gap-2">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-error"></div><span className="text-[10px] uppercase font-bold text-white">Critical (90%+)</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-secondary"></div><span className="text-[10px] uppercase font-bold text-white">Heavy (75%+)</span></div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-tertiary"></div><span className="text-[10px] uppercase font-bold text-white">Optimal (&lt;40%)</span></div>
                </div>
              </div>
              <div className="mt-auto pointer-events-auto">
                <button 
                  onClick={() => showNotification('Opening Full Screen Operations Map', 'info')}
                  className="bg-surface-bright/80 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 text-white text-xs lg:text-sm font-bold flex items-center gap-2 hover:bg-surface-bright transition-all"
                >
                  <span className="material-symbols-outlined">zoom_in</span> Full Screen Map
                </button>
              </div>
            </div>
          </section>

          {/* Trigger Announcement */}
          <section className="col-span-12 lg:col-span-4 bg-surface-container-high rounded-3xl p-6 flex flex-col group focus-within:ring-2 focus-within:ring-secondary/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-secondary text-2xl lg:text-3xl">campaign</span>
              <h3 className="text-lg lg:text-xl font-headline font-bold uppercase tracking-tight text-white">Broadcast Tool</h3>
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-black text-on-surface-variant mb-2 tracking-widest">Emergency or Staff Message</label>
                <textarea 
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  className="w-full h-32 lg:h-40 bg-surface-container-highest border-0 rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 font-body focus:ring-1 focus:ring-secondary/50 resize-none outline-none" 
                  placeholder="Type announcement here... e.g., Gates 4 and 5 are currently at low capacity for exit."
                ></textarea>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl cursor-pointer hover:bg-surface-container-highest transition-colors">
                  <span className="text-xs font-bold text-white">Target: All Attendees</span>
                  <div className="w-10 h-5 bg-secondary rounded-full relative flex items-center px-1">
                    <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
                  </div>
                </div>
                <button 
                  onClick={handleBroadcast}
                  className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-black uppercase tracking-widest rounded-full hover:shadow-[0_0_20px_rgba(255,116,59,0.4)] transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">send</span> Send to All
                </button>
              </div>
            </div>
          </section>

          {/* Crowd Density Table */}
          <section className="col-span-12 lg:col-span-7 bg-surface-container-low rounded-3xl p-6">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg lg:text-xl font-headline font-bold uppercase tracking-tight text-white">Real-Time Zone Density</h3>
              <span className="text-[10px] font-black bg-surface-container-highest px-3 py-1 rounded-full text-on-surface-variant uppercase">Updated live</span>
            </div>
            <div className="space-y-1">
              {/* Table Header */}
              <div className="grid grid-cols-4 px-4 py-2 text-[8px] lg:text-[10px] font-black text-on-surface-variant uppercase tracking-widest gap-2">
                <span>Zone</span>
                <span className="text-center">Capacity</span>
                <span className="text-center">Flow</span>
                <span className="text-right">Action</span>
              </div>
              {/* Table Rows */}
              <div className="grid grid-cols-4 px-2 lg:px-4 py-4 lg:py-5 items-center bg-surface rounded-2xl hover:bg-surface-container-high transition-colors gap-2 cursor-pointer">
                <span className="font-headline font-bold text-white text-xs lg:text-base">North Gate A</span>
                <div className="flex flex-col items-center">
                  <div className="w-16 lg:w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-error w-[92%]"></div>
                  </div>
                  <span className="text-[8px] lg:text-[10px] mt-1 font-bold text-white">92%</span>
                </div>
                <span className="text-center font-mono text-error font-bold text-[10px] lg:text-sm">CRIT</span>
                <div className="text-right"><span className="px-2 lg:px-3 py-1 rounded-full bg-error/10 text-error text-[8px] lg:text-[10px] font-black whitespace-nowrap">HOLD</span></div>
              </div>
              <div className="grid grid-cols-4 px-2 lg:px-4 py-4 lg:py-5 items-center bg-surface rounded-2xl hover:bg-surface-container-high transition-colors gap-2 cursor-pointer">
                <span className="font-headline font-bold text-white text-xs lg:text-base">East Concourse</span>
                <div className="flex flex-col items-center">
                  <div className="w-16 lg:w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[74%]"></div>
                  </div>
                  <span className="text-[8px] lg:text-[10px] mt-1 font-bold text-white">74%</span>
                </div>
                <span className="text-center font-mono text-secondary font-bold text-[10px] lg:text-sm">HEAVY</span>
                <div className="text-right"><span className="px-2 lg:px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[8px] lg:text-[10px] font-black whitespace-nowrap">MONITOR</span></div>
              </div>
              <div className="grid grid-cols-4 px-2 lg:px-4 py-4 lg:py-5 items-center bg-surface rounded-2xl hover:bg-surface-container-high transition-colors gap-2 cursor-pointer">
                <span className="font-headline font-bold text-white text-xs lg:text-base">VIP Lounge</span>
                <div className="flex flex-col items-center">
                  <div className="w-16 lg:w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-[31%]"></div>
                  </div>
                  <span className="text-[8px] lg:text-[10px] mt-1 font-bold text-white">31%</span>
                </div>
                <span className="text-center font-mono text-tertiary font-bold text-[10px] lg:text-sm">STEADY</span>
                <div className="text-right"><span className="px-2 lg:px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-[8px] lg:text-[10px] font-black whitespace-nowrap">CLEAR</span></div>
              </div>
            </div>
          </section>

          {/* Wait Time Management */}
          <section className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-high rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">wc</span>
                  <h4 className="font-headline font-bold uppercase text-sm text-white">Restroom Wait Times</h4>
                </div>
                <span className="text-primary font-headline text-[10px] font-bold uppercase">Dynamic Override</span>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Zone 1-4 (North)</span>
                    <span className="text-white bg-surface-container-highest px-2 py-0.5 rounded">{waitTimes.restroomNorth} MIN</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="60" 
                    value={waitTimes.restroomNorth}
                    onChange={(e) => setWaitTimes({...waitTimes, restroomNorth: e.target.value})}
                    className="w-full accent-primary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer hover:opacity-80 transition-opacity" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Zone 5-8 (South)</span>
                    <span className="text-white bg-surface-container-highest px-2 py-0.5 rounded">{waitTimes.restroomSouth} MIN</span>
                  </div>
                  <input 
                    type="range"
                    min="0" max="60" 
                    value={waitTimes.restroomSouth}
                    onChange={(e) => setWaitTimes({...waitTimes, restroomSouth: e.target.value})}
                    className="w-full accent-tertiary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer hover:opacity-80 transition-opacity" 
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface-container-high rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">fastfood</span>
                  <h4 className="font-headline font-bold uppercase text-sm text-white">Food Court Wait Times</h4>
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Main Plaza Grill</span>
                    <span className="text-white bg-surface-container-highest px-2 py-0.5 rounded">{waitTimes.foodMain} MIN</span>
                  </div>
                  <input 
                    type="range"
                    min="0" max="60" 
                    value={waitTimes.foodMain}
                    onChange={(e) => setWaitTimes({...waitTimes, foodMain: e.target.value})}
                    className="w-full accent-secondary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer hover:opacity-80 transition-opacity" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Upper Tier Snacks</span>
                    <span className="text-white bg-surface-container-highest px-2 py-0.5 rounded">{waitTimes.foodUpper} MIN</span>
                  </div>
                  <input 
                    type="range"
                    min="0" max="60" 
                    value={waitTimes.foodUpper}
                    onChange={(e) => setWaitTimes({...waitTimes, foodUpper: e.target.value})}
                    className="w-full accent-tertiary h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer hover:opacity-80 transition-opacity" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Alert Log */}
          <section className="col-span-12 bg-surface-container-low rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl lg:text-3xl">route</span>
                <h3 className="text-lg lg:text-xl font-headline font-bold uppercase tracking-tight text-white">System Smart-Route Logs</h3>
              </div>
              <button 
                onClick={() => showNotification('Logs exported to CSV successfully.', 'success')}
                className="text-[10px] font-black uppercase w-fit text-primary border border-primary/30 px-4 py-2 rounded-full hover:bg-primary/10 transition-colors"
               >
                Export CSV
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              <div className="bg-surface-container rounded-2xl p-4 flex gap-4 border-l-4 border-primary hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl lg:text-2xl">auto_awesome</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Diverted North Gate traffic to East Gate.</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">14:32 • 4,200 Attendeed reached</p>
                </div>
              </div>
              <div className="bg-surface-container rounded-2xl p-4 flex gap-4 border-l-4 border-tertiary hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-tertiary/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-tertiary text-xl lg:text-2xl">info</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Restroom occupancy alert: Suggesting Zone 4.</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">14:28 • 850 Attendees reached</p>
                </div>
              </div>
              <div className="bg-surface-container rounded-2xl p-4 flex gap-4 border-l-4 border-secondary hover:bg-surface-container-highest transition-colors cursor-pointer">
                <div className="w-10 lg:w-12 h-10 lg:h-12 bg-secondary/10 rounded-xl flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-secondary text-xl lg:text-2xl">warning</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-white mb-1">Concession congestion: 15% discount push.</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">14:15 • Global push notification</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      {/* Floating Action for Mobile (Hidden on Desktop) */}
      <button 
        onClick={() => {
            setActiveTab('Announcements');
            showNotification('Switched to Quick Announcement Mode', 'info');
        }}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary rounded-full shadow-2xl flex items-center justify-center text-on-primary-container z-[110] active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined">campaign</span>
      </button>
    </div>
  );
}
