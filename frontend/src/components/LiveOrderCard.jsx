import { useToast } from '../context/ToastContext';

export default function LiveOrderCard({ activeOrder, notifyReady, setNotifyReady }) {
  const { showNotification } = useToast();

  if (!activeOrder) return null;

  return (
    <section className="mt-4 animate-in fade-in duration-500" aria-label="Live Order Status">
      <div className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-6 shadow-2xl shadow-tertiary/10 relative overflow-hidden group border border-tertiary/20">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="flex justify-between items-start relative z-10">
            <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Active Order</span>
            <h2 className="text-2xl font-headline font-bold text-white">Your Pickup Order</h2>
            <div className="text-sm font-medium text-slate-400 mt-1">{activeOrder.length} items preparing</div>
            </div>
            <div className="flex flex-col items-end">
            <span className="text-xs font-medium text-on-surface-variant uppercase mb-1">Estimated Ready</span>
            <div className="text-4xl font-headline font-black text-tertiary tracking-tighter">12:00</div>
            </div>
        </div>
        <div className="mt-6 space-y-2 relative z-10">
            <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-tertiary to-[#a2fca2] w-[25%] rounded-full shadow-[0_0_12px_rgba(162,252,162,0.4)] transition-all duration-1000"></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
            <span className="text-tertiary">Received</span>
            <span>Preparing</span>
            <span>Ready</span>
            </div>
        </div>
        <div className="mt-6 flex items-center justify-between bg-surface-container-lowest/40 p-4 rounded-2xl border border-outline-variant/10 relative z-10">
            <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-tertiary" aria-hidden="true">alarm</span>
            <div>
                <p className="text-sm font-bold text-white">Notify when ready</p>
                <p className="text-[11px] text-on-surface-variant">Push notification to your device</p>
            </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
            <input 
                checked={notifyReady}
                onChange={(e) => {
                  setNotifyReady(e.target.checked);
                  showNotification(e.target.checked ? 'Notifications turned on' : 'Notifications turned off', 'info');
                }}
                className="sr-only peer" 
                type="checkbox"
                aria-label="Toggle ready notification"
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
            </label>
        </div>
      </div>
    </section>
  );
}
