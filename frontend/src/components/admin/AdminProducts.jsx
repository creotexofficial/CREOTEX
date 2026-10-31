import React, { useState } from 'react';
import {
  Boxes,
  Search,
  Plus,
  CircleDot,
  Edit3,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Zap,
  Filter,
  Layers
} from 'lucide-react';
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
              <Boxes size={20} />
              <span>Robotics Product & Catalog Manager</span>
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total items in catalog: <strong>{products.length}</strong> | Low stock items: <strong>{products.filter(p => p.stock <= 15).length}</strong>
            </div>
          </div>

          <div className="admin-table-controls">
            {/* Search */}
            <div className="admin-search-wrapper">
              <Search size={15} />
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
              <CircleDot size={14} style={{ color: '#0EA5E9' }} />
              <span>Filament Colors Hub</span>
            </button>

            {/* Add Product Button */}
            <button className="admin-action-pill-btn primary" onClick={handleOpenAddModal}>
              <Plus size={16} />
              <span>Add Product</span>
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
                          <button className="btn-table-icon" style={{ color: '#22C55E' }} onClick={() => handleQuickStockSave(p.id)}>
                            <Check size={14} />
                          </button>
                          <button className="btn-table-icon" onClick={() => setQuickStockId(null)}>
                            <X size={14} />
                          </button>
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
                          <Edit3 size={12} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {p.badge && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--primary)', borderRadius: '4px', fontWeight: '600' }}>
                            {p.badge}
                          </span>
                        )}
                        {p.isDeal && (
                          <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '4px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Zap size={10} /> Deal
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
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="btn-table-icon danger"
                          title="Delete Product"
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 size={14} />
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
