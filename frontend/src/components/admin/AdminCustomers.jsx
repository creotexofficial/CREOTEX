import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Users,
  Search,
  Plus,
  RotateCw,
  Trash2,
  UserPlus,
  X
} from 'lucide-react';

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
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={20} strokeWidth={2} style={{ color: 'var(--primary)' }} />
              Maker &amp; Enterprise Customer Directory
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total registered robotics enthusiasts and lab accounts: <strong>{customers.length}</strong>
            </div>
          </div>

          <div className="admin-table-controls">
            <div className="admin-search-wrapper">
              <Search size={15} strokeWidth={2} />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search maker name, email, city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <button className="admin-action-pill-btn primary" onClick={() => setIsModalOpen(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Plus size={16} strokeWidth={2.5} />
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
                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        title="Click to cycle tier"
                        onClick={() => handleToggleTier(c)}
                      >
                        {c.tier} <RotateCw size={11} strokeWidth={2.2} />
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
                        <Trash2 size={14} strokeWidth={2} />
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
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserPlus size={18} strokeWidth={2} style={{ color: 'var(--primary)' }} /> Add Customer Account
              </h3>
              <button className="btn-table-icon" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <X size={16} strokeWidth={2} />
              </button>
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
                <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={15} strokeWidth={2.2} />
                  Add Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
