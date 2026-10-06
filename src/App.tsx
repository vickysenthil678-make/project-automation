import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SignInPage } from './components/auth/SignInPage';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { DocumentsLibrary } from './components/documents/DocumentsLibrary';
import { UploadModal } from './components/upload/UploadModal';
import { DocumentViewerDrawer } from './components/preview/DocumentViewerDrawer';
import { EditDocumentModal } from './components/documents/EditDocumentModal';
import { NotificationsView } from './components/notifications/NotificationsView';
import { UsersAndDepartments } from './components/admin/UsersAndDepartments';
import { ActivityLogView } from './components/admin/ActivityLogView';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { Toast } from './components/common/Toast';
import { CollegeDocument } from './types';

export const MainPortal: React.FC = () => {
  const {
    currentUser,
    loginWithRole,
    activeModal,
    setActiveModal,
    selectedDocForPreview,
    setSelectedDocForPreview,
    resetToSeedData,
  } = useApp();

  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [docToEditFromDrawer, setDocToEditFromDrawer] = useState<CollegeDocument | null>(null);

  // If no user is logged in and user hasn't explicitly clicked browse public, we can show SignInPage or default to Guest/Public view
  const [isBrowsingPublic, setIsBrowsingPublic] = useState(false);

  if (!currentUser && !isBrowsingPublic) {
    return (
      <SignInPage
        onSuccess={() => {
          setIsBrowsingPublic(false);
          setCurrentTab('overview');
        }}
        onBrowsePublic={() => {
          setIsBrowsingPublic(true);
          loginWithRole('guest');
          setCurrentTab('documents');
        }}
      />
    );
  }

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewDashboard onNavigateTab={tab => setCurrentTab(tab)} />;
      case 'documents':
        return <DocumentsLibrary />;
      case 'upload':
        return <DocumentsLibrary />; // Upload modal is opened on top
      case 'notifications':
        return <NotificationsView />;
      case 'admin-users':
        return <UsersAndDepartments />;
      case 'admin-activity':
        return <ActivityLogView />;
      default:
        return <OverviewDashboard onNavigateTab={tab => setCurrentTab(tab)} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--canvas-bg)' }}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenSignIn={() => setShowSignInModal(true)}
      />

      {/* Main Layout Body */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={tab => {
            if (tab === 'upload') {
              setActiveModal('upload');
            } else {
              setCurrentTab(tab);
            }
          }}
          onOpenSignIn={() => setShowSignInModal(true)}
        />

        {/* Dynamic Screen Container */}
        <main style={{ flex: 1, maxWidth: '1440px', margin: '0 auto', width: '100%', paddingBottom: '40px' }}>
          {renderActiveScreen()}
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={activeModal === 'upload'}
        onClose={() => setActiveModal(null)}
        onSuccessNavigate={() => setCurrentTab('documents')}
      />

      {/* Document Viewer Drawer */}
      <DocumentViewerDrawer
        doc={selectedDocForPreview}
        onClose={() => setSelectedDocForPreview(null)}
        onEditDoc={doc => setDocToEditFromDrawer(doc)}
      />

      {/* Edit Modal from Drawer */}
      <EditDocumentModal
        doc={docToEditFromDrawer}
        isOpen={!!docToEditFromDrawer}
        onClose={() => setDocToEditFromDrawer(null)}
      />

      {/* Reset Demo Data Confirmation Modal */}
      <ConfirmationModal
        isOpen={activeModal === 'resetConfirm'}
        title="Reset Demo Data"
        message="Are you sure you want to reset all document repositories, activities, and demo user edits back to the initial seed state? This action cannot be undone."
        confirmLabel="Reset Repository"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={() => {
          resetToSeedData();
          setActiveModal(null);
        }}
        onCancel={() => setActiveModal(null)}
      />

      {/* Sign-in Overlay Modal when guest clicks sign-in */}
      {showSignInModal && (
        <div className="modal-overlay" onClick={() => setShowSignInModal(false)}>
          <div style={{ width: '100%', maxWidth: '980px', animation: 'scaleUp 200ms ease' }} onClick={e => e.stopPropagation()}>
            <SignInPage
              onSuccess={() => setShowSignInModal(false)}
              onBrowsePublic={() => setShowSignInModal(false)}
            />
          </div>
        </div>
      )}

      {/* Persistent Toast Notifications */}
      <Toast />
    </div>
  );
};

export default function App() {
  return <MainPortal />;
}
