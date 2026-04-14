import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <footer className="fixed bottom-0 w-full rounded-t-3xl z-50 bg-slate-950/60 backdrop-blur-xl flex justify-around items-center h-20 px-4 pb-2 shadow-2xl shadow-blue-500/20 lg:hidden">
      <Link to="/" className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all active:scale-90 duration-200 ${isActive('/') ? 'bg-blue-600/20 text-blue-300' : 'text-slate-500 hover:text-blue-200'}`}>
        <span className="material-symbols-outlined">home</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-widest">Home</span>
      </Link>
      <Link to="/ticket" className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all active:scale-90 duration-200 ${isActive('/ticket') ? 'bg-blue-600/20 text-blue-300' : 'text-slate-500 hover:text-blue-200'}`}>
        <span className="material-symbols-outlined">confirmation_number</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-widest">Tickets</span>
      </Link>
      <Link to="/food" className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all active:scale-90 duration-200 ${isActive('/food') ? 'bg-blue-600/20 text-blue-300' : 'text-slate-500 hover:text-blue-200'}`}>
        <span className="material-symbols-outlined">fastfood</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-widest">Food</span>
      </Link>
      <Link to="/map" className={`flex flex-col items-center justify-center rounded-full px-5 py-2 transition-all active:scale-90 duration-200 ${isActive('/map') ? 'bg-blue-600/20 text-blue-300' : 'text-slate-500 hover:text-blue-200'}`}>
        <span className="material-symbols-outlined">map</span>
        <span className="font-label text-[10px] font-bold uppercase tracking-widest">Map</span>
      </Link>
    </footer>
  );
}
