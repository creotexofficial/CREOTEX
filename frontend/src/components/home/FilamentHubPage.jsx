import React, { useState, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { FILAMENT_SUBCATEGORIES, DEFAULT_FILAMENT_COLORS } from '../../data/productsData';
import { FilamentSpoolViewer } from './FilamentSpoolViewer';
import { ProductCard } from './ProductCard';
import { Header } from '../layout/Header';
import { MegaNav } from '../layout/MegaNav';
import { Footer } from '../layout/Footer';
import { NeuralBackground } from '../layout/NeuralBackground';

export const FilamentHubPage = () => {
  const {
    products,
    filamentSubcategories,
    activeFilamentSubcategory,
    setActiveFilamentSubcategory,
    navigateToHome,
    addItem,
    setCurrentView,
    setAdminActiveTab,
    currentUser
  } = useCart();

  const allSubcategories = (filamentSubcategories && filamentSubcategories.length > 0)
    ? filamentSubcategories
    : FILAMENT_SUBCATEGORIES;

  // Filter published subcategories for customer storefront
  const subcategoriesList = allSubcategories.filter(s => s.published !== false);

  // Selected subcategory metadata (default to PLA or first subcategory if 'all')
  const defaultSub = subcategoriesList.find(s => s.subCategoryKey === "PLA") || subcategoriesList[0] || allSubcategories[0];
  const currentSubMeta = (activeFilamentSubcategory && activeFilamentSubcategory !== 'all')
    ? allSubcategories.find(s => s.subCategoryKey.toLowerCase() === activeFilamentSubcategory.toLowerCase()) || defaultSub
    : defaultSub;

  // Find underlying product in catalog
  const underlyingProduct = (products || []).find(
    p => p.subCategory && p.subCategory.toLowerCase() === currentSubMeta.subCategoryKey.toLowerCase()
  ) || (products || []).find(p => p.category === 'filaments') || {};

  // Swatch colors list: use product colors if defined, otherwise subcategory colors, otherwise DEFAULT_FILAMENT_COLORS
  const availableColors = (underlyingProduct.colors && underlyingProduct.colors.length > 0)
    ? underlyingProduct.colors
    : (currentSubMeta.colors && currentSubMeta.colors.length > 0)
    ? currentSubMeta.colors
    : DEFAULT_FILAMENT_COLORS;

  // State for interactive customizer
  const [selectedColor, setSelectedColor] = useState(availableColors[0] || { name: "Pitch Black", hex: "#111111", image: "/filaments/spool_black_dragon.jpg" });
  const [hoveredColor, setHoveredColor] = useState(null);
  const [selectedType, setSelectedType] = useState("Filament with Spool"); // "Filament with Spool" | "Refill"
  const [selectedWeight, setSelectedWeight] = useState("1 kg"); // "1 kg" | "3 kg"
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showMoreDesc, setShowMoreDesc] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Sync color when subcategory changes
  useEffect(() => {
    if (availableColors && availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [currentSubMeta.id, currentSubMeta.subCategoryKey, availableColors.length]);

  // Dynamic price calculation
  const base1KgSpoolPrice = underlyingProduct.price || 999;
  const baseOriginalPrice = underlyingProduct.originalPrice || 1499;

  let currentPrice = base1KgSpoolPrice;
  let currentOriginalPrice = baseOriginalPrice;

  if (selectedType === "Refill") {
    currentPrice = Math.round(base1KgSpoolPrice * 0.9); // ₹100 / 10% discount for refill
    currentOriginalPrice = Math.round(baseOriginalPrice * 0.9);
  }

  if (selectedWeight === "3 kg") {
    currentPrice = Math.round(currentPrice * 2.7); // 3kg master spool
    currentOriginalPrice = Math.round(currentOriginalPrice * 2.7);
  }

  // Handle Add to Cart
  const handleAddToCart = () => {
    addItem(
      underlyingProduct,
      quantity,
      {
        material: currentSubMeta.displayName,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        type: selectedType,
        weight: selectedWeight,
        customPrice: currentPrice,
        image: selectedColor.image || underlyingProduct.image
      }
    );

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  // Other related filaments
  const otherFilaments = (products || [])
    .filter(p => p.category === 'filaments' && p.id !== underlyingProduct.id)
    .slice(0, 4);

  return (
    <>
      <NeuralBackground />
      <div className="creotex-app-root" style={{ position: 'relative', zIndex: 1 }}>
        <Header />
        <MegaNav />

        <main id="main-content" style={{ minHeight: '85vh', padding: '24px 0 70px' }}>
          <div className="container">
            {/* 1. Breadcrumb & Back Button */}
            <div
              className="filament-hub-header-bar"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span
                  onClick={navigateToHome}
                  style={{ cursor: 'pointer', color: 'var(--text-secondary)' }}
                >
                  🏠 Home
                </span>
                <span>/</span>
                <span
                  onClick={() => setActiveFilamentSubcategory('all')}
                  style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}
                >
                  Filament Spool Zone
                </span>
                <span>/</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                  {currentSubMeta.displayName}
                </span>
              </div>

              <div className="filament-hub-actions-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {currentUser?.role === 'super_admin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdminActiveTab('filaments');
                      setCurrentView('admin');
                    }}
                    style={{
                      background: 'rgba(0, 102, 204, 0.1)',
                      border: '1.5px solid #0066CC',
                      color: '#0066CC',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="Open Admin Panel to manage subcategory pricing, engineering specs, colors and images"
                  >
                    <span>⚙️ Admin: Edit Subcategory &amp; Colors</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={navigateToHome}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    borderRadius: '8px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <span>← Back to Store</span>
                </button>
              </div>
            </div>

            {/* 2. Material Quick Switcher Strip (All 8 Subcategories) */}
            <div
              className="materials-strip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '12px',
                marginBottom: '24px'
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', marginRight: '6px' }}>
                Select Material:
              </span>
              {subcategoriesList.map((sub) => {
                const isCurrent = sub.subCategoryKey.toLowerCase() === currentSubMeta.subCategoryKey.toLowerCase();
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setActiveFilamentSubcategory(sub.subCategoryKey)}
                    style={{
                      background: isCurrent ? '#0066CC' : 'var(--bg-card)',
                      color: isCurrent ? '#FFFFFF' : 'var(--text-primary)',
                      border: `1.5px solid ${isCurrent ? '#0066CC' : 'var(--border-color)'}`,
                      borderRadius: '30px',
                      padding: '7px 16px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrent ? '0 4px 12px rgba(0, 102, 204, 0.3)' : 'none'
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: isCurrent ? '#FFFFFF' : sub.accentColor,
                        display: 'inline-block'
                      }}
                    />
                    <span>{sub.displayName}</span>
                  </button>
                );
              })}
            </div>

            {/* 3. NuMakers-Style 2-Column Customizer Layout */}
            <div
              className="filament-customizer-card"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                marginBottom: '40px'
              }}
            >
              <div
                className="filament-customizer-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
                  gap: '40px',
                  alignItems: 'start'
                }}
              >
                {/* Left Column: Interactive Spool + Dragon Visualizer & 5 Thumbnails */}
                <div>
                  <FilamentSpoolViewer
                    activeColor={selectedColor}
                    selectedType={selectedType}
                    selectedWeight={selectedWeight}
                    materialName={currentSubMeta.displayName}
                  />

                  {/* Material Highlights Box */}
                  <div
                    style={{
                      marginTop: '20px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>⚡ Print Engineering Profile:</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Nozzle: <strong style={{ color: 'var(--text-primary)' }}>{currentSubMeta.printTemp}</strong>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Bed Temp: <strong style={{ color: 'var(--text-primary)' }}>{currentSubMeta.bedTemp}</strong>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Print Speed: <strong style={{ color: '#0066CC' }}>{currentSubMeta.speed}</strong>
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>
                        Dimensional: <strong style={{ color: 'var(--text-primary)' }}>±0.02 mm</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Title, Wishlist, Description, Type, Weight, Swatches, Pricing & Checkout */}
                <div>
                  {/* Title & Wishlist Star Button */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                    <div>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: `${currentSubMeta.badgeColor}1A`,
                          color: currentSubMeta.badgeColor,
                          border: `1px solid ${currentSubMeta.badgeColor}4D`,
                          display: 'inline-block',
                          marginBottom: '6px'
                        }}
                      >
                        {currentSubMeta.badge}
                      </span>
                      <h1
                        className="filament-title-h1"
                        style={{
                          fontSize: '28px',
                          fontWeight: '900',
                          color: 'var(--text-primary)',
                          margin: 0,
                          letterSpacing: '-0.5px'
                        }}
                      >
                        {currentSubMeta.displayName} Filament
                      </h1>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        border: '1.5px solid var(--border-color)',
                        background: isWishlisted ? '#FEF3C7' : 'var(--bg-surface)',
                        color: isWishlisted ? '#D97706' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '20px',
                        transition: 'all 0.2s ease',
                        flexShrink: 0
                      }}
                    >
                      {isWishlisted ? '★' : '☆'}
                    </button>
                  </div>

                  {/* Description with Show More Toggle */}
                  <div style={{ marginBottom: '24px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                      }}
                    >
                      {currentSubMeta.displayName} is our most popular high-performance filament and we highly recommend it for both beginners and competition robotics teams, because of its trouble-free printing experience.
                      {showMoreDesc && (
                        <span>
                          {' '}Manufactured using 100% pure high-purity virgin polymer resin without low-grade chalk or talc fillers. Offers outstanding 3D printing characteristics such as crisp fine-feature detail, excellent build plate adhesion, zero warping or curling, and negligible odor. Tested rigorously across Bambu Lab X1C/P1S, Creality K1, Voron 2.4, and Prusa MK4 printers.
                        </span>
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowMoreDesc(!showMoreDesc)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0066CC',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0,
                        marginTop: '6px',
                        textDecoration: 'underline'
                      }}
                    >
                      {showMoreDesc ? 'Show less' : 'Show more'}
                    </button>
                  </div>

                  {/* Type Selector: Filament with Spool vs Refill */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Type: <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{selectedType}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedType("Filament with Spool")}
                        style={{
                          background: selectedType === "Filament with Spool" ? "#0066CC" : "var(--bg-surface)",
                          color: selectedType === "Filament with Spool" ? "#FFFFFF" : "var(--text-primary)",
                          border: `1.5px solid ${selectedType === "Filament with Spool" ? "#0066CC" : "var(--border-color)"}`,
                          borderRadius: '8px',
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: selectedType === "Filament with Spool" ? "0 4px 12px rgba(0, 102, 204, 0.25)" : "none"
                        }}
                      >
                        Filament with Spool
                      </button>

                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedType("Refill")}
                          style={{
                            background: selectedType === "Refill" ? "#0066CC" : "var(--bg-surface)",
                            color: selectedType === "Refill" ? "#FFFFFF" : "var(--text-primary)",
                            border: `1.5px solid ${selectedType === "Refill" ? "#0066CC" : "var(--border-color)"}`,
                            borderRadius: '8px',
                            padding: '9px 18px',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            boxShadow: selectedType === "Refill" ? "0 4px 12px rgba(0, 102, 204, 0.25)" : "none"
                          }}
                        >
                          Refill
                        </button>
                        <span
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-6px',
                            background: '#EAB308',
                            color: '#000000',
                            fontSize: '9px',
                            fontWeight: '900',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            letterSpacing: '0.5px'
                          }}
                        >
                          NEW
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Net Weight: 1 kg vs 3 kg */}
                  <div style={{ marginBottom: '22px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
                      Net Weight: <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>{selectedWeight}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      {["1 kg", "3 kg"].map((wt) => {
                        const isChosen = selectedWeight === wt;
                        return (
                          <button
                            key={wt}
                            type="button"
                            onClick={() => setSelectedWeight(wt)}
                            style={{
                              background: isChosen ? "#0066CC" : "var(--bg-surface)",
                              color: isChosen ? "#FFFFFF" : "var(--text-primary)",
                              border: `1.5px solid ${isChosen ? "#0066CC" : "var(--border-color)"}`,
                              borderRadius: '8px',
                              padding: '8px 20px',
                              fontSize: '13px',
                              fontWeight: '700',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              boxShadow: isChosen ? "0 4px 12px rgba(0, 102, 204, 0.25)" : "none"
                            }}
                          >
                            {wt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Swatches Grid with Live Dynamic Label & Hover */}
                  <div style={{ marginBottom: '28px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '12px' }}>
                      Color:{' '}
                      <span style={{ color: '#0066CC', fontWeight: '800' }}>
                        {hoveredColor ? hoveredColor.name : selectedColor.name}
                      </span>
                    </div>

                    {/* Circular Swatches Grid */}
                    <div
                      className="filament-swatches-grid"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(28px, 1fr))',
                        gap: '10px',
                        maxWidth: '480px'
                      }}
                    >
                      {availableColors.map((col, idx) => {
                        const isSelected = selectedColor.name === col.name;
                        const isHovered = hoveredColor?.name === col.name;

                        return (
                          <div
                            key={col.name + idx}
                            style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedColor(col)}
                              onMouseEnter={() => setHoveredColor(col)}
                              onMouseLeave={() => setHoveredColor(null)}
                              title={col.name}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: col.hex,
                                border: isSelected
                                  ? '2.5px solid #0066CC'
                                  : isHovered
                                  ? '2px solid #64748B'
                                  : '1.5px solid rgba(0, 0, 0, 0.15)',
                                outline: isSelected ? '2px solid #FFFFFF' : 'none',
                                outlineOffset: '-4px',
                                cursor: 'pointer',
                                padding: 0,
                                transform: isSelected || isHovered ? 'scale(1.15)' : 'scale(1)',
                                transition: 'transform 0.15s ease, border-color 0.15s ease',
                                boxShadow: isSelected
                                  ? '0 2px 8px rgba(0, 102, 204, 0.4)'
                                  : '0 1px 3px rgba(0,0,0,0.1)'
                              }}
                            />

                            {/* Floating hover tooltip matching screenshot */}
                            {isHovered && (
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '36px',
                                  background: '#0F172A',
                                  color: '#FFFFFF',
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  whiteSpace: 'nowrap',
                                  zIndex: 50,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                  pointerEvents: 'none'
                                }}
                              >
                                {col.name}
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    borderWidth: '4px',
                                    borderStyle: 'solid',
                                    borderColor: '#0F172A transparent transparent transparent'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price & Quantity & Actions */}
                  <div
                    style={{
                      borderTop: '1px solid var(--border-color)',
                      paddingTop: '20px'
                    }}
                  >
                    {/* Price display */}
                    <div className="filament-price-row" style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
                      <span style={{ fontSize: '28px', fontWeight: '900', color: 'var(--text-primary)' }}>
                        ₹{currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '16px', color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                        ₹{currentOriginalPrice.toLocaleString('en-IN')}
                      </span>
                      <span
                        style={{
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#16A34A',
                          border: '1px solid rgba(34, 197, 94, 0.3)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '800'
                        }}
                      >
                        {Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)}% OFF
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>●</span>
                      <span>In Stock • Ships in 24 Hours with Vacuum Desiccant Sealed Packaging</span>
                    </div>

                    {/* Quantity & CTA buttons */}
                    <div className="filament-actions-row" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                      {/* Quantity Stepper */}
                      <div
                        className="filament-stepper-box"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: '1.5px solid var(--border-color)',
                          borderRadius: '8px',
                          background: 'var(--bg-surface)',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700'
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            padding: '0 12px',
                            fontSize: '14px',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            minWidth: '24px',
                            textAlign: 'center'
                          }}
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            padding: '10px 14px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '700'
                          }}
                        >
                          +
                        </button>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        type="button"
                        className="filament-add-cart-btn"
                        onClick={handleAddToCart}
                        style={{
                          flex: 1,
                          minWidth: '160px',
                          background: 'linear-gradient(135deg, #0066CC, #004C99)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 16px rgba(0, 102, 204, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>🛒 Add to Cart</span>
                      </button>

                      {/* Direct Buy Now */}
                      <button
                        type="button"
                        className="filament-buy-now-btn"
                        onClick={() => {
                          handleAddToCart();
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #EA580C, #C2410C)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px 24px',
                          fontSize: '14px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 16px rgba(234, 88, 12, 0.35)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span>⚡ Buy Now</span>
                      </button>
                    </div>

                    {/* Success Toast */}
                    {addedToast && (
                      <div
                        style={{
                          marginTop: '12px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#15803D',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          borderRadius: '8px',
                          padding: '8px 14px',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <span>✓</span>
                        <span>
                          Added {quantity}x <strong>{currentSubMeta.displayName}</strong> ({selectedColor.name}, {selectedWeight}, {selectedType}) to cart!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Related Engineering Filaments Shelf */}
            <div style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  Explore Other High-Precision Filaments
                </h3>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  All 8 engineering grades tested for high-speed 3D printing
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: '20px'
                }}
              >
                {otherFilaments.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};
