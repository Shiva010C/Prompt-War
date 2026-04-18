import { useCart } from '../context/CartContext';

export default function CartDrawer({ showCart, setShowCart }) {
  const { cart, totalCartPrice, handleRemoveItem, checkout } = useCart();

  if (!showCart) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end lg:items-center justify-center lg:justify-end lg:pr-8 animate-in fade-in duration-200">
      <div className="bg-surface-container-high w-full lg:max-w-sm h-[80vh] lg:h-[90vh] lg:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8">
        <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">shopping_cart</span>
            <h3 className="text-xl font-headline font-black text-white">Your Cart</h3>
          </div>
          <button 
            onClick={() => setShowCart(false)} 
            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-white active:scale-95"
            aria-label="Close Cart"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-4 opacity-50" aria-hidden="true">shopping_bag</span>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.name} className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-white/5">
                <div className="flex-1">
                  <h4 className="font-bold text-white text-sm">{item.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-secondary font-bold text-xs">${item.price * item.qty}</span>
                    <span className="text-[10px] bg-surface-container-highest px-2 py-0.5 rounded text-white font-black">x{item.qty}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveItem(item.name)}
                  className="w-8 h-8 rounded-full bg-error/10 text-error flex items-center justify-center hover:bg-error/20 active:scale-95 ml-3 shrink-0"
                  aria-label={`Remove ${item.name}`}
                >
                  <span className="material-symbols-outlined text-sm" aria-hidden="true">delete</span>
                </button>
              </div>
            ))
          )}
        </div>
        <div className="p-6 bg-surface-container border-t border-white/5 shrink-0 rounded-b-3xl">
          <div className="flex justify-between items-center mb-6">
            <span className="text-on-surface-variant font-bold text-sm">Total</span>
            <span className="text-2xl font-black font-headline text-white">${totalCartPrice}</span>
          </div>
          <button 
            onClick={() => { checkout(); setShowCart(false); }}
            disabled={cart.length === 0}
            aria-label="Checkout"
            className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
          >
            Checkout Now
          </button>
        </div>
      </div>
    </div>
  );
}
