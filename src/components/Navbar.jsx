import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Search, Moon, Sun, Grid, Shield, User, ChevronDown, Check, LogOut, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ currentView, setCurrentView, onOpenAuthModal, isDark, setIsDark }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [appsMenuOpen, setAppsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
        setAppsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-subtle)',
      transition: 'all 0.2s ease'
    }}>
      {/* Google 4-color top hairline */}
      <div className="google-color-bar" />

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }} className="navbar-inner">
        {/* Brand Logo with Google Aesthetic */}
        <div 
          onClick={() => setCurrentView('catalog')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          {/* Minimal Google Dot Stack */}
          <div style={{ display: 'flex', gap: '3px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EA4335' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FBBC05' }} />
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34A853' }} />
          </div>

          <span style={{
            fontSize: '20px',
            fontWeight: '600',
            letterSpacing: '-0.5px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-sans)'
          }}>
            THREAD <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>Essentials</span>
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCurrentView('catalog')}
            className={`btn-ghost ${currentView === 'catalog' ? 'active' : ''}`}
            style={{
              color: currentView === 'catalog' ? 'var(--google-blue)' : 'var(--text-secondary)',
              fontWeight: currentView === 'catalog' ? '600' : '500'
            }}
          >
            Catalog
          </button>
          
          <button
            onClick={() => {
              setCurrentView('catalog');
              setTimeout(() => {
                const el = document.getElementById('brand-pillars');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="btn-ghost"
          >
            Ethos & Pillars
          </button>

          {/* Admin Panel strictly visible ONLY to authenticated Administrators */}
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="btn-ghost"
              style={{
                color: currentView === 'admin' ? 'var(--google-blue)' : 'var(--text-secondary)',
                fontWeight: currentView === 'admin' ? '600' : '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Shield size={16} color="var(--google-blue)" />
              Admin Panel
              <span style={{
                fontSize: '11px',
                padding: '2px 6px',
                borderRadius: '9999px',
                backgroundColor: 'var(--google-blue-surface)',
                color: 'var(--google-blue)',
                fontWeight: '600'
              }}>
                Auth
              </span>
            </button>
          )}
        </nav>

        {/* Right Tools: Theme Toggle, Cart, App Launcher, Account Menu */}
        <div ref={menuRef} className="navbar-tools" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
            className="btn-ghost"
            style={{ padding: '8px', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', justifyContent: 'center' }}
          >
            {isDark ? <Sun size={18} color="var(--google-yellow)" /> : <Moon size={18} />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Shopping Cart"
            className="btn-ghost"
            style={{
              position: 'relative',
              padding: '8px',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <ShoppingBag size={19} />
            {totalItemsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--google-blue)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}>
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Google 9-dot App Launcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setAppsMenuOpen(!appsMenuOpen);
                setAccountMenuOpen(false);
              }}
              aria-label="Quick Apps"
              className="btn-ghost"
              style={{ padding: '8px', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', justifyContent: 'center' }}
            >
              <Grid size={18} />
            </button>

            {appsMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: isAdmin ? '280px' : '200px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: isAdmin ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                gap: '12px',
                zIndex: 200
              }}>
                <button
                  onClick={() => { setCurrentView('catalog'); setAppsMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--google-blue-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--google-blue)' }}>
                    <ShoppingBag size={18} />
                  </div>
                  <span>Store</span>
                </button>

                <button
                  onClick={() => { setIsCartOpen(true); setAppsMenuOpen(false); }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--google-yellow-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--google-yellow)' }}>
                    <Search size={18} />
                  </div>
                  <span>Cart</span>
                </button>

                {/* Only visible if admin */}
                {isAdmin && (
                  <button
                    onClick={() => { setCurrentView('admin'); setAppsMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '12px 8px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--google-green-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--google-green)' }}>
                      <ShieldCheck size={18} />
                    </div>
                    <span>Admin</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Google Account Avatar */}
          <div style={{ position: 'relative' }}>
            {currentUser ? (
              <button
                onClick={() => {
                  setAccountMenuOpen(!accountMenuOpen);
                  setAppsMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'transparent',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-full)',
                  padding: '4px 10px 4px 4px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    backgroundColor: isAdmin ? 'var(--google-blue)' : 'var(--google-green)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {currentUser.avatar || 'U'}
                  </div>
                )}
                <span style={{ fontSize: '13px', fontWeight: '500', maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {currentUser.name?.split(' ')[0] || currentUser.email.split('@')[0]}
                </span>
                <ChevronDown size={14} color="var(--text-secondary)" />
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="btn-google-primary"
                style={{ padding: '7px 18px', fontSize: '13.5px' }}
              >
                Sign In
              </button>
            )}

            {/* Account Menu Dropdown */}
            {accountMenuOpen && currentUser && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: 0,
                width: '300px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-dropdown)',
                padding: '16px',
                zIndex: 200
              }}>
                {/* Active Account Info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '14px',
                  borderBottom: '1px solid var(--border-subtle)'
                }}>
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isAdmin ? 'var(--google-blue)' : 'var(--google-green)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '600'
                    }}>
                      {currentUser.avatar || 'U'}
                    </div>
                  )}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {currentUser.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {currentUser.email}
                    </div>
                    {isAdmin && (
                      <div style={{ marginTop: '4px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '600',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--google-blue-surface)',
                          color: 'var(--google-blue)'
                        }}>
                          THREAD Administrator
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Admin Quick Link inside menu if admin */}
                {isAdmin && (
                  <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setAccountMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: 'var(--radius-sm)',
                        border: 'none',
                        background: 'var(--bg-secondary)',
                        color: 'var(--google-blue)',
                        fontWeight: '600',
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      <Shield size={16} /> Open Admin Dashboard
                    </button>
                  </div>
                )}

                {/* Sign Out Action */}
                <div style={{
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => {
                      logout();
                      setAccountMenuOpen(false);
                      if (currentView === 'admin') {
                        setCurrentView('catalog');
                      }
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '12.5px', padding: '6px 12px', color: 'var(--google-red)' }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
