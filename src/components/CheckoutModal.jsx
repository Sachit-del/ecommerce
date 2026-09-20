import React, { useEffect, useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, ArrowRight, Printer, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CheckoutModal({ onOrderComplete }) {
  const { isCheckoutOpen, setIsCheckoutOpen, items, total, promoCode, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Jane Doe',
    email: currentUser?.email || 'shopper@gmail.com',
    address: '1600 Amphitheatre Pkwy',
    city: 'Mountain View',
    state: 'CA',
    zip: '94043',
    paymentMethod: 'Google Pay'
  });
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser?.email) {
      setFormData(prev => ({ ...prev, email: currentUser.email }));
    }
  }, [currentUser]);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: formData.fullName,
          email: formData.email,
          items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, size: i.size })),
          promoCode,
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
          paymentMethod: formData.paymentMethod
        })
      });

      let orderData;
      if (response.ok) {
        const data = await response.json();
        orderData = data.order;
      } else throw new Error('Order could not be placed');

      setConfirmedOrder(orderData);
      clearCart();
      setStep(3);
      if (onOrderComplete) onOrderComplete(orderData);
    } catch (err) {
      console.error(err);
      console.error('Order placement failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
      <div
        className="checkout-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          overflow: 'hidden',
          border: '1px solid var(--border-color)',
          animation: 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4285F4' }} />
            <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
              {step === 3 ? 'Order Receipt' : 'THREAD Simulated Checkout'}
            </span>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            aria-label="Close"
            className="btn-ghost"
            style={{ padding: '6px', borderRadius: '50%' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Indicators (Steps 1 & 2) */}
        {step < 3 && (
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)',
            fontSize: '12.5px',
            fontWeight: '600'
          }}>
            <div style={{
              flex: 1,
              padding: '10px 16px',
              textAlign: 'center',
              color: step === 1 ? 'var(--google-blue)' : 'var(--text-secondary)',
              borderBottom: step === 1 ? '2px solid var(--google-blue)' : 'none'
            }}>
              1. Shipping Address
            </div>
            <div style={{
              flex: 1,
              padding: '10px 16px',
              textAlign: 'center',
              color: step === 2 ? 'var(--google-blue)' : 'var(--text-secondary)',
              borderBottom: step === 2 ? '2px solid var(--google-blue)' : 'none'
            }}>
              2. Payment Simulation
            </div>
          </div>
        )}

        <div style={{ padding: '24px' }}>
          {/* STEP 1: SHIPPING */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  Full Recipient Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  Purchaser Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                  Shipping Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
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

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--bg-primary)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{
                marginTop: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                  Total: <strong style={{ color: 'var(--text-primary)' }}>${total.toFixed(2)}</strong>
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="btn-google-primary"
                  style={{ padding: '10px 20px' }}
                >
                  Continue to Payment <ArrowRight size={15} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Google Pay minimal option */}
              <div
                onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Google Pay' }))}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.paymentMethod === 'Google Pay' ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                  backgroundColor: formData.paymentMethod === 'Google Pay' ? 'var(--google-blue-surface)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    fontWeight: '700',
                    fontSize: '11px',
                    color: '#202124'
                  }}>
                    GPay
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Google Pay (One-Tap Instant)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Simulated fast & secure encrypted checkout</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'Google Pay'}
                  onChange={() => {}}
                  style={{ accentColor: 'var(--google-blue)' }}
                />
              </div>

              {/* Credit Card option */}
              <div
                onClick={() => setFormData(p => ({ ...p, paymentMethod: 'Credit Card' }))}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  border: formData.paymentMethod === 'Credit Card' ? '2px solid var(--google-blue)' : '1px solid var(--border-color)',
                  backgroundColor: formData.paymentMethod === 'Credit Card' ? 'var(--google-blue-surface)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CreditCard size={22} color="var(--text-secondary)" />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>Credit Card (Demo Mode)</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>•••• •••• •••• 4242 (Simulated)</div>
                  </div>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={formData.paymentMethod === 'Credit Card'}
                  onChange={() => {}}
                  style={{ accentColor: 'var(--google-blue)' }}
                />
              </div>

              {/* Security badge */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--google-green)',
                backgroundColor: 'var(--google-green-surface)',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)'
              }}>
                <ShieldCheck size={16} />
                <span>256-Bit SSL Encrypted & Carbon-Neutral Logistics Guaranteed</span>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '16px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <button
                  onClick={() => setStep(1)}
                  className="btn-ghost"
                  style={{ fontSize: '13px' }}
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="btn-google-primary"
                  style={{ padding: '10px 24px', fontSize: '14px' }}
                >
                  {isSubmitting ? 'Processing Payment...' : `Complete Order • $${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER CONFIRMATION */}
          {step === 3 && confirmedOrder && (
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--google-green-surface)',
                color: 'var(--google-green)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle size={36} />
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '4px' }}>
                Order Confirmed!
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Thank you, <strong>{confirmedOrder.customer}</strong>. Your sustainable minimalist essentials have been queued for ethical dispatch.
              </p>

              {/* Receipt Summary Box */}
              <div style={{
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'left',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                  <span style={{ fontWeight: '700', fontFamily: 'var(--font-mono)' }}>{confirmedOrder.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                  <span>{confirmedOrder.paymentMethod} (Authorized)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Deliver To:</span>
                  <span style={{ maxWidth: '240px', textAlign: 'right' }}>{confirmedOrder.shippingAddress}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontWeight: '700' }}>
                  <span>Total Paid:</span>
                  <span style={{ color: 'var(--google-blue)' }}>${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-google-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
                >
                  <Printer size={15} /> Print Receipt
                </button>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="btn-google-primary"
                  style={{ fontSize: '13px' }}
                >
                  Continue Exploring
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
