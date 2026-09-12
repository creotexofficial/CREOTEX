import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';

export const AdminSettings = () => {
  const {
    storeSettings,
    updateStoreSettings,
    resetDemoData,
    products,
    orders,
    coupons,
    customers,
    datasheets
  } = useCart();

  const [formData, setFormData] = useState({ ...storeSettings });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateStoreSettings({
      ...formData,
      gstRate: parseFloat(formData.gstRate) || 18,
      freeShippingThreshold: parseFloat(formData.freeShippingThreshold) || 999,
      standardShippingCost: parseFloat(formData.standardShippingCost) || 79
    });
  };

  const handleExportJSON = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      storeSettings,
      products,
      orders,
      coupons,
      customers,
      datasheets
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `creotex_store_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="admin-page-content">
      <div className="admin-card" style={{ maxWidth: '880px' }}>
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              Store Configuration &amp; Global Parameters
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Control tax calculation, shipping tier rules, announcement bar, and store backups
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          <div className="admin-form-grid">
            {/* Store Profile */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Store Brand Name</label>
              <input
                type="text"
                className="admin-form-input"
                name="storeName"
                value={formData.storeName}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Store Tagline / Subtitle</label>
              <input
                type="text"
                className="admin-form-input"
                name="storeTagline"
                value={formData.storeTagline}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Admin Support Email</label>
              <input
                type="email"
                className="admin-form-input"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Customer Support Hotline</label>
              <input
                type="text"
                className="admin-form-input"
                name="supportPhone"
                value={formData.supportPhone}
                onChange={handleChange}
              />
            </div>

            {/* Tax & Shipping */}
            <div className="admin-form-group">
              <label className="admin-form-label">GST Tax Rate (%)</label>
              <input
                type="number"
                min="0"
                max="30"
                className="admin-form-input"
                name="gstRate"
                value={formData.gstRate}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Free Shipping Threshold (₹)</label>
              <input
                type="number"
                min="0"
                className="admin-form-input"
                name="freeShippingThreshold"
                value={formData.freeShippingThreshold}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Standard Shipping Fee (₹)</label>
              <input
                type="number"
                min="0"
                className="admin-form-input"
                name="standardShippingCost"
                value={formData.standardShippingCost}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Currency Symbol</label>
              <input
                type="text"
                className="admin-form-input"
                name="currencySymbol"
                value={formData.currencySymbol}
                onChange={handleChange}
              />
            </div>

            {/* Banner Announcement */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Storefront Announcement Banner Text</label>
              <input
                type="text"
                className="admin-form-input"
                name="announcementBanner"
                value={formData.announcementBanner}
                onChange={handleChange}
              />
            </div>

            {/* Maintenance Mode Toggle */}
            <div className="admin-form-group admin-form-full" style={{ marginTop: '8px' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                />
                <strong>Enable Maintenance Mode</strong> (Restricts storefront checkouts)
              </label>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button type="submit" className="admin-action-pill-btn primary">Save Store Settings</button>
          </div>
        </form>
      </div>

      {/* Backup & System Operations */}
      <div className="admin-card" style={{ maxWidth: '880px', marginTop: '24px' }}>
        <div className="admin-card-header">
          <h2 className="admin-card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Data Backup &amp; Factory Reset
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="admin-action-pill-btn" onClick={handleExportJSON}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Store Backup (JSON)
          </button>

          <button
            className="admin-action-pill-btn"
            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all store data to factory demo defaults? Custom added items and orders will be refreshed.")) {
                resetDemoData();
              }
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            Reset to Factory Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
