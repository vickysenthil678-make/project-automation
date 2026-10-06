import { UserAccount, CollegeDocument, UserRole, AccessLevel } from '../types';

export const DEMO_CREDENTIALS = [
  {
    role: 'admin' as UserRole,
    label: 'Admin',
    email: 'admin@campus.test',
    password: 'AdminDemo26!',
    name: 'Dr. Arthur Vance',
    title: 'Registrar & Chief Records Officer',
    scopeBadge: 'Full Institutional Access',
    description: 'Full administrative access: add, edit, rename, move, delete documents, manage users and departments, and inspect system audit logs.'
  },
  {
    role: 'staff' as UserRole,
    label: 'Staff',
    email: 'staff@campus.test',
    password: 'StaffDemo26!',
    name: 'Prof. Sarah Jenkins',
    title: '2nd Year Coordinator · B.Sc Computer Science',
    scopeBadge: 'B.Sc Computer Science · Year 2',
    description: 'Departmental faculty access: view and download curriculum materials, and upload/manage records within assigned 2nd-year scope.'
  },
  {
    role: 'student' as UserRole,
    label: 'Student',
    email: 'student@campus.test',
    password: 'StudentDemo26!',
    name: 'Rohan Sharma',
    title: 'Reg No: 24BCS1082 (Class Rep)',
    scopeBadge: 'B.Sc Computer Science · Year 2 (Student)',
    description: 'Student access: browse, search, preview, and download timetables, internal marks, circulars, and certificates released for students.'
  },
  {
    role: 'guest' as UserRole,
    label: 'Guest',
    email: 'guest@campus.test',
    password: 'GuestDemo26!',
    name: 'Visitor / Public Observer',
    title: 'Public Portal Viewer',
    scopeBadge: 'Public Documents Only',
    description: 'Public visitor view: browse and view institutional circulars, academic calendars, event announcements, and public gazettes.'
  }
];

export function canView(user: UserAccount | null, doc: CollegeDocument): boolean {
  if (doc.accessLevel === 'Public') return true;
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'guest') return false;
  if (user.role === 'student') return doc.accessLevel === 'Student';
  if (user.role === 'staff') {
    if (doc.accessLevel === 'Student' || doc.accessLevel === 'College') {
      return true;
    }
    // Private documents are only viewable by Admin or the exact uploader
    return doc.uploadedBy.email === user.email;
  }
  return false;
}

export function canDownload(user: UserAccount | null, doc: CollegeDocument): boolean {
  return canView(user, doc);
}

export function canUpload(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'staff';
}

export function canEdit(user: UserAccount | null, doc: CollegeDocument): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') {
    // Staff can edit documents within their department or uploaded by them
    if (doc.uploadedBy.email === user.email) return true;
    if (user.department && doc.department === user.department) return true;
  }
  return false;
}

export function canDelete(user: UserAccount | null, doc: CollegeDocument): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  if (user.role === 'staff') {
    // Staff can only delete what they uploaded themselves
    return doc.uploadedBy.email === user.email;
  }
  return false;
}

export function canChangeAccess(user: UserAccount | null, _doc: CollegeDocument): boolean {
  if (!user) return false;
  return user.role === 'admin';
}

export function canManageUsers(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'admin';
}

export function canViewActivityLog(user: UserAccount | null): boolean {
  if (!user) return false;
  return user.role === 'admin';
}

export function getPermissionExplanation(
  action: 'view' | 'upload' | 'edit' | 'delete' | 'changeAccess' | 'manageUsers' | 'activityLog',
  user: UserAccount | null,
  doc?: CollegeDocument
): string {
  if (!user) {
    return 'Sign in with an authorized college role to perform this action.';
  }

  switch (action) {
    case 'upload':
      return user.role === 'student' || user.role === 'guest'
        ? `Students and Guests do not have document upload privileges. Switch to Staff or Admin role.`
        : 'Authorized to upload within your scope.';

    case 'edit':
      if (user.role === 'student' || user.role === 'guest') {
        return `Edit permission is reserved for faculty coordinators and administrative staff.`;
      }
      if (user.role === 'staff' && doc && doc.department !== user.department && doc.uploadedBy.email !== user.email) {
        return `Staff can only modify records belonging to their assigned department (${user.department}).`;
      }
      return 'Authorized to edit this record.';

    case 'delete':
      if (user.role === 'student' || user.role === 'guest') {
        return `Students and Guests cannot remove institutional records.`;
      }
      if (user.role === 'staff' && doc && doc.uploadedBy.email !== user.email) {
        return `Staff can only delete documents they personally authored and uploaded.`;
      }
      return 'Authorized to delete this document.';

    case 'changeAccess':
      return user.role !== 'admin'
        ? 'Only Central Administration (Admin role) can alter statutory access classification.'
        : 'Admin authorized.';

    case 'manageUsers':
      return user.role !== 'admin'
        ? 'User & Department management is restricted to Central Administration (Admin role).'
        : 'Admin authorized.';

    case 'activityLog':
      return user.role !== 'admin'
        ? 'System security and audit trails are visible exclusively to Central Administration.'
        : 'Admin authorized.';

    default:
      return 'Permission denied by institutional access policy.';
  }
}

export function getAllowedAccessLevelsForRole(role: UserRole): AccessLevel[] {
  if (role === 'admin') {
    return ['Public', 'Student', 'College', 'Private'];
  }
  if (role === 'staff') {
    return ['Student', 'College'];
  }
  return ['Public'];
}
