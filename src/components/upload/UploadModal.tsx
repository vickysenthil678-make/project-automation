import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  FileCheck,
  FolderTree,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Info,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, AccessLevel, FileFormat } from '../../types';
import { generateStandardizedFilename, generateDriveDestinationPath } from '../../utils/fileHelpers';
import { canUpload, getAllowedAccessLevelsForRole } from '../../utils/auth';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessNavigate?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccessNavigate }) => {
  const {
    currentUser,
    departments,
    addDocument,
    showToast,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form Fields
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; format: FileFormat } | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Attendance');
  const [department, setDepartment] = useState(currentUser?.department || 'B.Sc Computer Science');
  const [yearLevel, setYearLevel] = useState(currentUser?.yearLevel || 'Year 2');
  const [academicYear, setAcademicYear] = useState('2026-27');
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(currentUser?.role === 'admin' ? 'College' : 'Student');
  const [description, setDescription] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Upload progress simulation
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepLabel, setUploadStepLabel] = useState('');

  if (!isOpen) return null;

  const isUserAllowedToUpload = canUpload(currentUser);
  const allowedAccessLevels = getAllowedAccessLevelsForRole(currentUser?.role || 'guest');

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

  const handleFileSelect = (file: File) => {
    setValidationError('');
    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setValidationError('File exceeds the 15MB limit. Please select a smaller document.');
      return;
    }

    const name = file.name;
    const ext = name.split('.').pop()?.toLowerCase() || '';

    let format: FileFormat = 'pdf';
    if (ext === 'xlsx' || ext === 'xls') format = 'xlsx';
    else if (ext === 'docx' || ext === 'doc') format = 'docx';
    else if (ext === 'csv') format = 'csv';
    else if (ext === 'png') format = 'png';
    else if (ext === 'jpg' || ext === 'jpeg') format = 'jpg';
    else if (ext === 'pdf') format = 'pdf';
    else {
      setValidationError('Supported formats: PDF, DOCX, XLSX, CSV, PNG, JPG.');
      return;
    }

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    setSelectedFile({ name, size: sizeFormatted, format });

    // Auto populate title from file name if empty
    if (!title) {
      const cleanName = name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Generate standardized filename and drive path previews in real time
  const standardizedName = generateStandardizedFilename({
    title: title || 'UNTITLED_DOCUMENT',
    category,
    department,
    academicYear,
    yearLevel,
    fileFormat: selectedFile ? selectedFile.format : 'pdf',
  });

  const destinationPath = generateDriveDestinationPath({
    department,
    yearLevel,
    category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !title) {
      setValidationError('Please specify a document title or select a file.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStepLabel('Validating document taxonomy & metadata rules...');

    setTimeout(() => {
      setUploadProgress(40);
      setUploadStepLabel('Generating standardized filename key...');
    }, 400);

    setTimeout(() => {
      setUploadProgress(75);
      setUploadStepLabel(`Syncing to Google Drive: "${destinationPath}"...`);
    }, 850);

    setTimeout(() => {
      setUploadProgress(100);
      setUploadStepLabel('Indexing and recording audit event...');

      setTimeout(() => {
        addDocument({
          title: title || selectedFile?.name || 'Uploaded Document',
          category,
          department,
          academicYear,
          yearLevel,
          accessLevel,
          fileFormat: selectedFile?.format || 'pdf',
          fileSize: selectedFile?.size || '320 KB',
          standardizedFilename: standardizedName,
          destinationDrivePath: destinationPath,
          uploadedBy: {
            name: currentUser?.name || 'Staff User',
            role: currentUser?.role || 'staff',
            email: currentUser?.email || 'staff@campus.test',
            department: currentUser?.department,
          },
          description: description || `Uploaded by ${currentUser?.name} into ${department} repository.`,
          tags: [category.toLowerCase(), department.toLowerCase(), academicYear],
          sampleContent: {
            type: category === 'Attendance' || category === 'CIA / Internal Marks' ? 'tabular' : 'general',
            headers: category === 'Attendance' ? ['Reg No.', 'Student Name', 'Total Classes', 'Attended', 'Percentage %'] : undefined,
            rows: category === 'Attendance' ? [
              ['24BCS1081', 'Aarav Mehta', 30, 28, '93.3%'],
              ['24BCS1082', 'Rohan Sharma', 30, 30, '100%'],
              ['24BCS1083', 'Ananya Iyer', 30, 27, '90.0%']
            ] : undefined,
            notes: `Archived via automated workflow into ${destinationPath}.`
          }
        });

        setIsUploading(false);
        onClose();
        if (onSuccessNavigate) onSuccessNavigate();
      }, 500);
    }, 1300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ padding: '30px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--brand-primary)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--clay-shadow-primary-btn)',
              }}
            >
              <UploadCloud size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Upload & Organize Document
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Auto-standardized naming & Google Drive folder routing
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

        {/* Upload permission check */}
        {!isUserAllowedToUpload ? (
          <div
            style={{
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-terracotta-bg)',
              border: '1px solid rgba(194, 84, 56, 0.3)',
              color: 'var(--accent-terracotta)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <ShieldAlert size={20} />
              <span>Upload Access Restricted</span>
            </div>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              Your current role (<strong>{currentUser?.role || 'Guest'}</strong>) does not have authorization to upload institutional documents. Document uploads require faculty coordinator (Staff) or administrator credentials.
            </p>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Tip: Switch to the <strong>Staff</strong> or <strong>Admin</strong> demo profile from the role switcher in the top right to test the automated upload workflow.
            </div>
          </div>
        ) : isUploading ? (
          /* Simulated Uploading Progress View */
          <div
            style={{
              padding: '36px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '18px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--brand-primary-light)',
                color: 'var(--brand-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'scaleUp 600ms infinite alternate',
              }}
            >
              <UploadCloud size={32} />
            </div>

            <div style={{ width: '100%', maxWidth: '400px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-main)' }}>{uploadStepLabel}</span>
                <span style={{ color: 'var(--brand-primary)' }}>{uploadProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--surface-inset)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${uploadProgress}%`,
                    height: '100%',
                    background: 'var(--brand-primary)',
                    borderRadius: '4px',
                    transition: 'width 250ms ease',
                  }}
                />
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Simulating standardized metadata structuring and destination path binding...
            </p>
          </div>
        ) : (
          /* Upload Form */
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Validation Error */}
            {validationError && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-terracotta-bg)',
                  color: 'var(--accent-terracotta)',
                  fontSize: '0.84rem',
                }}
              >
                <AlertCircle size={16} />
                <span>{validationError}</span>
              </div>
            )}

            {/* Drag & Drop Zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragOver ? '2px dashed var(--brand-primary)' : '2px dashed rgba(200, 190, 170, 0.6)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragOver ? 'var(--brand-primary-light)' : 'var(--surface-inset)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <FileCheck size={28} style={{ color: 'var(--accent-sage)' }} />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      {selectedFile.size} · Format: {selectedFile.format.toUpperCase()} (Click or drop to replace)
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <UploadCloud size={32} style={{ color: 'var(--brand-primary)' }} />
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    Drop document here or click to browse
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Supports PDF, Word (DOCX), Excel (XLSX), CSV, and Images (up to 15MB)
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Document Title *
                </label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g., B.Sc CS Year 2 Attendance — November 2026"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.88rem',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Category *
                  </label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as DocumentCategory)}
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
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Department *
                  </label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select
                      value={department}
                      onChange={e => setDepartment(e.target.value)}
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
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Academic Year *
                  </label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select
                      value={academicYear}
                      onChange={e => setAcademicYear(e.target.value)}
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
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    Access Level *
                  </label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select
                      value={accessLevel}
                      onChange={e => setAccessLevel(e.target.value as AccessLevel)}
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
                      {allowedAccessLevels.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', textTransform: 'uppercase' }}>
                  Description (Optional)
                </label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input
                    type="text"
                    placeholder="Short summary for records search..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.82rem',
                      color: 'var(--text-main)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Live Automated Naming & Destination Path Preview Box */}
            <div
              className="clay-card"
              style={{
                padding: '14px 16px',
                background: 'var(--surface-raised)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                border: '1px solid rgba(46, 83, 151, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} style={{ color: 'var(--accent-butter)' }} />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-main)', textTransform: 'uppercase' }}>
                  Autonomous Placement Engine Preview
                </span>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Standardized Filename:</strong>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px', wordBreak: 'break-all' }}>
                  {standardizedName}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <strong>Destination Drive Folder:</strong>
                <div style={{ color: 'var(--text-main)', fontWeight: 600, marginTop: '2px' }}>
                  {destinationPath}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" className="clay-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="clay-button clay-button-primary">
                <UploadCloud size={16} /> Archive & Sync
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
