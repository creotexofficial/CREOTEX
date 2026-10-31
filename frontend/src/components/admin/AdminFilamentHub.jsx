import React, { useState, useRef, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { DEFAULT_FILAMENT_COLORS, FILAMENT_SUBCATEGORIES } from '../../data/productsData';
import {
  CircleDot,
  Layers,
  Plus,
  Edit3,
  Trash2,
  UploadCloud,
  Search,
  Check,
  X,
  Save,
  ExternalLink,
  RotateCcw,
  Flame,
  ArrowLeft,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Palette,
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';

// 11 Photorealistic 3D Spool Presets
const PRESET_SPOOL_IMAGES = [
  { label: "Sunflower Yellow", url: "/filaments/spool_yellow_dragon.jpg", hex: "#EAB308" },
  { label: "Pitch Black", url: "/filaments/spool_black_dragon.jpg", hex: "#111111" },
  { label: "Bone White", url: "/filaments/spool_white_dragon.jpg", hex: "#F5F0EB" },
  { label: "Crimson Red", url: "/filaments/spool_abs_red.jpg", hex: "#DC2626" },
  { label: "Signal Orange", url: "/filaments/spool_petg_orange.jpg", hex: "#EA580C" },
  { label: "Royal Blue", url: "/filaments/spool_pla_blue.jpg", hex: "#1D4ED8" },
  { label: "Army Olive", url: "/filaments/spool_pla_matte.jpg", hex: "#4D7C0F" },
  { label: "Carbon Fiber Gray", url: "/filaments/spool_petg_cf.jpg", hex: "#374151" },
  { label: "Pacific Teal", url: "/filaments/spool_asa_teal.jpg", hex: "#06B6D4" },
  { label: "Transparent PETG", url: "/filaments/spool_petg_trans.jpg", hex: "#CBD5E1" },
  { label: "Refill Roll Pack", url: "/filaments/refill_spool_pack.jpg", hex: "#94A3B8" }
];

/**
 * Photorealistic Vector 3D Spool Renderer Fallback
 * Guaranteed to NEVER show a broken image icon. Renders rich metallic lighting & color winding.
 */
const DynamicSpoolVisual = ({ colorHex = '#0066CC', colorName = 'Filament', customImage = '' }) => {
  const [imgFailed, setImgFailed] = useState(false);

  // If custom image exists and hasn't failed, show it
  if (customImage && !imgFailed) {
    return (
      <img
        src={customImage}
        alt={colorName}
        onError={() => setImgFailed(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block'
        }}
      />
    );
  }

  // Otherwise render our gorgeous 3D vector spool
  return (
    <svg
      viewBox="0 0 320 320"
      style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.18))' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`spoolFlangeGrad-${colorHex}`} cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="65%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <linearGradient id={`filamentWinding-${colorHex}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="25%" stopColor={colorHex} />
          <stop offset="70%" stopColor={colorHex} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="hubGloss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      {/* Outer Flange Rim */}
      <circle cx="160" cy="160" r="142" fill={`url(#spoolFlangeGrad-${colorHex})`} stroke="#475569" strokeWidth="4" />
      <circle cx="160" cy="160" r="136" fill="none" stroke="#64748B" strokeWidth="1.5" strokeOpacity="0.5" />

      {/* Filament Coils Area */}
      <circle cx="160" cy="160" r="126" fill={`url(#filamentWinding-${colorHex})`} stroke="#0F172A" strokeWidth="2" />

      {/* Realistic Filament Texture Ridges */}
      <circle cx="160" cy="160" r="118" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.25" />
      <circle cx="160" cy="160" r="108" fill="none" stroke="#000000" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="160" cy="160" r="98" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.2" />
      <circle cx="160" cy="160" r="88" fill="none" stroke="#000000" strokeWidth="1" strokeOpacity="0.3" />
      <circle cx="160" cy="160" r="78" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.25" />

      {/* Inner Transparent Spool Hub */}
      <circle cx="160" cy="160" r="68" fill="#1E293B" stroke="#64748B" strokeWidth="3" />
      <circle cx="160" cy="160" r="68" fill="url(#hubGloss)" />

      {/* Hub Cutout Holes (Bambu / Prusa style lightweight spool) */}
      {[0, 60, 120, 180, 240, 300].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const hx = 160 + 44 * Math.cos(rad);
        const hy = 160 + 44 * Math.sin(rad);
        return <circle key={angle} cx={hx} cy={hy} r="10" fill="#0B0F19" stroke="#334155" strokeWidth="1.5" />;
      })}

      {/* Center Mounting Spindle Bore */}
      <circle cx="160" cy="160" r="24" fill="#0B0F19" stroke="#94A3B8" strokeWidth="3" />

      {/* Creotex Branding Spec Label */}
      <rect x="110" y="248" width="100" height="20" rx="10" fill="rgba(15, 23, 42, 0.85)" stroke="#64748B" strokeWidth="1" />
      <text x="160" y="262" fill="#38BDF8" fontFamily="'JetBrains Mono', monospace" fontSize="9" fontWeight="800" textAnchor="middle">
        1.75mm • 1KG
      </text>
    </svg>
  );
};

