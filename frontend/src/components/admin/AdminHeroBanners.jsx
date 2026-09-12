import React, { useState, useRef } from 'react';
import { useCart } from '../../context/CartContext';

const COLOR_PRESETS = [
  { name: 'Orange', hex: '#EA580C' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Sky Blue', hex: '#0EA5E9' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Purple', hex: '#8B5CF6' }
];

export const AdminHeroBanners = () => {
  const {
    heroSlides,
    heroSideBanners,
    heroSettings,
    products,
    navbarCategories,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    toggleHeroSlideActive,
    reorderHeroSlides,
    addHeroSideBanner,
    updateHeroSideBanner,
    deleteHeroSideBanner,
    toggleHeroSideBannerActive,
    reorderHeroSideBanners,
    updateHeroSettings,
    resetHeroDefaults,
    navigateToStorefront,
    showToast
  } = useCart();

  const [activeTab, setActiveTab] = useState('slides'); // 'slides' | 'side-banners'

  // Image Upload State (URL vs File)
  const fileInputRef = useRef(null);
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' | 'url'
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFileSize, setUploadedFileSize] = useState('');

  // Slide Modal State
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState(null);
  const [slideForm, setSlideForm] = useState({
    id: '',
    badge: 'Next-Gen Rapid Prototyping',
    badgeColor: '#EA580C',
    title: 'Hyper-Speed PLA &',
    titleHighlight: 'Carbon Fiber PETG',
    description: 'Print up to 600mm/s without clogs. Rigid lightweight robot parts and volcano nozzles.',
    primaryBtnText: 'Shop 3D Filaments',
    primaryBtnAction: 'category',
    primaryBtnTarget: 'filaments',
    secondaryBtnText: 'Slicing Guides',
    secondaryBtnAction: 'link',
    secondaryBtnTarget: '#datasheets-hub',
    imageType: 'filament',
    imageUrl: '',
    order: 1,
    active: true
  });

  // Side Banner Modal State
  const [isSideModalOpen, setIsSideModalOpen] = useState(false);
  const [editingSideId, setEditingSideId] = useState(null);
  const [sideForm, setSideForm] = useState({
    id: '',
    badge: '🔩 Workshop Essential',
    badgeColor: '#EA580C',
    title: 'M2–M5 Fastener Kits',
    description: '304 Stainless Steel Allen bolts, knurled brass standoffs & anti-vibration nyloc nuts.',
    btnText: 'Shop Fasteners →',
    btnAction: 'category',
    btnTarget: 'fasteners',
    accentClass: 'card-accent-1',
    order: 1,
    active: true
  });

  const isHeroPublished = heroSettings?.enabled !== false;
  const slidesList = [...(heroSlides || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  const sideBannersList = [...(heroSideBanners || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Master Publish & Unpublish Handlers
  const handlePublishHero = () => {
    updateHeroSettings({ ...heroSettings, enabled: true });
    showToast('🚀 Hero Section is now PUBLISHED & Live on Home Page!', 'success');
  };

  const handleUnpublishHero = () => {
    updateHeroSettings({ ...heroSettings, enabled: false });
    showToast('🔒 Hero Section is now UNPUBLISHED (Hidden from Home Page).', 'info');
  };

  // File Upload Handler (FileReader -> Base64 Data URL)
  const handleSlideFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP, SVG, GIF)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file too large! Maximum allowed size is 5MB', 'error');
      return;
    }

    const sizeKB = (file.size / 1024).toFixed(1);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${sizeKB} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target.result;
      setSlideForm(prev => ({
        ...prev,
        imageType: 'custom',
        imageUrl: base64Url
      }));
      showToast(`Image "${file.name}" loaded successfully!`, 'success');
    };
    reader.onerror = () => {
      showToast('Failed to read image file. Please try another image.', 'error');
    };
    reader.readAsDataURL(file);
  };

  // Open Add Slide Modal
  const handleOpenAddSlide = () => {
    setActiveTab('slides');
    setEditingSlideId(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    setImageUploadMode('file');
    setSlideForm({
      id: '',
      badge: 'Championship Robotics 2026',
      badgeColor: '#EA580C',
      title: 'Dominate Every Arena with',
      titleHighlight: 'Creotex Pro Kits',
      description: 'High-torque planetary motors, sticky silicone race wheels, and sub-millimeter PID line follower robots.',
      primaryBtnText: 'Explore Store Catalog →',
      primaryBtnAction: 'catalog',
      primaryBtnTarget: 'all',
      secondaryBtnText: '🛠️ Build Custom Bot',
      secondaryBtnAction: 'link',
      secondaryBtnTarget: '#robot-builder',
      imageType: 'robot',
      imageUrl: '',
      order: slidesList.length + 1,
      active: true
    });
    setIsSlideModalOpen(true);
  };

  // Open Edit Slide Modal
  const handleOpenEditSlide = (slide) => {
    setEditingSlideId(slide.id);
    setUploadedFileName('');
    setUploadedFileSize('');
    if (slide.imageUrl && slide.imageUrl.startsWith('http')) {
      setImageUploadMode('url');
    } else {
      setImageUploadMode('file');
    }
    setSlideForm({
      id: slide.id,
      badge: slide.badge || '',
      badgeColor: slide.badgeColor || '#EA580C',
      title: slide.title || '',
      titleHighlight: slide.titleHighlight || '',
      description: slide.description || '',
      primaryBtnText: slide.primaryBtnText || '',
      primaryBtnAction: slide.primaryBtnAction || 'catalog',
      primaryBtnTarget: slide.primaryBtnTarget || 'all',
      secondaryBtnText: slide.secondaryBtnText || '',
      secondaryBtnAction: slide.secondaryBtnAction || 'link',
      secondaryBtnTarget: slide.secondaryBtnTarget || '#robot-builder',
      imageType: slide.imageType || 'robot',
      imageUrl: slide.imageUrl || '',
      order: slide.order || 1,
      active: slide.active !== false
    });
    setIsSlideModalOpen(true);
  };

  // Save Slide (Add or Update)
  const handleSaveSlide = (e) => {
    e.preventDefault();
    if (!slideForm.title || !slideForm.title.trim()) {
      showToast('Please enter slide title', 'error');
      return;
    }
    if (editingSlideId) {
      updateHeroSlide(editingSlideId, slideForm);
    } else {
      addHeroSlide(slideForm);
    }
    setIsSlideModalOpen(false);
  };

  const handleDeleteSlide = (slide) => {
    if (window.confirm(`Delete slide "${slide.titleHighlight || slide.title}"?`)) {
      deleteHeroSlide(slide.id);
    }
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slidesList.length) return;
    const reordered = [...slidesList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderHeroSlides(reordered);
  };

  // Open Add Side Banner Modal
  const handleOpenAddSideBanner = () => {
    setActiveTab('side-banners');
    setEditingSideId(null);
    setSideForm({
      id: '',
      badge: '⚙️ Heavy Duty Power',
      badgeColor: '#F59E0B',
      title: 'Planetary & Steppers',
      description: '12V PG36 high-torque all-metal motors, NEMA 17 steppers & Cytron drivers.',
      btnText: 'Shop Motors & Drivers →',
      btnAction: 'category',
      btnTarget: 'motors',
      accentClass: 'card-accent-2',
      order: sideBannersList.length + 1,
      active: true
    });
    setIsSideModalOpen(true);
  };

  // Open Edit Side Banner Modal
  const handleOpenEditSideBanner = (banner) => {
    setEditingSideId(banner.id);
    setSideForm({
      id: banner.id,
      badge: banner.badge || '',
      badgeColor: banner.badgeColor || '#EA580C',
      title: banner.title || '',
      description: banner.description || '',
      btnText: banner.btnText || '',
      btnAction: banner.btnAction || 'category',
      btnTarget: banner.btnTarget || 'fasteners',
      accentClass: banner.accentClass || 'card-accent-1',
      order: banner.order || 1,
      active: banner.active !== false
    });
    setIsSideModalOpen(true);
  };

  // Save Side Banner (Add or Update)
  const handleSaveSideBanner = (e) => {
    e.preventDefault();
    if (!sideForm.title || !sideForm.title.trim()) {
      showToast('Please enter title', 'error');
      return;
    }
    if (editingSideId) {
      updateHeroSideBanner(editingSideId, sideForm);
    } else {
      addHeroSideBanner(sideForm);
    }
    setIsSideModalOpen(false);
  };

  const handleDeleteSideBanner = (banner) => {
    if (window.confirm(`Delete side card "${banner.title}"?`)) {
      deleteHeroSideBanner(banner.id);
    }
  };

  const handleMoveSideBanner = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= sideBannersList.length) return;
    const reordered = [...sideBannersList];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    reorderHeroSideBanners(reordered);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 1. MASTER STATUS & PUBLISH CONTROLS */}
      <div
        style={{
          background: isHeroPublished
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 78, 59, 0.2) 100%)'
            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(127, 29, 29, 0.2) 100%)',
          border: `1.5px solid ${isHeroPublished ? '#10B981' : '#EF4444'}`,
          borderRadius: '14px',
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontSize: '26px' }}>{isHeroPublished ? '🟢' : '🔴'}</span>
          <div>
            <strong style={{ fontSize: '16px', color: 'var(--text-primary)' }}>
              {isHeroPublished
                ? 'HERO SECTION IS PUBLISHED & LIVE ON HOME PAGE'
                : 'HERO SECTION IS CURRENTLY HIDDEN (UNPUBLISHED)'}
            </strong>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
              {isHeroPublished
                ? `Slides: ${slidesList.filter(s => s.active).length} Active | Side Cards: ${sideBannersList.filter(b => b.active).length} Active`
                : 'Section is hidden from home page. Shoppers see category strip & catalog first.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handlePublishHero}
            style={{
              background: '#10B981',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: isHeroPublished ? '0 0 12px rgba(16, 185, 129, 0.4)' : 'none'
            }}
          >
            🚀 Publish to Home
          </button>

          <button
            type="button"
            onClick={handleUnpublishHero}
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#EF4444',
              border: '1.5px solid #EF4444',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🚫 Unpublish from Home
          </button>

          <button
            type="button"
            onClick={navigateToStorefront}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            👁️ View Store
          </button>
        </div>
      </div>

      {/* 2. TOP ACTION BAR: TABS & ACTION BUTTONS */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px'
        }}
      >
        {/* Simple Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setActiveTab('slides')}
            style={{
              background: activeTab === 'slides' ? '#EA580C' : 'transparent',
              color: activeTab === 'slides' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '7px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🖼️ Hero Slides ({slidesList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('side-banners')}
            style={{
              background: activeTab === 'side-banners' ? '#EA580C' : 'transparent',
              color: activeTab === 'side-banners' ? '#FFFFFF' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '7px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            🎯 Side Promo Cards ({sideBannersList.length})
          </button>
        </div>

        {/* ALWAYS-VISIBLE ACTION BUTTONS (Add Slide & Add Side Card) */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleOpenAddSlide}
            style={{
              background: '#EA580C',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(234, 88, 12, 0.3)'
            }}
          >
            ➕ Add Hero Slide
          </button>

          <button
            type="button"
            onClick={handleOpenAddSideBanner}
            style={{
              background: '#F59E0B',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 18px',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
            }}
          >
            ➕ Add Side Card
          </button>

          {/* Autoplay Toggle */}
          <button
            type="button"
            onClick={() => updateHeroSettings({ ...heroSettings, autoplay: !heroSettings?.autoplay })}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Toggle Slide Auto Rotation"
          >
            {heroSettings?.autoplay !== false ? '🔄 Autoplay: ON' : '⏸️ Autoplay: OFF'}
          </button>

          <button
            type="button"
            onClick={resetHeroDefaults}
            style={{
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
            title="Reset to factory demo content"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* 3. TAB 1: HERO SLIDES LIST */}
      {activeTab === 'slides' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slidesList.map((slide, index) => {
            const isPublished = slide.active !== false;
            const badgeColor = slide.badgeColor || '#EA580C';

            return (
              <div
                key={slide.id || index}
                style={{
                  background: 'var(--bg-card)',
                  border: `1.5px solid ${isPublished ? 'var(--border-color)' : 'rgba(239, 68, 68, 0.3)'}`,
                  borderLeft: `5px solid ${isPublished ? badgeColor : '#64748B'}`,
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              >
                {/* Left: Order + Details */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 500px' }}>
                  {/* Order Arrows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, -1)}
                      disabled={index === 0}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1,
                        fontSize: '10px'
                      }}
                    >
                      ▲
                    </button>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-secondary)' }}>
                      #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(index, 1)}
                      disabled={index === slidesList.length - 1}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        cursor: index === slidesList.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === slidesList.length - 1 ? 0.3 : 1,
                        fontSize: '10px'
                      }}
                    >
                      ▼
                    </button>
                  </div>

                  {/* Content Preview */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      {slide.badge && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            color: badgeColor,
                            background: `${badgeColor}18`,
                            border: `1px solid ${badgeColor}`,
                            padding: '2px 8px',
                            borderRadius: '12px'
                          }}
                        >
                          {slide.badge}
                        </span>
                      )}

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                          color: isPublished ? '#10B981' : '#64748B'
                        }}
                      >
                        {isPublished ? '● Published' : '○ Hidden'}
                      </span>

                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        Graphic: <strong>{slide.imageUrl ? 'Custom Image' : slide.imageType || 'Robot'}</strong>
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {slide.title} <span style={{ color: badgeColor }}>{slide.titleHighlight}</span>
                    </h4>

                    <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: 1.4 }}>
                      {slide.description}
                    </p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {slide.primaryBtnText && (
                        <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          🔘 <strong>{slide.primaryBtnText}</strong> → {slide.primaryBtnAction}: {slide.primaryBtnTarget}
                        </span>
                      )}
                      {slide.secondaryBtnText && (
                        <span style={{ background: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                          🔘 {slide.secondaryBtnText} → {slide.secondaryBtnTarget}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: High-Contrast Color Action Buttons */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Publish/Hide Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleHeroSlideActive(slide.id)}
                    style={{
                      background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.15)',
                      color: isPublished ? '#10B981' : '#64748B',
                      border: `1.5px solid ${isPublished ? '#10B981' : '#64748B'}`,
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {isPublished ? '✓ Active' : '⊘ Hidden'}
                  </button>

                  {/* Edit Button: Sky Blue */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditSlide(slide)}
                    style={{
                      background: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button: Red */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide)}
                    style={{
                      background: '#EF4444',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. TAB 2: SIDE FEATURE PROMO CARDS */}
      {activeTab === 'side-banners' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {sideBannersList.map((banner, index) => {
            const isPublished = banner.active !== false;
            const accentClass = banner.accentClass || (index % 2 === 0 ? 'card-accent-1' : 'card-accent-2');

            return (
              <div
                key={banner.id || index}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderLeft: `5px solid ${accentClass === 'card-accent-1' ? '#EA580C' : '#F59E0B'}`,
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                  opacity: isPublished ? 1 : 0.65
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#EA580C', textTransform: 'uppercase' }}>
                      {banner.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: isPublished ? 'rgba(16, 185, 129, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                        color: isPublished ? '#10B981' : '#64748B'
                      }}
                    >
                      {isPublished ? '● Published' : '○ Hidden'}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {banner.title}
                  </h3>

                  <p style={{ margin: '0 0 14px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {banner.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ color: '#EA580C', fontWeight: '700' }}>
                      🔘 {banner.btnText}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
                      Target: <strong>{banner.btnTarget}</strong>
                    </span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveSideBanner(index, -1)}
                      disabled={index === 0}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        opacity: index === 0 ? 0.3 : 1
                      }}
                    >
                      ◀
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSideBanner(index, 1)}
                      disabled={index === sideBannersList.length - 1}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        borderRadius: '4px',
                        padding: '3px 8px',
                        fontSize: '11px',
                        cursor: index === sideBannersList.length - 1 ? 'not-allowed' : 'pointer',
                        opacity: index === sideBannersList.length - 1 ? 0.3 : 1
                      }}
                    >
                      ▶
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => toggleHeroSideBannerActive(banner.id)}
                      style={{
                        background: isPublished ? 'rgba(16, 185, 129, 0.12)' : 'rgba(100, 116, 139, 0.15)',
                        color: isPublished ? '#10B981' : '#64748B',
                        border: `1.5px solid ${isPublished ? '#10B981' : '#64748B'}`,
                        borderRadius: '6px',
                        padding: '5px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {isPublished ? '✓ Active' : '⊘ Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditSideBanner(banner)}
                      style={{
                        background: '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSideBanner(banner)}
                      style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '5px 8px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. NATIVE ADMIN MODAL: ADD / EDIT HERO SLIDE */}
      {isSlideModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsSlideModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '620px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingSlideId ? '✏️ Edit Hero Slide' : '➕ Add New Hero Slide'}
              </h3>
              <button
                type="button"
                className="btn-table-icon"
                onClick={() => setIsSlideModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSlide}>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Title & Highlight */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Main Title *</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={slideForm.title}
                      onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                      placeholder="e.g. Hyper-Speed PLA &"
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Highlighted Text</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={slideForm.titleHighlight}
                      onChange={(e) => setSlideForm({ ...slideForm, titleHighlight: e.target.value })}
                      placeholder="e.g. Carbon Fiber PETG"
                      style={{ color: slideForm.badgeColor, fontWeight: '700' }}
                    />
                  </div>
                </div>

                {/* Badge Tag & Color */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="admin-form-label" style={{ margin: 0 }}>Badge Tag Text</label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      {COLOR_PRESETS.map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setSlideForm({ ...slideForm, badgeColor: c.hex })}
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: c.hex,
                            border: slideForm.badgeColor === c.hex ? '2px solid white' : 'none',
                            cursor: 'pointer',
                            boxShadow: slideForm.badgeColor === c.hex ? '0 0 6px rgba(0,0,0,0.6)' : 'none'
                          }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={slideForm.badge}
                    onChange={(e) => setSlideForm({ ...slideForm, badge: e.target.value })}
                    placeholder="e.g. Next-Gen Rapid Prototyping"
                  />
                </div>

                {/* Description */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-form-textarea"
                    rows="2"
                    value={slideForm.description}
                    onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                    placeholder="Print up to 600mm/s without clogs..."
                  />
                </div>

                {/* Primary Button & Product Link */}
                <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <label className="admin-form-label" style={{ color: '#EA580C', fontWeight: '800', marginBottom: '8px' }}>
                    🔘 Primary Button &amp; Target Destination
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <input
                        type="text"
                        className="admin-form-input"
                        value={slideForm.primaryBtnText}
                        onChange={(e) => setSlideForm({ ...slideForm, primaryBtnText: e.target.value })}
                        placeholder="Button Text (e.g. Shop Filaments)"
                      />
                    </div>
                    <div>
                      <select
                        className="admin-form-select"
                        value={slideForm.primaryBtnAction}
                        onChange={(e) => setSlideForm({ ...slideForm, primaryBtnAction: e.target.value })}
                      >
                        <option value="category">Category Filter</option>
                        <option value="product">Specific Product (Open Quick View)</option>
                        <option value="catalog">All Catalog</option>
                        <option value="link">Custom URL</option>
                      </select>
                    </div>
                  </div>

                  {/* Target Product or Category Selector */}
                  <div style={{ marginTop: '10px' }}>
                    {slideForm.primaryBtnAction === 'product' ? (
                      <select
                        className="admin-form-select"
                        value={slideForm.primaryBtnTarget}
                        onChange={(e) => setSlideForm({ ...slideForm, primaryBtnTarget: e.target.value })}
                      >
                        <option value="">-- Choose Product to Open --</option>
                        {(products || []).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name} (₹{p.price})
                          </option>
                        ))}
                      </select>
                    ) : slideForm.primaryBtnAction === 'category' ? (
                      <select
                        className="admin-form-select"
                        value={slideForm.primaryBtnTarget}
                        onChange={(e) => setSlideForm({ ...slideForm, primaryBtnTarget: e.target.value })}
                      >
                        {(navbarCategories || []).map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        className="admin-form-input"
                        value={slideForm.primaryBtnTarget}
                        onChange={(e) => setSlideForm({ ...slideForm, primaryBtnTarget: e.target.value })}
                        placeholder="#store-catalog"
                      />
                    )}
                  </div>
                </div>

                {/* Secondary Button */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Secondary Button Text</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={slideForm.secondaryBtnText}
                      onChange={(e) => setSlideForm({ ...slideForm, secondaryBtnText: e.target.value })}
                      placeholder="e.g. Slicing Guides"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Secondary Target URL</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={slideForm.secondaryBtnTarget}
                      onChange={(e) => setSlideForm({ ...slideForm, secondaryBtnTarget: e.target.value })}
                      placeholder="#datasheets-hub"
                    />
                  </div>
                </div>

                {/* Graphic Visual Selection */}
                <div className="admin-form-group">
                  <label className="admin-form-label">Visual Graphic Type</label>
                  <select
                    className="admin-form-select"
                    value={slideForm.imageType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSlideForm(prev => ({
                        ...prev,
                        imageType: val,
                        imageUrl: val !== 'custom' ? '' : prev.imageUrl
                      }));
                    }}
                  >
                    <option value="robot">🤖 Robot Chassis (Preset SVG)</option>
                    <option value="filament">🧵 3D Filament Spool (Preset SVG)</option>
                    <option value="motor">⚙️ Planetary Motor (Preset SVG)</option>
                    <option value="electronics">🔌 Microcontroller (Preset SVG)</option>
                    <option value="custom">🖼️ Upload Your Image (Live URL or Device File)</option>
                  </select>
                </div>

                {/* 2-Way Image Upload Box (Live URL vs Device File) */}
                {slideForm.imageType === 'custom' && (
                  <div
                    style={{
                      background: 'var(--bg-card)',
                      padding: '16px',
                      borderRadius: '10px',
                      border: '1.5px dashed #EA580C',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <label className="admin-form-label" style={{ margin: 0, fontWeight: '800', color: '#EA580C' }}>
                        🖼️ Upload Your Image:
                      </label>
                      
                      {/* Mode Toggle Buttons: Live URL vs Upload File */}
                      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-secondary)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('url')}
                          style={{
                            background: imageUploadMode === 'url' ? '#EA580C' : 'transparent',
                            color: imageUploadMode === 'url' ? '#FFFFFF' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          🌐 Live URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setImageUploadMode('file')}
                          style={{
                            background: imageUploadMode === 'file' ? '#EA580C' : 'transparent',
                            color: imageUploadMode === 'file' ? '#FFFFFF' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 12px',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          📁 Upload from Device
                        </button>
                      </div>
                    </div>

                    {/* TYPE 1: LIVE IMAGE URL */}
                    {imageUploadMode === 'url' && (
                      <div className="admin-form-group" style={{ margin: 0 }}>
                        <label className="admin-form-label" style={{ fontSize: '12px' }}>
                          Paste Live Image URL (Web link)
                        </label>
                        <input
                          type="url"
                          className="admin-form-input"
                          value={slideForm.imageUrl || ''}
                          onChange={(e) => setSlideForm({ ...slideForm, imageUrl: e.target.value })}
                          placeholder="https://example.com/robot-banner.png"
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block' }}>
                          💡 Paste any direct image link (.png, .jpg, .webp, .svg)
                        </span>
                      </div>
                    )}

                    {/* TYPE 2: UPLOAD IMAGE FILE FROM DEVICE */}
                    {imageUploadMode === 'file' && (
                      <div>
                        <label className="admin-form-label" style={{ fontSize: '12px' }}>
                          Choose Image File from Computer / Phone
                        </label>
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleSlideFileChange}
                        />
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          style={{
                            border: '2px dashed var(--border-color)',
                            borderRadius: '8px',
                            padding: '16px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: 'var(--bg-secondary)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '26px', marginBottom: '4px' }}>📁</div>
                          <strong style={{ fontSize: '13px', color: 'var(--text-primary)', display: 'block' }}>
                            Click to Browse Image File
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                            Supports PNG, JPG, WEBP, SVG, GIF (Max 5MB)
                          </span>
                        </div>
                      </div>
                    )}

                    {/* LIVE IMAGE PREVIEW & REMOVE OPTION */}
                    {slideForm.imageUrl && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: 'var(--bg-secondary)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid var(--border-color)'
                        }}
                      >
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: '1px solid var(--border-color)',
                            background: '#0F172A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <img
                            src={slideForm.imageUrl}
                            alt="Preview"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <strong style={{ fontSize: '12px', color: '#10B981', display: 'block' }}>
                            ✓ Image Loaded &amp; Active
                          </strong>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--text-secondary)',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: 'block'
                            }}
                          >
                            {uploadedFileName ? `${uploadedFileName} (${uploadedFileSize})` : (slideForm.imageUrl.startsWith('data:') ? 'Base64 Device Upload' : slideForm.imageUrl)}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSlideForm(prev => ({ ...prev, imageUrl: '' }));
                            setUploadedFileName('');
                            setUploadedFileSize('');
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          style={{
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#EF4444',
                            border: '1px solid #EF4444',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer'
                          }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Active Checkbox */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="slideActiveCheck"
                    checked={slideForm.active}
                    onChange={(e) => setSlideForm({ ...slideForm, active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="slideActiveCheck" style={{ fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    Publish Slide on Storefront (Active)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="admin-action-pill-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-pill-btn primary"
                  style={{ background: '#EA580C', color: '#FFFFFF', fontWeight: '700', border: 'none' }}
                >
                  💾 Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. NATIVE ADMIN MODAL: ADD / EDIT SIDE PROMO BANNER */}
      {isSideModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsSideModalOpen(false)}>
          <div className="admin-modal-box" style={{ maxWidth: '560px' }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">
                {editingSideId ? '✏️ Edit Side Card' : '➕ Add Side Promo Card'}
              </h3>
              <button
                type="button"
                className="btn-table-icon"
                onClick={() => setIsSideModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSideBanner}>
              <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Badge Tag (with Emoji)</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={sideForm.badge}
                    onChange={(e) => setSideForm({ ...sideForm, badge: e.target.value })}
                    placeholder="e.g. 🔩 Workshop Essential"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Card Title *</label>
                  <input
                    type="text"
                    className="admin-form-input"
                    value={sideForm.title}
                    onChange={(e) => setSideForm({ ...sideForm, title: e.target.value })}
                    placeholder="e.g. M2–M5 Fastener Kits"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    className="admin-form-textarea"
                    rows="2"
                    value={sideForm.description}
                    onChange={(e) => setSideForm({ ...sideForm, description: e.target.value })}
                    placeholder="304 Stainless Steel Allen bolts..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Button Text</label>
                    <input
                      type="text"
                      className="admin-form-input"
                      value={sideForm.btnText}
                      onChange={(e) => setSideForm({ ...sideForm, btnText: e.target.value })}
                      placeholder="e.g. Shop Fasteners →"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Action Type</label>
                    <select
                      className="admin-form-select"
                      value={sideForm.btnAction}
                      onChange={(e) => setSideForm({ ...sideForm, btnAction: e.target.value })}
                    >
                      <option value="category">Category Filter</option>
                      <option value="product">Specific Product</option>
                      <option value="link">Custom Link</option>
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Target Destination</label>
                  {sideForm.btnAction === 'product' ? (
                    <select
                      className="admin-form-select"
                      value={sideForm.btnTarget}
                      onChange={(e) => setSideForm({ ...sideForm, btnTarget: e.target.value })}
                    >
                      <option value="">-- Select Product --</option>
                      {(products || []).map(p => (
                        <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                      ))}
                    </select>
                  ) : sideForm.btnAction === 'category' ? (
                    <select
                      className="admin-form-select"
                      value={sideForm.btnTarget}
                      onChange={(e) => setSideForm({ ...sideForm, btnTarget: e.target.value })}
                    >
                      {(navbarCategories || []).map(c => (
                        <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="admin-form-input"
                      value={sideForm.btnTarget}
                      onChange={(e) => setSideForm({ ...sideForm, btnTarget: e.target.value })}
                      placeholder="#store-catalog"
                    />
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                  <input
                    type="checkbox"
                    id="sideActiveCheck"
                    checked={sideForm.active}
                    onChange={(e) => setSideForm({ ...sideForm, active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="sideActiveCheck" style={{ fontSize: '13px', fontWeight: '700', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    Publish Side Card (Active)
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setIsSideModalOpen(false)}
                  className="admin-action-pill-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-action-pill-btn primary"
                  style={{ background: '#EA580C', color: '#FFFFFF', fontWeight: '700', border: 'none' }}
                >
                  💾 Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
