import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateQuantity,
    removeItem,
    clearCart,
    promoCode,
    setPromoCode,
    appliedDiscount,
    applyPromoCode,
    removePromoCode,
    promoError,
    subtotal,
    discountAmount,
    shippingFee,
    total,
    freeShippingThreshold
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCode = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    applyPromoCode(inputCode);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCartOpen(false)} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        className="cart-drawer"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--bg-primary)',
          boxShadow: 'var(--shadow-drawer)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          borderLeft: '1px solid var(--border-color)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--google-blue)" />
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--text-primary)' }}>
              Your Bag ({items.reduce((a, b) => a + b.quantity, 0)})
            </h2>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close bag"
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div style={{
          padding: '12px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', marginBottom: '6px', color: 'var(--text-primary)' }}>
            <Truck size={15} color={progressPercent >= 100 ? 'var(--google-green)' : 'var(--google-blue)'} />
            {progressPercent >= 100 ? (
              <span style={{ fontWeight: '600', color: 'var(--google-green)' }}>
                You've unlocked Free Carbon-Neutral Shipping!
              </span>
            ) : (
              <span>
                Add <strong style={{ color: 'var(--google-blue)' }}>${amountToFreeShipping.toFixed(2)}</strong> more for Free Shipping
              </span>
            )}
          </div>

          <div style={{
            width: '100%',
            height: '5px',
            backgroundColor: 'var(--border-color)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent >= 100 ? 'var(--google-green)' : 'var(--google-blue)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid var(--border-subtle)'
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '74px',
                      height: '88px',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-tertiary)'
                    }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          aria-label="Remove item"
                          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', padding: '2px' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <span>Size: <strong>{item.size}</strong></span>
                        <span>•</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.color.hex, border: '1px solid var(--border-color)' }} />
                          <span>{item.color.name}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      {/* Quantity stepper */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-full)',
                        padding: '1px'
                      }}>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ width: '24px', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>

                      <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--text-muted)'
              }}>
                <ShoppingBag size={28} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '6px' }}>Your bag is empty</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Explore our pure minimalist essentials and organic capsules.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="btn-google-primary"
                style={{ fontSize: '13px' }}
              >
                Start Exploring
              </button>
            </div>
          )}
        </div>

        {/* Promo Code & Summary Footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {/* Promo code form */}
            {appliedDiscount > 0 ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                backgroundColor: 'var(--google-green-surface)',
                border: '1px solid var(--google-green-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '12.5px',
                color: 'var(--google-green)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Check size={14} />
                  <span>Promo applied: <strong>{appliedDiscount * 100}% OFF</strong></span>
                </div>
                <button
                  onClick={removePromoCode}
                  style={{ border: 'none', background: 'transparent', color: 'var(--google-red)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCode} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder='Promo code (try "THREAD10")'
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="btn-google-secondary"
                  style={{ padding: '8px 16px', fontSize: '13px' }}
                >
                  Apply
                </button>
              </form>
            )}

            {promoError && (
              <span style={{ fontSize: '11.5px', color: 'var(--google-red)' }}>
                {promoError}
              </span>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--google-green)' }}>
                  <span>Discount ({appliedDiscount * 100}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Carbon-Neutral Shipping</span>
                <span>{shippingFee === 0 ? <span style={{ color: 'var(--google-green)', fontWeight: '600' }}>FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '17px',
                fontWeight: '700',
                color: 'var(--text-primary)',
                paddingTop: '8px',
                borderTop: '1px solid var(--border-color)',
                marginTop: '4px'
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="btn-google-primary"
              style={{
                width: '100%',
                padding: '13px',
                fontSize: '15px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Simulate Checkout <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
