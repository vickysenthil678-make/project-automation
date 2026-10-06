export type UserRole = 'admin' | 'staff' | 'student' | 'guest';

export type AccessLevel = 'Public' | 'Student' | 'College' | 'Private';

export type DocumentCategory =
  | 'Attendance'
  | 'Student Records'
  | 'CIA / Internal Marks'
  | 'Exam Schedules'
  | 'Question Papers'
  | 'Results'
  | 'Timetable'
  | 'Academic Calendar'
  | 'Staff Records'
  | 'Department Reports'
  | 'Certificates'
  | 'Internship Documents'
  | 'Circulars & Notices'
  | 'Events';

export type FileFormat = 'pdf' | 'docx' | 'xlsx' | 'csv' | 'png' | 'jpg';

export interface CollegeDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  department: string;
  academicYear: string;
  yearLevel?: string; // e.g. "Year 1", "Year 2", "Year 3", "All Years"
  semester?: string;
  accessLevel: AccessLevel;
  fileFormat: FileFormat;
  fileSize: string;
  standardizedFilename: string;
  destinationDrivePath: string;
  uploadedBy: {
    name: string;
    role: UserRole;
    email: string;
    department?: string;
  };
  uploadDate: string; // ISO date string or formatted date
  modifiedDate: string;
  version: string;
  description: string;
  tags: string[];
  sampleContent: {
    type: 'tabular' | 'notice' | 'certificate' | 'calendar' | 'general';
    headers?: string[];
    rows?: (string | number)[][];
    officialLetterhead?: {
      institution: string;
      subTitle: string;
      refNo: string;
      date: string;
      subject: string;
      bodyParagraphs: string[];
      signatory: string;
      designation: string;
    };
    certificateData?: {
      recipientName: string;
      regNumber: string;
      program: string;
      achievement: string;
      issuedDate: string;
      signatory: string;
    };
    notes?: string;
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  yearLevel?: string;
  designation?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive';
  joinedDate: string;
}

export interface DepartmentInfo {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  facultyCount: number;
  studentCount: number;
  documentCount: number;
  status: 'active' | 'inactive';
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: 'UPLOAD' | 'VIEW' | 'DOWNLOAD' | 'EDIT' | 'DELETE' | 'RENAME' | 'MOVE' | 'ACCESS_CHANGE' | 'LOGIN' | 'LOGOUT';
  documentTitle?: string;
  documentId?: string;
  details: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'notice' | 'upload' | 'access' | 'system';
  isRead: boolean;
  relatedDocId?: string;
  targetRole?: UserRole | 'all';
}
