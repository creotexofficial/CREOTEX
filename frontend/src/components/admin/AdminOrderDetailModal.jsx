import React, { useState } from 'react';
import {
  Printer,
  X,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  User,
  CheckCircle2,
  Clock,
  Package,
  FileText
} from 'lucide-react';

export const AdminOrderDetailModal = ({ order, isOpen, onClose, onUpdateStatus }) => {
  const [currentStatus, setCurrentStatus] = useState(order ? order.orderStatus : 'Processing');
  const [trackingNumber, setTrackingNumber] = useState(order ? (order.trackingNumber || '') : '');

  if (!isOpen || !order) return null;

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onUpdateStatus(order.id, newStatus, trackingNumber);
  };

  const handleSaveTracking = () => {
    onUpdateStatus(order.id, currentStatus, trackingNumber);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" style={{ maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--primary)' }} />
              <span>Order Manifest: #{order.id}</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placed on {order.date}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="admin-action-pill-btn" onClick={handlePrint} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Printer size={14} />
              <span>Print Invoice</span>
            </button>
            <button className="btn-table-icon" onClick={onClose}>
              <X size={15} />
            </button>
          </div>
        </div>

        <div className="admin-modal-body">
          {/* Order Status & Tracking Workflow Bar */}
          <div style={{
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700' }}>
                Fulfillment Status
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: currentStatus === st ? 'var(--primary)' : 'var(--border-color)',
                      background: currentStatus === st ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                      color: currentStatus === st ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  Courier Tracking / AWB
                </div>
                <input
                  type="text"
                  className="admin-form-input"
                  style={{ padding: '4px 10px', fontSize: '0.8rem', width: '180px', marginTop: '4px' }}
                  placeholder="e.g. BLUEDART-88194"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="admin-action-pill-btn"
                style={{ marginTop: '16px', padding: '6px 12px', fontSize: '0.75rem' }}
                onClick={handleSaveTracking}
              >
                Update AWB
              </button>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={13} />
                <span>Customer Profile</span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{order.customer?.name}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{order.customer?.email}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={12} style={{ color: 'var(--text-muted)' }} />
                <span>{order.customer?.phone}</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={13} />
                <span>Delivery Destination</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                {order.customer?.address}<br />
                {order.customer?.city}, {order.customer?.state || 'India'} - {order.customer?.pincode}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={13} />
                <span>Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})</span>
              </div>
            </div>
          </div>

          {/* Purchased Items Table */}
          <div style={{ border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden', marginBottom: '20px' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Component Item</th>
                  <th>SKU</th>
                  <th>Unit Price</th>
                  <th>Qty</th>
                  <th style={{ textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{it.name}</td>
                    <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {it.sku || 'N/A'}
                    </td>
                    <td>₹{it.price}</td>
                    <td>{it.quantity}</td>
                    <td style={{ textAlign: 'right', fontWeight: '700' }}>₹{it.price * it.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing & GST Tax Breakdown */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Subtotal:</span>
                <span>₹{order.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                  <span>Coupon ({order.couponApplied || 'Promo'}):</span>
                  <span>-₹{order.discount?.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST (18% Included):</span>
                <span>₹{Math.round(order.tax || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: '800',
                fontSize: '1.1rem',
                color: 'var(--text-primary)',
                borderTop: '1px solid var(--border-color)',
                paddingTop: '8px',
                marginTop: '4px'
              }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--primary)' }}>₹{Math.round(order.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-modal-footer">
          <button className="admin-action-pill-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
