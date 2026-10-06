import React from 'react';
import {
  X,
  Download,
  Edit,
  FolderTree,
  Building,
  Calendar,
  User,
  Shield,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  Award,
  CheckCircle,
  FileCheck2
} from 'lucide-react';
import { CollegeDocument } from '../../types';
import { useApp } from '../../context/AppContext';
import { canEdit, canDownload } from '../../utils/auth';
import { downloadSimulatedDocument } from '../../utils/fileHelpers';

interface DocumentViewerDrawerProps {
  doc: CollegeDocument | null;
  onClose: () => void;
  onEditDoc: (doc: CollegeDocument) => void;
}

export const DocumentViewerDrawer: React.FC<DocumentViewerDrawerProps> = ({ doc, onClose, onEditDoc }) => {
  const { currentUser, showToast } = useApp();

  if (!doc) return null;

  const isDownloadAllowed = canDownload(currentUser, doc);
  const isEditAllowed = canEdit(currentUser, doc);

  const handleDownload = () => {
    if (isDownloadAllowed) {
      downloadSimulatedDocument(doc);
      showToast(`Downloaded: ${doc.standardizedFilename}`, 'success');
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

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div className="drawer-content" onClick={e => e.stopPropagation()} style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
        {/* Top Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-college" style={{ fontSize: '0.68rem' }}>
                {doc.category}
              </span>
              {getAccessBadge(doc.accessLevel)}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                {doc.version}
              </span>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.25 }}>
              {doc.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {isEditAllowed && (
              <button
                type="button"
                className="clay-button clay-button-sm"
                onClick={() => {
                  onClose();
                  onEditDoc(doc);
                }}
              >
                <Edit size={14} /> Edit
              </button>
            )}

            {isDownloadAllowed && (
              <button
                type="button"
                className="clay-button clay-button-primary clay-button-sm"
                onClick={handleDownload}
              >
                <Download size={14} /> Download ({doc.fileFormat.toUpperCase()})
              </button>
            )}

            <button
              type="button"
              className="clay-button"
              style={{ padding: '6px', borderRadius: '50%' }}
              onClick={onClose}
              aria-label="Close drawer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Standardized File Key & Google Drive Placement Banner */}
        <div
          className="clay-card"
          style={{
            padding: '14px 16px',
            background: 'var(--surface-raised)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FolderTree size={15} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
              Simulated Google Drive Archive Location
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Destination Folder:</strong>
            <div style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
              {doc.destinationDrivePath}
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Standardized Key:</strong>
            <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
              {doc.standardizedFilename}
            </div>
          </div>
        </div>

        {/* Metadata Key-Value Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}
        >
          <div className="clay-inset" style={{ padding: '10px 12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Department</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.department}</div>
          </div>

          <div className="clay-inset" style={{ padding: '10px 12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Academic Session</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.academicYear} {doc.yearLevel ? `(${doc.yearLevel})` : ''}</div>
          </div>

          <div className="clay-inset" style={{ padding: '10px 12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Archived By</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.uploadedBy.name}</div>
          </div>

          <div className="clay-inset" style={{ padding: '10px 12px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>Upload Date</span>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '2px' }}>{doc.uploadDate}</div>
          </div>
        </div>

        {/* Realistic Content Preview Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Sample Document Content (Audited Preview)
            </span>
            <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
              Simulated View
            </span>
          </div>

          {/* Letterhead Circular Preview */}
          {doc.sampleContent.officialLetterhead ? (
            <div
              className="clay-card"
              style={{
                padding: '24px',
                background: '#FFFDF9',
                border: '1px solid rgba(215, 205, 185, 0.6)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ textAlign: 'center', borderBottom: '2px double rgba(180, 160, 130, 0.4)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.02em' }}>
                  {doc.sampleContent.officialLetterhead.institution}
                </h3>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {doc.sampleContent.officialLetterhead.subTitle}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.74rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                  <span>REF: {doc.sampleContent.officialLetterhead.refNo}</span>
                  <span>DATE: {doc.sampleContent.officialLetterhead.date}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px' }}>
                  SUB: {doc.sampleContent.officialLetterhead.subject}
                </div>
                {doc.sampleContent.officialLetterhead.bodyParagraphs.map((para, i) => (
                  <p key={i} style={{ fontSize: '0.82rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '10px' }}>
                    {para}
                  </p>
                ))}
              </div>

              <div style={{ textAlign: 'right', marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(215, 205, 185, 0.3)' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {doc.sampleContent.officialLetterhead.signatory}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {doc.sampleContent.officialLetterhead.designation}
                </div>
              </div>
            </div>
          ) : doc.sampleContent.certificateData ? (
            /* Certificate Preview */
            <div
              className="clay-card"
              style={{
                padding: '28px',
                background: '#FAF6EE',
                border: '3px double #C4820A',
                borderRadius: 'var(--radius-md)',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Award size={36} style={{ color: 'var(--accent-butter)', margin: '0 auto' }} />
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '0.04em' }}>
                CERTIFICATE OF COMPLETION
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                This is proudly verified and awarded to
              </p>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                {doc.sampleContent.certificateData.recipientName}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                Register Number: {doc.sampleContent.certificateData.regNumber} · {doc.sampleContent.certificateData.program}
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: '8px 0' }}>
                {doc.sampleContent.certificateData.achievement}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(196, 130, 10, 0.3)', paddingTop: '10px', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <span>Issued: {doc.sampleContent.certificateData.issuedDate}</span>
                <span>Signatory: {doc.sampleContent.certificateData.signatory}</span>
              </div>
            </div>
          ) : doc.sampleContent.headers && doc.sampleContent.rows ? (
            /* Tabular Preview */
            <div className="clay-card" style={{ padding: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-inset)', borderBottom: '2px solid rgba(200, 190, 170, 0.4)' }}>
                    {doc.sampleContent.headers.map((h, i) => (
                      <th key={i} style={{ padding: '8px 10px', fontWeight: 700, color: 'var(--text-main)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {doc.sampleContent.rows.map((row, rIdx) => (
                    <tr key={rIdx} style={{ borderBottom: '1px solid rgba(215, 205, 185, 0.3)' }}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} style={{ padding: '8px 10px', color: 'var(--text-main)' }}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {doc.sampleContent.notes && (
                <div style={{ padding: '8px', marginTop: '6px', fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  * {doc.sampleContent.notes}
                </div>
              )}
            </div>
          ) : (
            /* General Text Preview */
            <div className="clay-card" style={{ padding: '16px', background: 'var(--surface-raised)' }}>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                {doc.description}
              </p>
              {doc.sampleContent.notes && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'var(--surface-inset)', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {doc.sampleContent.notes}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
