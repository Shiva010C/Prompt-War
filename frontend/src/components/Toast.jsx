import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, visible }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let showTimer;
    let removeTimer;

    if (visible) {
      // Small timeout avoids synchronous cascade while still triggering the transition
      showTimer = setTimeout(() => setShow(true), 10);
      removeTimer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Wait for CSS transition before logical unmount
      }, 3000);
    } else {
      // Defer state update to avoid synchronous cascade error
      setTimeout(() => setShow(false), 0);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(removeTimer);
    };
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
