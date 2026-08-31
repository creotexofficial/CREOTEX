import React from 'react';
import { useCart } from '../../context/CartContext';

export const ToastContainer = () => {
  const { toasts } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map((t) => {
        let icon = "ℹ️";
        if (t.type === "success") icon = "✓";
        if (t.type === "error") icon = "⚠️";

        return (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span style={{ fontWeight: 'bold' }}>{icon}</span>
            <span>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
};
