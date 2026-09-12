import React from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const CompareModal = () => {
  const { isCompareOpen, setIsCompareOpen, compareList, clearCompare, addItem, products } = useCart();

  if (!isCompareOpen) return null;

  const items = compareList.map((id) => (products || []).find((p) => p.id === id)).filter(Boolean);

  return (
    <div
      className="modal-backdrop active"
      id="compare-modal"
      onClick={(e) => {
        if (e.target.id === 'compare-modal') setIsCompareOpen(false);
      }}
    >
      <div className="modal-card" style={{ maxWidth: '920px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>Technical Specifications Comparison</h3>
          <button className="modal-close-btn" onClick={() => setIsCompareOpen(false)}>
            ✕
          </button>
        </div>

        <div id="compare-modal-body">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-secondary)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚖️</div>
              <h4>No products added for comparison</h4>
              <p>Click the compare icon on product cards to view technical differences side by side.</p>
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                        Feature
                      </th>
                      {items.map((p) => (
                        <th
                          key={p.id}
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            borderBottom: '1px solid var(--border-color)',
                            width: `${100 / (items.length + 1)}%`
                          }}
                        >
                          <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ProductImage type={p.image} className="compare-svg" />
                          </div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '6px' }}>{p.name}</div>
                          <div style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                          <button
                            className="btn btn-primary btn-sm"
                            style={{ marginTop: '8px' }}
                            onClick={() => {
                              addItem(p.id, 1);
                              setIsCompareOpen(false);
                            }}
                          >
                            Add to Cart
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-subtle)' }}>
                        Category
                      </td>
                      {items.map((p) => (
                        <td key={p.id} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                          {p.categoryLabel}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-subtle)' }}>
                        Rating
                      </td>
                      {items.map((p) => (
                        <td key={p.id} style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid var(--border-subtle)' }}>
                          ⭐ {p.rating} ({p.reviewsCount} reviews)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-subtle)' }}>
                        Stock Status
                      </td>
                      {items.map((p) => (
                        <td
                          key={p.id}
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            borderBottom: '1px solid var(--border-subtle)',
                            color: 'var(--primary)',
                            fontWeight: 'bold'
                          }}
                        >
                          In Stock ({p.stock} units)
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td style={{ padding: '10px', fontWeight: 'bold', borderBottom: '1px solid var(--border-subtle)' }}>
                        SKU
                      </td>
                      {items.map((p) => (
                        <td
                          key={p.id}
                          style={{
                            padding: '10px',
                            textAlign: 'center',
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: '0.75rem',
                            borderBottom: '1px solid var(--border-subtle)'
                          }}
                        >
                          {p.sku}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={clearCompare}
                >
                  Clear Comparison
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
