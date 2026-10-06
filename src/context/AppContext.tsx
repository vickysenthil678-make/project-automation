import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CollegeDocument,
  UserAccount,
  DepartmentInfo,
  ActivityEvent,
  AppNotification,
  UserRole,
  AccessLevel,
  DocumentCategory
} from '../types';
import {
  SEED_USERS,
  SEED_DEPARTMENTS,
  SEED_DOCUMENTS,
  SEED_ACTIVITIES,
  SEED_NOTIFICATIONS
} from '../data/seedData';
import { DEMO_CREDENTIALS, canView } from '../utils/auth';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface FilterState {
  department: string;
  academicYear: string;
  category: string;
  accessLevel: string;
}

interface AppContextType {
  currentUser: UserAccount | null;
  documents: CollegeDocument[];
  users: UserAccount[];
  departments: DepartmentInfo[];
  activities: ActivityEvent[];
  notifications: AppNotification[];
  
  // Filtering & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  clearFilters: () => void;
  activeFilterCount: number;
  sortOption: 'newest' | 'oldest' | 'title' | 'category';
  setSortOption: (sort: 'newest' | 'oldest' | 'title' | 'category') => void;
  viewMode: 'table' | 'cards';
  setViewMode: (mode: 'table' | 'cards') => void;

  // Modals & Drawers
  selectedDocForPreview: CollegeDocument | null;
  setSelectedDocForPreview: (doc: CollegeDocument | null) => void;
  activeModal: 'upload' | 'edit' | 'delete' | 'move' | 'userForm' | 'deptForm' | 'resetConfirm' | 'accessChange' | null;
  setActiveModal: (modal: 'upload' | 'edit' | 'delete' | 'move' | 'userForm' | 'deptForm' | 'resetConfirm' | 'accessChange' | null) => void;
  modalTargetDoc: CollegeDocument | null;
  setModalTargetDoc: (doc: CollegeDocument | null) => void;

  // Toast
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Actions
  loginWithRole: (role: UserRole) => void;
  loginWithCredentials: (email: string, pass: string) => boolean;
  logout: () => void;
  addDocument: (newDoc: Omit<CollegeDocument, 'id' | 'uploadDate' | 'modifiedDate' | 'version'>) => void;
  updateDocument: (id: string, updates: Partial<CollegeDocument>) => void;
  deleteDocument: (id: string) => void;
  changeDocumentAccess: (id: string, newAccess: AccessLevel) => void;
  
