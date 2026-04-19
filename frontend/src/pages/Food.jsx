import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import DesktopLayout from '../components/DesktopLayout';
import FoodMenuModal from '../components/FoodMenuModal';
import CartDrawer from '../components/CartDrawer';
import FoodStands from '../components/FoodStands';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { placeOrder } from '../lib/api.js';

// Mock Menus (could eventually come from Firestore 'menu' collection)
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
  ],
};

export default function Food() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useToast();
  const { cart, totalCartPrice, handleQuickAdd, checkout } = useCart();

  const [activeMenu, setActiveMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [activeOrder, setActiveOrder] = useState(null);

  // Real-time: Listen to user's latest active order from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );
    const unsub = onSnapshot(q, (snap) => {
      const myOrders = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(o => o.userId === user.uid && ['Received', 'Preparing', 'Ready'].includes(o.status));
      setActiveOrder(myOrders[0] || null);
    });
    return () => unsub();
  }, [user]);

  // Real checkout: sends cart to backend, creates Firestore order
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!user) {
      showNotification('Please sign in to place an order.', 'error');
      return;
    }
    setIsCheckingOut(true);
    try {
      const result = await placeOrder(cart);
      checkout(); // Clear local cart
      setShowCart(false);
      showNotification(`Order placed! Est. ready in ${result.estimatedReadyMinutes} mins.`, 'success');
    } catch (err) {
      showNotification(`Order failed: ${err.message}`, 'error');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const content = (
    <div className="pt-4 px-2 max-w-5xl mx-auto space-y-8 pb-6 w-full relative">
      <FoodMenuModal activeMenu={activeMenu} setActiveMenu={setActiveMenu} mockMenus={mockMenus} />
      <CartDrawer showCart={showCart} setShowCart={setShowCart} onCheckout={handleCheckout} isCheckingOut={isCheckingOut} />

      {/* Floating Cart Button */}
      {cart.length > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          aria-label={`View cart with ${cart.reduce((a, c) => a + c.qty, 0)} items`}
          className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[100] bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom hover:-translate-y-1 transition-all group"
        >
          <div className="relative">
            <span className="material-symbols-outlined" aria-hidden="true">shopping_cart</span>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-error text-white text-[10px] font-black flex items-center justify-center rounded-full animate-pulse">
              {cart.reduce((a, c) => a + c.qty, 0)}
            </span>
          </div>
          <span className="font-bold text-sm uppercase tracking-widest hidden lg:block ml-2">${totalCartPrice}</span>
        </button>
      )}

      {/* Live Order Status (from Firestore) */}
      {activeOrder ? (
        <section className="mt-4 animate-in fade-in duration-500" aria-label="Live Order Status">
          <div className="bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-6 shadow-2xl shadow-tertiary/10 relative overflow-hidden border border-tertiary/20">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-tertiary/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span> Active Order
                </span>
                <h2 className="text-2xl font-headline font-bold text-white">Your Pickup Order</h2>
                <div className="text-sm font-medium text-slate-400 mt-1">{activeOrder.items?.length} items — ${activeOrder.totalCost}</div>
              </div>
              <div className={`px-4 py-2 rounded-full text-xs font-black uppercase ${
                activeOrder.status === 'Received' ? 'bg-secondary/20 text-secondary' :
                activeOrder.status === 'Preparing' ? 'bg-primary/20 text-primary animate-pulse' :
                'bg-tertiary/20 text-tertiary'
              }`}>
                {activeOrder.status}
              </div>
            </div>
            <div className="mt-6 space-y-2 relative z-10">
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r from-tertiary to-[#a2fca2] rounded-full transition-all duration-1000 ${
                  activeOrder.status === 'Received' ? 'w-[25%]' :
                  activeOrder.status === 'Preparing' ? 'w-[60%]' : 'w-full'
                }`}></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1">
                <span className={activeOrder.status === 'Received' ? 'text-tertiary' : 'text-slate-300'}>Received</span>
                <span className={activeOrder.status === 'Preparing' ? 'text-tertiary' : ''}>Preparing</span>
                <span className={activeOrder.status === 'Ready' ? 'text-tertiary' : ''}>Ready</span>
              </div>
            </div>
            {activeOrder.status === 'Ready' && (
              <div className="mt-4 p-4 bg-tertiary/10 border border-tertiary/30 rounded-2xl text-center relative z-10">
                <p className="text-tertiary font-black text-lg">🎉 Your order is ready for pickup!</p>
                <p className="text-slate-400 text-sm">Head to Pickup Point B — Level 2, North Concourse</p>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="mt-4">
          <div className="bg-surface-container-high rounded-3xl p-8 border border-white/5 flex flex-col items-center justify-center text-center">
            <div className="flex gap-3 text-4xl lg:text-5xl mb-4" aria-hidden="true">
              <span className="animate-bounce" style={{ animationDelay: '0ms' }}>🍔</span>
              <span className="animate-bounce" style={{ animationDelay: '150ms' }}>🍕</span>
              <span className="animate-bounce" style={{ animationDelay: '300ms' }}>🌭</span>
            </div>
            <h3 className="text-2xl font-headline font-black text-white mb-2 tracking-tighter uppercase italic">Hungry?</h3>
            <p className="text-sm text-slate-400">Order your match day favorites from vendors below.</p>
          </div>
        </section>
      )}

      {/* Map & Promo Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-surface-container rounded-3xl overflow-hidden relative min-h-[280px]">
          <div className="absolute inset-0 grayscale contrast-125 brightness-50">
            <img loading="lazy" decoding="async" alt="Pickup Map" className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_PLVODVVPpnEIDHifWhcly5tMpsEzzGHRUcMHQS3AnAlJ9xUusF66ezUaMC_ovlIBpnn8UFYCVi5uK-Jlgr09GCHO2BZLsN4GcJQbO8phjw2S-1O0GKiZ6hyTnbuVR1XKKwAvOjHjwre6YaDb8og2uhfjZvosfeJ03vQCvHGMm-oYJnupcvRz9Dege8olam8ll6rYOCRkYhqHi-q-HXJ0mQ654T-n_aTaTwDyOxsNWybCVypWiJaYiw0_5ab7QxX0Unj2rPVWS7G5" />
          </div>
          <div className="absolute bottom-4 left-4 right-4 bg-surface-bright/60 backdrop-blur-xl p-4 rounded-2xl flex items-center justify-between border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-on-secondary">
                <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
              </div>
              <div>
                <h4 className="font-headline font-bold text-sm text-white">Pickup Point B</h4>
                <p className="text-xs text-slate-300">Level 2, North Concourse</p>
              </div>
            </div>
            <button onClick={() => navigate('/map')} className="bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest active:scale-95 transition-all">
              Directions
            </button>
          </div>
        </div>
        <div className="bg-secondary p-6 rounded-3xl flex flex-col justify-between text-on-secondary shadow-2xl shadow-secondary/20 relative overflow-hidden group">
          <span className="material-symbols-outlined text-4xl relative z-10 animate-pulse" aria-hidden="true">local_fire_department</span>
          <div className="relative z-10">
            <h3 className="font-headline font-black text-2xl leading-tight uppercase italic">Match Day Special</h3>
            <p className="text-sm font-medium opacity-80 mt-2">Double MVP Burger + Large Fries & Soda</p>
          </div>
          <button
            onClick={() => handleQuickAdd('Match Day Special Combo', 18)}
            className="mt-6 w-full py-4 bg-on-secondary text-secondary font-bold rounded-full uppercase text-xs tracking-widest hover:brightness-110 active:scale-95 transition-all relative z-10"
          >
            Quick Add - $18
          </button>
        </div>
      </section>

      <FoodStands setActiveMenu={setActiveMenu} />
    </div>
  );

  return (
    <DesktopLayout>
      {content}
    </DesktopLayout>
  );
}