export const AdminFilamentHub = () => {
  const {
    products,
    filamentSubcategories,
    updateFilamentSubcategory,
    addFilamentSubcategory,
    toggleFilamentSubcategoryPublish,
    deleteFilamentSubcategory,
    resetFilamentSubcategoriesDefaults,
    navigateToFilaments,
    setAdminActiveTab,
    showToast
  } = useCart();

  // Mode: null = Subcategories Grid View, 'string' = Active Subcategory Key for Studio Editor
  const [activeSubKey, setActiveSubKey] = useState(null);

  // Filter tab on the overview list: 'all' | 'published' | 'draft' | 'pla' | 'petg' | 'engineering'
  const [overviewFilter, setOverviewFilter] = useState('all');

  // Subcategory Form State for Studio Editor
  const [subForm, setSubForm] = useState({
    id: '',
    name: '',
    displayName: '',
    subCategoryKey: '',
    badge: '',
    badgeColor: '#06B6D4',
    accentColor: '#06B6D4',
    subtitle: '',
    price: 899,
    originalPrice: 1399,
    stock: 150,
    desc: '',
    printTemp: '200°C - 230°C',
    bedTemp: '50°C - 65°C',
    speed: 'Up to 500 mm/s',
    strength: 'High Durability',
    published: true,
    image: '/filaments/spool_pla_blue.jpg',
    colors: []
  });

  // Create Subcategory Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    displayName: '',
    subCategoryKey: '',
    badge: 'New Material',
    badgeColor: '#0066CC',
    accentColor: '#0066CC',
    subtitle: 'Everyday precision 3D printing filament',
    price: 999,
    originalPrice: 1499,
    stock: 150,
    desc: 'High-performance 3D filament engineered for smooth extrusion, high tensile strength, and zero warping.',
    printTemp: '200°C - 230°C',
    bedTemp: '50°C - 60°C',
    speed: 'Up to 500 mm/s',
    strength: 'High Toughness',
    image: '/filaments/spool_pla_blue.jpg',
    published: true,
    colors: [
      { name: "Pitch Black", hex: "#111111", image: "/filaments/spool_black_dragon.jpg" },
      { name: "Bone White", hex: "#F5F0EB", image: "/filaments/spool_white_dragon.jpg" },
      { name: "Royal Blue", hex: "#1D4ED8", image: "/filaments/spool_pla_blue.jpg" },
      { name: "Crimson Red", hex: "#DC2626", image: "/filaments/spool_abs_red.jpg" },
      { name: "Signal Orange", hex: "#EA580C", image: "/filaments/spool_petg_orange.jpg" },
      { name: "Sunflower Yellow", hex: "#EAB308", image: "/filaments/spool_yellow_dragon.jpg" }
    ]
  });

  // Selected Color variant currently being previewed / edited in the right-side Live Studio
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  // Left column color search & filter state
  const [colorSearchQuery, setColorSearchQuery] = useState('');
  const [colorFilterTab, setColorFilterTab] = useState('all'); // 'all' | 'with-photo' | 'auto-tint'

  // Inline "Add New Color" drawer state
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#EAB308');
  const [newColorImage, setNewColorImage] = useState('');
  const [colorFileName, setColorFileName] = useState('');

  // Hidden file inputs for direct device upload
  const studioFileInputRef = useRef(null);
  const newColorFileInputRef = useRef(null);
  const createSubFileInputRef = useRef(null);

  // Open the studio editor for a subcategory
  const handleOpenEditor = (sub) => {
    const matchedProduct = (products || []).find(
      p => p.subCategory && p.subCategory.toLowerCase() === sub.subCategoryKey.toLowerCase()
    );

    const colorsToLoad = (matchedProduct?.colors && matchedProduct.colors.length > 0)
      ? matchedProduct.colors
      : (sub.colors && sub.colors.length > 0)
      ? sub.colors
      : DEFAULT_FILAMENT_COLORS;

    setActiveSubKey(sub.subCategoryKey);
    setSubForm({
      id: sub.id,
      name: sub.name || sub.subCategoryKey,
      displayName: sub.displayName || sub.name || sub.subCategoryKey,
      subCategoryKey: sub.subCategoryKey,
      badge: sub.badge || 'New Material',
      badgeColor: sub.badgeColor || '#06B6D4',
      accentColor: sub.accentColor || '#06B6D4',
      subtitle: sub.subtitle || sub.desc || '',
      price: matchedProduct?.price || sub.price || 899,
      originalPrice: matchedProduct?.originalPrice || sub.originalPrice || 1399,
      stock: matchedProduct?.stock || sub.stock || 150,
      desc: sub.desc || 'High-performance 3D filament engineered for smooth trouble-free extrusion.',
      printTemp: sub.printTemp || '200°C - 230°C',
      bedTemp: sub.bedTemp || '50°C - 65°C',
      speed: sub.speed || 'Up to 500 mm/s',
      strength: sub.strength || 'High Durability',
      published: sub.published !== false,
      image: sub.image || '/filaments/spool_pla_blue.jpg',
      colors: JSON.parse(JSON.stringify(colorsToLoad))
    });

    setSelectedColorIndex(0);
    setColorSearchQuery('');
    setColorFilterTab('all');
    setIsAddingColor(false);
    setNewColorName('');
    setNewColorHex('#EAB308');
    setNewColorImage('');
    setColorFileName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close editor and return to subcategories grid
  const handleBackToList = () => {
    setActiveSubKey(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Delete Subcategory with confirmation
  const handleDeleteSubcategory = (subKey, displayName, e) => {
    if (e) e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete subcategory "${displayName || subKey}" and remove its products from the store?`)) {
      deleteFilamentSubcategory(subKey);
      if (activeSubKey && activeSubKey.toLowerCase() === subKey.toLowerCase()) {
        setActiveSubKey(null);
      }
    }
  };

  // Handle Create Subcategory Form Submit
  const handleCreateSubcategorySubmit = (e) => {
    if (e) e.preventDefault();
    if (!createForm.displayName.trim()) {
      alert('Please enter subcategory display name (e.g. PLA Silk Gradient).');
      return;
    }

    const generatedKey = (createForm.subCategoryKey || createForm.displayName)
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '_')
      .replace(/[^A-Z0-9_]/g, '');

    const newSub = addFilamentSubcategory({
      ...createForm,
      displayName: createForm.displayName.trim(),
      name: createForm.displayName.trim(),
      subCategoryKey: generatedKey
    });

    setIsCreateModalOpen(false);
    // Reset create form to defaults
    setCreateForm({
      displayName: '',
      subCategoryKey: '',
      badge: 'New Material',
      badgeColor: '#0066CC',
      accentColor: '#0066CC',
      subtitle: 'Everyday precision 3D printing filament',
      price: 999,
      originalPrice: 1499,
      stock: 150,
      desc: 'High-performance 3D filament engineered for smooth extrusion, high tensile strength, and zero warping.',
      printTemp: '200°C - 230°C',
      bedTemp: '50°C - 60°C',
      speed: 'Up to 500 mm/s',
      strength: 'High Toughness',
      image: '/filaments/spool_pla_blue.jpg',
      published: true,
      colors: [
        { name: "Pitch Black", hex: "#111111", image: "/filaments/spool_black_dragon.jpg" },
        { name: "Bone White", hex: "#F5F0EB", image: "/filaments/spool_white_dragon.jpg" },
        { name: "Royal Blue", hex: "#1D4ED8", image: "/filaments/spool_pla_blue.jpg" },
        { name: "Crimson Red", hex: "#DC2626", image: "/filaments/spool_abs_red.jpg" },
        { name: "Signal Orange", hex: "#EA580C", image: "/filaments/spool_petg_orange.jpg" },
        { name: "Sunflower Yellow", hex: "#EAB308", image: "/filaments/spool_yellow_dragon.jpg" }
      ]
    });

    // Automatically open the studio editor for the new subcategory
    handleOpenEditor(newSub);
  };

  // Save all changes (updates CartContext and syncs product catalog)
  const handleSaveSubcategory = (e) => {
    if (e) e.preventDefault();
    if (!subForm.displayName.trim()) {
      alert('Please enter subcategory name.');
      return;
    }

    updateFilamentSubcategory(subForm.subCategoryKey, {
      id: subForm.id,
      displayName: subForm.displayName.trim(),
      name: subForm.name.trim() || subForm.subCategoryKey,
      subCategoryKey: subForm.subCategoryKey,
      badge: subForm.badge.trim(),
      badgeColor: subForm.badgeColor,
      accentColor: subForm.accentColor,
      subtitle: (subForm.subtitle || subForm.desc || '').trim(),
      price: parseFloat(subForm.price) || 899,
      originalPrice: parseFloat(subForm.originalPrice) || 1399,
      stock: parseInt(subForm.stock, 10) || 150,
      desc: subForm.desc,
      printTemp: subForm.printTemp,
      bedTemp: subForm.bedTemp,
      speed: subForm.speed,
      strength: subForm.strength,
      published: subForm.published,
      image: subForm.image,
      colors: subForm.colors
    });

    showToast(`"${subForm.displayName}" and ${subForm.colors.length} colors saved successfully!`, 'success');
  };

  // Active color currently selected in the Live Studio
  const activeColor = subForm.colors[selectedColorIndex] || subForm.colors[0] || {
    name: 'Pitch Black',
    hex: '#111111',
    image: '/filaments/spool_black_dragon.jpg'
  };

  // 1-Click attach a preset spool photo to the active color
  const handleSelectPresetForActiveColor = (presetUrl) => {
    setSubForm(prev => {
      const nextColors = [...prev.colors];
      if (nextColors[selectedColorIndex]) {
        nextColors[selectedColorIndex] = {
          ...nextColors[selectedColorIndex],
          image: presetUrl
        };
      }
      return { ...prev, colors: nextColors };
    });
    showToast(`Preset spool attached to ${activeColor.name}!`, 'info');
  };

  // 1-Click upload a custom photo for the active color
  const handleProcessStudioFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result;
      setSubForm(prev => {
        const nextColors = [...prev.colors];
        if (nextColors[selectedColorIndex]) {
          nextColors[selectedColorIndex] = {
            ...nextColors[selectedColorIndex],
            image: base64
          };
        }
        return { ...prev, colors: nextColors };
      });
      showToast(`Custom photo attached to ${activeColor.name}!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Remove photo from active color and revert to dynamic color tint
  const handleRemoveActiveColorPhoto = () => {
    setSubForm(prev => {
      const nextColors = [...prev.colors];
      if (nextColors[selectedColorIndex]) {
        nextColors[selectedColorIndex] = {
          ...nextColors[selectedColorIndex],
          image: ''
        };
      }
      return { ...prev, colors: nextColors };
    });
    showToast(`${activeColor.name} now uses dynamic color tint!`, 'info');
  };

  // Quick edit color name inline in table
  const handleColorNameChange = (newName, index) => {
    setSubForm(prev => {
      const next = [...prev.colors];
      next[index] = { ...next[index], name: newName };
      return { ...prev, colors: next };
    });
  };

  // Quick edit color hex inline in table
  const handleColorHexChange = (newHex, index) => {
    setSubForm(prev => {
      const next = [...prev.colors];
      next[index] = { ...next[index], hex: newHex };
      return { ...prev, colors: next };
    });
  };

  // Delete a color variant
  const handleDeleteColor = (index, e) => {
    if (e) e.stopPropagation();
    const colName = subForm.colors[index]?.name;
    if (window.confirm(`Delete color "${colName}"?`)) {
      setSubForm(prev => {
        const next = prev.colors.filter((_, i) => i !== index);
        return { ...prev, colors: next };
      });
      if (selectedColorIndex >= subForm.colors.length - 1) {
        setSelectedColorIndex(Math.max(0, subForm.colors.length - 2));
      }
    }
  };

  // Add new color to the subcategory
  const handleAddNewColor = () => {
    if (!newColorName.trim()) {
      alert('Please enter a color name (e.g. Metallic Gold, Lavender Purple).');
      return;
    }

    const newCol = {
      name: newColorName.trim(),
      hex: newColorHex,
      image: newColorImage.trim()
    };

    setSubForm(prev => ({
      ...prev,
      colors: [newCol, ...prev.colors]
    }));

    setNewColorName('');
    setNewColorHex('#EAB308');
    setNewColorImage('');
    setColorFileName('');
    setIsAddingColor(false);
    setSelectedColorIndex(0);
    showToast(`Color "${newCol.name}" added to top of list!`, 'success');
  };

  // Process file for Add New Color drawer
  const handleProcessNewColorFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    setColorFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewColorImage(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Filtered colors list for the left directory pane
  const filteredColors = useMemo(() => {
    return subForm.colors.map((col, originalIndex) => ({ ...col, originalIndex })).filter((col) => {
      // 1. Tab filter
      if (colorFilterTab === 'with-photo' && !col.image) return false;
      if (colorFilterTab === 'auto-tint' && col.image) return false;

      // 2. Search query filter
      if (colorSearchQuery.trim()) {
        const q = colorSearchQuery.toLowerCase().trim();
        const matchesName = col.name.toLowerCase().includes(q);
        const matchesHex = col.hex.toLowerCase().includes(q);
        return matchesName || matchesHex;
      }

      return true;
    });
  }, [subForm.colors, colorFilterTab, colorSearchQuery]);

  const withPhotosCount = subForm.colors.filter(c => c.image && c.image.length > 0).length;
  const autoTintCount = subForm.colors.length - withPhotosCount;

  // Calculate discount %
  const discountPercent = (subForm.originalPrice && subForm.price && subForm.originalPrice > subForm.price)
    ? Math.round(((subForm.originalPrice - subForm.price) / subForm.originalPrice) * 100)
    : 0;

  // =========================================================================
  // VIEW 2: HIGH-END 2-COLUMN STUDIO (FULL-WIDTH, NO WASTED SPACE, COMPACT)
  // =========================================================================
  if (activeSubKey) {
    return (
      <div className="admin-page-content" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', paddingBottom: '50px' }}>
        {/* Hidden File Input for 1-Click Studio Spool Upload */}
        <input
          type="file"
          ref={studioFileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleProcessStudioFile(file);
          }}
        />

        {/* 1. TOP NAVIGATION & ACTION BAR */}
        <div
          className="admin-card"
          style={{
            padding: '14px 20px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleBackToList}
              className="admin-action-pill-btn secondary"
              style={{ padding: '7px 14px', fontSize: '13px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} /> All Subcategories
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  background: `${subForm.badgeColor || '#0066CC'}20`,
                  color: subForm.badgeColor || '#0066CC',
                  border: `1px solid ${subForm.badgeColor || '#0066CC'}50`
                }}
              >
                {subForm.badge || 'Material'}
              </span>

              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>
                {subForm.displayName} <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '600' }}>({subForm.subCategoryKey})</span>
              </h2>

              {/* Live Publish Status Badge */}
              <button
                type="button"
                onClick={() => setSubForm(prev => ({ ...prev, published: !prev.published }))}
                style={{
                  background: subForm.published ? 'rgba(34, 197, 94, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                  color: subForm.published ? '#16A34A' : '#94A3B8',
                  border: `1.5px solid ${subForm.published ? 'rgba(34, 197, 94, 0.4)' : 'rgba(100, 116, 139, 0.3)'}`,
                  borderRadius: '20px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Click to toggle publish status on storefront"
              >
                {subForm.published ? (
                  <>
                    <CircleDot size={12} color="#16A34A" />
                    <span>Published (Live)</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={12} color="#94A3B8" />
                    <span>Draft (Hidden)</span>
                  </>
                )}
              </button>

              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>•</span>
              <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Check size={13} /> {subForm.colors.length} Colors Total
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>•</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ImageIcon size={13} /> {withPhotosCount} With Dedicated Photos
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleDeleteSubcategory(subForm.subCategoryKey, subForm.displayName)}
              className="admin-action-pill-btn secondary"
              style={{ padding: '8px 14px', fontSize: '12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Permanently remove this subcategory"
            >
              <Trash2 size={13} /> Delete Subcategory
            </button>

            <button
              type="button"
              onClick={() => navigateToFilaments(subForm.subCategoryKey)}
              className="admin-action-pill-btn secondary"
              style={{ padding: '8px 16px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={13} /> View on Store
            </button>

            <button
              type="button"
              onClick={handleSaveSubcategory}
              className="admin-action-pill-btn primary"
              style={{ padding: '8px 24px', fontSize: '13px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Save size={14} /> Save All Changes
            </button>
          </div>
        </div>

        {/* 2. STREAMLINED SUBCATEGORY SETTINGS BAR (COMPACT MULTI-FIELD GRID) */}
        <div
          className="admin-card"
          style={{
            padding: '16px 20px',
            marginBottom: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', alignItems: 'end' }}>
            {/* Display Name */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Display Name
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={subForm.displayName}
                onChange={e => setSubForm({ ...subForm, displayName: e.target.value })}
                placeholder="e.g. PLA+"
                style={{ fontSize: '13px', padding: '6px 10px', height: '36px' }}
              />
            </div>

            {/* Selling Price */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Selling Price (₹)
              </label>
              <input
                type="number"
                min="1"
                className="admin-form-input"
                value={subForm.price}
                onChange={e => setSubForm({ ...subForm, price: e.target.value })}
                style={{ fontSize: '13px', padding: '6px 10px', height: '36px', fontWeight: '700' }}
              />
            </div>

            {/* Original MRP */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Original MRP (₹)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="number"
                  min="1"
                  className="admin-form-input"
                  value={subForm.originalPrice}
                  onChange={e => setSubForm({ ...subForm, originalPrice: e.target.value })}
                  style={{ fontSize: '13px', padding: '6px 10px', height: '36px', flex: 1 }}
                />
                {discountPercent > 0 && (
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#16A34A', background: 'rgba(22, 163, 74, 0.12)', padding: '6px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Stock Count */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Stock Available (Spools)
              </label>
              <input
                type="number"
                min="0"
                className="admin-form-input"
                value={subForm.stock}
                onChange={e => setSubForm({ ...subForm, stock: e.target.value })}
                style={{ fontSize: '13px', padding: '6px 10px', height: '36px' }}
              />
            </div>

            {/* Accent Color Picker */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Accent Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input
                  type="color"
                  value={subForm.accentColor || '#0066CC'}
                  onChange={e => setSubForm({ ...subForm, accentColor: e.target.value, badgeColor: e.target.value })}
                  style={{ width: '36px', height: '36px', padding: '1px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                />
                <input
                  type="text"
                  className="admin-form-input"
                  value={subForm.accentColor}
                  onChange={e => setSubForm({ ...subForm, accentColor: e.target.value, badgeColor: e.target.value })}
                  style={{ fontSize: '12px', height: '36px', flex: 1, fontFamily: 'monospace' }}
                />
              </div>
            </div>

            {/* Badge Text */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Badge Text
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={subForm.badge}
                onChange={e => setSubForm({ ...subForm, badge: e.target.value })}
                placeholder="e.g. NEW REFILL OPTION"
                style={{ fontSize: '13px', padding: '6px 10px', height: '36px' }}
              />
            </div>

            {/* Print Temp */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Print Temp
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={subForm.printTemp}
                onChange={e => setSubForm({ ...subForm, printTemp: e.target.value })}
                placeholder="e.g. 200°C - 230°C"
                style={{ fontSize: '12px', padding: '6px 10px', height: '36px' }}
              />
            </div>

            {/* Print Speed */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Recommended Speed
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={subForm.speed}
                onChange={e => setSubForm({ ...subForm, speed: e.target.value })}
                placeholder="e.g. Up to 500 mm/s"
                style={{ fontSize: '12px', padding: '6px 10px', height: '36px' }}
              />
            </div>

            {/* Subtitle / Description */}
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Subtitle / Tagline
              </label>
              <input
                type="text"
                className="admin-form-input"
                value={subForm.subtitle || subForm.desc}
                onChange={e => setSubForm({ ...subForm, subtitle: e.target.value, desc: e.target.value })}
                placeholder="e.g. 37 colors · everyday printing"
                style={{ fontSize: '13px', padding: '6px 10px', height: '36px' }}
              />
            </div>
          </div>
        </div>

        {/* 3. STUDIO 2-COLUMN WORKSPACE: LEFT (DIRECTORY) + RIGHT (LIVE STUDIO) */}
        <div className="admin-filament-studio-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.4fr) minmax(380px, 1fr)', gap: '22px', alignItems: 'start' }}>
          
          {/* ================= LEFT COLUMN: COLOR DIRECTORY ================= */}
          <div>
            <div
              className="admin-card"
              style={{
                padding: '18px 20px',
                border: '1px solid var(--border-color)',
                borderRadius: '14px'
              }}
            >
              {/* Header & Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Palette size={18} style={{ color: '#0066CC' }} /> Color Palette Directory
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Click any color row to preview and manage its dedicated spool photo in the right studio.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingColor(!isAddingColor)}
                  className="admin-action-pill-btn primary"
                  style={{ fontSize: '12px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {isAddingColor ? <><X size={13} /> Close</> : <><Plus size={13} /> Add Color</>}
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '14px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                {/* Search input */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '180px' }}>
                  <Search size={14} color="var(--text-secondary)" />
                  <input
                    type="text"
                    placeholder="Filter colors by name or #hex..."
                    value={colorSearchQuery}
                    onChange={e => setColorSearchQuery(e.target.value)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--text-primary)',
                      fontSize: '12px',
                      width: '100%'
                    }}
                  />
                  {colorSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setColorSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setColorFilterTab('all')}
                    style={{
                      background: colorFilterTab === 'all' ? '#0066CC' : 'transparent',
                      color: colorFilterTab === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    All ({subForm.colors.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorFilterTab('with-photo')}
                    style={{
                      background: colorFilterTab === 'with-photo' ? '#0066CC' : 'transparent',
                      color: colorFilterTab === 'with-photo' ? '#FFFFFF' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <ImageIcon size={11} /> Photos ({withPhotosCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setColorFilterTab('auto-tint')}
                    style={{
                      background: colorFilterTab === 'auto-tint' ? '#0066CC' : 'transparent',
                      color: colorFilterTab === 'auto-tint' ? '#FFFFFF' : 'var(--text-secondary)',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Palette size={11} /> Auto-Tint ({autoTintCount})
                  </button>
                </div>
              </div>

              {/* ADD COLOR INLINE DRAWER (WHEN EXPANDED) */}
              {isAddingColor && (
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1.5px solid #0066CC',
                    borderRadius: '10px',
                    padding: '14px',
                    marginBottom: '16px',
                    boxShadow: '0 4px 14px rgba(0, 102, 204, 0.1)'
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Plus size={14} color="#0066CC" /> Add a New Color Variant
                  </div>

                  <input
                    type="file"
                    ref={newColorFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleProcessNewColorFile(file);
                    }}
                  />

                  <div style={{ display: 'grid', gridTemplateColumns: '170px 130px 1fr auto', gap: '10px', alignItems: 'end' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                        Color Name
                      </label>
                      <input
                        type="text"
                        className="admin-form-input"
                        placeholder="e.g. Pitch Black"
                        value={newColorName}
                        onChange={e => setNewColorName(e.target.value)}
                        style={{ fontSize: '12px', height: '34px' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                        Hex Color
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <input
                          type="color"
                          value={newColorHex}
                          onChange={e => setNewColorHex(e.target.value)}
                          style={{ width: '32px', height: '32px', padding: '1px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                        />
                        <input
                          type="text"
                          className="admin-form-input"
                          value={newColorHex}
                          onChange={e => setNewColorHex(e.target.value)}
                          style={{ fontSize: '11px', height: '32px', padding: '4px 6px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '3px' }}>
                        Optional Spool Photo
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => newColorFileInputRef.current?.click()}
                          className="admin-action-pill-btn secondary"
                          style={{ fontSize: '11px', padding: '5px 10px', height: '32px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <UploadCloud size={12} /> {colorFileName ? 'Uploaded' : 'Upload File'}
                        </button>
                        <select
                          className="admin-select"
                          style={{ fontSize: '11px', padding: '4px 6px', height: '32px', flex: 1 }}
                          value={newColorImage}
                          onChange={e => {
                            setNewColorImage(e.target.value);
                            setColorFileName('');
                          }}
                        >
                          <option value="">-- Or Pick Spool Preset --</option>
                          {PRESET_SPOOL_IMAGES.map(pr => (
                            <option key={pr.url} value={pr.url}>{pr.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddNewColor}
                      className="admin-action-pill-btn primary"
                      style={{ padding: '7px 16px', fontSize: '12px', height: '32px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                </div>
              )}

              {/* COMPACT BOUNDED SCROLLABLE COLOR TABLE */}
              <div
                style={{
                  maxHeight: '580px',
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 5 }}>
                      <th style={{ padding: '8px 10px', textAlign: 'center', width: '42px' }}>Swatch</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', minWidth: '150px' }}>Color Name</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', width: '115px' }}>Hex Code</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', width: '150px' }}>Spool Asset</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', width: '100px' }}>Studio</th>
                      <th style={{ padding: '8px 10px', textAlign: 'center', width: '45px' }}>Del</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredColors.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          No colors match your search filter.
                        </td>
                      </tr>
                    ) : (
                      filteredColors.map((col) => {
                        const isSelected = selectedColorIndex === col.originalIndex;

                        return (
                          <tr
                            key={col.name + col.originalIndex}
                            onClick={() => setSelectedColorIndex(col.originalIndex)}
                            style={{
                              borderBottom: '1px solid var(--border-color)',
                              background: isSelected ? 'rgba(0, 102, 204, 0.08)' : 'transparent',
                              borderLeft: isSelected ? '3px solid #0066CC' : '3px solid transparent',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            {/* Swatch Circle */}
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <span
                                style={{
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  backgroundColor: col.hex,
                                  border: '1.5px solid rgba(0,0,0,0.2)',
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                              />
                            </td>

                            {/* Color Name (Editable inline) */}
                            <td style={{ padding: '8px 10px' }} onClick={e => e.stopPropagation()}>
                              <input
                                type="text"
                                className="admin-form-input"
                                value={col.name}
                                onChange={e => handleColorNameChange(e.target.value, col.originalIndex)}
                                style={{
                                  fontWeight: '700',
                                  padding: '5px 8px',
                                  fontSize: '12px',
                                  height: '30px',
                                  background: isSelected ? 'var(--bg-card)' : 'transparent'
                                }}
                              />
                            </td>

                            {/* Hex Code (Color square + text) */}
                            <td style={{ padding: '8px 10px' }} onClick={e => e.stopPropagation()}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <input
                                  type="color"
                                  value={col.hex || '#111111'}
                                  onChange={e => handleColorHexChange(e.target.value, col.originalIndex)}
                                  style={{ width: '26px', height: '26px', padding: '1px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', background: 'transparent' }}
                                />
                                <input
                                  type="text"
                                  className="admin-form-input"
                                  value={col.hex}
                                  onChange={e => handleColorHexChange(e.target.value, col.originalIndex)}
                                  style={{ width: '68px', padding: '3px 6px', fontSize: '11px', height: '26px', fontFamily: 'monospace' }}
                                />
                              </div>
                            </td>

                            {/* Spool Asset Status Tag */}
                            <td style={{ padding: '8px 10px' }}>
                              {col.image ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <img
                                    src={col.image}
                                    alt={col.name}
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    style={{
                                      width: '26px',
                                      height: '26px',
                                      objectFit: 'contain',
                                      borderRadius: '4px',
                                      background: '#FFFFFF',
                                      border: '1px solid var(--border-color)'
                                    }}
                                  />
                                  <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <ImageIcon size={11} /> Photo
                                  </span>
                                </div>
                              ) : (
                                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <Palette size={11} /> Auto-Tint
                                </span>
                              )}
                            </td>

                            {/* Select / Active studio button */}
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedColorIndex(col.originalIndex);
                                }}
                                style={{
                                  background: isSelected ? '#0066CC' : 'var(--bg-surface)',
                                  color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                                  border: `1px solid ${isSelected ? '#0066CC' : 'var(--border-color)'}`,
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {isSelected ? (
                                  <>
                                    <Check size={11} /> Active
                                  </>
                                ) : 'Select'}
                              </button>
                            </td>

                            {/* Delete Button */}
                            <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteColor(col.originalIndex, e)}
                                title="Delete color"
                                style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '13px', cursor: 'pointer', padding: '2px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>Showing {filteredColors.length} of {subForm.colors.length} colors</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Info size={12} /> Click any row to preview and edit photo in Studio
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: LIVE SPOOL STUDIO (STICKY) ================= */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <div
              className="admin-card"
              style={{
                padding: '20px',
                borderRadius: '14px',
                border: '1.5px solid #0066CC',
                boxShadow: '0 8px 30px rgba(0, 102, 204, 0.08)'
              }}
            >
              {/* Studio Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#0066CC" /> Live Spool Studio
                </div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#0066CC', background: 'rgba(0, 102, 204, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  Selected: #{selectedColorIndex + 1}
                </span>
              </div>

              {/* 1. Photorealistic 3D Spool Display Port */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1 / 1',
                  maxHeight: '300px',
                  background: 'linear-gradient(145deg, #0F172A, #1E293B)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '16px',
                  marginBottom: '14px'
                }}
              >
                {/* Spool Badges */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
                  <span style={{ background: 'rgba(0, 0, 0, 0.75)', color: '#38BDF8', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', border: '1px solid rgba(56, 189, 248, 0.3)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CircleDot size={10} /> 1.75mm PRECISION
                  </span>
                </div>

                <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10, background: '#FFFFFF', padding: '3px 9px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: activeColor.hex, border: '1px solid rgba(0,0,0,0.3)' }} />
                  <span style={{ fontSize: '11px', fontWeight: '800', color: '#0F172A' }}>
                    {activeColor.name}
                  </span>
                </div>

                {/* 3D Spool Visualizer Component */}
                <DynamicSpoolVisual
                  key={activeColor.name + activeColor.hex + (activeColor.image || 'none')}
                  colorHex={activeColor.hex}
                  colorName={activeColor.name}
                  customImage={activeColor.image}
                />
              </div>

              {/* 2. Subcategory & Price Preview Info */}
              <div style={{ marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--text-primary)' }}>
                      {subForm.displayName} Filament
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Color: <strong style={{ color: 'var(--text-primary)' }}>{activeColor.name}</strong> ({activeColor.hex})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#16A34A' }}>
                      ₹{subForm.price}
                    </span>
                    <span style={{ fontSize: '12px', textDecoration: 'line-through', color: 'var(--text-secondary)', marginLeft: '6px' }}>
                      ₹{subForm.originalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. Quick-Palette Swatches Strip */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Click dot to test color in spool:
                </div>
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxHeight: '58px', overflowY: 'auto' }}>
                  {subForm.colors.map((col, idx) => (
                    <button
                      key={col.name + idx}
                      type="button"
                      onClick={() => setSelectedColorIndex(idx)}
                      title={`${col.name} (${col.hex})`}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: col.hex,
                        border: selectedColorIndex === idx ? '2px solid #0066CC' : '1px solid rgba(0,0,0,0.2)',
                        transform: selectedColorIndex === idx ? 'scale(1.3)' : 'scale(1)',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* 4. Dedicated Photo Manager for the Active Color */}
              <div
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px'
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <ImageIcon size={14} color="#0066CC" /> Photo for: {activeColor.name}
                  </span>
                  {activeColor.image ? (
                    <button
                      type="button"
                      onClick={handleRemoveActiveColorPhoto}
                      style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '11px', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >
                      Revert to Tint
                    </button>
                  ) : (
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Using smart color tint</span>
                  )}
                </div>

                {/* Upload Button */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button
                    type="button"
                    onClick={() => studioFileInputRef.current?.click()}
                    className="admin-action-pill-btn secondary"
                    style={{ flex: 1, fontSize: '11px', padding: '7px', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <UploadCloud size={13} /> Upload Custom Photo
                  </button>
                </div>

                {/* Visual Preset Spools Grid (1-Click Attach) */}
                <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Or 1-click attach realistic spool preset:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '6px',
                    maxHeight: '125px',
                    overflowY: 'auto'
                  }}
                >
                  {PRESET_SPOOL_IMAGES.map((pr) => (
                    <div
                      key={pr.url}
                      onClick={() => handleSelectPresetForActiveColor(pr.url)}
                      title={`Attach ${pr.label}`}
                      style={{
                        padding: '4px',
                        border: `1.5px solid ${activeColor.image === pr.url ? '#0066CC' : 'var(--border-color)'}`,
                        borderRadius: '6px',
                        background: activeColor.image === pr.url ? 'rgba(0, 102, 204, 0.12)' : 'var(--bg-card)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <img
                        src={pr.url}
                        alt={pr.label}
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        style={{ width: '100%', height: '28px', objectFit: 'contain' }}
                      />
                      <div style={{ fontSize: '9px', fontWeight: '700', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pr.label.replace(' Spool', '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Sticky Save Button */}
              <button
                type="button"
                onClick={handleSaveSubcategory}
                className="admin-action-pill-btn primary"
                style={{ width: '100%', padding: '11px', fontSize: '13px', fontWeight: '800', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Save size={14} /> Save All Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 1: ALL 17 FILAMENT SUBCATEGORIES (FULL-WIDTH GRID WITH FILTER TABS)
  // =========================================================================
  const subcategoriesList = (filamentSubcategories && filamentSubcategories.length > 0)
    ? filamentSubcategories
    : FILAMENT_SUBCATEGORIES;

  const publishedCount = subcategoriesList.filter(s => s.published !== false).length;
  const draftCount = subcategoriesList.length - publishedCount;

  // Filter subcategories by series & status
  const filteredSubcategories = subcategoriesList.filter((sub) => {
    if (overviewFilter === 'all') return true;
    if (overviewFilter === 'published') return sub.published !== false;
    if (overviewFilter === 'draft') return sub.published === false;
    const key = sub.subCategoryKey.toLowerCase();
    if (overviewFilter === 'pla') return key.includes('pla') || key.includes('silk') || key.includes('stone') || key.includes('wood') || key.includes('glow') || key.includes('starlight');
    if (overviewFilter === 'petg') return key.includes('petg');
    if (overviewFilter === 'engineering') return key.includes('abs') || key.includes('asa') || key.includes('cf');
    return true;
  });

  return (
    <div className="admin-page-content" style={{ width: '100%', maxWidth: '1600px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Top Banner Card */}
      <div className="admin-card" style={{ marginBottom: '20px', padding: '22px 26px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(0, 102, 204, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0066CC'
              }}>
                <CircleDot size={24} />
              </div>
              <div>
                <h2 className="admin-card-title" style={{ margin: 0, fontSize: '22px' }}>
                  3D Filament Subcategories &amp; Color Hub
                </h2>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Manage filament subcategories, add new material grades, publish/unpublish from storefront, customize pricing, and configure color palettes.
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="admin-action-pill-btn"
              onClick={() => setAdminActiveTab('deals-filaments')}
              style={{
                background: 'rgba(234, 88, 12, 0.15)',
                border: '1.5px solid #EA580C',
                color: '#FF7A29',
                fontWeight: '700',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Manage Homepage Flash Deals & Filament Spool Zone"
            >
              <Flame size={14} />
              <span>Manage Spool Zone &amp; Deals</span>
            </button>

            <button
              type="button"
              className="admin-action-pill-btn primary"
              onClick={() => setIsCreateModalOpen(true)}
              style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800', background: 'linear-gradient(135deg, #0066CC, #004C99)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Add New Subcategory</span>
            </button>

            <button
              type="button"
              className="admin-action-pill-btn secondary"
              onClick={resetFilamentSubcategoriesDefaults}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Reset all subcategories and default colors to system factory defaults"
            >
              <RotateCcw size={13} /> Reset Defaults
            </button>

            <button
              type="button"
              className="admin-action-pill-btn secondary"
              onClick={() => navigateToFilaments('all')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ExternalLink size={13} /> View Storefront Hub
            </button>
          </div>
        </div>

        {/* Filter Series & Status Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '18px', borderTop: '1px solid var(--border-color)', paddingTop: '14px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: `All Materials (${subcategoriesList.length})` },
            { id: 'published', label: `Published (${publishedCount})` },
            { id: 'draft', label: `Draft / Hidden (${draftCount})` },
            { id: 'pla', label: 'PLA & Specialty Silk' },
            { id: 'petg', label: 'PETG Series' },
            { id: 'engineering', label: 'Engineering ABS & ASA' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOverviewFilter(tab.id)}
              style={{
                background: overviewFilter === tab.id ? '#0066CC' : 'var(--bg-surface)',
                color: overviewFilter === tab.id ? '#FFFFFF' : 'var(--text-primary)',
                border: `1px solid ${overviewFilter === tab.id ? '#0066CC' : 'var(--border-color)'}`,
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategories Responsive Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {filteredSubcategories.map((sub) => {
          const matchedProduct = (products || []).find(
            p => p.subCategory && p.subCategory.toLowerCase() === sub.subCategoryKey.toLowerCase()
          );

          const colorsList = (matchedProduct?.colors && matchedProduct.colors.length > 0)
            ? matchedProduct.colors
            : (sub.colors && sub.colors.length > 0)
            ? sub.colors
            : DEFAULT_FILAMENT_COLORS;

          const colorsWithPhotos = colorsList.filter(c => c.image && c.image.length > 0).length;
          const displayPrice = matchedProduct?.price || sub.price || 899;
          const originalPrice = matchedProduct?.originalPrice || sub.originalPrice || 1399;
          const discountPct = originalPrice > displayPrice
            ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
            : 0;

          const isPublished = sub.published !== false;

          return (
            <div
              key={sub.id || sub.subCategoryKey}
              style={{
                background: 'var(--bg-card)',
                border: `1.5px solid ${isPublished ? 'var(--border-color)' : 'rgba(100, 116, 139, 0.4)'}`,
                borderTop: `4px solid ${sub.accentColor || '#0066CC'}`,
                borderRadius: '14px',
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                opacity: isPublished ? 1 : 0.8,
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                {/* Header: Badge & Publish Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: `${sub.badgeColor || '#0066CC'}1A`,
                      color: sub.badgeColor || '#0066CC',
                      border: `1px solid ${sub.badgeColor || '#0066CC'}4D`
                    }}
                  >
                    {sub.badge || 'Material'}
                  </span>

                  {/* Direct 1-Click Publish Toggle Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFilamentSubcategoryPublish(sub.subCategoryKey);
                    }}
                    style={{
                      background: isPublished ? 'rgba(34, 197, 94, 0.12)' : 'rgba(100, 116, 139, 0.15)',
                      color: isPublished ? '#16A34A' : '#94A3B8',
                      border: `1.5px solid ${isPublished ? 'rgba(34, 197, 94, 0.35)' : 'rgba(100, 116, 139, 0.3)'}`,
                      borderRadius: '20px',
                      padding: '3px 10px',
                      fontSize: '11px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title={isPublished ? "Click to unpublish/hide from customer storefront" : "Click to publish and show on customer storefront"}
                  >
                    {isPublished ? (
                      <>
                        <CircleDot size={11} color="#16A34A" />
                        <span>Published</span>
                      </>
                    ) : (
                      <>
                        <EyeOff size={11} color="#94A3B8" />
                        <span>Draft (Hidden)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Subcategory Title */}
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    {sub.displayName}
                  </h3>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)' }}>
                    {sub.subCategoryKey}
                  </span>
                </div>

                {/* Subtitle / Tagline */}
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', minHeight: '18px' }}>
                  {sub.subtitle || sub.desc}
                </div>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--text-primary)' }}>
                    ₹{displayPrice}
                  </span>
                  <span style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                    ₹{originalPrice}
                  </span>
                  {discountPct > 0 && (
                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#16A34A', background: 'rgba(22, 163, 74, 0.1)', padding: '1px 6px', borderRadius: '4px' }}>
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                {/* Colors Count & Swatches row */}
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      <Palette size={12} color="#0066CC" /> {colorsList.length} Colors
                    </span>
                    <span style={{ color: '#16A34A', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={12} /> {colorsWithPhotos} with photos
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxHeight: '42px', overflow: 'hidden' }}>
                    {colorsList.slice(0, 14).map((col, idx) => (
                      <span
                        key={col.name + idx}
                        title={col.name}
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: col.hex,
                          border: '1px solid rgba(0,0,0,0.15)',
                          display: 'inline-block'
                        }}
                      />
                    ))}
                    {colorsList.length > 14 && (
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700', alignSelf: 'center' }}>
                        +{colorsList.length - 14}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: Edit Colors & Delete */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleOpenEditor(sub)}
                  className="admin-action-pill-btn primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '9px', fontSize: '13px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit3 size={13} /> Edit Colors &amp; Settings
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDeleteSubcategory(sub.subCategoryKey, sub.displayName, e)}
                  className="admin-action-pill-btn secondary"
                  style={{ padding: '9px 12px', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                  title={`Delete subcategory "${sub.displayName}"`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* CREATE NEW FILAMENT SUBCATEGORY MODAL                                     */}
      {/* ========================================================================= */}
      {isCreateModalOpen && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div
            className="admin-card"
            style={{
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg-card)',
              border: '1.5px solid #0066CC',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#0066CC" /> Create New 3D Filament Subcategory
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Add a new material formulation to your storefront catalog with custom pricing and technical profiles.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubcategorySubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                {/* Display Name */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Material Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. PLA Silk Gradient, PVA Water-Soluble"
                    value={createForm.displayName}
                    onChange={e => {
                      const name = e.target.value;
                      const autoKey = name.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
                      setCreateForm({
                        ...createForm,
                        displayName: name,
                        subCategoryKey: autoKey
                      });
                    }}
                    style={{ fontSize: '13px', height: '36px' }}
                  />
                </div>

                {/* Subcategory Key */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    System Identifier Key *
                  </label>
                  <input
                    type="text"
                    required
                    className="admin-form-input"
                    placeholder="e.g. PLA_SILK_GRADIENT"
                    value={createForm.subCategoryKey}
                    onChange={e => setCreateForm({ ...createForm, subCategoryKey: e.target.value.toUpperCase().replace(/\s+/g, '_') })}
                    style={{ fontSize: '13px', height: '36px', fontFamily: 'monospace' }}
                  />
                </div>

                {/* Selling Price */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="admin-form-input"
                    value={createForm.price}
                    onChange={e => setCreateForm({ ...createForm, price: e.target.value })}
                    style={{ fontSize: '13px', height: '36px', fontWeight: '700' }}
                  />
                </div>

                {/* Original MRP */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="admin-form-input"
                    value={createForm.originalPrice}
                    onChange={e => setCreateForm({ ...createForm, originalPrice: e.target.value })}
                    style={{ fontSize: '13px', height: '36px' }}
                  />
                </div>

                {/* Accent Color */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Theme Accent Color
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <input
                      type="color"
                      value={createForm.accentColor}
                      onChange={e => setCreateForm({ ...createForm, accentColor: e.target.value, badgeColor: e.target.value })}
                      style={{ width: '36px', height: '36px', padding: '1px', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                    />
                    <input
                      type="text"
                      className="admin-form-input"
                      value={createForm.accentColor}
                      onChange={e => setCreateForm({ ...createForm, accentColor: e.target.value, badgeColor: e.target.value })}
                      style={{ fontSize: '12px', height: '36px', flex: 1, fontFamily: 'monospace' }}
                    />
                  </div>
                </div>

                {/* Badge Text */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Badge Tag
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Ultra Gloss, Heat Resistant"
                    value={createForm.badge}
                    onChange={e => setCreateForm({ ...createForm, badge: e.target.value })}
                    style={{ fontSize: '13px', height: '36px' }}
                  />
                </div>

                {/* Print Temp & Bed Temp */}
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Nozzle Print Temp
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 200°C - 230°C"
                    value={createForm.printTemp}
                    onChange={e => setCreateForm({ ...createForm, printTemp: e.target.value })}
                    style={{ fontSize: '12px', height: '36px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Bed Temperature
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. 50°C - 60°C"
                    value={createForm.bedTemp}
                    onChange={e => setCreateForm({ ...createForm, bedTemp: e.target.value })}
                    style={{ fontSize: '12px', height: '36px' }}
                  />
                </div>

                {/* Spool Preset Image */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Default Spool Showcase Photo
                  </label>
                  <select
                    className="admin-select"
                    value={createForm.image}
                    onChange={e => setCreateForm({ ...createForm, image: e.target.value })}
                    style={{ width: '100%', fontSize: '12px', height: '36px' }}
                  >
                    {PRESET_SPOOL_IMAGES.map(pr => (
                      <option key={pr.url} value={pr.url}>{pr.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subtitle / Description */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Subtitle / Short Tagline
                  </label>
                  <input
                    type="text"
                    className="admin-form-input"
                    placeholder="e.g. Silky finish · zero warping · high speed"
                    value={createForm.subtitle}
                    onChange={e => setCreateForm({ ...createForm, subtitle: e.target.value, desc: e.target.value })}
                    style={{ fontSize: '13px', height: '36px' }}
                  />
                </div>

                {/* Published Toggle Checkbox */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-surface)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input
                    type="checkbox"
                    id="create-sub-published"
                    checked={createForm.published}
                    onChange={e => setCreateForm({ ...createForm, published: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="create-sub-published" style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', cursor: 'pointer' }}>
                    Publish immediately to Storefront (Visible to Customers)
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="admin-action-pill-btn secondary"
                  style={{ padding: '9px 18px', fontSize: '13px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-action-pill-btn primary"
                  style={{ padding: '9px 24px', fontSize: '13px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={14} /> Create &amp; Open Color Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
