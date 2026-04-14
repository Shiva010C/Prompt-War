import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for transition before fully removing
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, onClose]);

  if (!visible && !show) return null;

  const bgColors = {
    success: 'bg-primary border-primary text-on-primary',
    error: 'bg-error border-error text-white',
    info: 'bg-secondary border-secondary text-on-secondary'
  };

  const icons = {
    success: 'check_circle',
    error: 'warning',
    info: 'info'
  };

  return (
    <div className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ease-in-out ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}>
      <div className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl border ${bgColors[type]}`}>
        <span className="material-symbols-outlined text-[20px]">{icons[type]}</span>
        <span className="font-headline font-bold text-sm tracking-wide">{message}</span>
      </div>
    </div>
  );
}
