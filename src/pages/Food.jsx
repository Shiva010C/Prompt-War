import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopLayout from '../components/DesktopLayout';
import Toast from '../components/Toast';

export default function Food() {
  const navigate = useNavigate();
  const [notifyReady, setNotifyReady] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  
  // New States for enhanced functionality
  const [cart, setCart] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); // Which vendor's menu is open
  const [showCart, setShowCart] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null); // The order currently being processed

  const showNotification = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleQuickAdd = (item, price) => {
    setCart(prev => {
      const existing = prev.find(i => i.name === item);
      if (existing) {
        return prev.map(i => i.name === item ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { name: item, price, qty: 1 }];
    });
    showNotification(`${item} added to cart!`, 'success');
  };

  const handleRemoveItem = (item) => {
    setCart(prev => prev.filter(i => i.name !== item));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setActiveOrder(cart);
    setCart([]);
    setShowCart(false);
    showNotification('Order placed successfully!', 'success');
  };

  const totalCartPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // Mock Menu options
  const mockMenus = {
    'The Burger Joint': [
      { name: 'Classic MVP Burger', price: 14 },
      { name: 'Plant-Based Smash', price: 16 },
      { name: 'Loaded Fries', price: 8 },
    ],
    'Stadium Classics': [
      { name: 'Footlong Dog', price: 10 },
      { name: 'Giant Pretzel', price: 7 },
      { name: 'Nachos Supreme', price: 12 },
    ],
    'Brick Oven Pizza': [
      { name: 'Cheese Slice', price: 6 },
      { name: 'Pepperoni Slice', price: 7 },
      { name: 'Whole Vegan Pie', price: 24 },
    ]
  };

  const content = (
    <div className="pt-20 px-6 max-w-5xl mx-auto space-y-8 pb-32 w-full relative">
      <Toast 
        visible={toast.visible} 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast(prev => ({ ...prev, visible: false }))} 
      />

      {/* Menu Modal */}
      {activeMenu && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-end lg:items-center justify-center animate-in fade-in duration-200">
          <div className="bg-surface-container-high w-full lg:max-w-md lg:rounded-3xl rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 className="text-2xl font-headline font-black text-white">{activeMenu}</h3>
              <button onClick={() => setActiveMenu(null)} className="w-8 h-8 bg-surface-container-highest rounded-full flex items-center justify-center text-white hover:bg-surface-variant active:scale-95">
                <span className="material-symbols-outlined text-sm">close</span>
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
                    onClick={() => handleQuickAdd(item.name, item.price)}
                    className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-colors border border-primary/30 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-xl">add</span>
                  </button>
                </div>
              ))}
            </div>
            <button 
                onClick={() => setActiveMenu(null)}
                className="w-full mt-6 py-4 bg-surface-container-highest text-white font-bold rounded-xl active:scale-95 transition-all text-sm uppercase tracking-widest"
            >
              Done Browsing
            </button>
          </div>
        </div>
      )}

      {/* Cart Drawer/Modal */}
      {showCart && (
        <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-end lg:items-center justify-center lg:justify-end lg:pr-8 animate-in fade-in duration-200">
          <div className="bg-surface-container-high w-full lg:max-w-sm h-[80vh] lg:h-[90vh] lg:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8">
            <div className="p-6 flex justify-between items-center border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart</span>
                <h3 className="text-xl font-headline font-black text-white">Your Cart</h3>
              </div>
              <button onClick={() => setShowCart(false)} className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-white active:scale-95">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl mb-4 opacity-50">shopping_bag</span>
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
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
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
                onClick={handleCheckout}
                disabled={cart.length === 0}
                className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-black rounded-xl uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
              >
                Checkout Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button for Cart (renders only if items exist) */}
      {cart.length > 0 && !showCart && (
        <button 
            onClick={() => setShowCart(true)}
            className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[100] bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom hover:-translate-y-1 transition-all group"
        >
            <div className="relative">
                <span className="material-symbols-outlined">shopping_cart</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white text-[10px] font-black flex items-center justify-center rounded-full animate-pulse">{cart.reduce((a,c)=>a+c.qty,0)}</span>
            </div>
            <span className="font-bold text-sm uppercase tracking-widest hidden lg:block group-hover:block ml-2">${totalCartPrice}</span>
        </button>
      )}

      {/* Live Order Status Section (Order Status View) */}
      {activeOrder ? (
         <section className="mt-4 animate-in fade-in duration-500">
            <div className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-6 shadow-2xl shadow-tertiary/10 relative overflow-hidden group border border-tertiary/20">
            {/* Kinetic Background Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Active Order</span>
                <h2 className="text-2xl font-headline font-bold text-white">Your Pickup Order</h2>
                <div className="text-sm font-medium text-slate-400 mt-1">{activeOrder.length} items preparing</div>
                </div>
                <div className="flex flex-col items-end">
                <span className="text-xs font-medium text-on-surface-variant uppercase mb-1">Estimated Ready</span>
                <div className="text-4xl font-headline font-black text-tertiary tracking-tighter">12:00</div>
                </div>
            </div>
            {/* Visual Progress Bar */}
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
            {/* Notification Toggle */}
            <div className="mt-6 flex items-center justify-between bg-surface-container-lowest/40 p-4 rounded-2xl border border-outline-variant/10 relative z-10">
                <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-tertiary">alarm</span>
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
                />
                <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tertiary"></div>
                </label>
            </div>
            </div>
        </section>
      ) : (
        <section className="mt-4">
            <div className="bg-surface-container-high rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container-highest transition-colors">
                <div className="flex gap-3 text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-xl">
                    <span className="animate-bounce" style={{animationDelay: '0ms'}}>🍔</span>
                    <span className="animate-bounce" style={{animationDelay: '150ms'}}>🍕</span>
                    <span className="animate-bounce" style={{animationDelay: '300ms'}}>🌭</span>
                </div>
                <h3 className="text-2xl font-headline font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Hungary?</h3>
                <p className="text-sm text-slate-400">Order your match day favorites from vendors below.</p>
            </div>
        </section>
      )}

      {/* Bento Grid: Food Selection & Map */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Snippet (Asymmetric layout) */}
        <div className="md:col-span-2 bg-surface-container rounded-3xl overflow-hidden relative min-h-[280px]">
          <div className="absolute inset-0 grayscale contrast-125 brightness-50">
            <img alt="Pickup Map" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_PLVODVVPpnEIDHifWhcly5tMpsEzzGHRUcMHQS3AnAlJ9xUusF66ezUaMC_ovlIBpnn8UFYCVi5uK-Jlgr09GCHO2BZLsN4GcJQbO8phjw2S-1O0GKiZ6hyTnbuVR1XKKwAvOjHjwre6YaDb8og2uhfjZvosfeJ03vQCvHGMm-oYJnupcvRz9Dege8olam8ll6rYOCRkYhqHi-q-HXJ0mQ654T-n_aTaTwDyOxsNWybCVypWiJaYiw0_5ab7QxX0Unj2rPVWS7G5"/>
          </div>
          {/* Glass Overlay for Location Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-surface-bright/60 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Pickup Point B</h4>
                <p className="text-xs text-slate-300">Level 2, North Concourse</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/map')}
              className="bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              Directions
            </button>
          </div>
        </div>

        {/* Promotion / Quick Add (High Contrast) */}
        <div className="bg-secondary p-6 rounded-3xl flex flex-col justify-between text-on-secondary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500 hidden md:block pointer-events-none"></div>
          <span className="material-symbols-outlined text-4xl relative z-10 animate-pulse">local_fire_department</span>
          <div className="relative z-10">
            <h3 className="font-headline font-black text-2xl leading-tight uppercase italic">Match Day Special</h3>
            <p className="text-sm font-medium opacity-80 mt-2">Double MVP Burger + Large Fries & Soda</p>
          </div>
          <button 
            onClick={() => handleQuickAdd("Match Day Special Combo", 18)}
            className="mt-6 w-full py-4 bg-on-secondary text-secondary font-bold rounded-full uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all relative z-10"
          >
            Quick Add - $18
          </button>
        </div>
      </section>

      {/* Categories / Food Stands */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-headline font-black uppercase italic tracking-tighter text-white">Food Stands</h3>
          <div className="flex gap-2">
            <div className="bg-tertiary-container text-on-tertiary-container text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Open Now</div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Food Card 1 */}
          <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
            <div className="h-40 overflow-hidden relative">
              <img alt="Burgers" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_k4MS5XaC2uol8F9plPYskfMURqCwTndxkKjfqQi4FrwGN7RIR9TOxnV4qnYcJhcWxf9oGK74To0kKgGVKrbg1etn-VvU7xfWVDRmtf3EXrFzcO9FH2-U_bhoT4cMxern2CkyQ049SR273A2fp-Wm9IIhkrbBiqZ8HspIKmcUitlNlHvQxTXgUD7JayyQ0wH2RvNgSTgustRDom7lVfY3Q2qREnsb1FqFk-z0_dgNr3t2xSjgT0a071MmuJt4BWtF-42p0EMYLSTd"/>
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-tertiary text-xs" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                <span className="text-xs font-bold text-white">4.8</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-headline font-bold text-lg text-white">The Burger Joint</h4>
                <p className="text-xs text-slate-400">Artisan beef, plant-based options</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Burgers</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Fries</span>
              </div>
              <button 
                onClick={() => setActiveMenu('The Burger Joint')}
                className="w-full py-3 bg-surface-container-highest text-primary font-bold rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
              >
                View Menu
              </button>
            </div>
          </div>

          {/* Food Card 2 */}
          <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-transparent hover:border-primary/20">
            <div className="h-40 overflow-hidden relative" >
              <img alt="Hot Dogs" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBB52BaJld7D7vc6QBcY3AZw-QJRuOqq1AmpqCjxGS7H_SFZvL2GLDfX-zeuzvgXhqES9wJnjiVITSq9D_vnKeC2cT4wQspTI__TUA5EdaGrgJMZG8mfT1YLjt2DQ92NgMjwkwWGdfatp1Ats4kzaBhoUyWQ6Km9a1hRgWPjYmxZmp70vPYscVGS_tnwnYcs0k7q6lDL1JfxXlWFC14lHJPmLgiLaGZ3FK07tEB4uzEFDxnDXqBokcE7JHHlv24lxi9OuN4V9DRWnSV"/>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-headline font-bold text-lg text-white">Stadium Classics</h4>
                <p className="text-xs text-slate-400">Footlong dogs, Pretzels, Nachos</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Hot Dogs</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Snacks</span>
              </div>
              <button 
                onClick={() => setActiveMenu('Stadium Classics')}
                className="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary-container font-black rounded-xl uppercase text-[10px] tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
              >
                Select Items
              </button>
            </div>
          </div>

          {/* Food Card 3 */}
          <div className="bg-surface-container-low rounded-3xl overflow-hidden group hover:bg-surface-container-high transition-all duration-300">
            <div className="h-40 overflow-hidden relative">
              <img alt="Pizza" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHxdj8TfG_v84bPXrr1nlekAgBkb29HRYnuaEURko0s1MTHMHLvVb5hyvj8A0mMqv2YTNlRa2SdYIabp50gM0FyBuRP1epzJaLB89eYREL5_1nP8js2QJUHPndoQvlY7YVlpgm6HhcO0ZeDfl-Y9qb3Vpa4l7Hjkt4442JfNW7RSold6paeHN6JzlLq5IbYO7necM_HnTpUAIVrUpsmDf1rMTO5lL-FUFs6LT07MtqlDnABLBaiG5DU27nOz5ekkjtQYjErh4nBnmG"/>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-headline font-bold text-lg text-white">Brick Oven Pizza</h4>
                <p className="text-xs text-slate-400">Traditional wood-fired slices</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Pizza</span>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-variant text-slate-300 rounded-md uppercase tracking-wider">Vegan</span>
              </div>
              <button 
                onClick={() => setActiveMenu('Brick Oven Pizza')}
                className="w-full py-3 bg-surface-container-highest text-primary font-bold rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-on-primary active:scale-95 transition-all"
              >
                View Menu
              </button>
            </div>
          </div>
        </div>
      </section>
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
