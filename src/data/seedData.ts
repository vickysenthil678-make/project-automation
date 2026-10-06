import { CollegeDocument, UserAccount, DepartmentInfo, ActivityEvent, AppNotification } from '../types';

export const SEED_USERS: UserAccount[] = [
  {
    id: 'usr-admin-01',
    name: 'Dr. Arthur Vance',
    email: 'admin@campus.test',
    role: 'admin',
    department: 'Central Administration',
    designation: 'Registrar & Chief Records Officer',
    status: 'active',
    joinedDate: '2021-06-15',
  },
  {
    id: 'usr-staff-01',
    name: 'Prof. Sarah Jenkins',
    email: 'staff@campus.test',
    role: 'staff',
    department: 'B.Sc Computer Science',
    yearLevel: 'Year 2',
    designation: 'Assistant Professor & 2nd Year Coordinator',
    status: 'active',
    joinedDate: '2023-08-01',
  },
  {
    id: 'usr-student-01',
    name: 'Rohan Sharma',
    email: 'student@campus.test',
    role: 'student',
    department: 'B.Sc Computer Science',
    yearLevel: 'Year 2',
    designation: 'Reg No: 24BCS1082 (Class Rep)',
    status: 'active',
    joinedDate: '2024-07-10',
  },
  {
    id: 'usr-guest-01',
    name: 'Visitor / Public Observer',
    email: 'guest@campus.test',
    role: 'guest',
    designation: 'Prospective Student / Public Visitor',
    status: 'active',
    joinedDate: '2026-10-01',
  },
  {
    id: 'usr-staff-02',
    name: 'Dr. Michael Chang',
    email: 'm.chang@campus.test',
    role: 'staff',
    department: 'M.Sc AI & Data Science',
    designation: 'Head of Department & Professor',
    status: 'active',
    joinedDate: '2022-01-15',
  },
  {
    id: 'usr-staff-03',
    name: 'Dr. Priya Sundaram',
    email: 'p.sundaram@campus.test',
    role: 'staff',
    department: 'B.Com Corporate Secretaryship',
    designation: 'Associate Professor',
    status: 'active',
    joinedDate: '2022-09-01',
  },
  {
    id: 'usr-staff-04',
    name: 'Prof. David Reynolds',
    email: 'd.reynolds@campus.test',
    role: 'staff',
    department: 'Mechanical Engineering',
    designation: 'Lab Superintendent & Senior Lecturer',
    status: 'active',
    joinedDate: '2020-03-10',
  }
];

export const SEED_DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'dept-cs',
    code: 'BSC-CS',
    name: 'B.Sc Computer Science',
    headOfDepartment: 'Dr. Alistair Finch',
    facultyCount: 14,
    studentCount: 320,
    documentCount: 42,
    status: 'active',
  },
  {
    id: 'dept-ai',
    code: 'MSC-AIDS',
    name: 'M.Sc AI & Data Science',
    headOfDepartment: 'Dr. Michael Chang',
    facultyCount: 8,
    studentCount: 110,
    documentCount: 26,
    status: 'active',
  },
  {
    id: 'dept-bcom',
    code: 'BCOM-CS',
    name: 'B.Com Corporate Secretaryship',
    headOfDepartment: 'Dr. Priya Sundaram',
    facultyCount: 12,
    studentCount: 280,
    documentCount: 31,
    status: 'active',
  },
  {
    id: 'dept-mech',
    code: 'BTECH-MECH',
    name: 'Mechanical Engineering',
    headOfDepartment: 'Dr. Robert Sterling',
    facultyCount: 18,
    studentCount: 360,
    documentCount: 38,
    status: 'active',
  },
  {
    id: 'dept-admin',
    code: 'ADMIN-CENTRAL',
    name: 'Central Administration & Dean Office',
    headOfDepartment: 'Dr. Arthur Vance',
    facultyCount: 6,
    studentCount: 0,
    documentCount: 54,
    status: 'active',
  },
  {
    id: 'dept-exam',
    code: 'COE-OFFICE',
    name: 'Office of Controller of Examinations',
    headOfDepartment: 'Prof. Elena Rostova',
    facultyCount: 5,
    studentCount: 0,
    documentCount: 48,
    status: 'active',
  }
];

