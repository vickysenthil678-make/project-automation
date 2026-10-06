import React, { useState } from 'react';
import {
  Activity,
  Filter,
  Search,
  Lock,
  Clock,
  UploadCloud,
  Eye,
  DownloadCloud,
  Edit2,
  Trash2,
  Shield,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActivityEvent } from '../../types';

export const ActivityLogView: React.FC = () => {
  const { currentUser, activities } = useApp();

  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [userQuery, setUserQuery] = useState('');

  if (currentUser?.role !== 'admin') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="clay-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '32px' }}>
          <Lock size={36} style={{ color: 'var(--accent-terracotta)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Restricted Audit Trail
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            System activity logging and access audit trails are restricted to Central Administration. Please switch to the <strong>Admin</strong> profile.
          </p>
        </div>
      </div>
    );
  }

  const filteredActivities = activities.filter(act => {
    if (selectedAction !== 'all' && act.action !== selectedAction) return false;
    if (userQuery.trim()) {
      const q = userQuery.toLowerCase();
      const matchUser = act.userName.toLowerCase().includes(q);
      const matchDoc = act.documentTitle?.toLowerCase().includes(q);
      const matchDetails = act.details.toLowerCase().includes(q);
      if (!matchUser && !matchDoc && !matchDetails) return false;
    }
    return true;
  });

  const getActionBadge = (action: ActivityEvent['action']) => {
    switch (action) {
      case 'UPLOAD':
        return <span className="badge badge-student"><UploadCloud size={12} /> UPLOAD</span>;
      case 'DELETE':
        return <span className="badge badge-private"><Trash2 size={12} /> DELETE</span>;
      case 'EDIT':
        return <span className="badge badge-college"><Edit2 size={12} /> EDIT</span>;
      case 'DOWNLOAD':
        return <span className="badge badge-public"><DownloadCloud size={12} /> DOWNLOAD</span>;
      case 'LOGIN':
        return <span className="badge badge-warning"><KeyRound size={12} /> AUTH</span>;
      default:
        return <span className="badge badge-public">{action}</span>;
    }
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Activity size={20} style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              System Activity & Audit Log
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Comprehensive immutable activity timeline recording simulated user events and storage lifecycle changes
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div
        className="clay-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div className="clay-inset" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} style={{ color: 'var(--text-light)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Action:</span>
            <select
              value={selectedAction}
              onChange={e => setSelectedAction(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-main)',
              }}
            >
              <option value="all">All Actions</option>
              <option value="UPLOAD">Upload</option>
              <option value="EDIT">Edit / Metadata</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Auth & Sessions</option>
              <option value="ACCESS_CHANGE">Access Policy Changes</option>
            </select>
          </div>

          <div className="clay-inset" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={14} style={{ color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Filter by user or document..."
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                color: 'var(--text-main)',
                minWidth: '200px',
              }}
            />
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Showing <strong>{filteredActivities.length}</strong> logged events
        </div>
      </div>

      {/* Activity Table */}
      <div className="clay-card" style={{ padding: '12px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid rgba(205, 195, 175, 0.4)', color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '10px 12px' }}>Timestamp</th>
              <th style={{ padding: '10px 12px' }}>Action</th>
              <th style={{ padding: '10px 12px' }}>User & Role</th>
              <th style={{ padding: '10px 12px' }}>Event Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((act, idx) => (
              <tr
                key={act.id}
                style={{
                  borderBottom: idx !== filteredActivities.length - 1 ? '1px solid rgba(215, 205, 185, 0.3)' : 'none',
                }}
              >
                <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                  {act.timestamp}
                </td>
                <td style={{ padding: '12px' }}>
                  {getActionBadge(act.action)}
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{act.userName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{act.userRole}</div>
                </td>
                <td style={{ padding: '12px', color: 'var(--text-main)' }}>
                  <div style={{ lineHeight: 1.4 }}>{act.details}</div>
                  {act.documentTitle && (
                    <div style={{ fontSize: '0.74rem', color: 'var(--brand-primary)', marginTop: '2px', fontWeight: 600 }}>
                      Doc: {act.documentTitle}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
