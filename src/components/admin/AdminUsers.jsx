import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminUsers = () => {
  const {
    users,
    currentUser,
    addUser,
    showToast
  } = useCart();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bengaluru'
  });

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.toLowerCase().includes(q)) ||
      (u.city && u.city.toLowerCase().includes(q)) ||
      (u.id && u.id.toLowerCase().includes(q))
    );
  });

  // KPI Calculations
  const totalUsers = users.length;
  const verifiedEmails = users.filter(u => u.email).length;
  const verifiedPhones = users.filter(u => u.phone && u.phone !== 'Not Provided').length;

  // Copy to clipboard helper
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`, 'info');
  };

  // Handle Add User Form
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Name and Email are required!', 'error');
      return;
    }

    const res = addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || '+91 98765 00000',
      city: formData.city.trim() || 'India',
      role: 'customer',
      tier: 'Maker Pro',
      status: 'Active'
    });

    if (res?.success) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: 'Bengaluru'
      });
    }
  };

  // Export Users as JSON
  const handleExportData = () => {
    const exportData = users.map(u => ({
      ID: u.id,
      Name: u.name,
      Email: u.email,
      Phone: u.phone || 'N/A',
      City: u.city || 'India',
      JoinedDate: u.joinedDate || '2026-01-01',
      LastActive: u.lastLogin || 'Recent'
    }));

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `Creotex_Users_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported user data successfully!', 'success');
  };

  return (
    <div className="admin-page-content" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* ================= TOP METRICS CARDS ================= */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {/* Total Users */}
        <div className="admin-stat-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Registered Users</span>
            <div className="admin-stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)', color: '#F97316' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.8rem', marginTop: '8px' }}>{totalUsers}</div>
          <div className="admin-stat-footer" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Verified Maker &amp; Lab Accounts</span>
          </div>
        </div>

        {/* Registered Emails */}
        <div className="admin-stat-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="admin-stat-header">
            <span className="admin-stat-label">Verified Email Accounts</span>
            <div className="admin-stat-icon" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.8rem', marginTop: '8px', color: '#38BDF8' }}>{verifiedEmails}</div>
          <div className="admin-stat-footer" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Primary Login Identifiers</span>
          </div>
        </div>

        {/* Contact Numbers */}
        <div className="admin-stat-card" style={{ padding: '18px 20px', borderRadius: '16px' }}>
          <div className="admin-stat-header">
            <span className="admin-stat-label">Phone &amp; Mobile Numbers</span>
            <div className="admin-stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)', color: '#22C55E' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
          </div>
          <div className="admin-stat-value" style={{ fontSize: '1.8rem', marginTop: '8px', color: '#22C55E' }}>{verifiedPhones}</div>
          <div className="admin-stat-footer" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>Registered Contact Numbers</span>
          </div>
        </div>
      </div>

      {/* ================= MAIN USER DATA CARD ================= */}
      <div className="admin-card">
        {/* Card Header & Controls */}
        <div className="admin-card-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              User Login Data Directory
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Registered user logins: User Name, Email Address, and Phone/Mobile Number.
            </div>
          </div>

          <div className="admin-table-controls" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Search Input */}
            <div className="admin-search-wrapper" style={{ minWidth: '260px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search user name, email, number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Export Button */}
            <button
              className="admin-action-pill-btn"
              onClick={handleExportData}
              title="Download user login list as JSON"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export JSON
            </button>

            {/* Add User Button */}
            <button
              className="admin-action-pill-btn primary"
              onClick={() => {
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  city: 'Bengaluru'
                });
                setIsAddModalOpen(true);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add User
            </button>
          </div>
        </div>

        {/* User Data Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>User Full Name &amp; Profile</th>
                <th style={{ width: '35%' }}>Email Address</th>
                <th style={{ width: '30%' }}>Phone / Mobile Number</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => {
                  const isCurrentUser = currentUser?.id === user.id;

                  return (
                    <tr key={user.id} style={{ transition: 'background 0.2s ease' }}>
                      {/* User Name & Profile */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            className="admin-avatar"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #F97316, #EA580C)',
                              color: '#FFFFFF',
                              fontWeight: '700',
                              fontSize: '0.9rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                              flexShrink: 0
                            }}
                          >
                            {(user.name || 'U')
                              .split(' ')
                              .map(n => n[0])
                              .join('')
                              .substring(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.92rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>{user.name}</span>
                              {isCurrentUser && (
                                <span style={{
                                  fontSize: '0.65rem',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  background: 'rgba(34, 197, 94, 0.2)',
                                  color: '#22C55E',
                                  fontWeight: '700'
                                }}>
                                  YOU
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>ID: <code style={{ color: 'var(--primary)' }}>{user.id}</code></span>
                              <span>•</span>
                              <span>{user.city || 'India'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email Address */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                            {user.email}
                          </span>
                          <button
                            onClick={() => copyToClipboard(user.email, 'Email')}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '3px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Copy email address"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          </button>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Joined: {user.joinedDate || '2026-01-01'}
                        </div>
                      </td>

                      {/* Phone / Mobile Number */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            fontFamily: 'monospace',
                            color: user.phone ? 'var(--text-primary)' : 'var(--text-muted)'
                          }}>
                            {user.phone || 'Not Provided'}
                          </span>
                          {user.phone && (
                            <button
                              onClick={() => copyToClipboard(user.phone, 'Phone Number')}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '3px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                              title="Copy mobile number"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '3px' }}>
                          Last Active: {user.lastLogin || 'Recent'}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', opacity: 0.5 }}>
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4" />
                      <path d="M12 16h.01" />
                    </svg>
                    <div style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>No user login records match your search</div>
                    <div style={{ fontSize: '0.82rem', marginTop: '4px' }}>Try clearing the search filter.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD NEW USER ================= */}
      {isAddModalOpen && (
        <div
          className="admin-modal-backdrop"
          onClick={(e) => {
            if (e.target.className === 'admin-modal-backdrop') setIsAddModalOpen(false);
          }}
        >
          <div className="admin-modal-card" style={{ maxWidth: '480px' }}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                Add User Login
              </h3>
              <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="admin-modal-body">
                {/* User Name */}
                <div className="admin-form-group">
                  <label className="admin-form-label">User Full Name *</label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. Vikramaditya Sharma"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email Address */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="admin-form-input"
                    placeholder="e.g. vikram@makerlabs.in"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                {/* Phone / Mobile Number */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Phone / Mobile Number</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                {/* City */}
                <div className="admin-form-group">
                  <label className="admin-form-label">City / Location</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Bengaluru"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button type="button" className="admin-modal-btn cancel" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-modal-btn submit">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
