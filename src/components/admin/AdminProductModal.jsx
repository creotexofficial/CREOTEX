import React, { useState, useEffect, useRef } from 'react';
import { CATEGORIES_METADATA } from '../../data/productsData';
import { ProductImage } from '../../data/productImages';

const AVAILABLE_IMAGES = [
  "fasteners-m3-kit",
  "fasteners-brass-standoff",
  "fasteners-m4-black",
  "filament-hyper-pla",
  "filament-petg-cf",
  "filament-tpu",
  "nozzle-set",
  "motor-planetary-pg36",
  "motor-nema17",
  "motor-n20-encoder",
  "motor-servo-mg996r",
  "motor-bldc-2212",
  "driver-cytron-mdd10a",
  "driver-tb6612",
  "driver-tmc2209",
  "driver-bldc-esc40",
  "bearing-608zz",
  "bearing-lm8uu",
  "motion-t8-screw",
  "lfr-kit-pro",
  "lfr-qtr8rc",
  "chassis-race-4wd",
  "wheels-silicone-racing",
  "wheels-mecanum-100",
  "chassis-omni-soccer",
  "battery-lipo-3s",
  "sensor-mpu6050",
  "sensor-ultrasonic"
];

export const AdminProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'motors',
    categoryLabel: 'Gearbox & Motors',
    price: 999,
    originalPrice: 1499,
    stock: 50,
    rating: 4.8,
    badge: 'Popular',
    image: 'motor-planetary-pg36',
    shortDesc: '',
    tags: 'Robotics, Hardware',
    isDeal: false,
    isFeatured: true,
    isBestSeller: false,
    specs: { 'Material': 'High-Grade Alloy', 'Voltage': '12V DC' }
  });

  // Image upload mode: 'file' | 'url' | 'preset'
  const [imageSourceTab, setImageSourceTab] = useState('file');
  const [liveUrlInput, setLiveUrlInput] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [imageError, setImageError] = useState('');

  const [specKey, setSpecKey] = useState('');
  const [specVal, setSpecVal] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      const img = product.image || 'motor-planetary-pg36';
      setFormData({
        ...product,
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
        specs: product.specs || {}
      });

      // Detect current image type
      if (img.startsWith('data:')) {
        setImageSourceTab('file');
        setUploadedFileName('Custom Uploaded File');
      } else if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('//') || img.startsWith('/')) {
        setImageSourceTab('url');
        setLiveUrlInput(img);
      } else {
        setImageSourceTab('preset');
      }
    } else {
      setFormData({
        name: '',
        sku: `CTX-${Math.floor(1000 + Math.random() * 9000)}`,
        category: 'motors',
        categoryLabel: 'Gearbox & Motors',
        price: 999,
        originalPrice: 1499,
        stock: 50,
        rating: 4.8,
        badge: 'New Arrival',
        image: 'motor-planetary-pg36',
        shortDesc: 'Precision robotics component for makers, engineers, and competition bots.',
        tags: 'Robotics, DIY, High-Torque',
        isDeal: false,
        isFeatured: true,
        isBestSeller: false,
        specs: { 'Operating Voltage': '12V DC', 'Gear Material': 'All-Metal Steel' }
      });
      setImageSourceTab('file');
      setLiveUrlInput('');
      setUploadedFileName('');
      setUploadedFileSize('');
      setImageError('');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const catMeta = CATEGORIES_METADATA.find(c => c.id === catId);
    setFormData(prev => ({
      ...prev,
      category: catId,
      categoryLabel: catMeta ? catMeta.name : catId
    }));
  };

  // File Upload Handler (FileReader -> Base64 Data URL)
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF).');
      return;
    }

    // Check size limit (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image file is too large! Maximum allowed size is 5MB.');
      return;
    }

    setImageError('');
    const sizeKB = (file.size / 1024).toFixed(1);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${sizeKB} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setFormData(prev => ({ ...prev, image: base64Url }));
    };
    reader.onerror = () => {
      setImageError('Failed to read image file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  // Live URL Handler
  const handleLiveUrlChange = (url) => {
    const trimmed = url.trim();
    setLiveUrlInput(url);
    setImageError('');
    if (trimmed) {
      setFormData(prev => ({ ...prev, image: trimmed }));
    }
  };

  const handleAddSpec = () => {
    if (!specKey.trim() || !specVal.trim()) return;
    setFormData(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [specKey.trim()]: specVal.trim()
      }
    }));
    setSpecKey('');
    setSpecVal('');
  };

  const handleRemoveSpec = (keyToRemove) => {
    setFormData(prev => {
      const nextSpecs = { ...prev.specs };
      delete nextSpecs[keyToRemove];
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const discountPercent = formData.originalPrice > formData.price
      ? `${Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100)}% OFF`
      : '0% OFF';

    const payload = {
      ...formData,
      discount: discountPercent,
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice),
      stock: parseInt(formData.stock, 10),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" style={{ maxWidth: '680px', width: '92%' }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {product ? `Edit Product: ${product.name}` : 'Add New Product to Inventory'}
          </h3>
          <button className="btn-table-icon" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-body" style={{ maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          <div className="admin-form-grid">
            {/* Product Name */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Product Name *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. High Torque Planetary Gear Motor 12V 300RPM"
              />
            </div>

            {/* SKU */}
            <div className="admin-form-group">
              <label className="admin-form-label">SKU Code *</label>
              <input
                type="text"
                className="admin-form-input"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                placeholder="CTX-MOT-PG36"
              />
            </div>

            {/* Category */}
            <div className="admin-form-group">
              <label className="admin-form-label">Category *</label>
              <select
                className="admin-select"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                {CATEGORIES_METADATA.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Price & Original Price */}
            <div className="admin-form-group">
              <label className="admin-form-label">Selling Price (₹) *</label>
              <input
                type="number"
                min="1"
                className="admin-form-input"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Original MSRP Price (₹) *</label>
              <input
                type="number"
                min="1"
                className="admin-form-input"
                required
                value={formData.originalPrice}
                onChange={e => setFormData({ ...formData, originalPrice: e.target.value })}
              />
            </div>

            {/* Stock & Rating */}
            <div className="admin-form-group">
              <label className="admin-form-label">Inventory Units (Stock) *</label>
              <input
                type="number"
                min="0"
                className="admin-form-input"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Badge Text</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.badge}
                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                placeholder="e.g. Best Seller, New, Pro Choice"
              />
            </div>

            {/* ================= DUAL IMAGE UPLOAD SYSTEM ================= */}
            <div className="admin-form-group admin-form-full" style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '18px 20px',
              marginTop: '4px',
              marginBottom: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <label className="admin-form-label" style={{ margin: 0, fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Product Image Upload Method
                </label>

                {/* Tab Switcher: Upload File vs Live URL vs Presets */}
                <div style={{
                  display: 'inline-flex',
                  background: 'var(--bg-card)',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)'
                }}>
                  <button
                    type="button"
                    onClick={() => {
                      setImageSourceTab('file');
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: imageSourceTab === 'file' ? 'var(--primary)' : 'transparent',
                      color: imageSourceTab === 'file' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    📁 Upload from File
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageSourceTab('url');
                      if (liveUrlInput.trim()) {
                        setFormData(prev => ({ ...prev, image: liveUrlInput.trim() }));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: imageSourceTab === 'url' ? 'var(--primary)' : 'transparent',
                      color: imageSourceTab === 'url' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    🌐 Live Image URL
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setImageSourceTab('preset');
                      if (!formData.image.startsWith('http') && !formData.image.startsWith('data:') && !formData.image.startsWith('//')) {
                        // keep current
                      } else {
                        setFormData(prev => ({ ...prev, image: 'motor-planetary-pg36' }));
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      background: imageSourceTab === 'preset' ? 'var(--primary)' : 'transparent',
                      color: imageSourceTab === 'preset' ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                    📦 Catalog Presets
                  </button>
                </div>
              </div>

              {/* Main Content Area Grid: Input Controls + Live Preview */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: '16px', alignItems: 'center' }}>
                <div>
                  {/* TAB 1: FILE UPLOAD (LOCAL DEVICE / PHONE / PC) */}
                  {imageSourceTab === 'file' && (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileInputChange}
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml, image/gif"
                        style={{ display: 'none' }}
                      />

                      <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          border: isDragOver ? '2px dashed #F97316' : '2px dashed var(--border-color)',
                          borderRadius: '12px',
                          padding: '20px 16px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          background: isDragOver ? 'rgba(249, 115, 22, 0.08)' : 'var(--bg-card)',
                          transition: 'all 0.25s ease'
                        }}
                      >
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: 'rgba(249, 115, 22, 0.15)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px'
                        }}>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                          Click to browse file or drag &amp; drop image here
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                          Supports PNG, JPG, WEBP, SVG (Max 5MB)
                        </div>

                        {uploadedFileName && (
                          <div style={{
                            marginTop: '10px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(34, 197, 94, 0.15)',
                            color: '#22C55E',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.76rem',
                            fontWeight: '600'
                          }}>
                            <span>✓ {uploadedFileName}</span>
                            {uploadedFileSize && <span>({uploadedFileSize})</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LIVE ONLINE IMAGE URL */}
                  {imageSourceTab === 'url' && (
                    <div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input
                            type="text"
                            className="admin-form-input"
                            placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                            value={liveUrlInput}
                            onChange={e => handleLiveUrlChange(e.target.value)}
                            style={{ paddingLeft: '38px' }}
                          />
                          <div style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)',
                            pointerEvents: 'none',
                            display: 'flex'
                          }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <line x1="2" y1="12" x2="22" y2="12" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              const text = await navigator.clipboard.readText();
                              if (text) handleLiveUrlChange(text);
                            } catch {
                              // Clipboard permission fallback
                            }
                          }}
                          className="admin-action-pill-btn"
                          style={{ padding: '0 14px', height: '42px', display: 'flex', alignItems: 'center', gap: '5px' }}
                          title="Paste from clipboard"
                        >
                          📋 Paste
                        </button>
                      </div>

                      {/* Quick Sample Image Test Buttons */}
                      <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Quick Samples:</span>
                        <button
                          type="button"
                          onClick={() => handleLiveUrlChange('https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80')}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ DC Motor
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLiveUrlChange('https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=600&auto=format&fit=crop&q=80')}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Circuit Board
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLiveUrlChange('https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80')}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ 3D Filament
                        </button>
                        <button
                          type="button"
                          onClick={() => handleLiveUrlChange('https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&auto=format&fit=crop&q=80')}
                          style={{
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            color: 'var(--primary)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            cursor: 'pointer'
                          }}
                        >
                          ⚡ Robot Kit
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: CATALOG PRESETS */}
                  {imageSourceTab === 'preset' && (
                    <div>
                      <select
                        className="admin-select"
                        value={formData.image}
                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                      >
                        {AVAILABLE_IMAGES.map(img => (
                          <option key={img} value={img}>{img}</option>
                        ))}
                      </select>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        Choose from high-definition robotics vector &amp; photo models.
                      </div>
                    </div>
                  )}

                  {imageError && (
                    <div style={{ marginTop: '8px', color: '#EF4444', fontSize: '0.78rem', fontWeight: '600' }}>
                      ⚠ {imageError}
                    </div>
                  )}
                </div>

                {/* LIVE PREVIEW BOX */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '130px',
                    height: '110px',
                    borderRadius: '12px',
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '6px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                  }}>
                    <ProductImage type={formData.image} />
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '600' }}>
                    Live Preview
                  </div>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Short Description</label>
              <textarea
                className="admin-form-textarea"
                rows="2"
                value={formData.shortDesc}
                onChange={e => setFormData({ ...formData, shortDesc: e.target.value })}
                placeholder="Brief technical summary..."
              />
            </div>

            {/* Tags */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Search Tags (Comma-separated)</label>
              <input
                type="text"
                className="admin-form-input"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g. Motor, 12V, Planetary, Robot Race"
              />
            </div>

            {/* Technical Specifications Editor */}
            <div className="admin-form-group admin-form-full">
              <label className="admin-form-label">Technical Specifications</label>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Spec Property (e.g. Stall Torque)"
                  value={specKey}
                  onChange={e => setSpecKey(e.target.value)}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="Value (e.g. 18.5 kg.cm)"
                  value={specVal}
                  onChange={e => setSpecVal(e.target.value)}
                />
                <button
                  type="button"
                  className="admin-action-pill-btn primary"
                  style={{ borderRadius: '8px', whiteSpace: 'nowrap' }}
                  onClick={handleAddSpec}
                >
                  + Add Spec
                </button>
              </div>

              {Object.keys(formData.specs || {}).length > 0 && (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  background: 'var(--bg-input)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  {Object.entries(formData.specs).map(([k, v]) => (
                    <div
                      key={k}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-color)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <strong style={{ color: 'var(--primary)' }}>{k}:</strong>
                      <span>{v}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSpec(k)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          padding: '0 2px'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkbox Flags */}
            <div className="admin-form-group admin-form-full" style={{ display: 'flex', gap: '24px', marginTop: '6px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                />
                Featured on Homepage
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formData.isDeal}
                  onChange={e => setFormData({ ...formData, isDeal: e.target.checked })}
                />
                Lightning Deal
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })}
                />
                Best Seller
              </label>
            </div>
          </div>

          <div className="admin-modal-footer" style={{ marginTop: '20px' }}>
            <button type="button" className="admin-modal-btn cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="admin-modal-btn submit">
              {product ? 'Save Changes' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
