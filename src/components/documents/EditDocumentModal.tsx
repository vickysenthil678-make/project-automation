import React, { useState, useEffect } from 'react';
import { X, Save, Edit3, Folder, Shield, FileText } from 'lucide-react';
import { CollegeDocument, AccessLevel, DocumentCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { canChangeAccess, getAllowedAccessLevelsForRole } from '../../utils/auth';
import { generateStandardizedFilename, generateDriveDestinationPath } from '../../utils/fileHelpers';

interface EditDocumentModalProps {
  doc: CollegeDocument | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ doc, isOpen, onClose }) => {
  const { updateDocument, currentUser, departments } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Attendance');
  const [department, setDepartment] = useState('');
  const [yearLevel, setYearLevel] = useState('Year 2');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>('College');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (doc) {
      setTitle(doc.title);
      setCategory(doc.category);
      setDepartment(doc.department);
      setYearLevel(doc.yearLevel || 'All Years');
      setAcademicYear(doc.academicYear);
      setAccessLevel(doc.accessLevel);
      setDescription(doc.description || '');
    }
  }, [doc]);

  if (!isOpen || !doc) return null;

  const isAccessChangeAllowed = canChangeAccess(currentUser, doc);
  const allowedAccessLevels = getAllowedAccessLevelsForRole(currentUser?.role || 'guest');

  // Compute live updated filename and path previews
  const simulatedFilename = generateStandardizedFilename({
    title,
    category,
    department,
    academicYear,
    yearLevel,
    fileFormat: doc.fileFormat,
  });

  const simulatedPath = generateDriveDestinationPath({
    department,
    yearLevel,
    category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDocument(doc.id, {
      title,
      category,
      department,
      yearLevel,
      academicYear,
      accessLevel,
      description,
      standardizedFilename: simulatedFilename,
      destinationDrivePath: simulatedPath,
    });
    onClose();
  };

  const categories: DocumentCategory[] = [
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ padding: '28px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Edit3 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Edit Document Record
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Modify title, taxonomy categorization, and storage routing
              </p>
            </div>
          </div>

          <button
            className="clay-button"
            style={{ padding: '6px', borderRadius: '50%' }}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Document Title
            </label>
            <div className="clay-inset" style={{ padding: '10px 14px' }}>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.9rem',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Category
              </label>
              <div className="clay-inset" style={{ padding: '8px 12px' }}>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as DocumentCategory)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Department
              </label>
              <div className="clay-inset" style={{ padding: '8px 12px' }}>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Year Level
              </label>
              <div className="clay-inset" style={{ padding: '8px 12px' }}>
                <select
                  value={yearLevel}
                  onChange={e => setYearLevel(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="All Years">All Years</option>
                  <option value="Year 1">Year 1</option>
                  <option value="Year 2">Year 2</option>
                  <option value="Year 3">Year 3</option>
                  <option value="Year 4">Year 4</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Academic Year
              </label>
              <div className="clay-inset" style={{ padding: '8px 12px' }}>
                <select
                  value={academicYear}
                  onChange={e => setAcademicYear(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                  }}
                >
                  <option value="2026-27">2026-27</option>
                  <option value="2025-26">2025-26</option>
                  <option value="2024-25">2024-25</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
                Access Level
              </label>
              <div className="clay-inset" style={{ padding: '8px 12px' }}>
                <select
                  disabled={!isAccessChangeAllowed}
                  value={accessLevel}
                  onChange={e => setAccessLevel(e.target.value as AccessLevel)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.86rem',
                    color: 'var(--text-main)',
                  }}
                >
                  {allowedAccessLevels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>
              {!isAccessChangeAllowed && (
                <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '3px' }}>
                  Admin role required to alter classification
                </div>
              )}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase' }}>
              Description
            </label>
            <div className="clay-inset" style={{ padding: '10px 14px' }}>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '0.86rem',
                  color: 'var(--text-main)',
                  fontFamily: 'var(--font-sans)',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Standardized Filename & Destination Preview */}
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--surface-inset)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase' }}>
              Simulated Google Drive Routing
            </div>
            <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', wordBreak: 'break-all' }}>
              <strong>Standardized Name:</strong> {simulatedFilename}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <strong>Target Path:</strong> {simulatedPath}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="clay-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="clay-button clay-button-primary">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
