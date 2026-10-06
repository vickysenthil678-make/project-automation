import React, { useState } from 'react';
import {
  Users,
  Building,
  Plus,
  Edit2,
  Check,
  X,
  Shield,
  Briefcase,
  GraduationCap,
  Eye,
  Search,
  Power,
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserAccount, DepartmentInfo, UserRole } from '../../types';

export const UsersAndDepartments: React.FC = () => {
  const {
    currentUser,
    users,
    departments,
    addUser,
    updateUser,
    toggleUserStatus,
    addDepartment,
    updateDepartment,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'departments'>('users');
  const [searchFilter, setSearchFilter] = useState('');

  // Modals
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState<DepartmentInfo | null>(null);

  // User form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('staff');
  const [userDept, setUserDept] = useState('B.Sc Computer Science');
  const [userDesignation, setUserDesignation] = useState('');

  // Dept form states
  const [deptCode, setDeptCode] = useState('');
  const [deptName, setDeptName] = useState('');
  const [deptHOD, setDeptHOD] = useState('');
  const [facultyCount, setFacultyCount] = useState(10);
  const [studentCount, setStudentCount] = useState(250);

  // Authorization guard
  if (currentUser?.role !== 'admin') {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div className="clay-card" style={{ maxWidth: '480px', margin: '0 auto', padding: '32px' }}>
          <Lock size={36} style={{ color: 'var(--accent-terracotta)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            Access Restricted
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            User and departmental administrative controls require the <strong>Admin</strong> role. Please switch profiles via the top right role switcher.
          </p>
        </div>
      </div>
    );
  }

  const openAddUser = () => {
    setEditingUser(null);
    setUserName('');
    setUserEmail('');
    setUserRole('staff');
    setUserDept('B.Sc Computer Science');
    setUserDesignation('');
    setShowUserModal(true);
  };

  const openEditUser = (u: UserAccount) => {
    setEditingUser(u);
    setUserName(u.name);
    setUserEmail(u.email);
    setUserRole(u.role);
    setUserDept(u.department || 'B.Sc Computer Science');
    setUserDesignation(u.designation || '');
    setShowUserModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, {
        name: userName,
        email: userEmail,
        role: userRole,
        department: userDept,
        designation: userDesignation,
      });
    } else {
      addUser({
        name: userName,
        email: userEmail,
        role: userRole,
        department: userDept,
        designation: userDesignation,
        status: 'active',
      });
    }
    setShowUserModal(false);
  };

  const openAddDept = () => {
    setEditingDept(null);
    setDeptCode('');
    setDeptName('');
    setDeptHOD('');
    setFacultyCount(10);
    setStudentCount(200);
    setShowDeptModal(true);
  };

  const openEditDept = (d: DepartmentInfo) => {
    setEditingDept(d);
    setDeptCode(d.code);
    setDeptName(d.name);
    setDeptHOD(d.headOfDepartment);
    setFacultyCount(d.facultyCount);
    setStudentCount(d.studentCount);
    setShowDeptModal(true);
  };

  const handleSaveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDept) {
      updateDepartment(editingDept.id, {
        code: deptCode,
        name: deptName,
        headOfDepartment: deptHOD,
        facultyCount,
        studentCount,
      });
    } else {
      addDepartment({
        code: deptCode,
        name: deptName,
        headOfDepartment: deptHOD,
        facultyCount,
        studentCount,
        status: 'active',
      });
    }
    setShowDeptModal(false);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.email.toLowerCase().includes(searchFilter.toLowerCase()) ||
    u.role.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredDepts = departments.filter(d =>
    d.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
    d.headOfDepartment.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Users size={20} style={{ color: 'var(--brand-primary)' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Users & Departments Governance
            </h2>
          </div>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            Central administration directory: manage faculty assignments, student portals, and department scopes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {activeTab === 'users' ? (
            <button type="button" className="clay-button clay-button-primary" onClick={openAddUser}>
              <Plus size={16} /> Add User Account
            </button>
          ) : (
            <button type="button" className="clay-button clay-button-primary" onClick={openAddDept}>
              <Plus size={16} /> Add Department
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="clay-button"
            style={{
              background: activeTab === 'users' ? 'var(--brand-primary)' : 'var(--surface-raised)',
              color: activeTab === 'users' ? '#FFF' : 'var(--text-main)',
              fontWeight: 700,
            }}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} /> User Accounts ({users.length})
          </button>
          <button
            type="button"
            className="clay-button"
            style={{
              background: activeTab === 'departments' ? 'var(--brand-primary)' : 'var(--surface-raised)',
              color: activeTab === 'departments' ? '#FFF' : 'var(--text-main)',
              fontWeight: 700,
            }}
            onClick={() => setActiveTab('departments')}
          >
            <Building size={16} /> Departments ({departments.length})
          </button>
        </div>

        <div className="clay-inset" style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px', minWidth: '240px' }}>
          <Search size={15} style={{ color: 'var(--text-light)' }} />
          <input
            type="text"
            placeholder="Search accounts or departments..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
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

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="clay-card" style={{ padding: '12px', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid rgba(205, 195, 175, 0.4)', color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>User & Email</th>
                <th style={{ padding: '10px 12px' }}>Role</th>
                <th style={{ padding: '10px 12px' }}>Department / Scope</th>
                <th style={{ padding: '10px 12px' }}>Status</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: idx !== filteredUsers.length - 1 ? '1px solid rgba(215, 205, 185, 0.3)' : 'none',
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{u.name}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>{u.email}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.role === 'admin' ? 'badge-college' : u.role === 'staff' ? 'badge-private' : u.role === 'student' ? 'badge-student' : 'badge-public'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                    <div>{u.department || 'All Campus Scopes'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>{u.designation}</div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${u.status === 'active' ? 'badge-student' : 'badge-warning'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="clay-button clay-button-sm"
                        onClick={() => openEditUser(u)}
                        title="Edit User"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        className="clay-button clay-button-sm"
                        onClick={() => toggleUserStatus(u.id)}
                        title={u.status === 'active' ? 'Deactivate' : 'Activate'}
                      >
                        <Power size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Departments Tab Content */}
      {activeTab === 'departments' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}
        >
          {filteredDepts.map(d => (
            <div
              key={d.id}
              className="clay-card"
              style={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--brand-primary)' }}>
                    {d.code}
                  </span>
                  <span className="badge badge-student" style={{ fontSize: '0.65rem' }}>
                    {d.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
                  {d.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  HOD: <strong>{d.headOfDepartment}</strong>
                </p>
              </div>

              <div style={{ borderTop: '1px solid rgba(215, 205, 185, 0.4)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                  <span>{d.facultyCount} Faculty</span>
                  <span>•</span>
                  <span>{d.studentCount} Students</span>
                </div>

                <button
                  type="button"
                  className="clay-button clay-button-sm"
                  onClick={() => openEditDept(d)}
                >
                  <Edit2 size={13} /> Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Add/Edit Modal */}
      {showUserModal && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingUser ? 'Edit User Account' : 'Create Demo User Account'}
            </h3>
            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Full Name</label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input type="text" required value={userName} onChange={e => setUserName(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Email Address</label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input type="email" required value={userEmail} onChange={e => setUserEmail(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Role</label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select value={userRole} onChange={e => setUserRole(e.target.value as UserRole)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.84rem' }}>
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="student">Student</option>
                      <option value="guest">Guest</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Department</label>
                  <div className="clay-inset" style={{ padding: '8px 10px' }}>
                    <select value={userDept} onChange={e => setUserDept(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.84rem' }}>
                      {departments.map(d => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Designation / Reg No.</label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input type="text" placeholder="e.g., Assistant Professor / Reg: 24BCS1082" value={userDesignation} onChange={e => setUserDesignation(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.84rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="clay-button" onClick={() => setShowUserModal(false)}>Cancel</button>
                <button type="submit" className="clay-button clay-button-primary">Save User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dept Add/Edit Modal */}
      {showDeptModal && (
        <div className="modal-overlay" onClick={() => setShowDeptModal(false)}>
          <div className="modal-content" style={{ padding: '24px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
              {editingDept ? 'Edit Department' : 'Add Department Directory'}
            </h3>
            <form onSubmit={handleSaveDept} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Code</label>
                  <div className="clay-inset" style={{ padding: '8px 12px' }}>
                    <input type="text" required placeholder="e.g. BSC-CS" value={deptCode} onChange={e => setDeptCode(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Department Name</label>
                  <div className="clay-inset" style={{ padding: '8px 12px' }}>
                    <input type="text" required placeholder="e.g. B.Sc Computer Science" value={deptName} onChange={e => setDeptName(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Head of Department (HOD)</label>
                <div className="clay-inset" style={{ padding: '8px 12px' }}>
                  <input type="text" required placeholder="e.g. Dr. Alistair Finch" value={deptHOD} onChange={e => setDeptHOD(e.target.value)} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Faculty Count</label>
                  <div className="clay-inset" style={{ padding: '8px 12px' }}>
                    <input type="number" value={facultyCount} onChange={e => setFacultyCount(Number(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '4px' }}>Student Count</label>
                  <div className="clay-inset" style={{ padding: '8px 12px' }}>
                    <input type="number" value={studentCount} onChange={e => setStudentCount(Number(e.target.value))} style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="clay-button" onClick={() => setShowDeptModal(false)}>Cancel</button>
                <button type="submit" className="clay-button clay-button-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
