import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const CheckoutModal = () => {
  const {
    isCheckoutOpen,
    closeCheckoutModal,
    checkoutStep,
    setCheckoutStep,
    total,
    gst,
    items,
    clearCart,
    createOrder,
    appliedCoupon,
    currentUser
  } = useCart();

  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Rahul Sharma',
    email: currentUser?.email || 'rahul.maker@creotex.in',
    phone: currentUser?.phone || '+91 98765 43210',
    address: 'Flat 402, Tech Innovation Hub, Indiranagar',
    city: currentUser?.city || 'Bengaluru',
    pincode: '560038',
    gstin: ''
  });

  // Sync with currentUser if changes
  React.useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        city: currentUser.city || prev.city
      }));
    }
  }, [currentUser, isCheckoutOpen]);

  const [payMethod, setPayMethod] = useState('upi');
  const [orderId, setOrderId] = useState('');
  const [awbNumber, setAwbNumber] = useState('');

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setCheckoutStep(2);
  };

  const handlePlaceOrder = () => {
    const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const generatedAwb = `BLUEDART-${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    setOrderId(generatedOrderId);
    setAwbNumber(generatedAwb);

    // Record order in dynamic Super Admin state
    createOrder({
      id: generatedOrderId,
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode
      },
      items: [...items],
      paymentMethod: payMethod === 'upi' ? 'UPI (Verified)' : payMethod === 'card' ? 'Credit/Debit Card' : 'Net Banking',
      paymentStatus: 'Paid',
      orderStatus: 'Processing',
      trackingNumber: generatedAwb
    });

    setCheckoutStep(3);
  };

  const handleFinishCheckout = () => {
    clearCart();
    closeCheckoutModal();
  };

  return (
    <div
      className="modal-backdrop active"
      id="checkout-modal"
      onClick={(e) => {
        if (e.target.id === 'checkout-modal') closeCheckoutModal();
      }}
    >
      <div className="modal-card checkout-modal-card">
        <button className="modal-close-btn" onClick={closeCheckoutModal}>
          ✕
        </button>

        {/* 3-Step Header Navigation */}
        <div className="checkout-steps-nav" id="checkout-steps-nav">
          <div
            className={`checkout-step-item ${checkoutStep >= 1 ? 'active' : ''} ${
              checkoutStep > 1 ? 'completed' : ''
            }`}
          >
            <span className="step-number">1</span>
            <span>Address</span>
          </div>
          <div
            className={`checkout-step-item ${checkoutStep >= 2 ? 'active' : ''} ${
              checkoutStep > 2 ? 'completed' : ''
            }`}
          >
            <span className="step-number">2</span>
            <span>Payout</span>
          </div>
          <div className={`checkout-step-item ${checkoutStep === 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span>Record / Receipt</span>
          </div>
        </div>

        {/* Step 1: Address */}
        {checkoutStep === 1 && (
          <form onSubmit={handleProceedToPayment}>
            <h3 style={{ marginBottom: '16px' }}>1. Shipping &amp; Maker Contact Details</h3>
            <div className="form-grid">
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">Mobile Number (For WhatsApp Updates) *</label>
                <input
                  type="tel"
                  className="form-input"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group-full">
                <label className="form-label">Delivery Address (House/Lab, Street, Area) *</label>
                <input
                  type="text"
                  className="form-input"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">City *</label>
                <input
                  type="text"
                  className="form-input"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="form-label">PIN Code *</label>
                <input
                  type="text"
                  className="form-input"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group-full">
                <label className="form-label">GSTIN (Optional for Business Invoice)</label>
                <input
                  type="text"
                  className="form-input"
                  name="gstin"
                  placeholder="29AAAAA0000A1Z5"
                  value={formData.gstin}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <div>
                Order Total:{' '}
                <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>
                  ₹{total.toLocaleString('en-IN')}
                </strong>
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                Proceed to Payout →
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payout */}
        {checkoutStep === 2 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>2. Choose Payout &amp; Payment Method</h3>
            <div className="payment-options-grid">
              <div
                className={`payment-option-card ${payMethod === 'upi' ? 'selected' : ''}`}
                onClick={() => setPayMethod('upi')}
              >
                <input
                  type="radio"
                  name="pay-method"
                  checked={payMethod === 'upi'}
                  onChange={() => setPayMethod('upi')}
                />
                <div>
                  <strong>📱 Instant UPI / QR</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Google Pay, PhonePe, Paytm, BHIM
                  </div>
                </div>
              </div>
              <div
                className={`payment-option-card ${payMethod === 'card' ? 'selected' : ''}`}
                onClick={() => setPayMethod('card')}
              >
                <input
                  type="radio"
                  name="pay-method"
                  checked={payMethod === 'card'}
                  onChange={() => setPayMethod('card')}
                />
                <div>
                  <strong>💳 Credit / Debit Cards</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Visa, Mastercard, RuPay, Amex
                  </div>
                </div>
              </div>
              <div
                className={`payment-option-card ${payMethod === 'netbanking' ? 'selected' : ''}`}
                onClick={() => setPayMethod('netbanking')}
              >
                <input
                  type="radio"
                  name="pay-method"
                  checked={payMethod === 'netbanking'}
                  onChange={() => setPayMethod('netbanking')}
                />
                <div>
                  <strong>🏦 NetBanking</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    HDFC, ICICI, SBI, Axis + 50 Banks
                  </div>
                </div>
              </div>
              <div
                className={`payment-option-card ${payMethod === 'cod' ? 'selected' : ''}`}
                onClick={() => setPayMethod('cod')}
              >
                <input
                  type="radio"
                  name="pay-method"
                  checked={payMethod === 'cod'}
                  onChange={() => setPayMethod('cod')}
                />
                <div>
                  <strong>💵 Cash on Delivery</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                    Pay at your doorstep
                  </div>
                </div>
              </div>
            </div>

            <div className="blueprint-visual" style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '0.85rem', marginBottom: '8px' }}>
                🔒 256-Bit SSL Encrypted &amp; RBI Verified Checkout
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)' }}>
                Total Payable: ₹{total.toLocaleString('en-IN')}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Includes 18% GST (₹{gst.gstAmount.toLocaleString('en-IN')}) • Free Express Delivery Included
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCheckoutStep(1)}
              >
                ← Back to Address
              </button>
              <button
                type="button"
                className="btn btn-accent btn-lg"
                onClick={handlePlaceOrder}
              >
                ⚡ Pay &amp; Confirm Order
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Record / Receipt */}
        {checkoutStep === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>🎉</div>
            <h2 style={{ color: 'var(--primary)', marginBottom: '6px' }}>
              Order Record Confirmed Successfully!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Thank you for shopping at CreotexShop! Your components are being packed for dispatch.
            </p>

            <div className="blueprint-card" style={{ margin: '20px 0', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' }}>
                <span>Order Record Number:</span>
                <span className="mono" style={{ color: 'var(--primary)', fontWeight: 900 }}>
                  {orderId}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span>Tracking AWB:</span>
                <span className="mono">{awbNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span>Recipient:</span>
                <span>{formData.name} ({formData.phone})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                <span>Payout Status:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                  PAID ({payMethod.toUpperCase()} Confirmed)
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span>Estimated Delivery:</span>
                <span>2-3 Business Days (Express Delivery)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                🖨️ Print Tax Invoice &amp; Receipt
              </button>
              <button className="btn btn-primary" onClick={handleFinishCheckout}>
                Done &amp; Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
