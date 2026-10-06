import React, { useState } from 'react';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEMO_CREDENTIALS } from '../../utils/auth';
import { UserRole } from '../../types';

interface SignInPageProps {
  onSuccess: () => void;
  onBrowsePublic: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onSuccess, onBrowsePublic }) => {
  const { loginWithCredentials, loginWithRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const ok = loginWithCredentials(email, password);
      setIsLoading(false);
      if (ok) {
        onSuccess();
      } else {
        setErrorMessage('Invalid credentials. Use the 1-click fictional demo roles below or enter listed credentials.');
      }
    }, 200);
  };

  const handleQuickRoleSelect = (role: UserRole) => {
    const cred = DEMO_CREDENTIALS.find(c => c.role === role);
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
      loginWithRole(role);
      onSuccess();
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin': return <Shield size={18} style={{ color: 'var(--brand-primary)' }} />;
      case 'staff': return <Briefcase size={18} style={{ color: 'var(--accent-terracotta)' }} />;
      case 'student': return <GraduationCap size={18} style={{ color: 'var(--accent-sage)' }} />;
      case 'guest': return <Eye size={18} style={{ color: 'var(--accent-slate)' }} />;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, #F5F1E8 0%, #EBE5D7 90%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1020px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {/* Left Column: Sign-in Form */}
        <div className="clay-card" style={{ padding: '36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Brand Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-primary)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--clay-shadow-primary-btn)',
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                  Campus Archive
                </h1>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Intelligent College Document Portal
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Sign In to Your Records Account
              </h2>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                Access centralized academic records, departmental registers, and institutional circulars.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--accent-terracotta-bg)',
                  border: '1px solid rgba(194, 84, 56, 0.3)',
                  color: 'var(--accent-terracotta)',
                  fontSize: '0.84rem',
                  marginBottom: '20px',
                }}
                role="alert"
              >
                <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Interactive Form */}
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Institutional Email
                </label>
                <div className="clay-inset" style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: '10px' }}>
                  <Mail size={16} style={{ color: 'var(--text-light)' }} />
                  <input
                    type="email"
                    required
                    placeholder="e.g., admin@campus.test"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Password
                </label>
                <div className="clay-inset" style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: '10px' }}>
                  <Lock size={16} style={{ color: 'var(--text-light)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.9rem',
                      color: 'var(--text-main)',
                      fontFamily: 'var(--font-sans)',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-light)', cursor: 'pointer' }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="clay-button clay-button-primary"
                style={{ padding: '12px', fontSize: '0.92rem', marginTop: '8px' }}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(215, 205, 185, 0.4)', textAlign: 'center' }}>
            <button
              type="button"
              onClick={onBrowsePublic}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--brand-primary)',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Browse public notices & circulars without signing in →
            </button>
          </div>
        </div>

        {/* Right Column: 1-Click Fictional Demo Role Cards */}
        <div className="clay-card" style={{ padding: '32px', background: 'var(--surface-raised)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} style={{ color: 'var(--accent-butter)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  1-Click Demo Roles
                </h3>
              </div>
              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                Fictional Credentials
              </span>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.4 }}>
              Click any demo profile to prefill the login and instantly inspect role-scoped permissions, views, and upload behaviors:
            </p>

            {/* Role List Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {DEMO_CREDENTIALS.map(cred => (
                <div
                  key={cred.role}
                  className="clay-card clay-card-interactive"
                  onClick={() => handleQuickRoleSelect(cred.role)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--surface-clay)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {getRoleIcon(cred.role)}
                      <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {cred.label}
                      </span>
                    </div>
                    <span className="badge badge-college" style={{ fontSize: '0.65rem' }}>
                      {cred.scopeBadge}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35, marginTop: '2px' }}>
                    {cred.description}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed rgba(200, 190, 170, 0.4)', fontSize: '0.72rem', color: 'var(--text-light)', fontFamily: 'var(--font-mono)' }}>
                    <span>{cred.email}</span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>1-Click Login →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '18px', padding: '10px', background: 'var(--surface-inset)', borderRadius: 'var(--radius-sm)', fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            <strong>Note:</strong> This is an interactive frontend prototype for evaluation. All accounts, records, register numbers, and Google Drive paths are simulated in client storage.
          </div>
        </div>
      </div>
    </div>
  );
};
