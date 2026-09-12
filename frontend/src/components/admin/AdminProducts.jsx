import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CATEGORIES_METADATA } from '../../data/productsData';
import { ProductImage } from '../../data/productImages';
import { AdminProductModal } from './AdminProductModal';

export const AdminProducts = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateStock, setAdminActiveTab } = useCart();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all, low, out, instock
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [quickStockId, setQuickStockId] = useState(null);
  const [quickStockVal, setQuickStockVal] = useState(0);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));

    const matchesCat = selectedCat === 'all' || p.category === selectedCat;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.stock > 0 && p.stock <= 15;
    else if (stockFilter === 'out') matchesStock = p.stock === 0;
    else if (stockFilter === 'instock') matchesStock = p.stock > 15;

    return matchesSearch && matchesCat && matchesStock;
  });

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  const handleQuickStockSave = (id) => {
    updateStock(id, quickStockVal);
    setQuickStockId(null);
  };

  return (
    <div className="admin-page-content">
      {/* Top Header Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Robotics Product &amp; Inventory Manager
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total items in catalog: <strong>{products.length}</strong> | Low stock items: <strong>{products.filter(p => p.stock <= 15).length}</strong>
            </div>
          </div>

          <div className="admin-table-controls">
            {/* Search */}
            <div className="admin-search-wrapper">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search name, SKU, tag..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <select
              className="admin-select"
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
            >
              {CATEGORIES_METADATA.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              className="admin-select"
              value={stockFilter}
              onChange={e => setStockFilter(e.target.value)}
            >
              <option value="all">All Inventory</option>
              <option value="instock">In Stock (&gt;15)</option>
              <option value="low">Low Stock (&le;15)</option>
              <option value="out">Out of Stock (0)</option>
            </select>

            {/* Filament Colors Hub Shortcut */}
            <button
              type="button"
              className="admin-action-pill-btn secondary"
              onClick={() => setAdminActiveTab('filaments')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Open 3D Filament Subcategories & Color Swatches Manager"
            >
              <span>🧵 Filament Colors Hub</span>
            </button>

            {/* Add Product Button */}
            <button className="admin-action-pill-btn primary" onClick={handleOpenAddModal}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add Product
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item / SKU</th>
                <th>Category</th>
                <th>Price / MSRP</th>
                <th>Stock Level</th>
                <th>Badges / Features</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '4px',
                          flexShrink: 0
                        }}>
                          <ProductImage type={p.image} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: 'var(--text-primary)', maxWidth: '280px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--primary)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {p.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {p.categoryLabel || p.category}
                      </span>
                    </td>
                    <td>
                      <div>
                        <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>₹{p.price}</span>
                        {p.originalPrice > p.price && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'line-through', marginLeft: '6px' }}>
                            ₹{p.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      {quickStockId === p.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="number"
                            min="0"
                            style={{ width: '60px', padding: '4px 6px', background: 'var(--bg-input)', border: '1px solid var(--primary)', borderRadius: '4px', color: '#fff' }}
                            value={quickStockVal}
                            onChange={e => setQuickStockVal(e.target.value)}
                            autoFocus
                          />
                          <button className="btn-table-icon" style={{ color: '#22C55E' }} onClick={() => handleQuickStockSave(p.id)}>✓</button>
                          <button className="btn-table-icon" onClick={() => setQuickStockId(null)}>✕</button>
                        </div>
                      ) : (
                        <div
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                          title="Click to quick-adjust stock"
                          onClick={() => {
                            setQuickStockId(p.id);
                            setQuickStockVal(p.stock);
                          }}
                        >
                          <span className={`badge-status ${p.stock === 0 ? 'badge-outstock' : p.stock <= 15 ? 'badge-lowstock' : 'badge-instock'}`}>
                            {p.stock === 0 ? 'Out of Stock' : p.stock <= 15 ? `Low (${p.stock})` : `${p.stock} units`}
                          </span>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--text-muted)' }}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {p.badge && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', borderRadius: '4px', fontWeight: '600' }}>
                            {p.badge}
                          </span>
                        )}
                        {p.isDeal && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '4px', fontWeight: '600' }}>
                            ⚡ Deal
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-table-icon"
                          title="Edit Product"
                          onClick={() => handleOpenEditModal(p)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn-table-icon danger"
                          title="Delete Product"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No products matched your search / filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