  // User & Dept Actions (Admin)
  addUser: (user: Omit<UserAccount, 'id' | 'joinedDate'>) => void;
  updateUser: (id: string, updates: Partial<UserAccount>) => void;
  toggleUserStatus: (id: string) => void;
  addDepartment: (dept: Omit<DepartmentInfo, 'id' | 'documentCount'>) => void;
  updateDepartment: (id: string, updates: Partial<DepartmentInfo>) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // System
  resetToSeedData: () => void;
  getFilteredAndSortedDocs: () => CollegeDocument[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  DOCS: 'campus_archive_docs_v1',
  USERS: 'campus_archive_users_v1',
  DEPTS: 'campus_archive_depts_v1',
  ACTIVITIES: 'campus_archive_acts_v1',
  NOTIFS: 'campus_archive_notifs_v1',
  CURRENT_USER: 'campus_archive_curr_user_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from LocalStorage or Seed Data
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    // Default to Dr. Arthur Vance (Admin) for rich initial exploration
    return SEED_USERS[0];
  });

  const [documents, setDocuments] = useState<CollegeDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_DOCUMENTS;
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_USERS;
  });

  const [departments, setDepartments] = useState<DepartmentInfo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DEPTS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_DEPARTMENTS;
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_ACTIVITIES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return SEED_NOTIFICATIONS;
  });

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    department: 'all',
    academicYear: 'all',
    category: 'all',
    accessLevel: 'all',
  });
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'category'>('newest');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');

  const [selectedDocForPreview, setSelectedDocForPreview] = useState<CollegeDocument | null>(null);
  const [activeModal, setActiveModal] = useState<'upload' | 'edit' | 'delete' | 'move' | 'userForm' | 'deptForm' | 'resetConfirm' | 'accessChange' | null>(null);
  const [modalTargetDoc, setModalTargetDoc] = useState<CollegeDocument | null>(null);

  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEPTS, JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(curr => (curr?.id === id ? null : curr));
    }, 4000);
  };

  const addActivity = (action: ActivityEvent['action'], details: string, doc?: { id: string; title: string }) => {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newEvent: ActivityEvent = {
      id: `act-${Date.now()}`,
      timestamp: formatted,
      userName: currentUser ? currentUser.name : 'Guest User',
      userRole: currentUser ? currentUser.role : 'guest',
      action,
      details,
      documentId: doc?.id,
      documentTitle: doc?.title,
    };

    setActivities(prev => [newEvent, ...prev]);
  };

  const loginWithRole = (role: UserRole) => {
    const matched = users.find(u => u.role === role) || SEED_USERS.find(u => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      addActivity('LOGIN', `Switched session to role: ${role.toUpperCase()} (${matched.name})`);
      showToast(`Signed in as ${matched.name} (${role.toUpperCase()})`, 'info');
    }
  };

  const loginWithCredentials = (email: string, pass: string): boolean => {
    const cred = DEMO_CREDENTIALS.find(c => c.email.toLowerCase() === email.toLowerCase().trim());
    if (cred && cred.password === pass) {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || {
        id: `usr-${cred.role}-01`,
        name: cred.name,
        email: cred.email,
        role: cred.role,
        status: 'active' as const,
        joinedDate: '2024-01-01',
      };
      setCurrentUser(user);
      addActivity('LOGIN', `Signed in with demo credentials (${user.name})`);
      showToast(`Welcome back, ${user.name}!`, 'success');
      return true;
    }
    return false;
  };

  const logout = () => {
    if (currentUser) {
      addActivity('LOGOUT', `Signed out from ${currentUser.name}`);
    }
    setCurrentUser(null);
    showToast('Signed out of Campus Archive session', 'info');
  };

  const addDocument = (newDocData: Omit<CollegeDocument, 'id' | 'uploadDate' | 'modifiedDate' | 'version'>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newDoc: CollegeDocument = {
      ...newDocData,
      id: `doc-${Date.now()}`,
      uploadDate: formattedDate,
      modifiedDate: formattedDate,
      version: 'v1.0',
    };

    setDocuments(prev => [newDoc, ...prev]);
    addActivity('UPLOAD', `Uploaded document "${newDoc.title}" to ${newDoc.destinationDrivePath}`, {
      id: newDoc.id,
      title: newDoc.title,
    });

    // Notify users
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `New Document: ${newDoc.title}`,
      message: `${currentUser?.name || 'Staff'} uploaded a new ${newDoc.category} in ${newDoc.department}.`,
      timestamp: 'Just now',
      type: 'upload',
      isRead: false,
      relatedDocId: newDoc.id,
      targetRole: newDoc.accessLevel === 'Student' ? 'student' : 'all',
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`Document "${newDoc.title}" successfully archived & synced!`, 'success');
  };

  const updateDocument = (id: string, updates: Partial<CollegeDocument>) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }) + ' ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    setDocuments(prev =>
      prev.map(doc => {
        if (doc.id === id) {
          const updated = { ...doc, ...updates, modifiedDate: formattedDate };
          return updated;
        }
        return doc;
      })
    );

    const doc = documents.find(d => d.id === id);
    if (doc) {
      addActivity('EDIT', `Updated metadata for "${updates.title || doc.title}"`, {
        id: doc.id,
        title: updates.title || doc.title,
      });
    }

    showToast('Document record updated successfully', 'success');
  };

  const deleteDocument = (id: string) => {
    const docToDelete = documents.find(d => d.id === id);
    if (docToDelete) {
      setDocuments(prev => prev.filter(d => d.id !== id));
      addActivity('DELETE', `Archived document "${docToDelete.title}" removed from repository`, {
        id: docToDelete.id,
        title: docToDelete.title,
      });
      if (selectedDocForPreview?.id === id) {
        setSelectedDocForPreview(null);
      }
      showToast(`Document "${docToDelete.title}" deleted`, 'warning');
    }
  };

  const changeDocumentAccess = (id: string, newAccess: AccessLevel) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      updateDocument(id, { accessLevel: newAccess });
      addActivity('ACCESS_CHANGE', `Changed access level of "${doc.title}" to ${newAccess}`, {
        id: doc.id,
        title: doc.title,
      });
      showToast(`Access policy updated to: ${newAccess}`, 'info');
    }
  };

  const addUser = (userData: Omit<UserAccount, 'id' | 'joinedDate'>) => {
    const newUser: UserAccount = {
      ...userData,
      id: `usr-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
    addActivity('EDIT', `Added new user account for ${newUser.name} (${newUser.role})`);
    showToast(`User account created for ${newUser.name}`, 'success');
  };

  const updateUser = (id: string, updates: Partial<UserAccount>) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updates } : u)));
    addActivity('EDIT', `Updated user account settings`);
    showToast('User account updated', 'success');
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === id) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
    showToast('User status updated', 'info');
  };

  const addDepartment = (deptData: Omit<DepartmentInfo, 'id' | 'documentCount'>) => {
    const newDept: DepartmentInfo = {
      ...deptData,
      id: `dept-${Date.now()}`,
      documentCount: 0,
    };
    setDepartments(prev => [...prev, newDept]);
    showToast(`Department "${newDept.name}" added`, 'success');
  };

  const updateDepartment = (id: string, updates: Partial<DepartmentInfo>) => {
    setDepartments(prev => prev.map(d => (d.id === id ? { ...d, ...updates } : d)));
    showToast('Department details updated', 'success');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'info');
  };

  const resetToSeedData = () => {
    localStorage.removeItem(STORAGE_KEYS.DOCS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.DEPTS);
    localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);

    setDocuments(SEED_DOCUMENTS);
    setUsers(SEED_USERS);
    setDepartments(SEED_DEPARTMENTS);
    setActivities(SEED_ACTIVITIES);
    setNotifications(SEED_NOTIFICATIONS);
    setCurrentUser(SEED_USERS[0]);

    showToast('Repository reset to original demo seed state', 'info');
  };

  const clearFilters = () => {
    setFilters({
      department: 'all',
      academicYear: 'all',
      category: 'all',
      accessLevel: 'all',
    });
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(filters).filter(val => val !== 'all').length + (searchQuery ? 1 : 0);

  const getFilteredAndSortedDocs = (): CollegeDocument[] => {
    return documents
      .filter(doc => {
        // Enforce role-based viewing permission
        if (!canView(currentUser, doc)) {
          return false;
        }

        // Apply Search query (title, register no, student name, department, category, tags, uploader)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = doc.title.toLowerCase().includes(q);
          const matchDept = doc.department.toLowerCase().includes(q);
          const matchCat = doc.category.toLowerCase().includes(q);
          const matchUploader = doc.uploadedBy.name.toLowerCase().includes(q);
          const matchDesc = doc.description.toLowerCase().includes(q);
          const matchTags = doc.tags.some(t => t.toLowerCase().includes(q));
          const matchContent =
            doc.sampleContent.headers?.some(h => h.toLowerCase().includes(q)) ||
            doc.sampleContent.rows?.some(row => row.some(cell => String(cell).toLowerCase().includes(q))) ||
            doc.sampleContent.certificateData?.recipientName.toLowerCase().includes(q) ||
            doc.sampleContent.certificateData?.regNumber.toLowerCase().includes(q) ||
            doc.sampleContent.officialLetterhead?.subject.toLowerCase().includes(q);

          if (!matchTitle && !matchDept && !matchCat && !matchUploader && !matchDesc && !matchTags && !matchContent) {
            return false;
          }
        }

        // Apply Category filter
        if (filters.category !== 'all' && doc.category !== filters.category) {
          return false;
        }

        // Apply Department filter
        if (filters.department !== 'all' && doc.department !== filters.department) {
          return false;
        }

        // Apply Academic Year filter
        if (filters.academicYear !== 'all' && doc.academicYear !== filters.academicYear) {
          return false;
        }

        // Apply Access Level filter
        if (filters.accessLevel !== 'all' && doc.accessLevel !== filters.accessLevel) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortOption === 'category') {
          return a.category.localeCompare(b.category);
        }
        if (sortOption === 'oldest') {
          return new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
        }
        // Default: newest
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
      });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        documents,
        users,
        departments,
        activities,
        notifications,
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
        selectedDocForPreview,
        setSelectedDocForPreview,
        activeModal,
        setActiveModal,
        modalTargetDoc,
        setModalTargetDoc,
        toast,
        showToast,
        loginWithRole,
        loginWithCredentials,
        logout,
        addDocument,
        updateDocument,
        deleteDocument,
        changeDocumentAccess,
        addUser,
        updateUser,
        toggleUserStatus,
        addDepartment,
        updateDepartment,
        markNotificationRead,
        markAllNotificationsRead,
        resetToSeedData,
        getFilteredAndSortedDocs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
