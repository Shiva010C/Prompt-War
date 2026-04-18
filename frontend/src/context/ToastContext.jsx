import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { collection, onSnapshot, orderBy, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });
  const lastBroadcastIdRef = useRef(null);

  const showNotification = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  // Real-time listener: show Toast whenever admin sends a global broadcast
  useEffect(() => {
    const q = query(collection(db, 'broadcasts'), orderBy('sentAt', 'desc'), limit(1));
    const unsub = onSnapshot(q, (snap) => {
      if (snap.empty) return;
      const doc = snap.docs[0];
      // Don't show on initial load — only on new broadcasts
      if (lastBroadcastIdRef.current === null) {
        lastBroadcastIdRef.current = doc.id;
        return;
      }
      if (doc.id !== lastBroadcastIdRef.current) {
        lastBroadcastIdRef.current = doc.id;
        const { message, type } = doc.data();
        showNotification(`📢 ${message}`, type || 'info');
      }
    });
    return () => unsub();
  }, [showNotification]);

  return (
    <ToastContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideNotification} />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
