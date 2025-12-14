"use client"

import { useEffect } from 'react';
import { toast } from 'react-toastify';

const ToastInitializer = () => {
  useEffect(() => {
    const message = sessionStorage.getItem('toast_message');
    const type = sessionStorage.getItem('toast_type');

    if (message && type) {
      switch (type) {
        case 'error':
          toast.error(message);
          break;
        case 'success':
          toast.success(message);
          break;
        default:
          toast(message);
      }

      sessionStorage.removeItem('toast_message');
      sessionStorage.removeItem('toast_type');
    }
  }, []);

  return null;
};

export default ToastInitializer;