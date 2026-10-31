import React, { useState, useEffect, useRef } from 'react';
import {
  RotateCcw,
  X,
  UploadCloud,
  Globe,
  Boxes,
  Clipboard,
  Zap,
  AlertCircle,
  Palette,
  Edit3,
  Plus,
  Check,
  Trash2,
  Save,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { CATEGORIES_METADATA, DEFAULT_FILAMENT_COLORS } from '../../data/productsData';
import { ProductImage } from '../../data/productImages';

const AVAILABLE_IMAGES = [
  "filament-hyper-pla",
  "filament-petg-cf",
  "filament-tpu",
  "filament-abs-red",
  "filament-pla-matte",
  "filament-silk-gold",
  "filament-glow-green",
  "print-dragon-crystal",
  "print-headphone-stand",
  "print-cable-spine",
  "print-hex-planter",
  "print-planetary-gear",
  "print-phone-dock",
  "print-camera-slider",
  "print-pegboard-hooks",
  "print-caliper-holster",
  "print-moon-lamp",
  "print-spool-winder",
  "print-spiral-vase"
];

const PRESET_SPOOL_IMAGES = [
  { label: "Yellow Dragon Spool", url: "/filaments/spool_yellow_dragon.jpg" },
  { label: "Black Dragon Spool", url: "/filaments/spool_black_dragon.jpg" },
  { label: "White Dragon Spool", url: "/filaments/spool_white_dragon.jpg" },
  { label: "Crimson Red Spool", url: "/filaments/spool_abs_red.jpg" },
  { label: "Signal Orange Spool", url: "/filaments/spool_petg_orange.jpg" },
  { label: "Royal Blue Spool", url: "/filaments/spool_pla_blue.jpg" },
  { label: "Army Olive Matte Spool", url: "/filaments/spool_pla_matte.jpg" },
  { label: "Carbon Fiber Gray Spool", url: "/filaments/spool_petg_cf.jpg" },
  { label: "Pacific Teal Spool", url: "/filaments/spool_asa_teal.jpg" },
  { label: "Transparent PETG Spool", url: "/filaments/spool_petg_trans.jpg" },
  { label: "Refill Spool Pack", url: "/filaments/refill_spool_pack.jpg" }
];

const PRODUCT_DRAFT_KEY = 'creotex_admin_last_product_form';

const INITIAL_DEFAULT_PRODUCT = {
  name: '',
  sku: '',
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
};

export const AdminProductModal = ({ product, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'motors',
    categoryLabel: 'Gearbox & Motors',
    subCategory: '',
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

  // Color Variants & Dedicated Images State
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#DC2626');
  const [newColorImage, setNewColorImage] = useState('');
  const [colorImageTab, setColorImageTab] = useState('url'); // 'url' | 'file'
  const [colorFileName, setColorFileName] = useState('');
  const [colorEditingIndex, setColorEditingIndex] = useState(null);
  const colorFileInputRef = useRef(null);

  // Initialize or restore last saved changes as defaults
  useEffect(() => {
    if (product) {
      const img = product.image || 'motor-planetary-pg36';
      setFormData({
        ...product,
        subCategory: product.subCategory || '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : (product.tags || ''),
        specs: product.specs || {},
        colors: product.colors || (product.category === 'filaments' ? DEFAULT_FILAMENT_COLORS : []),
        spoolTypes: product.spoolTypes || ['Filament with Spool', 'Refill'],
        weights: product.weights || ['1 kg', '3 kg']
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
      // Add Product: Load last changes as default if available
      let lastSaved = null;
      try {
        const raw = localStorage.getItem(PRODUCT_DRAFT_KEY);
        if (raw) lastSaved = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to load product draft:', err);
      }

      if (lastSaved) {
        setFormData({
          ...INITIAL_DEFAULT_PRODUCT,
          ...lastSaved,
          sku: lastSaved.sku || `CTX-${Math.floor(1000 + Math.random() * 9000)}`
        });

        const savedImg = lastSaved.image || '';
        if (savedImg.startsWith('data:')) {
          setImageSourceTab('file');
          setUploadedFileName(lastSaved.uploadedFileName || 'Custom Uploaded File');
          setUploadedFileSize(lastSaved.uploadedFileSize || '');
        } else if (savedImg.startsWith('http://') || savedImg.startsWith('https://')) {
          setImageSourceTab('url');
          setLiveUrlInput(savedImg);
        } else if (savedImg) {
          setImageSourceTab('preset');
        } else {
          setImageSourceTab(lastSaved.imageSourceTab || 'file');
        }
      } else {
        setFormData({
          ...INITIAL_DEFAULT_PRODUCT,
          sku: `CTX-${Math.floor(1000 + Math.random() * 9000)}`
        });
        setImageSourceTab('file');
        setLiveUrlInput('');
        setUploadedFileName('');
        setUploadedFileSize('');
      }
      setImageError('');
    }
  }, [product, isOpen]);

  // Persist any changes made in Add Product mode so they serve as the new defaults
  useEffect(() => {
    if (!product && isOpen) {
      try {
        localStorage.setItem(PRODUCT_DRAFT_KEY, JSON.stringify({
          ...formData,
          imageSourceTab,
          uploadedFileName,
          uploadedFileSize
        }));
      } catch (err) {
        // quota limit fallback if base64 file is large
      }
    }
  }, [formData, imageSourceTab, uploadedFileName, uploadedFileSize, product, isOpen]);

  // Reset form to completely fresh defaults
  const handleResetForm = () => {
    if (window.confirm('Reset this form to blank defaults?')) {
      try {
        localStorage.removeItem(PRODUCT_DRAFT_KEY);
      } catch {}
      setFormData({
        ...INITIAL_DEFAULT_PRODUCT,
        sku: `CTX-${Math.floor(1000 + Math.random() * 9000)}`
      });
      setImageSourceTab('file');
      setLiveUrlInput('');
      setUploadedFileName('');
      setUploadedFileSize('');
      setImageError('');
    }
  };


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

  // Color Variant Handlers
  const handleProcessColorFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please choose a valid image file (PNG, JPG, WEBP, SVG).');
      return;
    }
    setColorFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewColorImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddOrUpdateColor = () => {
    if (!newColorName.trim()) {
      alert('Please enter a color name (e.g. Fire Red, Army Olive, Royal Blue).');
      return;
    }

    const colorItem = {
      name: newColorName.trim(),
      hex: newColorHex,
      image: newColorImage.trim()
    };

    let updatedColors = [...(formData.colors || [])];
    if (colorEditingIndex !== null) {
      updatedColors[colorEditingIndex] = colorItem;
    } else {
      updatedColors.push(colorItem);
    }

    setFormData(prev => ({ ...prev, colors: updatedColors }));
    setNewColorName('');
    setNewColorHex('#DC2626');
    setNewColorImage('');
    setColorFileName('');
    setColorEditingIndex(null);
  };

  const handleEditColor = (index) => {
    const target = (formData.colors || [])[index];
    if (!target) return;
    setNewColorName(target.name);
    setNewColorHex(target.hex || '#000000');
    setNewColorImage(target.image || '');
    setColorFileName(target.image?.startsWith('data:') ? 'Uploaded File' : '');
    setColorImageTab(target.image?.startsWith('data:') ? 'file' : 'url');
    setColorEditingIndex(index);
  };

  const handleDeleteColor = (index) => {
    const updated = (formData.colors || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, colors: updated }));
    if (colorEditingIndex === index) {
      setColorEditingIndex(null);
      setNewColorName('');
      setNewColorImage('');
      setColorFileName('');
    }
  };

  const handleLoadDefaultColors = () => {
    setFormData(prev => ({ ...prev, colors: DEFAULT_FILAMENT_COLORS }));
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

    if (!product) {
      // Save last used parameters as default for next product addition
      try {
        localStorage.setItem(PRODUCT_DRAFT_KEY, JSON.stringify({
          ...formData,
          sku: `CTX-${Math.floor(1000 + Math.random() * 9000)}`,
          imageSourceTab,
          uploadedFileName,
          uploadedFileSize
        }));
      } catch (err) {}
    }

    onSave(payload);
    onClose();
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-box" style={{ maxWidth: '680px', width: '92%' }}>
        <div className="admin-modal-header">
          <h3 className="admin-modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            {product ? `Edit Product: ${product.name}` : 'Add New Product to Inventory'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {!product && (
              <button
                type="button"
                onClick={handleResetForm}
                style={{
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '5px 10px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
                title="Clear draft and reset to default blank values"
              >
                <RotateCcw size={12} />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              className="btn-table-icon"
              onClick={onClose}
              title="Click to go Back / Close form"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <X size={14} />
              <span>Close</span>
            </button>
          </div>
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

            {/* SubCategory */}
            <div className="admin-form-group">
              <label className="admin-form-label">
                Subcategory {formData.category === 'filaments' && <span style={{ color: '#0066CC', fontWeight: '800' }}>(Filament Formula *)</span>}
              </label>
              {formData.category === 'filaments' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="admin-select"
                    value={['PLA', 'PLA Plus', 'PLA Matte', 'PETG', 'PETG-CF', 'PETG Transparent', 'ABS', 'ASA', 'TPU', 'Upgrades'].includes(formData.subCategory) ? formData.subCategory : 'custom'}
                    onChange={e => {
                      if (e.target.value !== 'custom') {
                        setFormData({ ...formData, subCategory: e.target.value });
                      }
                    }}
                    style={{ flex: 1 }}
                  >
                    <option value="PLA">PLA (Hyper PLA)</option>
                    <option value="PLA Plus">PLA Plus (PLA+)</option>
                    <option value="PLA Matte">PLA Matte</option>
                    <option value="PETG">PETG (High Strength)</option>
                    <option value="PETG-CF">PETG-CF (Carbon Fiber)</option>
                    <option value="PETG Transparent">PETG Transparent</option>
                    <option value="ABS">ABS</option>
                    <option value="ASA">ASA</option>
                    <option value="TPU">TPU (Flexible)</option>
                    <option value="Upgrades">Upgrades</option>
                    <option value="custom">Other / Custom</option>
                  </select>
                  {!['PLA', 'PLA Plus', 'PLA Matte', 'PETG', 'PETG-CF', 'PETG Transparent', 'ABS', 'ASA', 'TPU', 'Upgrades'].includes(formData.subCategory) && (
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="Custom SubCategory Key"
                      value={formData.subCategory}
                      onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                      style={{ flex: 1 }}
                    />
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  className="admin-form-input"
                  placeholder="e.g. Planetary, Standoffs, M3"
                  value={formData.subCategory || ''}
                  onChange={e => setFormData({ ...formData, subCategory: e.target.value })}
                />
              )}
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
                      gap: '6px'
                    }}
                  >
                    <UploadCloud size={14} />
                    <span>Upload from File</span>
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
                      gap: '6px'
                    }}
                  >
                    <Globe size={14} />
                    <span>Live Image URL</span>
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
                      gap: '6px'
                    }}
                  >
                    <Boxes size={14} />
                    <span>Catalog Presets</span>
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
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={13} />
                              <span>{uploadedFileName}</span>
                            </span>
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
                          style={{ padding: '0 14px', height: '42px', display: 'flex', alignItems: 'center', gap: '6px' }}
                          title="Paste from clipboard"
                        >
                          <Clipboard size={14} />
                          <span>Paste</span>
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Zap size={11} /> DC Motor
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Zap size={11} /> Circuit Board
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Zap size={11} /> 3D Filament
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
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Zap size={11} /> Robot Kit
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
                    <div style={{ marginTop: '8px', color: '#EF4444', fontSize: '0.78rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <AlertCircle size={14} />
                      <span>{imageError}</span>
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

            {/* Search Tags */}
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

            {/* 🎨 Color Variants & Dedicated Images Manager */}
            <div
              className="admin-form-group admin-form-full"
              style={{
                background: 'var(--bg-input)',
                border: '1.5px solid var(--border-color)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Palette size={20} style={{ color: 'var(--primary)' }} />
                  <div>
                    <label className="admin-form-label" style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>
                      Color Variants &amp; Dedicated Images Manager
                    </label>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {(formData.colors || []).length} colors currently configured for this product
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLoadDefaultColors}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--primary)',
                    borderRadius: '6px',
                    padding: '5px 12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Zap size={12} />
                  <span>Load Standard 32+ Colors</span>
                </button>
              </div>

              <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Configure individual color swatches (e.g. Red, Blue, Army Green) and assign dedicated spool images. When a customer clicks that color in the store, the main product image instantly switches to that color's image!
              </p>

              {/* Color Form Input Card */}
              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '14px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {colorEditingIndex !== null ? (
                    <>
                      <Edit3 size={13} style={{ color: 'var(--primary)' }} />
                      <span>Editing Color #{colorEditingIndex + 1}</span>
                    </>
                  ) : (
                    <>
                      <Plus size={13} style={{ color: 'var(--primary)' }} />
                      <span>Add Color Variant</span>
                    </>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  {/* Color Name */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Color Name (e.g. Fire Red)
                    </label>
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. Fire Red, Army Green"
                      value={newColorName}
                      onChange={e => setNewColorName(e.target.value)}
                    />
                  </div>

                  {/* Color Hex Picker */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      Color Hex Code
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input
                        type="color"
                        value={newColorHex}
                        onChange={e => setNewColorHex(e.target.value)}
                        style={{
                          width: '40px',
                          height: '38px',
                          padding: '2px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          background: 'transparent'
                        }}
                      />
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="#DC2626"
                        value={newColorHex}
                        onChange={e => setNewColorHex(e.target.value)}
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Color Image Uploader (URL or File Upload) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', margin: 0 }}>
                      Specific Image for this Color (Optional)
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setColorImageTab('url')}
                        style={{
                          background: colorImageTab === 'url' ? 'var(--primary)' : 'transparent',
                          color: colorImageTab === 'url' ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Globe size={11} />
                        <span>Image URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setColorImageTab('preset')}
                        style={{
                          background: colorImageTab === 'preset' ? 'var(--primary)' : 'transparent',
                          color: colorImageTab === 'preset' ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Zap size={11} />
                        <span>Presets</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setColorImageTab('file')}
                        style={{
                          background: colorImageTab === 'file' ? 'var(--primary)' : 'transparent',
                          color: colorImageTab === 'file' ? '#FFFFFF' : 'var(--text-secondary)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 8px',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <UploadCloud size={11} />
                        <span>Device Upload</span>
                      </button>
                    </div>
                  </div>

                  {colorImageTab === 'url' && (
                    <input
                      type="text"
                      className="admin-form-input"
                      placeholder="e.g. /filaments/spool_abs_red.jpg or https://..."
                      value={newColorImage}
                      onChange={e => setNewColorImage(e.target.value)}
                    />
                  )}

                  {colorImageTab === 'preset' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                      {PRESET_SPOOL_IMAGES.map(pr => (
                        <div
                          key={pr.url}
                          onClick={() => setNewColorImage(pr.url)}
                          style={{
                            border: `1.5px solid ${newColorImage === pr.url ? '#0066CC' : 'var(--border-color)'}`,
                            padding: '4px 6px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            background: newColorImage === pr.url ? 'rgba(0,102,204,0.1)' : 'var(--bg-card)'
                          }}
                        >
                          <img src={pr.url} alt={pr.label} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pr.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {colorImageTab === 'file' && (
                    <div>
                      <input
                        type="file"
                        ref={colorFileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handleProcessColorFile(file);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => colorFileInputRef.current?.click()}
                        style={{
                          width: '100%',
                          background: 'var(--bg-input)',
                          border: '1.5px dashed var(--border-color)',
                          borderRadius: '8px',
                          padding: '10px',
                          fontSize: '12px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <UploadCloud size={16} />
                        <span>{colorFileName || 'Click to choose image file from your computer'}</span>
                      </button>
                    </div>
                  )}

                  {/* Mini Preview of configured color */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          backgroundColor: newColorHex,
                          border: '2px solid rgba(0,0,0,0.2)',
                          display: 'inline-block'
                        }}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {newColorName || 'Color Preview'}
                      </span>
                      {newColorImage && (
                        <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Check size={12} />
                          <span>Image attached</span>
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {colorEditingIndex !== null && (
                        <button
                          type="button"
                          onClick={() => {
                            setColorEditingIndex(null);
                            setNewColorName('');
                            setNewColorImage('');
                            setColorFileName('');
                          }}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--border-color)',
                            color: 'var(--text-secondary)',
                            borderRadius: '6px',
                            padding: '6px 12px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleAddOrUpdateColor}
                        className="admin-action-pill-btn primary"
                        style={{ borderRadius: '6px', padding: '6px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      >
                        {colorEditingIndex !== null ? (
                          <>
                            <Check size={13} />
                            <span>Save Color</span>
                          </>
                        ) : (
                          <>
                            <Plus size={13} />
                            <span>Add Color</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Existing Colors List */}
              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '8px',
                  padding: '2px'
                }}
              >
                {(formData.colors || []).map((col, idx) => (
                  <div
                    key={col.name + idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: col.hex,
                          border: '1.5px solid rgba(0,0,0,0.2)',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ overflow: 'hidden' }}>
                        <div style={{ fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {col.name}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {col.image ? 'Custom Image' : 'Auto Filter'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => handleEditColor(idx)}
                        title="Edit color"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0066CC',
                          cursor: 'pointer',
                          padding: '3px 4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Edit3 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteColor(idx)}
                        title="Delete color"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#EF4444',
                          cursor: 'pointer',
                          padding: '3px 4px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                  style={{ borderRadius: '8px', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  onClick={handleAddSpec}
                >
                  <Plus size={14} />
                  <span>Add Spec</span>
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
                          padding: '0 2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={12} />
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

          <div className="admin-modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-modal-btn cancel"
              onClick={onClose}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="admin-modal-btn submit"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {product ? (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              ) : (
                <>
                  <Plus size={15} />
                  <span>Publish Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
