import React from 'react';
import { ShieldCheck, Heart, ArrowUp, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Footer({ onNavigateAdmin }) {
  const { isAdmin } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{
      backgroundColor: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '48px 24px 32px 24px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Brand Col */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', gap: '3px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4285F4' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#EA4335' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FBBC05' }} />
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#34A853' }} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              THREAD Essentials
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            A Google-minimalist apparel project. Architectural cuts, GOTS organic cottons, and zero-compromise sustainability.
          </p>
          <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--google-green)', backgroundColor: 'var(--google-green-surface)', padding: '4px 10px', borderRadius: 'var(--radius-full)' }}>
            <ShieldCheck size={14} /> 100% Carbon Neutral Certified
          </div>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Capsules
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>Heavyweight Organic Tees (280 GSM)</li>
            <li>Zero-Spill French Terry Hoodies (450 GSM)</li>
            <li>Single-Pleated Trousers</li>
            <li>Recycled Melton Wool Outerwear</li>
          </ul>
        </div>

        {/* Column 3: Sustainability */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Ethical Governance
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>GOTS Certified Organic Cotton</li>
            <li>Porto & Biella Heritage Mills</li>
            <li>Closed-Loop Botanic Dye Systems</li>
            <li>Circular Seam Repair Program</li>
          </ul>
        </div>

        {/* Column 4: Care & Client Support */}
        <div>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '14px' }}>
            Client Services
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
            <li>Carbon-Neutral Tracking</li>
            <li>Size & Silhouette Consultation</li>
            <li>Garment Care Instructions</li>
            <li>Complimentary Lifetime Repairs</li>
          </ul>

          {/* Admin link strictly visible only if currently authenticated as admin */}
          {isAdmin && (
            <div style={{ marginTop: '16px' }}>
              <button
                onClick={onNavigateAdmin}
                className="btn-google-secondary"
                style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Shield size={14} color="var(--google-blue)" /> Admin Portal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Hairline */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        <div>
          &copy; {new Date().getFullYear()} THREAD Essentials Inc. Google-inspired minimalist architecture.
        </div>

        <button
          onClick={scrollToTop}
          className="btn-ghost"
          style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Back to Top <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  );
}
