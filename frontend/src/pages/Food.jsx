import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DesktopLayout from '../components/DesktopLayout';
import FoodMenuModal from '../components/FoodMenuModal';
import CartDrawer from '../components/CartDrawer';
import LiveOrderCard from '../components/LiveOrderCard';
import FoodStands from '../components/FoodStands';
import { useCart } from '../context/CartContext';

// Mock Menu options moved outside component render cycle
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

export default function Food() {
  const navigate = useNavigate();
  const [notifyReady, setNotifyReady] = useState(true);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);
  
  const { cart, activeOrder, totalCartPrice, handleQuickAdd } = useCart();

  const content = (
    <div className="pt-20 px-6 max-w-5xl mx-auto space-y-8 pb-32 w-full relative">
      <FoodMenuModal activeMenu={activeMenu} setActiveMenu={setActiveMenu} mockMenus={mockMenus} />
      <CartDrawer showCart={showCart} setShowCart={setShowCart} />

      {/* Floating Action Button for Cart (renders only if items exist) */}
      {cart.length > 0 && !showCart && (
        <button 
            onClick={() => setShowCart(true)}
            aria-label={`View cart with ${cart.reduce((a,c)=>a+c.qty,0)} items`}
            className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[100] bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom hover:-translate-y-1 transition-all group"
        >
            <div className="relative">
                <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white text-[10px] font-black flex items-center justify-center rounded-full animate-pulse">{cart.reduce((a,c)=>a+c.qty,0)}</span>
            </div>
            <span className="font-bold text-sm uppercase tracking-widest hidden lg:block group-hover:block ml-2">${totalCartPrice}</span>
        </button>
      )}

      {/* Live Order Status Section (Order Status View) */}
      {activeOrder ? (
         <LiveOrderCard activeOrder={activeOrder} notifyReady={notifyReady} setNotifyReady={setNotifyReady} />
      ) : (
        <section className="mt-4">
            <div className="bg-surface-container-high rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container-highest transition-colors">
                <div className="flex gap-3 text-4xl lg:text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-xl" aria-hidden="true">
                    <span className="animate-bounce" style={{animationDelay: '0ms'}}>🍔</span>
                    <span className="animate-bounce" style={{animationDelay: '150ms'}}>🍕</span>
                    <span className="animate-bounce" style={{animationDelay: '300ms'}}>🌭</span>
                </div>
                <h3 className="text-2xl font-headline font-black text-white mb-2 tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">Hungry?</h3>
                <p className="text-sm text-slate-400">Order your match day favorites from vendors below.</p>
            </div>
        </section>
      )}

      {/* Bento Grid: Food Selection & Map */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Map Snippet (Asymmetric layout) */}
        <div className="md:col-span-2 bg-surface-container rounded-3xl overflow-hidden relative min-h-[280px]">
          <div className="absolute inset-0 grayscale contrast-125 brightness-50">
            <img loading="lazy" decoding="async" alt="Pickup Map highlighting Gate B" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_PLVODVVPpnEIDHifWhcly5tMpsEzzGHRUcMHQS3AnAlJ9xUusF66ezUaMC_ovlIBpnn8UFYCVi5uK-Jlgr09GCHO2BZLsN4GcJQbO8phjw2S-1O0GKiZ6hyTnbuVR1XKKwAvOjHjwre6YaDb8og2uhfjZvosfeJ03vQCvHGMm-oYJnupcvRz9Dege8olam8ll6rYOCRkYhqHi-q-HXJ0mQ654T-n_aTaTwDyOxsNWybCVypWiJaYiw0_5ab7QxX0Unj2rPVWS7G5"/>
          </div>
          {/* Glass Overlay for Location Info */}
          <div className="absolute bottom-4 left-4 right-4 bg-surface-bright/60 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-lg shadow-secondary/20">
                <span className="material-symbols-outlined" aria-hidden="true" style={{fontVariationSettings: "'FILL' 1"}}>location_on</span>
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

        {/* Promotion / Quick Add */}
        <div className="bg-secondary p-6 rounded-3xl flex flex-col justify-between text-on-secondary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500 hidden md:block pointer-events-none"></div>
          <span className="material-symbols-outlined text-4xl relative z-10 animate-pulse" aria-hidden="true">local_fire_department</span>
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

      {/* Categories / Food Stands via Component */}
      <FoodStands setActiveMenu={setActiveMenu} />
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
