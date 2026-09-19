import React, { useState } from 'react';
import { X, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { signInWithGoogle, loginWithEmail, signupWithEmail } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await signupWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          padding: '32px 28px',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn-ghost"
          style={{ position: 'absolute', top: '16px', right: '16px', padding: '6px', borderRadius: '50%' }}
        >
          <X size={18} />
        </button>

        {/* Google Style Header */}
        <div style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '12px' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#4285F4' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#EA4335' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#FBBC05' }} />
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', backgroundColor: '#34A853' }} />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            THREAD Essentials Account
          </p>
        </div>

        {/* Google One-Click Auth Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '11px',
            backgroundColor: '#FFFFFF',
            color: '#3C4043',
            border: '1px solid #DADCE0',
            borderRadius: 'var(--radius-full)',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(60,64,67,0.3)',
            transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
            marginBottom: '18px'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8F9FA'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
        >
          {/* Official Google G Logo */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or with email</span>
          <span style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        {/* Mode switcher: Login vs Signup */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-full)',
          padding: '3px',
          marginBottom: '18px'
        }}>
          <button
            type="button"
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'login' ? 'var(--bg-primary)' : 'transparent',
              color: mode === 'login' ? 'var(--google-blue)' : 'var(--text-secondary)',
              fontWeight: mode === 'login' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'login' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            style={{
              flex: 1,
              padding: '7px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: mode === 'signup' ? 'var(--bg-primary)' : 'transparent',
              color: mode === 'signup' ? 'var(--google-blue)' : 'var(--text-secondary)',
              fontWeight: mode === 'signup' ? '600' : '500',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'var(--google-red-surface)',
            border: '1px solid var(--google-red-border)',
            color: 'var(--google-red)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {mode === 'signup' && (
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Julian Thorne"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-google-primary"
            style={{ width: '100%', padding: '12px', fontSize: '14px', marginTop: '6px' }}
          >
            {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>
      </div>
    </div>
  );
}
