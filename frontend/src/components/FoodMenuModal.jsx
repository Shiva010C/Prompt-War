import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function FoodMenuModal({ activeMenu, setActiveMenu, mockMenus }) {
  const { handleQuickAdd } = useCart();
  const { showNotification } = useToast();

  if (!activeMenu) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center animate-in fade-in duration-200">
      <div className="bg-surface-container-high w-full lg:max-w-md lg:rounded-3xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8">
        <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <h3 className="text-2xl font-headline font-black text-white">{activeMenu}</h3>
          <button 
             onClick={() => setActiveMenu(null)} 
             className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center text-white hover:bg-surface-variant active:scale-95"
             aria-label="Close menu"
          >
            <span className="material-symbols-outlined text-sm" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {mockMenus[activeMenu]?.map(item => (
            <div key={item.name} className="flex justify-between items-center bg-surface-container rounded-2xl p-4">
              <div>
                <h4 className="font-bold text-white text-sm">{item.name}</h4>
                <span className="text-secondary font-bold text-xs">${item.price}</span>
              </div>
              <button 
                onClick={() => {
                   handleQuickAdd(item.name, item.price);
                   showNotification(`${item.name} added to cart!`, 'success');
                }}
                className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-primary/30 active:scale-95"
                aria-label={`Add ${item.name} to cart`}
              >
                <span className="material-symbols-outlined text-xl" aria-hidden="true">add</span>
              </button>
            </div>
          ))}
        </div>
        <button 
            onClick={() => setActiveMenu(null)}
            className="w-full mt-6 py-4 bg-surface-container-highest text-white font-bold rounded-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
            aria-label="Done Browsing"
        >
          Done Browsing
        </button>
      </div>
    </div>
  );
}
