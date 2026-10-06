import React from 'react';
import {
  FolderClosed,
  UploadCloud,
  Bell,
  Clock,
  FileText,
  Shield,
  Briefcase,
  GraduationCap,
  Eye,
  ArrowRight,
  Sparkles,
  DownloadCloud,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { canUpload, canView, canDownload } from '../../utils/auth';
import { CollegeDocument } from '../../types';

interface OverviewDashboardProps {
  onNavigateTab: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigateTab }) => {
  const {
    currentUser,
    documents,
    activities,
    notifications,
    setSelectedDocForPreview,
    setActiveModal,
    setFilters,
  } = useApp();

  // Compute stats based on active user role & permissions
  const accessibleDocs = documents.filter(doc => canView(currentUser, doc));
  const publicDocsCount = documents.filter(d => d.accessLevel === 'Public').length;
  const recentUploadsCount = accessibleDocs.filter(d => {
    // uploaded within recent days
    return d.academicYear === '2026-27';
  }).length;
  const unreadNotifs = notifications.filter(n => !n.isRead).length;
  const departmentDocsCount = currentUser?.department
    ? documents.filter(d => d.department === currentUser.department && canView(currentUser, d)).length
    : accessibleDocs.length;

  const isUploadAllowed = canUpload(currentUser);

  // Filter activities visible to current role
  const visibleActivities = activities.filter(act => {
    if (!currentUser || currentUser.role === 'guest') {
      return act.userRole === 'guest' || act.action === 'UPLOAD';
    }
    if (currentUser.role === 'student') {
      return act.userRole === 'student' || act.action === 'UPLOAD';
    }
    return true; // Admin and staff see all logged events
  }).slice(0, 6);

  // Recent 5 documents
  const recentDocs = [...accessibleDocs]
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 5);

  const getRoleGreeting = () => {
    if (!currentUser) return 'Welcome, Public Explorer';
    switch (currentUser.role) {
      case 'admin':
        return `Welcome back, ${currentUser.name} (Administrator)`;
      case 'staff':
        return `Good day, ${currentUser.name} (Faculty Coordinator)`;
      case 'student':
        return `Hello, ${currentUser.name} (Student Portal)`;
      case 'guest':
      default:
        return `Welcome, ${currentUser.name}`;
    }
  };

  const getRoleScopeDescription = () => {
    if (!currentUser || currentUser.role === 'guest') {
      return 'You are browsing public gazettes, academic calendars, and collegiate circulars. Sign in with a staff or student account for internal department files.';
    }
    if (currentUser.role === 'student') {
      return 'You have student-level access to B.Sc Computer Science Year 2 marks, semester timetables, circulars, and verified certificates.';
    }
    if (currentUser.role === 'staff') {
      return `You have faculty coordinator privileges for ${currentUser.department || 'B.Sc Computer Science'}. You can upload, review attendance, and distribute internal marks.`;
    }
    return 'You have master administrative authority over all departmental repositories, Drive folder hierarchies, user access permissions, and audit logs.';
  };

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'Public': return <span className="badge badge-public">Public</span>;
      case 'Student': return <span className="badge badge-student">Student</span>;
      case 'College': return <span className="badge badge-college">College</span>;
      case 'Private': return <span className="badge badge-private">Private</span>;
      default: return <span className="badge badge-public">{level}</span>;
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome Banner Card */}
      <div
        className="clay-card"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #FAF7F0 0%, #F5EFE3 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
              <Sparkles size={12} /> Campus Archive Portal
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 600 }}>
              Academic Year 2026–27
            </span>
          </div>

          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {getRoleGreeting()}
          </h2>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {getRoleScopeDescription()}
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {isUploadAllowed && (
            <button
              type="button"
              className="clay-button clay-button-primary"
              onClick={() => setActiveModal('upload')}
            >
              <UploadCloud size={16} /> Upload Document
            </button>
          )}

          <button
            type="button"
            className="clay-button"
            onClick={() => onNavigateTab('documents')}
          >
            <FolderClosed size={16} /> Browse Library ({accessibleDocs.length})
          </button>

          <button
            type="button"
            className="clay-button"
            onClick={() => onNavigateTab('notifications')}
          >
            <Bell size={16} /> Notices
            {unreadNotifs > 0 && <span className="badge badge-private" style={{ padding: '1px 5px' }}>{unreadNotifs}</span>}
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Tiles */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Tile 1: Accessible Docs */}
        <div
          className="clay-card clay-card-interactive"
          onClick={() => onNavigateTab('documents')}
          style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--brand-primary-light)',
              color: 'var(--brand-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FolderClosed size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {accessibleDocs.length}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Accessible Records
            </div>
          </div>
        </div>

        {/* Tile 2: Department / Scope Files */}
        <div
          className="clay-card clay-card-interactive"
          onClick={() => {
            if (currentUser?.department) {
              setFilters(f => ({ ...f, department: currentUser.department! }));
            }
            onNavigateTab('documents');
          }}
          style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-sage-bg)',
              color: 'var(--accent-sage)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Briefcase size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {departmentDocsCount}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              {currentUser?.department ? 'Department Files' : 'Public Gazettes'}
            </div>
          </div>
        </div>

        {/* Tile 3: 2026-27 Recent Uploads */}
        <div
          className="clay-card clay-card-interactive"
          onClick={() => {
            setFilters(f => ({ ...f, academicYear: '2026-27' }));
            onNavigateTab('documents');
          }}
          style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-butter-bg)',
              color: 'var(--accent-butter)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {recentUploadsCount}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Current Term Records
            </div>
          </div>
        </div>

        {/* Tile 4: Actionable Notices */}
        <div
          className="clay-card clay-card-interactive"
          onClick={() => onNavigateTab('notifications')}
          style={{ padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '16px' }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-terracotta-bg)',
              color: 'var(--accent-terracotta)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Bell size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
              {unreadNotifs}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              Unread Circulars
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recently Updated Documents & Activity Timeline */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left: Recently Updated Documents */}
        <div className="clay-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recently Updated Documents
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Latest verified records in your authorized repository scope
              </p>
            </div>
            <button
              type="button"
              className="clay-button clay-button-sm"
              onClick={() => onNavigateTab('documents')}
            >
              View All <ChevronRight size={14} />
            </button>
          </div>

          {recentDocs.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <FileText size={32} style={{ color: 'var(--text-light)', marginBottom: '8px' }} />
              <p style={{ fontSize: '0.88rem' }}>No documents available in current scope.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentDocs.map(doc => (
                <div
                  key={doc.id}
                  className="clay-card clay-card-interactive"
                  onClick={() => setSelectedDocForPreview(doc)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-raised)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--surface-inset)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--brand-primary)',
                        textTransform: 'uppercase',
                        flexShrink: 0,
                      }}
                    >
                      {doc.fileFormat}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          color: 'var(--text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {doc.title}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span>{doc.department}</span>
                        <span>•</span>
                        <span>{doc.academicYear}</span>
                        <span>•</span>
                        <span>{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    {getAccessBadge(doc.accessLevel)}
                    <button
                      type="button"
                      className="clay-button clay-button-sm"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedDocForPreview(doc);
                      }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Recent Activity Timeline */}
        <div className="clay-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Recent Activity & Audit
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Chronological log of simulated repository actions
              </p>
            </div>
            {currentUser?.role === 'admin' && (
              <button
                type="button"
                className="clay-button clay-button-sm"
                onClick={() => onNavigateTab('admin-activity')}
              >
                Audit Log <ChevronRight size={14} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {visibleActivities.map((act, idx) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  position: 'relative',
                  paddingBottom: idx !== visibleActivities.length - 1 ? '12px' : 0,
                  borderBottom: idx !== visibleActivities.length - 1 ? '1px dashed rgba(215, 205, 185, 0.5)' : 'none',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: act.action === 'UPLOAD' ? 'var(--accent-sage-bg)' : act.action === 'DELETE' ? 'var(--accent-terracotta-bg)' : 'var(--brand-primary-light)',
                    color: act.action === 'UPLOAD' ? 'var(--accent-sage)' : act.action === 'DELETE' ? 'var(--accent-terracotta)' : 'var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {act.action === 'UPLOAD' ? <UploadCloud size={15} /> : act.action === 'DELETE' ? <AlertTriangle size={15} /> : <Clock size={15} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {act.userName}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                      {act.timestamp}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                    {act.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
