import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminCustomers = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCart();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bengaluru',
    tier: 'Maker Pro'
  });

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const getTierBadge = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'enterprise lab': return 'badge-tier-enterprise';
      case 'maker pro': return 'badge-tier-pro';
      case 'student maker': return 'badge-tier-student';
      default: return 'badge-tier-hobby';
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    addCustomer(formData);
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', city: 'Bengaluru', tier: 'Maker Pro' });
  };

  const handleToggleTier = (cust) => {
    const tiers = ['Hobbyist', 'Student Maker', 'Maker Pro', 'Enterprise Lab'];
    const nextTier = tiers[(tiers.indexOf(cust.tier) + 1) % tiers.length];
    updateCustomer(cust.id, { tier: nextTier });
  };

  return (
    <div className="admin-page-content">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Maker &amp; Enterprise Customer Directory
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total registered robotics enthusiasts and lab accounts: <strong>{customers.length}</strong>
            </div>
          </div>

          <div className="admin-table-controls">
            <div className="admin-search-wrapper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search maker name, email, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button className="admin-action-pill-btn primary" onClick={() => setIsModalOpen(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Customer
            </button>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Details</th>
                <th>Location</th>
                <th>Maker Tier</th>
                <th>Orders Placed</th>
                <th>Lifetime Spend</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="admin-avatar" style={{ width: '32px', height: '32px', fontSize: '0.75rem' }}>
                          {c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{c.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Joined {c.joinedDate || '2026'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem' }}>{c.email}</div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{c.city}</span>
                    </td>
                    <td>
                      <span
                        className={`badge-status ${getTierBadge(c.tier)}`}
                        style={{ cursor: 'pointer' }}
                        title="Click to cycle tier"
                        onClick={() => handleToggleTier(c)}
                      >
                        {c.tier} ↺
                      </span>
                    </td>
                    <td>
                      <span style={{ fontWeight: '600' }}>{c.totalOrders}</span> orders
                    </td>
                    <td>
                      <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                        ₹{c.totalSpent?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-table-icon danger"
                        title="Delete Customer"
                        onClick={() => {
                          if (window.confirm(`Delete customer ${c.name}?`)) {
                            deleteCustomer(c.id);
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
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No customer accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '520px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">✨ Add Customer Account</h3>
              <button className="btn-table-icon" onClick={() => setIsModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleAdd} className="admin-modal-body">
              <div className="admin-form-grid">
                <div className="admin-form-group admin-form-full">
                  <label className="admin-form-label">Full Name *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address *</label>
                  <input
                    type="email"
                    className="admin-form-input"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="vikram@maker.in"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="admin-form-input"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">City *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    required
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Maker Tier *</label>
                  <select
                    className="admin-select"
                    value={formData.tier}
                    onChange={e => setFormData({ ...formData, tier: e.target.value })}
                  >
                    <option value="Hobbyist">Hobbyist</option>
                    <option value="Student Maker">Student Maker</option>
                    <option value="Maker Pro">Maker Pro</option>
                    <option value="Enterprise Lab">Enterprise Lab</option>
                  </select>
                </div>
              </div>

              <div className="admin-modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
                <button type="button" className="admin-action-pill-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="admin-action-pill-btn primary">Add Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
