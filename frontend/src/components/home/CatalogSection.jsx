import React from 'react';
import { useCart } from '../../context/CartContext';
import { CATEGORIES_METADATA } from '../../data/productsData';
import { ProductCard } from './ProductCard';

const POPULAR_TAGS = [
  "All Tags",
  "Articulated & Toys",
  "Desk Organizers",
  "Functional & Mechanics",
  "Enclosures & Mounts",
  "Decor & Lighting",
  "Silk PLA",
  "TPU 95A",
  "Carbon Fiber",
  "PETG"
];

export const CatalogSection = () => {
  const {
    products,
    currentCategory,
    setCurrentCategory,
    currentTag,
    setCurrentTag,
    maxPrice,
    setMaxPrice,
    searchQuery,
    sortBy,
    setSortBy,
    resetFilters
  } = useCart();

  // Filtering & Sorting Logic (Memoized)
  const filteredProducts = React.useMemo(() => {
    return (products || []).filter((p) => {
      // Category match
      if (currentCategory !== "all" && p.category !== currentCategory) {
        return false;
      }

      // Tag filter
      if (
        currentTag !== "all" &&
        !p.tags?.some((t) => t.toLowerCase() === currentTag.toLowerCase())
      ) {
        return false;
      }

      // Price match
      if (p.price > maxPrice) {
        return false;
      }

      // Search match
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inName = p.name?.toLowerCase().includes(q);
        const inDesc = p.shortDesc?.toLowerCase().includes(q);
        const inSku = p.sku?.toLowerCase().includes(q);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(q));
        if (!inName && !inDesc && !inSku && !inTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sortBy === "newest") return String(b.id || '').localeCompare(String(a.id || ''));
      return 0;
    });
  }, [products, currentCategory, currentTag, maxPrice, searchQuery, sortBy]);

  return (
    <section className="catalog-section" id="section-3d-print-products" style={{ position: 'relative' }}>
      <div id="store-catalog" style={{ position: 'absolute', top: '-20px' }}></div>
      <div className="container">
        {/* Section 2 Header Banner */}
        <div className="deals-banner-header products-banner-header">
          <div className="deals-title-box">
            <span className="products-banner-icon">
              📦
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 className="products-banner-title">
                  Ready-to-Ship 3D Printed Products
                </h3>
                <span className="products-banner-badge">
                  PRECISION MANUFACTURED
                </span>
              </div>
              <div className="products-banner-subtitle">
                Functional parts, articulated models, desk organization, and engineering prototypes
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Single-Line Top Filter Toolbar */}
        <div className="catalog-toolbar-full">
          {/* Left Group: Results & Category Dropdown */}
          <div className="toolbar-left-group">
            <div className="results-count">
              Showing <strong>{filteredProducts.length}</strong> 3D Items
            </div>

            {/* Category Dropdown */}
            <div className="toolbar-control-item">
              <label htmlFor="catalog-category-select">📁 Category:</label>
              <select
                id="catalog-category-select"
                className="toolbar-select category-dropdown-select"
                value={currentCategory}
                onChange={(e) => setCurrentCategory(e.target.value)}
              >
                <option value="all">⚡ All 3D Catalog</option>
                {CATEGORIES_METADATA.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter Dropdown */}
            <div className="toolbar-control-item">
              <label htmlFor="catalog-tag-select">🏷️ Tag:</label>
              <select
                id="catalog-tag-select"
                className="toolbar-select"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value === "All Tags" ? "all" : e.target.value)}
              >
                {POPULAR_TAGS.map((tag) => (
                  <option key={tag} value={tag === "All Tags" ? "all" : tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Filter Dropdown */}
            <div className="toolbar-control-item">
              <label htmlFor="catalog-price-select">💰 Max Price:</label>
              <select
                id="catalog-price-select"
                className="toolbar-select"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              >
                <option value="5000">Up to ₹5,000 (All)</option>
                <option value="3500">Under ₹3,500</option>
                <option value="2000">Under ₹2,000</option>
                <option value="1000">Under ₹1,000</option>
                <option value="500">Under ₹500</option>
              </select>
            </div>
          </div>

          {/* Right Group: Reset & Sort Dropdown */}
          <div className="toolbar-right-group">
            {(currentCategory !== 'all' || currentTag !== 'all' || maxPrice < 5000 || searchQuery !== '') && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={resetFilters}
                title="Reset All Filters"
              >
                ✕ Reset Filters
              </button>
            )}

            <div className="toolbar-control-item">
              <label htmlFor="catalog-sort-select">Sort By:</label>
              <select
                className="toolbar-select"
                id="catalog-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured &amp; Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4-Column Full-Width Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="products-grid products-grid-4col">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="cart-empty-state">
            <div className="cart-empty-icon">🔍</div>
            <h3>No 3D products found</h3>
            <p>Try resetting your category or tag filters to view all 3D printed items.</p>
            <button
              className="btn btn-primary"
              style={{ marginTop: '14px' }}
              onClick={resetFilters}
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
