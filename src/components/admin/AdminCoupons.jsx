import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminCoupons = () => {
  const { coupons, addCoupon, deleteCoupon } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent', // 'percent' or 'flat'
    value: 10,
    minOrder: 500,
    label: ''
  });

  const couponList = Object.entries(coupons).map(([code, details]) => ({
    code,
    ...details
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim()) return;

    const newCoupon = {
      label: formData.label || `${formData.type === 'percent' ? `${formData.value}% OFF` : `₹${formData.value} OFF`} Maker Discount`,
      minOrder: parseFloat(formData.minOrder) || 0,
      ...(formData.type === 'percent'
        ? { discountPercent: parseFloat(formData.value) }
        : { flatDiscount: parseFloat(formData.value) })
    };

    addCoupon(formData.code, newCoupon);
    setIsModalOpen(false);
    setFormData({ code: '', type: 'percent', value: 10, minOrder: 500, label: '' });
  };

  return (
    <div className="admin-page-content">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Promotions &amp; Coupon Engine
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Active promo codes configured for checkout validation
            </div>
          </div>

          <button className="admin-action-pill-btn primary" onClick={() => setIsModalOpen(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Coupon
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Value</th>
                <th>Min Spend Required</th>
                <th>Campaign Name / Label</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {couponList.map(c => (
                <tr key={c.code}>
                  <td>
                    <span style={{
                      fontWeight: '700',
                      fontFamily: 'JetBrains Mono, monospace',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(249, 115, 22, 0.15)',
                      color: 'var(--primary)',
                      border: '1px dashed var(--primary)'
                    }}>
                      {c.code}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.flatDiscount} FLAT OFF`}
                    </span>
                  </td>
                  <td>₹{c.minOrder?.toLocaleString('en-IN')}</td>
                  <td>{c.label}</td>
                  <td>
                    <span className="badge-status badge-instock">Active</span>
                  </td>
                  <td>
                    <button
                      className="btn-table-icon danger"
                      title="Delete Coupon"
                      onClick={() => {
                        if (window.confirm(`Delete coupon code ${c.code}?`)) {
                          deleteCoupon(c.code);
                        }
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">✨ Create New Coupon Code</h3>
              <button className="btn-table-icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Coupon Code *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    style={{ textTransform: 'uppercase', fontFamily: 'JetBrains Mono, monospace' }}
                    placeholder="e.g. ROBOEXPO20"
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Discount Type *</label>
                  <select
                    className="admin-select"
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="percent">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Discount Amount/Percent *</label>
                  <input
                    type="number"
                    min="1"
                    className="admin-form-input"
                    required
                    value={formData.value}
                    onChange={e => setFormData({ ...formData, value: e.target.value })}
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Minimum Order Subtotal (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    className="admin-form-input"
                    required
                    value={formData.minOrder}
                    onChange={e => setFormData({ ...formData, minOrder: e.target.value })}
                  />
                </div>

                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Campaign Label / Title</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 20% OFF College Robotics Fest"
                    value={formData.label}
                    onChange={e => setFormData({ ...formData, label: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary">Save &amp; Activate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
