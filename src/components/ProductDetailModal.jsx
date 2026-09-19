import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, Truck, RotateCcw, AlertTriangle, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose, onReviewAdded }) {
  const { addToCart } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sizing' | 'reviews'
  const [addedNotice, setAddedNotice] = useState(false);

  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) return null;

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: reviewName.trim() || 'Verified Customer',
          rating: reviewRating,
          comment: reviewText.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (onReviewAdded) onReviewAdded(data.product);
        setReviewText('');
        setReviewName('');
        alert('Thank you! Your review has been published.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="product-detail-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '14px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>
              {product.category}
            </span>
            <span style={{ color: 'var(--text-muted)' }}>/</span>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              SKU: {product.sku}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div style={{
          overflowY: 'auto',
          padding: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '32px'
        }}>
          {/* Left Column: Visual Gallery */}
          <div>
            {/* Main Stage Image */}
            <div style={{
              width: '100%',
              paddingTop: '115%',
              position: 'relative',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              backgroundColor: 'var(--bg-tertiary)',
              marginBottom: '12px'
            }}>
              <img
                src={product.images ? product.images[activeImageIndex] : ''}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Badges on image */}
              {isLowStock && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'var(--google-yellow-surface)',
                  color: '#B06000',
                  border: '1px solid var(--google-yellow-border)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <AlertTriangle size={13} /> Only {product.stock} left in stock
                </div>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: 'var(--radius-md)',
                      overflow: 'hidden',
                      border: activeImageIndex === idx ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                      padding: 0,
                      cursor: 'pointer',
                      opacity: activeImageIndex === idx ? 1 : 0.7
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Specifications & Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < Math.floor(product.rating) ? '#FBBC05' : 'none'}
                      color="#FBBC05"
                    />
                  ))}
                </div>
                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {product.rating}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  ({product.reviewsCount} verified reviews)
                </span>
              </div>

              <h1 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                letterSpacing: '-0.5px',
                marginBottom: '8px'
              }}>
                {product.name}
              </h1>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-primary)' }}>
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span style={{ fontSize: '16px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: 'var(--google-green)', fontWeight: '600', backgroundColor: 'var(--google-green-surface)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                  Carbon Neutral
                </span>
              </div>
            </div>

            {/* Tab Navigation: Overview | Sizing Guide | Reviews */}
            <div style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-color)',
              gap: '16px'
            }}>
              {['overview', 'sizing', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 4px',
                    border: 'none',
                    background: 'transparent',
                    borderBottom: activeTab === tab ? '2px solid var(--google-blue)' : '2px solid transparent',
                    color: activeTab === tab ? 'var(--google-blue)' : 'var(--text-secondary)',
                    fontWeight: activeTab === tab ? '600' : '500',
                    fontSize: '14px',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {tab === 'sizing' ? 'Sizing Guide' : (tab === 'reviews' ? `Reviews (${product.reviewsCount})` : 'Product Overview')}
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {product.description}
                </p>

                {/* Fabric Breakdown */}
                <div style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Fabric & Craftsmanship
                  </div>
                  <div style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: '500' }}>
                    {product.fabric}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Origin: {product.origin}
                  </div>
                </div>

                {/* Color Selector */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Color: <span style={{ fontWeight: '400', color: 'var(--text-secondary)' }}>{selectedColor?.name}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    {product.colors && product.colors.map((c) => {
                      const isSel = selectedColor?.name === c.name;
                      return (
                        <button
                          key={c.name}
                          onClick={() => setSelectedColor(c)}
                          title={c.name}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            backgroundColor: c.hex,
                            border: isSel ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                            cursor: 'pointer',
                            boxShadow: isSel ? '0 0 0 2px var(--bg-primary)' : 'none'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--text-primary)' }}>
                    Select Size:
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.sizes && product.sizes.map((s) => {
                      const isSel = selectedSize === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          style={{
                            width: '42px',
                            height: '38px',
                            borderRadius: 'var(--radius-md)',
                            border: isSel ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                            backgroundColor: isSel ? 'var(--google-blue-surface)' : 'var(--bg-primary)',
                            color: isSel ? 'var(--google-blue)' : 'var(--text-primary)',
                            fontWeight: isSel ? '600' : '500',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quantity & CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                  {/* Quantity Counter */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    padding: '2px'
                  }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}
                    >
                      -
                    </button>
                    <span style={{ width: '32px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '16px' }}
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="btn-google-primary"
                    style={{
                      flex: 1,
                      padding: '12px 24px',
                      fontSize: '14px',
                      backgroundColor: addedNotice ? 'var(--google-green)' : (isOutOfStock ? 'var(--border-color)' : 'var(--google-blue)'),
                      cursor: isOutOfStock ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {addedNotice ? (
                      <>
                        <Check size={18} /> Added to Cart!
                      </>
                    ) : isOutOfStock ? (
                      'Out of Stock'
                    ) : (
                      `Add ${quantity} to Cart • $${(product.price * quantity).toFixed(2)}`
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: SIZING GUIDE */}
            {activeTab === 'sizing' && (
              <div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  All measurements are taken flat. THREAD garments feature a relaxed modern silhouette. Order true to size for intended drape.
                </p>

                <div style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <tr>
                        <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Size</th>
                        <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Chest / Waist</th>
                        <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Length / Inseam</th>
                        <th style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', fontWeight: '600' }}>Shoulder / Opening</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizingGuide && Object.entries(product.sizingGuide).map(([sizeKey, measurements], idx) => (
                        <tr key={sizeKey} style={{ borderBottom: idx < Object.keys(product.sizingGuide).length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <td style={{ padding: '10px 14px', fontWeight: '600', color: 'var(--google-blue)' }}>{sizeKey}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{measurements.chest}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{measurements.length}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{measurements.shoulder}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: REVIEWS */}
            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Review Submission Form */}
                <form onSubmit={handleReviewSubmit} style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Leave a Customer Review</div>
                  
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      style={{
                        padding: '8px 12px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Share details regarding fabric weight, drape, fit..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '13px',
                      resize: 'none'
                    }}
                  />

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="btn-google-primary"
                    style={{ alignSelf: 'flex-start', padding: '6px 16px', fontSize: '12.5px' }}
                  >
                    <Send size={13} /> Submit Review
                  </button>
                </form>

                {/* Reviews List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {product.reviews && product.reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        padding: '12px 14px',
                        borderBottom: '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {rev.user}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {rev.date}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} size={12} fill="#FBBC05" color="#FBBC05" />
                        ))}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
