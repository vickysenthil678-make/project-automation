import { DocumentCategory, FileFormat, CollegeDocument } from '../types';

// Standardized naming generator: [DEPT-CODE]_[YEAR]_[CATEGORY-SLUG]_[TITLE-SLUG]_[YEAR-SESSION].[ext]
export function generateStandardizedFilename(params: {
  title: string;
  category: DocumentCategory;
  department: string;
  academicYear: string;
  yearLevel?: string;
  fileFormat: FileFormat;
}): string {
  const { title, category, department, academicYear, yearLevel, fileFormat } = params;

  // Compute department shortcode
  let deptCode = 'CAMPUS';
  if (department.includes('Computer Science')) deptCode = 'BSC-CS';
  else if (department.includes('AI & Data Science')) deptCode = 'MSC-AIDS';
  else if (department.includes('Corporate Secretaryship')) deptCode = 'BCOM-CS';
  else if (department.includes('Mechanical')) deptCode = 'BTECH-MECH';
  else if (department.includes('Examinations')) deptCode = 'COE';
  else if (department.includes('Administration') || department.includes('Dean')) deptCode = 'ADMIN';

  // Compute year code
  let yrCode = 'ALL';
  if (yearLevel === 'Year 1') yrCode = 'YEAR1';
  else if (yearLevel === 'Year 2') yrCode = 'YEAR2';
  else if (yearLevel === 'Year 3') yrCode = 'YEAR3';
  else if (yearLevel === 'Year 4') yrCode = 'YEAR4';

  // Format category slug
  const catSlug = category
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  // Format title slug (alphanumeric clean, short)
  const titleClean = title
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 30);

  const cleanYear = academicYear.replace(/[^0-9]/g, '_').slice(0, 7);

  return `${deptCode}_${yrCode}_${catSlug}_${titleClean}_${cleanYear}.${fileFormat}`.replace(/__+/g, '_');
}

export function generateDriveDestinationPath(params: {
  department: string;
  yearLevel?: string;
  category: DocumentCategory;
}): string {
  const { department, yearLevel, category } = params;
  const root = 'College Digital Documents';
  const deptPart = department || 'General Administration';
  const yearPart = yearLevel && yearLevel !== 'All Years' ? yearLevel : 'General Records';
  return `${root} / ${deptPart} / ${yearPart} / ${category}`;
}

export function downloadSimulatedDocument(doc: CollegeDocument): void {
  // Generate realistic text / markdown / CSV contents based on doc format & metadata
  let content = '';
  let mimeType = 'text/plain;charset=utf-8';

  if (doc.fileFormat === 'csv') {
    mimeType = 'text/csv;charset=utf-8';
    if (doc.sampleContent.headers && doc.sampleContent.rows) {
      const headerLine = doc.sampleContent.headers.map(h => `"${h}"`).join(',');
      const rowsLines = doc.sampleContent.rows.map(row =>
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      );
      content = [headerLine, ...rowsLines].join('\r\n');
    } else {
      content = `"Document Title","${doc.title}"\r\n"Department","${doc.department}"\r\n"Academic Year","${doc.academicYear}"\r\n"Access Level","${doc.accessLevel}"\r\n"Status","Verified Sample Archive"`;
    }
  } else if (doc.fileFormat === 'pdf' || doc.fileFormat === 'docx') {
    mimeType = 'text/plain;charset=utf-8';
    content = `================================================================================
CAMPUS ARCHIVE · OFFICIAL COLLEGE DOCUMENT REPOSITORY
================================================================================
DOCUMENT TITLE:        ${doc.title}
STANDARDIZED FILENAME: ${doc.standardizedFilename}
GOOGLE DRIVE DEST:     ${doc.destinationDrivePath}
DEPARTMENT:            ${doc.department}
ACADEMIC YEAR:         ${doc.academicYear} | ${doc.yearLevel || 'All Semesters'}
ACCESS LEVEL:          ${doc.accessLevel} (Audited Prototype)
VERSION / REVISION:    ${doc.version}
UPLOADED BY:           ${doc.uploadedBy.name} (${doc.uploadedBy.role.toUpperCase()})
UPLOAD TIMESTAMP:      ${doc.uploadDate}
--------------------------------------------------------------------------------
DESCRIPTION & ABSTRACT:
${doc.description}
--------------------------------------------------------------------------------
SAMPLE PREVIEW CONTENT:
`;

    if (doc.sampleContent.officialLetterhead) {
      const lh = doc.sampleContent.officialLetterhead;
      content += `
INSTITUTION: ${lh.institution}
SUBTITLE:    ${lh.subTitle}
REF NO:      ${lh.refNo} | DATE: ${lh.date}
SUBJECT:     ${lh.subject}

BODY:
${lh.bodyParagraphs.map(p => `• ${p}`).join('\n\n')}

AUTHORITY SIGN-OFF:
${lh.signatory}
${lh.designation}
`;
    } else if (doc.sampleContent.certificateData) {
      const cd = doc.sampleContent.certificateData;
      content += `
RECIPIENT:    ${cd.recipientName} (REG NO: ${cd.regNumber})
PROGRAMME:    ${cd.program}
ACHIEVEMENT:  ${cd.achievement}
ISSUED DATE:  ${cd.issuedDate}
SIGNATORY:    ${cd.signatory}
`;
    } else if (doc.sampleContent.headers && doc.sampleContent.rows) {
      content += doc.sampleContent.headers.join(' | ') + '\n';
      content += doc.sampleContent.headers.map(() => '----------------').join('-+-') + '\n';
      doc.sampleContent.rows.forEach(r => {
        content += r.join(' | ') + '\n';
      });
    }

    if (doc.sampleContent.notes) {
      content += `\nNOTES & SCRUTINY COMMENTS:\n${doc.sampleContent.notes}\n`;
    }

    content += `\n================================================================================\nVerified by Campus Archive Autonomous System · Simulated Google Drive Sync Record\n================================================================================\n`;
  } else {
    content = `Campus Archive Simulated File: ${doc.title}\nStandardized Name: ${doc.standardizedFilename}\nGenerated locally for prototype demonstration.`;
  }

  // Create real local blob download
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', doc.standardizedFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
