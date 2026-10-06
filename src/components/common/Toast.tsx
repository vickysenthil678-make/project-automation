import React from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 size={18} className="toast-icon text-sage" />;
      case 'warning':
        return <AlertTriangle size={18} className="toast-icon text-butter" />;
      case 'error':
        return <AlertCircle size={18} className="toast-icon text-terracotta" />;
      case 'info':
      default:
        return <Info size={18} className="toast-icon text-brand" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 18px',
        background: 'var(--surface-raised)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.18), var(--clay-shadow-card)',
        border: '1px solid rgba(255, 255, 255, 0.9)',
        color: 'var(--text-main)',
        fontSize: '0.9rem',
        fontWeight: 500,
        maxWidth: '420px',
        animation: 'fadeIn 180ms ease-out',
      }}
      role="status"
      aria-live="polite"
    >
      {getIcon()}
      <span style={{ flex: 1 }}>{toast.message}</span>
    </div>
  );
};
