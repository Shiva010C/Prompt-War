import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { sendBroadcast, updateWaitTime, updateOrderStatus, resolveIncident } from '../lib/api.js';

export default function Admin() {
  const { user, logout } = useAuth();
  const { showNotification } = useToast();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [broadcastText, setBroadcastText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Live Firestore State
  const [activeOrders, setActiveOrders] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [waitTimes, setWaitTimes] = useState({
    restroomNorth: 12,
    restroomSouth: 4,
    foodMain: 25,
    foodUpper: 2,
  });

  // Real-time Firestore listeners
  useEffect(() => {
    const ordersQ = query(
      collection(db, 'orders'),
      where('status', 'in', ['Received', 'Preparing', 'Ready']),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(ordersQ, (snap) => {
      setActiveOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const incidentsQ = query(
      collection(db, 'incidents'),
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc')
    );
    const unsubIncidents = onSnapshot(incidentsQ, (snap) => {
      setIncidents(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      if (snap.docChanges().some(c => c.type === 'added')) {
        showNotification('🚨 New incident reported!', 'error');
      }
    });

    const waitTimesQ = collection(db, 'wait_times');
    const unsubWait = onSnapshot(waitTimesQ, (snap) => {
      const data = {};
      snap.forEach(d => { data[d.id] = d.data().estimatedWaitMinutes; });
      if (Object.keys(data).length > 0) setWaitTimes(prev => ({ ...prev, ...data }));
    });

    return () => { unsubOrders(); unsubIncidents(); unsubWait(); };
  }, [showNotification]);

  const handleBroadcast = async () => {
    const text = broadcastText.trim();
    if (!text) { showNotification('Please enter an announcement.', 'error'); return; }
    setIsSending(true);
    try {
      await sendBroadcast(text);
      setBroadcastText('');
      showNotification('Global broadcast sent to all attendees!', 'success');
    } catch (err) {
      showNotification(`Failed: ${err.message}`, 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleWaitTimeUpdate = async (zone, value) => {
    const minutes = Number(value);
    setWaitTimes(prev => ({ ...prev, [zone]: minutes }));
    try {
      await updateWaitTime(zone, minutes);
    } catch (err) {
      showNotification(`Failed to sync ${zone}: ${err.message}`, 'error');
    }
  };

  const handleOrderStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      showNotification(`Order updated to "${status}"`, 'success');
    } catch (err) {
      showNotification(`Failed: ${err.message}`, 'error');
    }
  };

  const handleResolveIncident = async (incidentId) => {
    try {
      await resolveIncident(incidentId);
      showNotification('Incident resolved.', 'success');
    } catch (err) {
      showNotification(`Failed: ${err.message}`, 'error');
    }
  };

  return (
    <div className="flex h-screen w-full bg-surface text-on-surface overflow-hidden absolute inset-0 z-[100]">
      {/* Sidebar */}
      <aside className="h-full w-64 border-r border-slate-800 bg-slate-900 flex flex-col py-8 shrink-0 relative z-20">
        <div className="px-6 mb-10">
          <h2 className="text-blue-400 font-bold tracking-tighter text-xl font-headline">ADMIN CONTROL</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1" aria-label="Admin Navigation">
          <ul className="space-y-1">
            {[
              { id: 'Dashboard', icon: 'dashboard' },
              { id: 'Orders', icon: 'receipt_long', badge: activeOrders.length || null },
              { id: 'Incidents', icon: 'emergency', badge: incidents.length || null },
              { id: 'Announcements', icon: 'campaign' },
              { id: 'Wait Times', icon: 'schedule' },
            ].map(tab => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-4 px-6 py-4 transition-all duration-200 cursor-pointer ${activeTab === tab.id ? 'bg-blue-600/10 text-blue-400 border-r-4 border-blue-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">{tab.icon}</span>
                  <span className="font-headline font-medium flex-1 text-left">{tab.id}</span>
                  {tab.badge ? (
                    <span className="w-5 h-5 bg-error rounded-full text-white text-[10px] font-black flex items-center justify-center animate-pulse">{tab.badge}</span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-6 pt-6 border-t border-slate-800">
          <button onClick={logout} className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full">
            <span className="material-symbols-outlined" aria-hidden="true">logout</span>
            <span className="text-sm font-bold">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-50 bg-slate-950/60 backdrop-blur-xl flex justify-between items-center px-8 h-16 border-b border-slate-800">
          <h1 className="text-xl font-black italic text-blue-400 font-headline tracking-tight uppercase">{activeTab}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full border border-outline-variant/20">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">Live</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6 pb-24">

          {/* ── DASHBOARD ── */}
          {activeTab === 'Dashboard' && (
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1 bg-surface-container-high rounded-3xl p-6 flex flex-col gap-2">
                <span className="material-symbols-outlined text-secondary text-3xl" aria-hidden="true">receipt_long</span>
                <p className="text-4xl font-black font-headline text-white">{activeOrders.length}</p>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Active Orders</p>
              </div>
              <div className="col-span-1 bg-surface-container-high rounded-3xl p-6 flex flex-col gap-2">
                <span className="material-symbols-outlined text-error text-3xl" aria-hidden="true">emergency</span>
                <p className="text-4xl font-black font-headline text-white">{incidents.length}</p>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Active Incidents</p>
              </div>
              <div className="col-span-1 bg-surface-container-high rounded-3xl p-6 flex flex-col gap-2">
                <span className="material-symbols-outlined text-tertiary text-3xl" aria-hidden="true">schedule</span>
                <p className="text-4xl font-black font-headline text-white">{Object.values(waitTimes).reduce((a, b) => a + Number(b), 0)}</p>
                <p className="text-on-surface-variant text-sm font-bold uppercase tracking-widest">Total Wait Minutes</p>
              </div>
            </div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'Orders' && (
            <div className="space-y-4">
              {activeOrders.length === 0 && (
                <div className="text-center py-20 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-3 block" aria-hidden="true">receipt_long</span>
                  <p>No active orders right now.</p>
                </div>
              )}
              {activeOrders.map(order => (
                <div key={order.id} className="bg-surface-container-high rounded-3xl p-6 flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        order.status === 'Received' ? 'bg-secondary/20 text-secondary' :
                        order.status === 'Preparing' ? 'bg-primary/20 text-primary' :
                        'bg-tertiary/20 text-tertiary'
                      }`}>{order.status}</span>
                      <span className="text-slate-500 text-xs">#{order.id.slice(-6)}</span>
                    </div>
                    <ul className="space-y-1">
                      {order.items?.map(item => (
                        <li key={item.name} className="text-sm text-white">
                          {item.qty}x {item.name} — <span className="text-secondary">${item.price * item.qty}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-slate-500 text-xs mt-2">{order.userEmail}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {order.status === 'Received' && (
                      <button onClick={() => handleOrderStatus(order.id, 'Preparing')} className="px-4 py-2 bg-primary/20 text-primary rounded-xl text-xs font-bold hover:bg-primary hover:text-white active:scale-95 transition-all">
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button onClick={() => handleOrderStatus(order.id, 'Ready')} className="px-4 py-2 bg-tertiary/20 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary hover:text-white active:scale-95 transition-all">
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'Ready' && (
                      <button onClick={() => handleOrderStatus(order.id, 'Completed')} className="px-4 py-2 bg-slate-700 text-slate-300 rounded-xl text-xs font-bold active:scale-95 transition-all">
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── INCIDENTS ── */}
          {activeTab === 'Incidents' && (
            <div className="space-y-4">
              {incidents.length === 0 && (
                <div className="text-center py-20 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-3 block" aria-hidden="true">check_circle</span>
                  <p>No active incidents. All clear!</p>
                </div>
              )}
              {incidents.map(inc => (
                <div key={inc.id} className="bg-surface-container-high rounded-3xl p-6 flex justify-between items-center gap-6 border border-error/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-error/20 rounded-2xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-error" aria-hidden="true">
                        {inc.type === 'sos' ? 'emergency_home' : inc.type === 'medical' ? 'medical_services' : inc.type === 'security' ? 'shield_with_heart' : 'search_check'}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-white uppercase text-sm">{inc.type} alert</p>
                      <p className="text-slate-400 text-xs">Location: {inc.location}</p>
                      <p className="text-slate-500 text-xs">{inc.userEmail}</p>
                    </div>
                  </div>
                  <button onClick={() => handleResolveIncident(inc.id)} className="px-4 py-2 bg-tertiary/20 text-tertiary rounded-xl text-xs font-bold hover:bg-tertiary hover:text-white active:scale-95 transition-all">
                    Resolve
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {activeTab === 'Announcements' && (
            <div className="max-w-xl">
              <div className="bg-surface-container-high rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-secondary text-2xl" aria-hidden="true">campaign</span>
                  <h3 className="text-xl font-headline font-bold text-white uppercase">Broadcast Tool</h3>
                </div>
                <label htmlFor="broadcast-input" className="block text-[10px] uppercase font-black text-on-surface-variant mb-2 tracking-widest">
                  Announcement Message (max 280 chars)
                </label>
                <textarea
                  id="broadcast-input"
                  value={broadcastText}
                  onChange={(e) => setBroadcastText(e.target.value)}
                  maxLength={280}
                  rows={5}
                  className="w-full bg-surface-container-highest rounded-2xl p-4 text-sm text-white placeholder:text-slate-600 focus:ring-1 focus:ring-secondary/50 resize-none outline-none mb-6"
                  placeholder="e.g. Gates 4 and 5 now available for faster exit..."
                />
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">{broadcastText.length}/280</span>
                  <button
                    onClick={handleBroadcast}
                    disabled={isSending}
                    className="px-8 py-4 bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-black uppercase tracking-widest rounded-full active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSending ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined" aria-hidden="true">send</span>}
                    Send to All
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── WAIT TIMES ── */}
          {activeTab === 'Wait Times' && (
            <div className="max-w-xl space-y-6">
              {[
                { key: 'restroomNorth', label: 'Restroom Zone 1-4 (North)', color: 'accent-primary' },
                { key: 'restroomSouth', label: 'Restroom Zone 5-8 (South)', color: 'accent-tertiary' },
                { key: 'foodMain', label: 'Main Plaza Grill', color: 'accent-secondary' },
                { key: 'foodUpper', label: 'Upper Tier Snacks', color: 'accent-tertiary' },
              ].map(({ key, label, color }) => (
                <div key={key} className="bg-surface-container-high rounded-3xl p-6">
                  <div className="flex justify-between text-xs font-bold mb-3">
                    <label htmlFor={key} className="text-on-surface-variant">{label}</label>
                    <span className="text-white bg-surface-container-highest px-2 py-0.5 rounded">{waitTimes[key]} MIN</span>
                  </div>
                  <input
                    id={key}
                    type="range"
                    min="0"
                    max="60"
                    value={waitTimes[key]}
                    onChange={(e) => handleWaitTimeUpdate(key, e.target.value)}
                    className={`w-full ${color} h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
