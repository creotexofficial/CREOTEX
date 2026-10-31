import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Users,
  Mail,
  Phone,
  Search,
  Download,
  Plus,
  UserPlus,
  Copy,
  Check,
  AlertCircle,
  X,
  MapPin
} from 'lucide-react';

export const AdminUsers = () => {
  const {
    users,
    currentUser,
    addUser,
    showToast
  } = useCart();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

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
  const copyToClipboard = (text, label, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
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
              <Users size={20} strokeWidth={2} />
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
              <Mail size={20} strokeWidth={2} />
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
              <Phone size={20} strokeWidth={2} />
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
              <Users size={22} strokeWidth={2} style={{ color: 'var(--primary)' }} />
              User Login Data Directory
            </h2>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '3px' }}>
              Registered user logins: User Name, Email Address, and Phone/Mobile Number.
            </div>
          </div>

          <div className="admin-table-controls" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            {/* Search Input */}
            <div className="admin-search-wrapper" style={{ minWidth: '260px' }}>
              <Search size={15} strokeWidth={2} />
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
              <Download size={15} strokeWidth={2} />
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
              <Plus size={16} strokeWidth={2.5} />
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
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={11} /> {user.city || 'India'}
                              </span>
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
                            onClick={() => copyToClipboard(user.email, 'Email', `email-${user.id}`)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: copiedKey === `email-${user.id}` ? '#22C55E' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px',
                              transition: 'all 0.2s ease'
                            }}
                            title="Copy email address"
                          >
                            {copiedKey === `email-${user.id}` ? (
                              <Check size={14} strokeWidth={2.2} />
                            ) : (
                              <Copy size={14} strokeWidth={1.8} />
                            )}
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
                              onClick={() => copyToClipboard(user.phone, 'Phone Number', `phone-${user.id}`)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: copiedKey === `phone-${user.id}` ? '#22C55E' : 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '4px',
                                transition: 'all 0.2s ease'
                              }}
                              title="Copy mobile number"
                            >
                              {copiedKey === `phone-${user.id}` ? (
                                <Check size={14} strokeWidth={2.2} />
                              ) : (
                                <Copy size={14} strokeWidth={1.8} />
                              )}
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
                    <AlertCircle size={40} strokeWidth={1.5} style={{ margin: '0 auto 12px', opacity: 0.5, display: 'block' }} />
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
                <UserPlus size={20} strokeWidth={2} style={{ color: 'var(--primary)' }} />
                Add User Login
              </h3>
              <button className="admin-modal-close" onClick={() => setIsAddModalOpen(false)} aria-label="Close">
                <X size={18} />
              </button>
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
                <button type="submit" className="admin-modal-btn submit" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} strokeWidth={2} />
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

