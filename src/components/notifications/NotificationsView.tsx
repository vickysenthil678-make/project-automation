import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  FileText,
  Sparkles,
  Info,
  Calendar,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedDocForPreview,
    documents,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'notice' | 'upload' | 'system'>('all');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.relatedDocId) {
      const doc = documents.find(d => d.id === notif.relatedDocId);
      if (doc) {
        setSelectedDocForPreview(doc);
      }
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'notice':
        return <Bell size={18} style={{ color: 'var(--brand-primary)' }} />;
      case 'upload':
        return <FileText size={18} style={{ color: 'var(--accent-sage)' }} />;
      case 'system':
      default:
        return <Info size={18} style={{ color: 'var(--accent-butter)' }} />;
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Bell size={20} style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Notifications & Circulars
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Stay updated with collegiate announcements, exam datesheets, and newly released documents
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            className="clay-button"
            onClick={markAllNotificationsRead}
          >
            <CheckCheck size={16} /> Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {(['all', 'notice', 'upload', 'system'] as const).map(tab => (
          <button
            key={tab}
            type="button"
            className="clay-button clay-button-sm"
            style={{
              background: filterType === tab ? 'var(--brand-primary)' : 'var(--surface-raised)',
              color: filterType === tab ? '#FFF' : 'var(--text-main)',
              fontWeight: 700,
              textTransform: 'capitalize',
            }}
            onClick={() => setFilterType(tab)}
          >
            {tab === 'all' ? 'All Updates' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="clay-card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredNotifs.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
            <p style={{ fontSize: '0.88rem' }}>No notifications found in this category.</p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className="clay-card clay-card-interactive"
              onClick={() => handleNotificationClick(n)}
              style={{
                padding: '14px 18px',
                borderRadius: 'var(--radius-md)',
                background: n.isRead ? 'var(--surface-clay)' : 'var(--surface-raised)',
                borderLeft: n.isRead ? '1px solid rgba(255,255,255,0.7)' : '4px solid var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-inset)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {getNotifIcon(n.type)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.92rem', fontWeight: n.isRead ? 600 : 800, color: 'var(--text-main)' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <span className="badge badge-private" style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                        New
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.45 }}>
                    {n.message}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                  {n.timestamp}
                </span>
                {n.relatedDocId && (
                  <button
                    type="button"
                    className="clay-button clay-button-sm clay-button-primary"
                    onClick={e => {
                      e.stopPropagation();
                      handleNotificationClick(n);
                    }}
                  >
                    <Eye size={13} /> View Doc
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
