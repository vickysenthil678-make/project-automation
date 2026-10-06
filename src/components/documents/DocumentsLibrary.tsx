import React, { useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Eye,
  Download,
  Edit2,
  Trash2,
  Shield,
  FolderClosed,
  FileText,
  Calendar,
  User,
  Clock,
  MoreVertical,
  X,
  Sparkles,
  Info,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { canEdit, canDelete, canDownload, canView, getPermissionExplanation } from '../../utils/auth';
import { downloadSimulatedDocument } from '../../utils/fileHelpers';
import { CollegeDocument } from '../../types';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EditDocumentModal } from './EditDocumentModal';

export const DocumentsLibrary: React.FC = () => {
  const {
    currentUser,
    getFilteredAndSortedDocs,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
    sortOption,
    setSortOption,
    viewMode,
    setViewMode,
    setSelectedDocForPreview,
    deleteDocument,
    departments,
    showToast,
  } = useApp();

  const [docToDelete, setDocToDelete] = useState<CollegeDocument | null>(null);
  const [docToEdit, setDocToEdit] = useState<CollegeDocument | null>(null);
  const [permissionNoticeDoc, setPermissionNoticeDoc] = useState<{ action: string; message: string } | null>(null);

  const displayedDocs = getFilteredAndSortedDocs();

  const categories = [
    'Attendance',
    'Student Records',
    'CIA / Internal Marks',
    'Exam Schedules',
    'Question Papers',
    'Results',
    'Timetable',
    'Academic Calendar',
    'Staff Records',
    'Department Reports',
    'Certificates',
    'Internship Documents',
    'Circulars & Notices',
    'Events',
  ];

  const handleDownload = (doc: CollegeDocument, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canDownload(currentUser, doc)) {
      showToast('You do not have permission to download this file.', 'warning');
      return;
    }
    downloadSimulatedDocument(doc);
    showToast(`Downloaded: ${doc.standardizedFilename}`, 'success');
  };

  const handleActionClick = (
    action: 'edit' | 'delete',
    doc: CollegeDocument,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (action === 'edit') {
      if (canEdit(currentUser, doc)) {
        setDocToEdit(doc);
      } else {
        const reason = getPermissionExplanation('edit', currentUser, doc);
        setPermissionNoticeDoc({ action: 'Edit Document', message: reason });
      }
    } else if (action === 'delete') {
      if (canDelete(currentUser, doc)) {
        setDocToDelete(doc);
      } else {
        const reason = getPermissionExplanation('delete', currentUser, doc);
        setPermissionNoticeDoc({ action: 'Delete Document', message: reason });
      }
    }
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

  const getFormatBadge = (fmt: string) => {
    let color = 'var(--brand-primary)';
    if (fmt === 'xlsx' || fmt === 'csv') color = 'var(--accent-sage)';
    if (fmt === 'docx') color = 'var(--accent-slate)';
    return (
      <span
        style={{
          fontSize: '0.68rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          padding: '2px 6px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--surface-inset)',
          color,
          textTransform: 'uppercase',
        }}
      >
        {fmt}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header & Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <FolderClosed size={20} style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Documents Repository
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Search, preview, download, and organize academic and administrative records
          </p>
        </div>

        {/* View Toggle & Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sort Dropdown */}
          <div className="clay-inset" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={14} style={{ color: 'var(--text-light)' }} />
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort:</span>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value as any)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div
            className="clay-card"
            style={{
              display: 'flex',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-inset)',
            }}
          >
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'cards' ? 'var(--surface-raised)' : 'transparent',
                boxShadow: viewMode === 'cards' ? 'var(--clay-shadow-sm)' : 'none',
                color: viewMode === 'cards' ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: viewMode === 'cards' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <LayoutGrid size={15} /> Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: viewMode === 'table' ? 'var(--surface-raised)' : 'transparent',
                boxShadow: viewMode === 'table' ? 'var(--clay-shadow-sm)' : 'none',
                color: viewMode === 'table' ? 'var(--brand-primary)' : 'var(--text-muted)',
                fontWeight: viewMode === 'table' ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <List size={15} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="clay-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            alignItems: 'center',
          }}
        >
          {/* Department Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Department
            </label>
            <div className="clay-inset" style={{ padding: '7px 10px' }}>
              <select
                value={filters.department}
                onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Category
            </label>
            <div className="clay-inset" style={{ padding: '7px 10px' }}>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Academic Year Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Academic Year
            </label>
            <div className="clay-inset" style={{ padding: '7px 10px' }}>
              <select
                value={filters.academicYear}
                onChange={e => setFilters(f => ({ ...f, academicYear: e.target.value }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <option value="all">All Academic Years</option>
                <option value="2026-27">2026–27 (Current)</option>
                <option value="2025-26">2025–26</option>
                <option value="2024-25">2024–25</option>
              </select>
            </div>
          </div>

          {/* Access Level Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Access Level
            </label>
            <div className="clay-inset" style={{ padding: '7px 10px' }}>
              <select
                value={filters.accessLevel}
                onChange={e => setFilters(f => ({ ...f, accessLevel: e.target.value }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.82rem',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                }}
              >
                <option value="all">All Access Levels</option>
                <option value="Public">Public Only</option>
                <option value="Student">Student Accessible</option>
                <option value="College">College Faculty</option>
                <option value="Private">Private / Confidential</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filters Summary and Clear Action */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', paddingTop: '6px', borderTop: '1px solid rgba(215, 205, 185, 0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing <strong>{displayedDocs.length}</strong> matching documents
            </span>
            {activeFilterCount > 0 && (
              <span className="badge badge-warning" style={{ fontSize: '0.68rem' }}>
                {activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              className="clay-button clay-button-sm"
              onClick={clearFilters}
              style={{ fontSize: '0.76rem', padding: '4px 10px' }}
            >
              <X size={12} /> Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Main Document Listing */}
      {displayedDocs.length === 0 ? (
        <div
          className="clay-card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--surface-inset)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-light)',
            }}
          >
            <FolderClosed size={28} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            No documents found
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
            No records matched your search query or role access scope. Try adjusting or clearing your filters.
          </p>
          <button type="button" className="clay-button clay-button-primary" onClick={clearFilters} style={{ marginTop: '8px' }}>
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* Folder / Cards Grid View */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '18px',
          }}
        >
          {displayedDocs.map(doc => {
            const hasEditPerm = canEdit(currentUser, doc);
            const hasDeletePerm = canDelete(currentUser, doc);

            return (
              <div
                key={doc.id}
                className="clay-card clay-card-interactive"
                onClick={() => setSelectedDocForPreview(doc)}
                style={{
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Top Bar: Format & Access Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {getFormatBadge(doc.fileFormat)}
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                        {doc.fileSize}
                      </span>
                    </div>
                    {getAccessBadge(doc.accessLevel)}
                  </div>

                  {/* Title */}
                  <h4
                    style={{
                      fontSize: '0.98rem',
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      lineHeight: 1.3,
                      marginBottom: '8px',
                    }}
                  >
                    {doc.title}
                  </h4>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      lineHeight: 1.45,
                      marginBottom: '12px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {doc.description}
                  </p>

                  {/* Taxonomy Pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Dept:</span>
                      <span>{doc.department}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Category:</span>
                      <span className="badge badge-college" style={{ fontSize: '0.65rem' }}>{doc.category}</span>
                    </div>
                  </div>
                </div>

                {/* Footer & Actions */}
                <div style={{ borderTop: '1px solid rgba(215, 205, 185, 0.35)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                    {doc.uploadDate}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      className="clay-button clay-button-sm"
                      title="Download real simulated sample file"
                      onClick={e => handleDownload(doc, e)}
                    >
                      <Download size={13} />
                    </button>

                    <button
                      type="button"
                      className="clay-button clay-button-sm"
                      title={hasEditPerm ? 'Edit document' : 'Edit (Unauthorized)'}
                      style={{ opacity: hasEditPerm ? 1 : 0.45 }}
                      onClick={e => handleActionClick('edit', doc, e)}
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      type="button"
                      className="clay-button clay-button-sm clay-button-danger"
                      title={hasDeletePerm ? 'Delete document' : 'Delete (Unauthorized)'}
                      style={{ opacity: hasDeletePerm ? 1 : 0.45 }}
                      onClick={e => handleActionClick('delete', doc, e)}
                    >
                      <Trash2 size={13} />
                    </button>

                    <button
                      type="button"
                      className="clay-button clay-button-primary clay-button-sm"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedDocForPreview(doc);
                      }}
                    >
                      <Eye size={13} /> View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table / List View */
        <div className="clay-card" style={{ overflowX: 'auto', padding: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(205, 195, 175, 0.4)', color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '10px 12px' }}>Document</th>
                <th style={{ padding: '10px 12px' }}>Department & Scope</th>
                <th style={{ padding: '10px 12px' }}>Category</th>
                <th style={{ padding: '10px 12px' }}>Access</th>
                <th style={{ padding: '10px 12px' }}>Modified</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedDocs.map((doc, idx) => {
                const hasEditPerm = canEdit(currentUser, doc);
                const hasDeletePerm = canDelete(currentUser, doc);

                return (
                  <tr
                    key={doc.id}
                    onClick={() => setSelectedDocForPreview(doc)}
                    style={{
                      borderBottom: idx !== displayedDocs.length - 1 ? '1px solid rgba(215, 205, 185, 0.3)' : 'none',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)',
                    }}
                    className="clay-card-interactive"
                  >
                    <td style={{ padding: '12px', minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {getFormatBadge(doc.fileFormat)}
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '0.88rem' }}>
                            {doc.title}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                            {doc.standardizedFilename}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.department}</div>
                      <div style={{ fontSize: '0.72rem' }}>{doc.academicYear} {doc.yearLevel ? `· ${doc.yearLevel}` : ''}</div>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className="badge badge-college" style={{ fontSize: '0.65rem' }}>{doc.category}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getAccessBadge(doc.accessLevel)}
                    </td>
                    <td style={{ padding: '12px', color: 'var(--text-light)', fontSize: '0.74rem' }}>
                      {doc.uploadDate}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="clay-button clay-button-sm"
                          title="Download local sample"
                          onClick={e => handleDownload(doc, e)}
                        >
                          <Download size={13} />
                        </button>
                        <button
                          type="button"
                          className="clay-button clay-button-sm"
                          title={hasEditPerm ? 'Edit' : 'Edit (Unauthorized)'}
                          style={{ opacity: hasEditPerm ? 1 : 0.45 }}
                          onClick={e => handleActionClick('edit', doc, e)}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="clay-button clay-button-sm clay-button-danger"
                          title={hasDeletePerm ? 'Delete' : 'Delete (Unauthorized)'}
                          style={{ opacity: hasDeletePerm ? 1 : 0.45 }}
                          onClick={e => handleActionClick('delete', doc, e)}
                        >
                          <Trash2 size={13} />
                        </button>
                        <button
                          type="button"
                          className="clay-button clay-button-primary clay-button-sm"
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedDocForPreview(doc);
                          }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={!!docToDelete}
        title="Delete Document Record"
        message={`Are you sure you want to delete "${docToDelete?.title}"? This will remove the record and simulated file reference from the repository.`}
        confirmLabel="Delete Document"
        isDanger={true}
        onConfirm={() => {
          if (docToDelete) {
            deleteDocument(docToDelete.id);
            setDocToDelete(null);
          }
        }}
        onCancel={() => setDocToDelete(null)}
      />

      {/* Edit Modal */}
      <EditDocumentModal
        doc={docToEdit}
        isOpen={!!docToEdit}
        onClose={() => setDocToEdit(null)}
      />

      {/* Permission Notice Dialog */}
      <ConfirmationModal
        isOpen={!!permissionNoticeDoc}
        title="Permission Notice"
        message={permissionNoticeDoc?.message || 'Action not permitted for current role.'}
        confirmLabel="Understood"
        cancelLabel="Close"
        isDanger={false}
        onConfirm={() => setPermissionNoticeDoc(null)}
        onCancel={() => setPermissionNoticeDoc(null)}
      />
    </div>
  );
};