export const SEED_DOCUMENTS: CollegeDocument[] = [
  {
    id: 'doc-001',
    title: 'B.Sc CS Year 2 Attendance — October 2026',
    category: 'Attendance',
    department: 'B.Sc Computer Science',
    academicYear: '2026-27',
    yearLevel: 'Year 2',
    semester: 'Semester III',
    accessLevel: 'College',
    fileFormat: 'xlsx',
    fileSize: '142 KB',
    standardizedFilename: 'BSC-CS_YEAR2_ATTENDANCE_OCTOBER_2026.xlsx',
    destinationDrivePath: 'College Digital Documents / B.Sc Computer Science / Year 2 / Attendance',
    uploadedBy: {
      name: 'Prof. Sarah Jenkins',
      role: 'staff',
      email: 'staff@campus.test',
      department: 'B.Sc Computer Science'
    },
    uploadDate: '2026-10-02 09:30 AM',
    modifiedDate: '2026-10-02 09:30 AM',
    version: 'v1.0',
    description: 'Monthly student attendance register and cumulative percentage report for B.Sc CS Section A & B.',
    tags: ['attendance', '2nd-year', 'october-2026', 'monthly-log'],
    sampleContent: {
      type: 'tabular',
      headers: ['Reg Number', 'Student Name', 'Total Working Days', 'Days Present', 'Days Absent', 'Attendance %', 'Status'],
      rows: [
        ['24BCS1081', 'Aarav Mehta', 24, 23, 1, '95.8%', 'Eligible'],
        ['24BCS1082', 'Rohan Sharma', 24, 24, 0, '100.0%', 'Eligible (CR)'],
        ['24BCS1083', 'Ananya Iyer', 24, 22, 2, '91.6%', 'Eligible'],
        ['24BCS1084', 'Kavya Nair', 24, 20, 4, '83.3%', 'Eligible'],
        ['24BCS1085', 'Vikramaditya Rao', 24, 17, 7, '70.8%', 'Shortage Warning'],
        ['24BCS1086', 'Sneha Paul', 24, 23, 1, '95.8%', 'Eligible'],
        ['24BCS1087', 'Devansh Gupta', 24, 21, 3, '87.5%', 'Eligible']
      ],
      notes: 'Threshold requirement: Minimum 75% attendance mandatory to sit for end-semester university exams.'
    }
  },
  {
    id: 'doc-002',
    title: 'CIA I Internal Marks — Data Structures & Algorithms',
    category: 'CIA / Internal Marks',
    department: 'B.Sc Computer Science',
    academicYear: '2026-27',
    yearLevel: 'Year 2',
    semester: 'Semester III',
    accessLevel: 'Student',
    fileFormat: 'pdf',
    fileSize: '318 KB',
    standardizedFilename: 'BSC-CS_YEAR2_CIA1_DATA_STRUCTURES_MARKS_2026.pdf',
    destinationDrivePath: 'College Digital Documents / B.Sc Computer Science / Year 2 / Internal Marks',
    uploadedBy: {
      name: 'Prof. Sarah Jenkins',
      role: 'staff',
      email: 'staff@campus.test',
      department: 'B.Sc Computer Science'
    },
    uploadDate: '2026-09-28 02:15 PM',
    modifiedDate: '2026-09-28 02:15 PM',
    version: 'v1.1',
    description: 'Continuous Internal Assessment (CIA-I) mark statement out of 50 for CS2301 Data Structures.',
    tags: ['cia-marks', 'data-structures', '2nd-year', 'internal-assessment'],
    sampleContent: {
      type: 'tabular',
      headers: ['Reg No.', 'Student Name', 'Test (30)', 'Assignment (10)', 'Quiz (10)', 'Total (50)', 'Grade'],
      rows: [
        ['24BCS1081', 'Aarav Mehta', 27, 10, 9, 46, 'O'],
        ['24BCS1082', 'Rohan Sharma', 29, 10, 10, 49, 'O'],
        ['24BCS1083', 'Ananya Iyer', 25, 9, 8, 42, 'A+'],
        ['24BCS1084', 'Kavya Nair', 22, 8, 7, 37, 'A'],
        ['24BCS1085', 'Vikramaditya Rao', 18, 7, 6, 31, 'B+'],
        ['24BCS1086', 'Sneha Paul', 28, 10, 9, 47, 'O'],
        ['24BCS1087', 'Devansh Gupta', 24, 9, 8, 41, 'A+']
      ],
      notes: 'Marks reviewed and signed off by Department Scrutiny Committee on 28th September 2026.'
    }
  },
  {
    id: 'doc-003',
    title: 'Computer Science Odd Semester Timetable — 2026',
    category: 'Timetable',
    department: 'B.Sc Computer Science',
    academicYear: '2026-27',
    yearLevel: 'Year 2',
    semester: 'Semester III',
    accessLevel: 'Student',
    fileFormat: 'pdf',
    fileSize: '240 KB',
    standardizedFilename: 'BSC-CS_YEAR2_TIMETABLE_ODD_SEM_2026.pdf',
    destinationDrivePath: 'College Digital Documents / B.Sc Computer Science / Year 2 / Timetables',
    uploadedBy: {
      name: 'Prof. Sarah Jenkins',
      role: 'staff',
      email: 'staff@campus.test',
      department: 'B.Sc Computer Science'
    },
    uploadDate: '2026-07-20 11:00 AM',
    modifiedDate: '2026-08-01 04:00 PM',
    version: 'v2.0',
    description: 'Weekly schedule of lectures, laboratory sessions, and tutorial hours for 2nd Year CS students.',
    tags: ['timetable', 'schedule', 'cs-year2', 'odd-semester'],
    sampleContent: {
      type: 'tabular',
      headers: ['Day', '09:00 - 10:00', '10:00 - 11:00', '11:15 - 12:15', '01:15 - 02:15', '02:15 - 04:15'],
      rows: [
        ['Monday', 'Data Structures (L1)', 'Operating Systems', 'Discrete Math', 'Python Programming', 'DS Lab (Batch A) / OS Lab (Batch B)'],
        ['Tuesday', 'Database Systems', 'Computer Networks', 'Data Structures (L2)', 'Library Hour', 'Web Dev Lab (All)'],
        ['Wednesday', 'Discrete Math', 'Data Structures (L3)', 'Operating Systems', 'Professional Ethics', 'Mini Project Mentoring'],
        ['Thursday', 'Computer Networks', 'Database Systems', 'Operating Systems', 'Aptitude Training', 'DBMS Lab (Batch A) / DS Lab (Batch B)'],
        ['Friday', 'Data Structures (L4)', 'Database Systems', 'Computer Networks', 'Sports & Club Activity', 'Open Seminar / Guest Lecture']
      ],
      notes: 'Room 304, Turing Block. Lab sessions conducted at Grace Hopper Computing Lab 2.'
    }
  },
  {
    id: 'doc-004',
    title: 'Academic Calendar & Schedule of Events — 2026–27',
    category: 'Academic Calendar',
    department: 'Central Administration & Dean Office',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Public',
    fileFormat: 'pdf',
    fileSize: '512 KB',
    standardizedFilename: 'CAMPUS_ALL_ACADEMIC_CALENDAR_2026_27.pdf',
    destinationDrivePath: 'College Digital Documents / Central Administration / Institutional Calendars',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-06-10 10:00 AM',
    modifiedDate: '2026-08-15 03:30 PM',
    version: 'v1.2',
    description: 'Official collegiate calendar detailing semester start dates, examination windows, vacations, and institutional events.',
    tags: ['academic-calendar', 'annual-schedule', 'public-calendar', '2026-27'],
    sampleContent: {
      type: 'calendar',
      officialLetterhead: {
        institution: 'ST. XAVIER METROPOLITAN COLLEGE OF ARTS & SCIENCES',
        subTitle: 'Autonomous Institution Affiliated to State University | NAAC A++ Grade',
        refNo: 'SXM/ACAD/CAL/2026-27/01',
        date: '10th June 2026',
        subject: 'Notification of Approved Academic Calendar for Academic Year 2026-2027',
        bodyParagraphs: [
          'The Academic Council at its 34th ordinary session held on June 5, 2026, has ratified the schedule of academic events for the upcoming year 2026-2027 for all Undergraduate and Postgraduate programmes.',
          'Key Milestones: Commencement of Odd Semester: July 15, 2026 | CIA-I Window: Sept 21-28, 2026 | CIA-II Window: Nov 02-09, 2026 | End Semester Practicals: Nov 20-30, 2026 | Theory Examinations: Dec 05-22, 2026 | Winter Recess: Dec 23 - Jan 04, 2027.',
          'All Departments, Examination Cells, and Administrative sections are instructed to strictly comply with the designated timeframes.'
        ],
        signatory: 'Dr. Arthur Vance',
        designation: 'Dean of Academic Affairs & Registrar'
      }
    }
  },
  {
    id: 'doc-005',
    title: 'College Annual Cultural Fest "Aura 2026" — Circular & Guidelines',
    category: 'Circulars & Notices',
    department: 'Central Administration & Dean Office',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Public',
    fileFormat: 'pdf',
    fileSize: '430 KB',
    standardizedFilename: 'CAMPUS_ALL_CIRCULAR_CULTURAL_FEST_AURA_2026.pdf',
    destinationDrivePath: 'College Digital Documents / Central Administration / Circulars',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-10-01 04:45 PM',
    modifiedDate: '2026-10-01 04:45 PM',
    version: 'v1.0',
    description: 'Official notification regarding dates, registration guidelines, and inter-collegiate event competitions for Aura 2026.',
    tags: ['circular', 'cultural-fest', 'aura-2026', 'student-life', 'public'],
    sampleContent: {
      type: 'notice',
      officialLetterhead: {
        institution: 'CAMPUS ARCHIVE · OFFICE OF STUDENT WELFARE',
        subTitle: 'St. Xavier Metropolitan College | Youth Cultural Committee',
        refNo: 'SXM/OSW/CIR/2026/104',
        date: '01st October 2026',
        subject: 'Call for Entries & Volunteer Registrations: Annual Inter-College Cultural Fest "AURA 2026"',
        bodyParagraphs: [
          'We are delighted to announce that "AURA 2026", our flagship annual inter-collegiate cultural fest, will be hosted from November 12th to November 14th, 2026 on the main campus grounds.',
          'Over 45 competitions spanning Music, Dance, Literary Arts, Theatrics, and Digital Media will feature prize pools exceeding 5,00,000 INR. Registrations open on October 8th via the college student portal.',
          'Student volunteer selections will be held on October 10th in the Main Auditorium at 3:30 PM. Attendance will be condoned for registered student coordinators.'
        ],
        signatory: 'Prof. Meenakshi Sundaram',
        designation: 'Dean of Student Affairs & Fest Convener'
      }
    }
  },
  {
    id: 'doc-006',
    title: 'Internship Completion Certificate — Rohan Sharma',
    category: 'Certificates',
    department: 'B.Sc Computer Science',
    academicYear: '2026-27',
    yearLevel: 'Year 2',
    accessLevel: 'Student',
    fileFormat: 'pdf',
    fileSize: '620 KB',
    standardizedFilename: 'BSC-CS_YEAR2_CERTIFICATE_INTERNSHIP_ROHAN_SHARMA_2026.pdf',
    destinationDrivePath: 'College Digital Documents / B.Sc Computer Science / Year 2 / Certificates',
    uploadedBy: {
      name: 'Prof. Sarah Jenkins',
      role: 'staff',
      email: 'staff@campus.test',
      department: 'B.Sc Computer Science'
    },
    uploadDate: '2026-09-15 11:30 AM',
    modifiedDate: '2026-09-15 11:30 AM',
    version: 'v1.0',
    description: 'Verified Summer 2026 Industry Internship certificate at Apex Cloud Systems for 24BCS1082.',
    tags: ['internship', 'certificate', 'rohan-sharma', 'industry-training'],
    sampleContent: {
      type: 'certificate',
      certificateData: {
        recipientName: 'Rohan Sharma',
        regNumber: '24BCS1082',
        program: 'B.Sc Computer Science (Honours)',
        achievement: 'Successful completion of 8-week Full Stack Cloud Engineering Internship at Apex Cloud Solutions Ltd.',
        issuedDate: '15th September 2026',
        signatory: 'Dr. Alistair Finch (Head of Department) & Apex Internship Directorate'
      }
    }
  },
  {
    id: 'doc-007',
    title: 'End-Semester Theory Exam Schedule — Autumn 2026',
    category: 'Exam Schedules',
    department: 'Office of Controller of Examinations',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Public',
    fileFormat: 'pdf',
    fileSize: '380 KB',
    standardizedFilename: 'COE_ALL_EXAM_SCHEDULE_AUTUMN_2026.pdf',
    destinationDrivePath: 'College Digital Documents / Examination Cell / Schedules',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-09-25 05:00 PM',
    modifiedDate: '2026-09-25 05:00 PM',
    version: 'v1.0',
    description: 'Detailed timetable of UG and PG autonomous semester examinations commencing December 2026.',
    tags: ['exam-schedule', 'autumn-2026', 'controller-of-exams', 'datesheet'],
    sampleContent: {
      type: 'tabular',
      headers: ['Date & Session', 'Department', 'Course Code', 'Subject Title', 'Duration'],
      rows: [
        ['05-Dec-2026 (FN)', 'B.Sc Computer Science', 'CS2301', 'Data Structures & Algorithmic Analysis', '3 Hours (09:30 - 12:30)'],
        ['07-Dec-2026 (FN)', 'B.Sc Computer Science', 'CS2302', 'Relational Database Management Systems', '3 Hours (09:30 - 12:30)'],
        ['09-Dec-2026 (FN)', 'B.Sc Computer Science', 'CS2303', 'Operating Systems Principles', '3 Hours (09:30 - 12:30)'],
        ['11-Dec-2026 (FN)', 'B.Sc Computer Science', 'MA2304', 'Discrete Mathematical Structures', '3 Hours (09:30 - 12:30)'],
        ['14-Dec-2026 (FN)', 'M.Sc AI & DS', 'AI5101', 'Foundations of Deep Learning', '3 Hours (09:30 - 12:30)'],
        ['16-Dec-2026 (FN)', 'B.Com Corp Sec', 'BC2101', 'Corporate Accounting & Auditing', '3 Hours (09:30 - 12:30)']
      ],
      notes: 'Hall tickets will be accessible via Student Portal from 20th November 2026.'
    }
  },
  {
    id: 'doc-008',
    title: 'Model Question Paper — Advanced Machine Learning (M.Sc AI)',
    category: 'Question Papers',
    department: 'M.Sc AI & Data Science',
    academicYear: '2026-27',
    yearLevel: 'Year 1',
    semester: 'Semester I',
    accessLevel: 'Student',
    fileFormat: 'pdf',
    fileSize: '410 KB',
    standardizedFilename: 'MSC-AIDS_YEAR1_QUESTION_PAPER_ADV_MACHINE_LEARNING_2026.pdf',
    destinationDrivePath: 'College Digital Documents / M.Sc AI & Data Science / Year 1 / Question Papers',
    uploadedBy: {
      name: 'Dr. Michael Chang',
      role: 'staff',
      email: 'm.chang@campus.test',
      department: 'M.Sc AI & Data Science'
    },
    uploadDate: '2026-09-18 10:15 AM',
    modifiedDate: '2026-09-18 10:15 AM',
    version: 'v1.0',
    description: 'Autonomous sample question paper with Bloom’s taxonomy distribution and marking scheme for AI5102.',
    tags: ['question-paper', 'model-paper', 'msc-ai', 'machine-learning'],
    sampleContent: {
      type: 'general',
      notes: 'Contains Part A (10 x 2 = 20 Marks), Part B (5 x 10 = 50 Marks), and Part C Case Study (1 x 15 = 15 Marks). Focus topics: Transformer architectures, Attention mechanisms, and Graph Neural Networks.'
    }
  },
  {
    id: 'doc-009',
    title: 'Annual Department Research & Publication Report — 2025–26',
    category: 'Department Reports',
    department: 'B.Sc Computer Science',
    academicYear: '2025-26',
    yearLevel: 'All Years',
    accessLevel: 'College',
    fileFormat: 'pdf',
    fileSize: '1.4 MB',
    standardizedFilename: 'BSC-CS_ALL_REPORT_RESEARCH_AND_PUBLICATIONS_2025_26.pdf',
    destinationDrivePath: 'College Digital Documents / B.Sc Computer Science / Department Reports',
    uploadedBy: {
      name: 'Prof. Sarah Jenkins',
      role: 'staff',
      email: 'staff@campus.test',
      department: 'B.Sc Computer Science'
    },
    uploadDate: '2026-08-30 03:00 PM',
    modifiedDate: '2026-08-30 03:00 PM',
    version: 'v1.0',
    description: 'Summary of 18 Scopus-indexed faculty papers, 4 patent grants, and student innovation hub outcomes.',
    tags: ['department-report', 'naac-documentation', 'faculty-research', 'annual-report'],
    sampleContent: {
      type: 'general',
      notes: 'Compiled for NAAC Peer Review Committee and Internal Quality Assurance Cell (IQAC).'
    }
  },
  {
    id: 'doc-010',
    title: 'Staff Appraisal & Peer Evaluation Matrix — Confidential 2026',
    category: 'Staff Records',
    department: 'Central Administration & Dean Office',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Private',
    fileFormat: 'docx',
    fileSize: '290 KB',
    standardizedFilename: 'ADMIN_ALL_STAFF_APPRAISAL_EVALUATION_2026_CONFIDENTIAL.docx',
    destinationDrivePath: 'College Digital Documents / Central Administration / Restricted Staff Files',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-09-05 09:00 AM',
    modifiedDate: '2026-09-05 09:00 AM',
    version: 'v1.0',
    description: 'Executive committee annual faculty appraisal performance scoring sheets.',
    tags: ['staff-records', 'confidential', 'appraisal', 'executive-only'],
    sampleContent: {
      type: 'general',
      notes: 'Access strictly restricted to Registrar, Principal, and College Governing Board members.'
    }
  },
  {
    id: 'doc-011',
    title: 'Corporate Internship MoUs & Industry Placement List — 2026',
    category: 'Internship Documents',
    department: 'B.Com Corporate Secretaryship',
    academicYear: '2026-27',
    yearLevel: 'Year 3',
    accessLevel: 'College',
    fileFormat: 'pdf',
    fileSize: '820 KB',
    standardizedFilename: 'BCOM-CS_YEAR3_INTERNSHIP_CORPORATE_MOUS_2026.pdf',
    destinationDrivePath: 'College Digital Documents / B.Com Corporate Secretaryship / Year 3 / Internships',
    uploadedBy: {
      name: 'Dr. Priya Sundaram',
      role: 'staff',
      email: 'p.sundaram@campus.test',
      department: 'B.Com Corporate Secretaryship'
    },
    uploadDate: '2026-09-12 01:40 PM',
    modifiedDate: '2026-09-12 01:40 PM',
    version: 'v1.0',
    description: 'Placement cell agreements with leading audit firms, banks, and corporate secretarial chambers.',
    tags: ['bcom', 'internship', 'placement-mou', 'industry-connect'],
    sampleContent: {
      type: 'general',
      notes: 'Covers 62 corporate partners offering mandatory 60-day summer trainee postings.'
    }
  },
  {
    id: 'doc-012',
    title: 'Fluid Mechanics Laboratory Manual & Safety Protocols',
    category: 'Department Reports',
    department: 'Mechanical Engineering',
    academicYear: '2026-27',
    yearLevel: 'Year 2',
    semester: 'Semester IV',
    accessLevel: 'Student',
    fileFormat: 'pdf',
    fileSize: '2.1 MB',
    standardizedFilename: 'BTECH-MECH_YEAR2_LAB_MANUAL_FLUID_MECHANICS_2026.pdf',
    destinationDrivePath: 'College Digital Documents / Mechanical Engineering / Year 2 / Lab Manuals',
    uploadedBy: {
      name: 'Prof. David Reynolds',
      role: 'staff',
      email: 'd.reynolds@campus.test',
      department: 'Mechanical Engineering'
    },
    uploadDate: '2026-08-10 11:20 AM',
    modifiedDate: '2026-08-10 11:20 AM',
    version: 'v3.1',
    description: 'Comprehensive experiment procedures, apparatus formulas, and lab emergency protocols.',
    tags: ['mechanical', 'lab-manual', 'fluid-mechanics', 'safety'],
    sampleContent: {
      type: 'general',
      notes: 'Verified by Department Safety Board. Includes calibration charts for Venturimeter and Pelton Wheel.'
    }
  },
  {
    id: 'doc-013',
    title: 'Graduation Day 2026 Convocation Register & Degree Awardees',
    category: 'Student Records',
    department: 'Central Administration & Dean Office',
    academicYear: '2025-26',
    yearLevel: 'All Years',
    accessLevel: 'Public',
    fileFormat: 'pdf',
    fileSize: '740 KB',
    standardizedFilename: 'CAMPUS_ALL_CONVOCATION_LIST_2026_AWARDEES.pdf',
    destinationDrivePath: 'College Digital Documents / Central Administration / Convocation',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-09-01 02:00 PM',
    modifiedDate: '2026-09-01 02:00 PM',
    version: 'v1.0',
    description: 'Official roll of medal winners, rank holders, and graduating batch of 2026.',
    tags: ['convocation', 'graduation', 'medal-winners', 'degree-records', 'public'],
    sampleContent: {
      type: 'tabular',
      headers: ['Rank', 'Reg No.', 'Graduate Name', 'Degree Program', 'CGPA', 'Distinction'],
      rows: [
        ['Gold Medal', '23BCS0912', 'Tanvi S. Deshmukh', 'B.Sc Computer Science', '9.88', 'First Class with Exemplary'],
        ['Silver Medal', '23BCS0944', 'Karthik Raman', 'B.Sc Computer Science', '9.74', 'First Class with Distinction'],
        ['Gold Medal', '23BCM0415', 'Meera V. Nair', 'B.Com Corporate Sec', '9.81', 'First Class with Exemplary'],
        ['Gold Medal', '24MAI0102', 'David O. Adeleke', 'M.Sc AI & Data Science', '9.92', 'First Class with Exemplary']
      ],
      notes: 'Presided by the Honorable Chancellor and Chief Guest on September 14, 2026.'
    }
  },
  {
    id: 'doc-014',
    title: 'Semester II Revaluation & Consolidated Results Gazettes',
    category: 'Results',
    department: 'Office of Controller of Examinations',
    academicYear: '2025-26',
    yearLevel: 'Year 1',
    semester: 'Semester II',
    accessLevel: 'Student',
    fileFormat: 'csv',
    fileSize: '95 KB',
    standardizedFilename: 'COE_YEAR1_RESULTS_REVALUATION_SEM2_2026.csv',
    destinationDrivePath: 'College Digital Documents / Examination Cell / Results Archive',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-07-28 04:30 PM',
    modifiedDate: '2026-07-28 04:30 PM',
    version: 'v1.0',
    description: 'Updated official marks ledger post grievance redressal and independent double-valuation.',
    tags: ['results', 'revaluation', 'semester-2', 'coe-gazette'],
    sampleContent: {
      type: 'tabular',
      headers: ['Reg No.', 'Student Name', 'Subject Code', 'Original Marks', 'Revised Marks', 'Final Result'],
      rows: [
        ['24BCS1014', 'Aditya Verma', 'CS1201', 38, 44, 'PASS (Grade B+)'],
        ['24BCS1032', 'Bhavna Kulkarni', 'MA1202', 42, 51, 'PASS (Grade A)'],
        ['24BCS1055', 'Harish Nathan', 'PH1203', 35, 41, 'PASS (Grade B)'],
        ['24BCS1085', 'Vikramaditya Rao', 'CS1201', 40, 47, 'PASS (Grade A)']
      ],
      notes: 'Published under authority of Section 14.B of the Autonomous College Regulations.'
    }
  },
  {
    id: 'doc-015',
    title: 'National Conference on Generative AI & Robotics — Call for Papers',
    category: 'Events',
    department: 'M.Sc AI & Data Science',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Public',
    fileFormat: 'pdf',
    fileSize: '480 KB',
    standardizedFilename: 'MSC-AIDS_ALL_EVENT_NCGAIR_2026_CFP.pdf',
    destinationDrivePath: 'College Digital Documents / M.Sc AI & Data Science / Events',
    uploadedBy: {
      name: 'Dr. Michael Chang',
      role: 'staff',
      email: 'm.chang@campus.test',
      department: 'M.Sc AI & Data Science'
    },
    uploadDate: '2026-09-20 01:10 PM',
    modifiedDate: '2026-09-20 01:10 PM',
    version: 'v1.0',
    description: 'Brochure, track details, keynotes, and IEEE publication partnership guidelines for NCGAIR-2026.',
    tags: ['events', 'conference', 'ai-robotics', 'research-papers', 'public'],
    sampleContent: {
      type: 'notice',
      officialLetterhead: {
        institution: 'DEPARTMENT OF AI & DATA SCIENCE · NCGAIR 2026',
        subTitle: 'In Technical Co-Sponsorship with IEEE Computer Society Chapter',
        refNo: 'NCGAIR/CONF/2026/01',
        date: '20th September 2026',
        subject: 'Call for Original Research Papers: 3rd National Conference on Generative AI (NCGAIR-26)',
        bodyParagraphs: [
          'The Department of AI & Data Science cordially invites faculty, researchers, and students to submit high-quality original research papers for the 3rd National Conference on Generative AI and Robotics (NCGAIR-2026), scheduled for December 18-19, 2026.',
          'Conference Tracks: 1. Large Language Models & Agentic Frameworks | 2. Computer Vision & Embodied AI | 3. Ethical AI & Robustness | 4. Industrial Robotics.',
          'All accepted and presented papers will be submitted for inclusion into IEEE Xplore digital library.'
        ],
        signatory: 'Dr. Michael Chang',
        designation: 'Conference General Chair & HOD'
      }
    }
  },
  {
    id: 'doc-016',
    title: 'Internal Audit & UGC Autonomous Compliance Dossier — 2026',
    category: 'Department Reports',
    department: 'Central Administration & Dean Office',
    academicYear: '2026-27',
    yearLevel: 'All Years',
    accessLevel: 'Private',
    fileFormat: 'pdf',
    fileSize: '3.2 MB',
    standardizedFilename: 'ADMIN_ALL_REPORT_UGC_AUTONOMY_COMPLIANCE_2026.pdf',
    destinationDrivePath: 'College Digital Documents / Central Administration / Statutory Audits',
    uploadedBy: {
      name: 'Dr. Arthur Vance',
      role: 'admin',
      email: 'admin@campus.test',
      department: 'Central Administration'
    },
    uploadDate: '2026-08-01 10:00 AM',
    modifiedDate: '2026-08-01 10:00 AM',
    version: 'v1.0',
    description: 'Comprehensive statutory filing for University Grants Commission autonomous status extension.',
    tags: ['ugc-compliance', 'statutory-audit', 'private', 'institutional-review'],
    sampleContent: {
      type: 'general',
      notes: 'Restricted access document. Contains financial balance sheets and university affiliation certificates.'
    }
  }
];

