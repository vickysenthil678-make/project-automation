import React from 'react';
import {
  LayoutDashboard,
  FolderClosed,
  UploadCloud,
  Bell,
  Users,
  Activity,
  RotateCcw,
  ShieldCheck,
  Building,
  Lock,
  Compass,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { canManageUsers, canViewActivityLog, canUpload } from '../../utils/auth';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSignIn: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, onOpenSignIn }) => {
  const { currentUser, setActiveModal, notifications } = useApp();

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;
  const isUploadAllowed = canUpload(currentUser);
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard size={18} />,
      badge: null,
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <FolderClosed size={18} />,
      badge: null,
    },
    {
      id: 'upload',
      label: 'Upload Workflow',
      icon: <UploadCloud size={18} />,
      badge: !isUploadAllowed ? 'Staff/Admin' : 'Auto-Sync',
      badgeClass: !isUploadAllowed ? 'badge-warning' : 'badge-college',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell size={18} />,
      badge: unreadNotifCount > 0 ? `${unreadNotifCount}` : null,
      badgeClass: 'badge-private',
    },
  ];

  const adminNavItems = [
    {
      id: 'admin-users',
      label: 'Users & Depts',
      icon: <Users size={18} />,
    },
    {
      id: 'admin-activity',
      label: 'Activity Log',
      icon: <Activity size={18} />,
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        flexShrink: 0,
        background: 'var(--canvas-bg)',
        borderRight: '1px solid rgba(215, 205, 185, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '20px 16px',
        minHeight: 'calc(100vh - 65px)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Navigation Group */}
        <div>
          <div
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              paddingLeft: '12px',
              marginBottom: '8px',
            }}
          >
            Portal Navigation
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isActive ? 'var(--surface-raised)' : 'transparent',
                    boxShadow: isActive ? 'var(--clay-shadow-sm)' : 'none',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid transparent',
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`badge ${item.badgeClass || 'badge-public'}`}
                      style={{ fontSize: '0.65rem', padding: '2px 6px' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration Section (Admin only) */}
        {isAdmin && (
          <div>
            <div
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                paddingLeft: '12px',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={13} style={{ color: 'var(--brand-primary)' }} /> Central Governance
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {adminNavItems.map(item => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCurrentTab(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--surface-raised)' : 'transparent',
                      boxShadow: isActive ? 'var(--clay-shadow-sm)' : 'none',
                      border: isActive ? '1px solid rgba(255, 255, 255, 0.8)' : '1px solid transparent',
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-main)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      textAlign: 'left',
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>

      {/* Scope Card & Reset Action at Bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* User Scope Card */}
        <div
          className="clay-card"
          style={{
            padding: '12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-clay)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>
              Active Scope
            </span>
            <span className={`badge ${currentUser?.role === 'admin' ? 'badge-college' : currentUser?.role === 'staff' ? 'badge-private' : currentUser?.role === 'student' ? 'badge-student' : 'badge-public'}`}>
              {currentUser?.role || 'Guest'}
            </span>
          </div>

          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
            {currentUser?.department || 'Public Explorer Scope'}
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            {currentUser?.yearLevel ? `${currentUser.yearLevel} · ` : ''}{currentUser?.designation || 'Read-Only View'}
          </div>
        </div>

        {/* Reset Demo State Button */}
        {isAdmin && (
          <button
            type="button"
            className="clay-button clay-button-sm"
            style={{ width: '100%', fontSize: '0.76rem', color: 'var(--text-muted)' }}
            onClick={() => setActiveModal('resetConfirm')}
            title="Restore pristine seed state"
          >
            <RotateCcw size={13} /> Reset Demo Data
          </button>
        )}
      </div>
    </aside>
  );
};
