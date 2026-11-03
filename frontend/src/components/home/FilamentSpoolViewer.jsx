import React, { useState, useEffect } from 'react';

/**
 * FilamentSpoolViewer
 * NuMakers-style left column with interactive 3D Spool + Dragon Model visualizer
 * and 5 thumbnail previews. Supports dynamic real-time color switching,
 * custom admin-uploaded images, and refill spool mode.
 */
export const FilamentSpoolViewer = ({
  activeColor = { name: "Pitch Black", hex: "#111111", image: "/filaments/spool_black_dragon.jpg" },
  selectedType = "Filament with Spool",
  selectedWeight = "1 kg",
  materialName = "PLA+ Filament"
}) => {
  const [activeThumb, setActiveThumb] = useState(0);

  // Extract all photos attached to the active color variant
  const colorImages = Array.isArray(activeColor?.images) && activeColor.images.length > 0
    ? activeColor.images.filter(Boolean)
    : (activeColor?.image ? [activeColor.image] : []);

  // Automatically reset to main view #1 when color changes so active color's cover image is visible
  useEffect(() => {
    setActiveThumb(0);
  }, [activeColor?.name, activeColor?.image, colorImages.length]);

  // Construct dynamic gallery thumbnails prioritizing all custom photos of active color
  const thumbnails = [];
  if (colorImages.length > 0) {
    colorImages.forEach((imgUrl, idx) => {
      thumbnails.push({
        id: idx,
        label: idx === 0 ? `${activeColor?.name || 'Spool'} (Main #1)` : `${activeColor?.name || 'Spool'} (Photo #${idx + 1})`,
        getImage: () => imgUrl,
        isDynamic: false,
        isColorPhoto: true,
        photoNum: idx + 1
      });
    });
  } else {
    thumbnails.push({
      id: 0,
      label: `${activeColor?.name || 'Spool'} (Smart Tint)`,
      getImage: () => "/filaments/spool_white_dragon.jpg",
      isDynamic: true,
      isColorPhoto: false,
      photoNum: 1
    });
  }

  // Complementary secondary reference views if fewer than 5 images
  if (thumbnails.length < 5) {
    thumbnails.push({
      id: thumbnails.length,
      label: "3D Dragon Model",
      getImage: () => "/filaments/dragon_model_black.jpg",
      isDynamic: false,
      isColorPhoto: false
    });
  }
  if (thumbnails.length < 5) {
    thumbnails.push({
      id: thumbnails.length,
      label: "Refill Roll Pack",
      getImage: () => "/filaments/refill_spool_pack.jpg",
      isDynamic: false,
      isColorPhoto: false
    });
  }

  // Determine main image to display
  const getMainImage = () => {
    if (selectedType === "Refill" && activeThumb === 0 && colorImages.length <= 1) {
      return {
        url: "/filaments/refill_spool_pack.jpg",
        isTinted: false
      };
    }

    const currentThumb = thumbnails[activeThumb] || thumbnails[0];
    if (currentThumb) {
      return {
        url: currentThumb.getImage() || "/filaments/spool_white_dragon.jpg",
        isTinted: currentThumb.isDynamic
      };
    }

    return { url: "/filaments/spool_white_dragon.jpg", isTinted: true };
  };

  const currentMain = getMainImage();

  return (
    <div className="filament-spool-viewer" style={{ width: '100%' }}>
      {/* 1. Main Viewport */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          background: 'linear-gradient(145deg, #FFFFFF, #F1F5F9)',
          borderRadius: '16px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Quality Badges */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}
        >
          <span
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}
          >
            {selectedType === "Refill" ? "📦 REFILL PACK" : "🧵 1.75mm SPOOL"}
          </span>
          <span
            style={{
              background: 'rgba(234, 88, 12, 0.9)',
              color: '#FFFFFF',
              padding: '3px 8px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '800'
            }}
          >
            {selectedWeight}
          </span>
        </div>

        {/* Color Badge */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(0,0,0,0.1)',
            padding: '4px 10px',
            borderRadius: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
        >
          <span
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: activeColor?.hex || '#111111',
              border: '1px solid rgba(0,0,0,0.2)',
              display: 'inline-block'
            }}
          />
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#1E293B' }}>
            {activeColor?.name || 'Default'}
          </span>
        </div>

        {/* Image Container with Dynamic Color Tinting */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <img
            key={currentMain.url + (currentMain.isTinted ? activeColor?.hex : '')}
            src={currentMain.url}
            alt={`${materialName} - ${activeColor?.name}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              display: 'block',
              transition: 'transform 0.4s ease, opacity 0.3s ease',
              filter: currentMain.isTinted ? 'contrast(1.05)' : 'none'
            }}
          />

          {/* Dynamic Color Multiplier Overlay for colors without direct photos */}
          {currentMain.isTinted && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: activeColor?.hex || '#111111',
                mixBlendMode: 'multiply',
                opacity: 0.85,
                pointerEvents: 'none',
                maskImage: `radial-gradient(circle at center, black 65%, transparent 95%)`,
                WebkitMaskImage: `radial-gradient(circle at center, black 65%, transparent 95%)`
              }}
            />
          )}
        </div>
      </div>

      {/* 2. Color Photos & Reference Thumbnails Gallery Row */}
      <div
        className="filament-thumbs-gallery"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(3, Math.min(6, thumbnails.length))}, 1fr)`,
          gap: '10px',
          marginTop: '16px'
        }}
      >
        {thumbnails.map((thumb) => {
          const isSelected = activeThumb === thumb.id;
          const thumbImg = thumb.getImage();

          return (
            <button
              key={thumb.id + (thumbImg || '')}
              type="button"
              onClick={() => setActiveThumb(thumb.id)}
              style={{
                background: '#FFFFFF',
                border: isSelected ? '2.5px solid #0066CC' : '1.5px solid #E2E8F0',
                borderRadius: '10px',
                padding: '4px',
                cursor: 'pointer',
                aspectRatio: '1 / 1',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: isSelected ? '0 0 0 3px rgba(0, 102, 204, 0.25)' : 'none',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title={thumb.label}
            >
              <img
                src={thumbImg}
                alt={thumb.label}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px',
                  opacity: isSelected ? 1 : 0.75,
                  transition: 'opacity 0.2s ease'
                }}
              />
              {/* Photo position indicator tag (#1, #2, #3) */}
              {thumb.isColorPhoto && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    background: isSelected ? '#0066CC' : 'rgba(15, 23, 42, 0.75)',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    lineHeight: '1.2'
                  }}
                >
                  #{thumb.photoNum}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
