import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Mic, Camera, Sparkles, ArrowRight, TrendingUp, CheckCircle, Sliders, ShieldCheck } from 'lucide-react';

export const CATEGORIES = [
  "All Products",
  "Heavyweight Tees",
  "Hoodies & Sweats",
  "Minimal Pants",
  "Outerwear"
];

const TRENDING_QUERIES = [
  "French Terry Hoodie",
  "280 GSM Boxy Tee",
  "Pleated Trouser",
  "Minimalist Parka"
];

export default function HeroSearch({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  products,
  onSelectProduct
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lensActive, setLensActive] = useState(false);
  const containerRef = useRef(null);

  // Filter suggestion list
  const suggestions = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFeelingMinimal = () => {
    if (products.length > 0) {
      const randomIdx = Math.floor(Math.random() * products.length);
      onSelectProduct(products[randomIdx]);
    }
  };

  const toggleVoiceSearch = () => {
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery("Heavyweight Boxy Organic Tee");
      setIsListening(false);
    }, 1500);
  };

  return (
    <section className="hero-search" style={{
      position: 'relative',
      padding: '56px 24px 44px 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      {/* Subtle Google ambient color halos */}
      <div style={{
        position: 'absolute',
        top: '-120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '720px',
        height: '420px',
        background: 'radial-gradient(ellipse at center, rgba(66, 133, 244, 0.10) 0%, rgba(234, 67, 53, 0.05) 35%, rgba(251, 188, 5, 0.05) 55%, rgba(52, 168, 83, 0.06) 75%, transparent 100%)',
        filter: 'blur(45px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Floating Pill Tag */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'var(--google-blue-surface)',
        border: '1px solid var(--google-blue-border)',
        padding: '6px 16px',
        borderRadius: 'var(--radius-full)',
        fontSize: '12.5px',
        fontWeight: '600',
        color: 'var(--google-blue)',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(26, 115, 232, 0.12)'
      }}>
        {/* Animated Google Dot */}
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          backgroundColor: '#34A853',
          boxShadow: '0 0 0 3px rgba(52, 168, 83, 0.25)'
        }} />
        <span>SS26 Capsule • Google Minimalist Apparel Standard</span>
      </div>

      {/* Hero Headline */}
      <div style={{ position: 'relative', zIndex: 1, marginBottom: '32px' }}>
        <h1 style={{
          fontSize: 'clamp(38px, 6.5vw, 68px)',
          fontWeight: '700',
          letterSpacing: '-1.8px',
          color: 'var(--text-primary)',
          lineHeight: 1.08,
          marginBottom: '14px'
        }}>
          Pure Form. Zero Noise.
          <br />
          <span style={{
            background: 'linear-gradient(135deg, #1A73E8 0%, #4285F4 50%, #1E8E3E 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            THREAD Essentials
          </span>
        </h1>

        <p style={{
          fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'var(--text-secondary)',
          maxWidth: '640px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Architectural minimalism crafted from 280–520 GSM organic textiles. Spun in Porto, shaped with mathematical precision, and engineered for lifetime wear.
        </p>
      </div>

      {/* Center Floating Google Search Bar */}
      <div 
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          marginBottom: '22px',
          zIndex: 10
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-primary)',
          border: isFocused ? '1px solid var(--google-blue)' : '1px solid var(--border-color)',
          borderRadius: showSuggestions && suggestions.length > 0 ? '24px 24px 0 0' : 'var(--radius-full)',
          padding: '12px 22px',
          boxShadow: isFocused 
            ? '0 4px 18px rgba(26, 115, 232, 0.22), 0 2px 6px rgba(0,0,0,0.08)' 
            : '0 2px 10px 1px rgba(60,64,67,0.14)',
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          {/* Magnifying Glass */}
          <Search 
            size={22} 
            color="var(--google-blue)" 
            style={{ flexShrink: 0, marginRight: '14px' }} 
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={isListening ? "Listening with Google Voice..." : "Search organic tees, French terry hoodies, trousers..."}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              color: isListening ? 'var(--google-blue)' : 'var(--text-primary)',
              backgroundColor: 'transparent'
            }}
          />

          {/* Clear button if text entered */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={17} />
            </button>
          )}

          {/* Google Tools: Voice Mic & Image Lens */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px', paddingLeft: '12px', borderLeft: '1px solid var(--border-subtle)' }}>
            <button
              onClick={toggleVoiceSearch}
              title="Google Voice Search"
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: isListening ? '#1A73E8' : '#EA4335',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                transform: isListening ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.2s ease'
              }}
            >
              <Mic size={20} />
            </button>

            <button
              onClick={() => {
                setLensActive(!lensActive);
                if (!lensActive) {
                  setSearchQuery("Heavy French Terry");
                }
              }}
              title="Google Lens Visual Search"
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: lensActive ? '#1A73E8' : '#FBBC05',
                padding: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Camera size={20} />
            </button>
          </div>
        </div>

        {/* Instant Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderTop: 'none',
            borderRadius: '0 0 24px 24px',
            boxShadow: 'var(--shadow-dropdown)',
            padding: '8px 0',
            zIndex: 100,
            textAlign: 'left'
          }}>
            {suggestions.map((item) => (
              <div
                key={item.id}
                onMouseDown={() => {
                  onSelectProduct(item);
                  setShowSuggestions(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 22px',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--text-primary)' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    {item.category} • <strong style={{ color: 'var(--text-primary)' }}>${Number(item.price || 0).toFixed(2)}</strong>
                    {item.stock < 10 && (
                      <span style={{ marginLeft: '8px', color: '#B06000', fontWeight: '600', fontSize: '11px' }}>
                        • Only {item.stock} left
                      </span>
                    )}
                  </div>
                </div>
                <ArrowRight size={16} color="var(--google-blue)" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Micro-tags */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        marginBottom: '28px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', color: 'var(--text-primary)' }}>
          <TrendingUp size={14} color="var(--google-blue)" />
          Trending:
        </div>
        {TRENDING_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => setSearchQuery(q)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--google-blue)',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              padding: '2px 4px'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Google-Style Action Buttons */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '14px', marginBottom: '36px' }}>
        <button
          onClick={() => {
            const el = document.getElementById('product-catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="btn-google-primary"
          style={{ padding: '11px 26px', fontSize: '14.5px' }}
        >
          Explore Catalog <ArrowRight size={16} />
        </button>

        <button
          onClick={handleFeelingMinimal}
          className="btn-google-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 24px', fontSize: '14.5px' }}
        >
          <Sparkles size={16} color="var(--google-yellow)" />
          I'm Feeling Minimal
        </button>
      </div>

      {/* Minimal Category Filter Chips with Icon and Active Indicators */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        maxWidth: '850px'
      }}>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          const count = cat === "All Products" 
            ? products.length 
            : products.filter(p => p.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`chip ${isActive ? 'active' : ''}`}
              style={{
                padding: '8px 20px',
                fontSize: '14px'
              }}
            >
              <span>{cat}</span>
              <span style={{
                fontSize: '11.5px',
                padding: '1px 7px',
                borderRadius: '9999px',
                backgroundColor: isActive ? 'var(--google-blue)' : 'var(--bg-tertiary)',
                color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                fontWeight: '600'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
