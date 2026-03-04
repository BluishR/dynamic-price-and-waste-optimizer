import React, { useEffect } from 'react';
import { ToastProps } from './types';

const Toast = ({ message, type, onClose }: ToastProps) => {
  
  // close the toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-sky-500',
  }[type];

  return (
    <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 flex items-center min-w-[320px] p-4 text-white rounded-xl shadow-2xl transition-all animate-bounce-in ${bgColor}`}>
      <p className="flex-1 font-medium text-center">{message}</p>
      <button 
        onClick={onClose} 
        className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Close notification"
    >
        ✕
    </button>
    </div>
  );
};

export default Toast;