export const SEED_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-001',
    timestamp: '2026-10-05 06:15 PM',
    userName: 'Dr. Arthur Vance',
    userRole: 'admin',
    action: 'LOGIN',
    details: 'Admin session authenticated from Registrar Office workstation.'
  },
  {
    id: 'act-002',
    timestamp: '2026-10-02 09:30 AM',
    userName: 'Prof. Sarah Jenkins',
    userRole: 'staff',
    action: 'UPLOAD',
    documentTitle: 'B.Sc CS Year 2 Attendance — October 2026',
    documentId: 'doc-001',
    details: 'Uploaded monthly attendance sheet into "College Digital Documents / B.Sc Computer Science / Year 2 / Attendance".'
  },
  {
    id: 'act-003',
    timestamp: '2026-10-01 04:45 PM',
    userName: 'Dr. Arthur Vance',
    userRole: 'admin',
    action: 'UPLOAD',
    documentTitle: 'College Annual Cultural Fest "Aura 2026" — Circular & Guidelines',
    documentId: 'doc-005',
    details: 'Published public circular for Aura 2026 cultural festival.'
  },
  {
    id: 'act-004',
    timestamp: '2026-09-28 02:15 PM',
    userName: 'Prof. Sarah Jenkins',
    userRole: 'staff',
    action: 'UPLOAD',
    documentTitle: 'CIA I Internal Marks — Data Structures & Algorithms',
    documentId: 'doc-002',
    details: 'Uploaded continuous internal assessment marks statement with Student access level.'
  },
  {
    id: 'act-005',
    timestamp: '2026-09-25 05:00 PM',
    userName: 'Dr. Arthur Vance',
    userRole: 'admin',
    action: 'UPLOAD',
    documentTitle: 'End-Semester Theory Exam Schedule — Autumn 2026',
    documentId: 'doc-007',
    details: 'Published Autumn 2026 datesheet to Examination Cell archive.'
  },
  {
    id: 'act-006',
    timestamp: '2026-09-20 01:10 PM',
    userName: 'Dr. Michael Chang',
    userRole: 'staff',
    action: 'UPLOAD',
    documentTitle: 'National Conference on Generative AI & Robotics — Call for Papers',
    documentId: 'doc-015',
    details: 'Created conference announcement under M.Sc AI & Data Science directory.'
  },
  {
    id: 'act-007',
    timestamp: '2026-09-15 11:30 AM',
    userName: 'Prof. Sarah Jenkins',
    userRole: 'staff',
    action: 'UPLOAD',
    documentTitle: 'Internship Completion Certificate — Rohan Sharma',
    documentId: 'doc-006',
    details: 'Verified and archived internship certificate for student 24BCS1082.'
  }
];

