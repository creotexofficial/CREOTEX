import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import {
  Settings,
  Save,
  Download,
  RotateCcw,
  Database,
  Store,
  ShieldAlert
} from 'lucide-react';

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
            <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={20} strokeWidth={2} style={{ color: 'var(--primary)' }} />
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
            <button type="submit" className="admin-action-pill-btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Save size={16} strokeWidth={2.2} />
              Save Store Settings
            </button>
          </div>
        </form>
      </div>

      {/* Backup & System Operations */}
      <div className="admin-card" style={{ maxWidth: '880px', marginTop: '24px' }}>
        <div className="admin-card-header">
          <h2 className="admin-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} strokeWidth={2} style={{ color: 'var(--primary)' }} />
            Data Backup &amp; Factory Reset
          </h2>
        </div>
        <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <button className="admin-action-pill-btn" onClick={handleExportJSON} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} strokeWidth={2} />
            Export Store Backup (JSON)
          </button>

          <button
            className="admin-action-pill-btn"
            style={{ color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all store data to factory demo defaults? Custom added items and orders will be refreshed.")) {
                resetDemoData();
              }
            }}
          >
            <RotateCcw size={16} strokeWidth={2} />
            Reset to Factory Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
