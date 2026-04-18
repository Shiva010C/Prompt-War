export default function NotificationsModal({ visible, onClose }) {
  if (!visible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="fixed top-20 right-4 lg:right-8 z-[260] w-[calc(100%-2rem)] max-w-sm bg-surface-container-high rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 animate-in slide-in-from-top-8 duration-300">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <h3 className="font-headline font-black text-white text-sm uppercase tracking-widest">Notifications</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="p-4 space-y-3">
            {/* Notification 1 */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-4 border-l-4 border-error cursor-pointer transition-colors relative group">
              <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-error animate-pulse"></span>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-error shrink-0">campaign</span>
                <div>
                  <h4 className="text-white font-bold text-sm">Global Announcement</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Match delayed by 15 minutes due to weather. Please seek cover in the concourse.</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">Just now</p>
                </div>
              </div>
            </div>

            {/* Notification 2 */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-4 border-l-4 border-secondary cursor-pointer transition-colors">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-secondary shrink-0">room_service</span>
                <div>
                  <h4 className="text-white font-bold text-sm">Order Ready</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Your order from The Burger Joint is ready for pickup at Point B.</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">5 mins ago</p>
                </div>
              </div>
            </div>

            {/* Notification 3 */}
            <div className="bg-surface-container-low hover:bg-surface-container rounded-2xl p-4 border-l-4 border-tertiary cursor-pointer transition-colors opacity-70">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-tertiary shrink-0">local_activity</span>
                <div>
                  <h4 className="text-white font-bold text-sm">Ticket Scanned</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Entry successful at Gate 4. Welcome to the Final!</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 bg-surface-container-lowest border-t border-white/5 text-center">
            <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline active:scale-95 transition-all">
                Mark all as read
            </button>
        </div>
      </div>
    </>
  );
}