export const SEED_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'Cultural Fest "Aura 2026" Circular Released',
    message: 'Official guidelines and registration dates for Aura 2026 have been published.',
    timestamp: '2 hours ago',
    type: 'notice',
    isRead: false,
    relatedDocId: 'doc-005',
    targetRole: 'all'
  },
  {
    id: 'notif-002',
    title: 'CIA-I Marks Published for B.Sc CS Year 2',
    message: 'Prof. Sarah Jenkins has published internal scores for Data Structures & Algorithms.',
    timestamp: '1 day ago',
    type: 'upload',
    isRead: false,
    relatedDocId: 'doc-002',
    targetRole: 'student'
  },
  {
    id: 'notif-003',
    title: 'Exam Schedule: Autumn 2026 Theory Exams',
    message: 'Controller of Examinations has updated the session datesheet for upcoming finals.',
    timestamp: '3 days ago',
    type: 'notice',
    isRead: true,
    relatedDocId: 'doc-007',
    targetRole: 'all'
  },
  {
    id: 'notif-004',
    title: 'System Backup & Google Drive Sync Complete',
    message: 'All 16 active departmental repository directories verified and synchronized.',
    timestamp: '5 days ago',
    type: 'system',
    isRead: true,
    targetRole: 'admin'
  }
];
