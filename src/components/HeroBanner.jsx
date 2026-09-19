import React from 'react';
import { ArrowUpRight, Sparkles, ShieldCheck, Leaf, Globe, Award } from 'lucide-react';

export default function HeroBanner({ onExplore }) {
  return (
    <section className="hero-banner" style={{
      maxWidth: '1280px',
      margin: '0 auto 48px auto',
      padding: '0 24px'
    }}>
      {/* Editorial Main Showcase with Glassmorphism Overlays */}
      <div className="hero-banner-stage" style={{
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'flex-end',
        backgroundImage: 'linear-gradient(180deg, rgba(18, 19, 21, 0.15) 0%, rgba(18, 19, 21, 0.85) 100%), url("https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=85")',
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
        boxShadow: 'var(--shadow-dropdown)'
      }}>
        {/* Top Status Capsule */}
        <div className="hero-banner-status" style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#202124',
          padding: '7px 16px',
          borderRadius: 'var(--radius-full)',
          fontSize: '12.5px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15)'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1E8E3E' }} />
          SS26 Organic Architecture Now Released
        </div>

        {/* Floating Spotlight Card (top right on desktop) */}
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          backgroundColor: 'rgba(32, 33, 36, 0.75)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 18px',
          color: '#FFFFFF',
          maxWidth: '260px',
          display: 'none',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}
        className="desktop-spotlight"
        >
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8AB4F8', fontWeight: '700', marginBottom: '4px' }}>
            Featured Fabric
          </div>
          <div style={{ fontSize: '13px', fontWeight: '600' }}>
            450 GSM Loopback Terry
          </div>
          <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.7)', marginTop: '2px' }}>
            Zero-spill brushed interior knitted in Osaka, Japan.
          </div>
        </div>

        {/* Banner Content Card */}
        <div className="hero-banner-content" style={{
          padding: '40px',
          maxWidth: '720px',
          color: '#FFFFFF',
          zIndex: 2
        }}>
          <div style={{
            fontSize: '13px',
            textTransform: 'uppercase',
            letterSpacing: '1.2px',
            fontWeight: '700',
            color: '#8AB4F8',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Award size={15} color="#8AB4F8" />
            Curated Minimalist Capsule
          </div>

          <h2 style={{
            fontSize: 'clamp(28px, 4.5vw, 46px)',
            fontWeight: '700',
            lineHeight: 1.12,
            color: '#FFFFFF',
            marginBottom: '14px',
            letterSpacing: '-0.5px'
          }}>
            Engineered weight. Precision drape. Zero compromise.
          </h2>

          <p style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.88)',
            marginBottom: '24px',
            lineHeight: 1.6,
            maxWidth: '600px'
          }}>
            Every THREAD piece adheres to Google-grade simplicity: heavyweight organic cottons, mathematical proportions, zero external logos, and closed-loop ethical sustainability.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            <button
              onClick={onExplore}
              className="btn-google-primary"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#202124',
                fontWeight: '600',
                padding: '12px 24px',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.35)'
              }}
            >
              Explore Collection
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Modern Ticker Highlight Strip */}
      <div style={{
        marginTop: '16px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          <Leaf size={16} color="#1E8E3E" />
          <span>100% GOTS Organic Cotton</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          <Globe size={16} color="#1A73E8" />
          <span>Carbon-Neutral Global Shipping</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          <ShieldCheck size={16} color="#F9AB00" />
          <span>Porto & Biella Fair-Wage Mills</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>
          <Sparkles size={16} color="#EA4335" />
          <span>280–520 GSM Fabric Density</span>
        </div>
      </div>
    </section>
  );
}
