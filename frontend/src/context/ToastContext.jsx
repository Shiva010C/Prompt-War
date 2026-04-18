import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' });

  const showNotification = useCallback((message, type = 'success') => {
    setToast({ visible: true, message, type });
  }, []);

  const hideNotification = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} onClose={hideNotification} />
    </ToastContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
