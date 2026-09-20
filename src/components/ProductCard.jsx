import React, { useState } from 'react';
import { Star, Plus, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onOpenDetail }) {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="card-google"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Thumbnail Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingTop: '115%',
        backgroundColor: 'var(--bg-tertiary)',
        overflow: 'hidden'
      }}>
        <img
          src={product.images ? product.images[0] : ''}
          alt={product.name}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          loading="lazy"
        />

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          zIndex: 2
        }}>
          {isLowStock && (
            <span style={{
              backgroundColor: 'var(--google-yellow-surface)',
              color: '#B06000',
              border: '1px solid var(--google-yellow-border)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '600',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              Only {product.stock} left
            </span>
          )}

          {isOutOfStock && (
            <span style={{
              backgroundColor: 'var(--google-red-surface)',
              color: 'var(--google-red)',
              border: '1px solid var(--google-red-border)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              Sold Out
            </span>
          )}

          {product.isNew && !isOutOfStock && (
            <span style={{
              backgroundColor: 'var(--google-blue-surface)',
              color: 'var(--google-blue)',
              border: '1px solid var(--google-blue-border)',
              padding: '3px 8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: '600'
            }}>
              New
            </span>
          )}
        </div>

        {/* Quick View Button overlay on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.2s ease',
          pointerEvents: 'none'
        }}>
          <span style={{
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--shadow-dropdown)'
          }}>
            <Eye size={15} /> Quick View
          </span>
        </div>
      </div>

      {/* Card Details Body */}
      <div style={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div>
          {/* Category & Star rating */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: '4px'
          }}>
            <span>{product.category}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Star size={13} fill="#FBBC05" color="#FBBC05" />
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            lineHeight: 1.3,
            marginBottom: '8px'
          }}>
            {product.name}
          </h3>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{
              fontSize: '17px',
              fontWeight: '700',
              color: 'var(--text-primary)'
            }}>
              ${Number(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && (
              <span style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                textDecoration: 'line-through'
              }}>
                ${Number(product.originalPrice || 0).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Color swatches & Quick Add */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '10px',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          {/* Color Swatch Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {product.colors && product.colors.map((col) => {
              const isColSelected = selectedColor?.name === col.name;
              return (
                <button
                  key={col.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColor(col);
                  }}
                  title={col.name}
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: col.hex,
                    border: isColSelected ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: isColSelected ? '0 0 0 2px var(--bg-primary)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Quick Add CTA */}
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className="btn-google-primary"
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              backgroundColor: addedAnimation ? 'var(--google-green)' : (isOutOfStock ? 'var(--border-color)' : 'var(--google-blue)'),
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
            }}
          >
            {addedAnimation ? (
              <>
                <Check size={14} /> Added
              </>
            ) : isOutOfStock ? (
              'Sold Out'
            ) : (
              <>
                <Plus size={14} /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
