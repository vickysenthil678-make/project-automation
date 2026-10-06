import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  User,
  Shield,
  GraduationCap,
  Briefcase,
  Eye,
  LogOut,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Check,
  Building2,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_CREDENTIALS } from '../../utils/auth';
import { UserRole } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenSignIn }) => {
  const {
    currentUser,
    loginWithRole,
    logout,
    searchQuery,
    setSearchQuery,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setSelectedDocForPreview,
    documents,
    setActiveModal,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield size={14} style={{ color: 'var(--brand-primary)' }} />;
      case 'staff':
        return <Briefcase size={14} style={{ color: 'var(--accent-terracotta)' }} />;
      case 'student':
        return <GraduationCap size={14} style={{ color: 'var(--accent-sage)' }} />;
      case 'guest':
      default:
        return <Eye size={14} style={{ color: 'var(--accent-slate)' }} />;
    }
  };

  const getRoleBadgeClass = (role?: UserRole) => {
    switch (role) {
      case 'admin': return 'badge-college';
      case 'staff': return 'badge-private';
      case 'student': return 'badge-student';
      case 'guest':
      default: return 'badge-public';
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(243, 239, 230, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(215, 205, 185, 0.45)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}
    >
      {/* Brand & Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setCurrentTab('overview')}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--clay-shadow-primary-btn)',
            }}
          >
            <Building2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)', lineHeight: 1.1 }}>
              Campus Archive
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
              College Document Portal
            </div>
          </div>
        </div>

        {/* Prominent Demo Indicator */}
        <div
          className="badge badge-warning"
          style={{
            fontSize: '0.68rem',
            padding: '3px 9px',
            boxShadow: 'var(--clay-shadow-sm)',
            border: '1px solid rgba(196, 130, 10, 0.3)',
          }}
          title="Fictional seed environment for prototype testing"
        >
          <Sparkles size={11} /> DEMO · Sample Data
        </div>
      </div>

      {/* Global Inset Search Bar */}
      <div style={{ flex: '1', maxWidth: '420px', position: 'relative' }}>
        <div
          className="clay-inset"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '7px 12px',
          }}
        >
          <Search size={16} style={{ color: 'var(--text-light)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search documents, register no, circulars..."
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              if (currentTab !== 'documents') {
                setCurrentTab('documents');
              }
            }}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              width: '100%',
              fontSize: '0.86rem',
              color: 'var(--text-main)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-light)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Notifications, Role Switcher, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifMenuRef}>
          <button
            type="button"
            className="clay-button"
            style={{ padding: '8px 10px', position: 'relative' }}
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            aria-label="Notifications"
          >
            <Bell size={17} style={{ color: 'var(--text-main)' }} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-terracotta)',
                  color: '#FFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid var(--canvas-bg)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div
              className="clay-card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                padding: '16px',
                zIndex: 100,
                maxHeight: '420px',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>Notifications</h4>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--brand-primary)',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {notifications.length === 0 ? (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                    No notifications
                  </p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px',
                        borderRadius: 'var(--radius-sm)',
                        background: n.isRead ? 'transparent' : 'var(--surface-inset)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        borderLeft: n.isRead ? 'none' : '3px solid var(--brand-primary)',
                      }}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.relatedDocId) {
                          const doc = documents.find(d => d.id === n.relatedDocId);
                          if (doc) {
                            setSelectedDocForPreview(doc);
                            setShowNotifMenu(false);
                          }
                        }
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: n.isRead ? 600 : 700, color: 'var(--text-main)' }}>
                          {n.title}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                          {n.timestamp}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4 }}>
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Role Switcher Dropdown */}
        <div style={{ position: 'relative' }} ref={roleMenuRef}>
          <button
            type="button"
            className="clay-button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{ padding: '6px 12px', gap: '8px' }}
          >
            {getRoleIcon(currentUser?.role)}
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, lineHeight: 1.1 }}>
                {currentUser ? currentUser.name.split(' ')[0] : 'Guest Portal'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'capitalize' }}>
                Role: {currentUser?.role || 'Guest'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-light)', marginLeft: '2px' }} />
          </button>

          {showRoleMenu && (
            <div
              className="clay-card"
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '300px',
                padding: '14px',
                zIndex: 100,
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                Switch Demo Role
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {DEMO_CREDENTIALS.map(cred => {
                  const isCurrent = currentUser?.role === cred.role;
                  return (
                    <div
                      key={cred.role}
                      onClick={() => {
                        loginWithRole(cred.role);
                        setShowRoleMenu(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        background: isCurrent ? 'var(--brand-primary-light)' : 'var(--surface-raised)',
                        border: isCurrent ? '1px solid rgba(46, 83, 151, 0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {getRoleIcon(cred.role)}
                        <div>
                          <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)' }}>
                            {cred.label}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {cred.name}
                          </div>
                        </div>
                      </div>
                      {isCurrent && <Check size={16} style={{ color: 'var(--brand-primary)' }} />}
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px solid rgba(200, 190, 170, 0.4)', marginTop: '12px', paddingTop: '10px' }}>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--accent-terracotta)',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '6px 8px',
                    }}
                  >
                    <LogOut size={14} /> Sign out of demo session
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenSignIn();
                      setShowRoleMenu(false);
                    }}
                    className="clay-button clay-button-primary clay-button-sm"
                    style={{ width: '100%' }}
                  >
                    Sign in with Demo Role
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
