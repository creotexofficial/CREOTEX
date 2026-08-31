import React from 'react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const AdminDashboard = () => {
  const {
    products,
    orders,
    customers,
    users,
    updateStock,
    setAdminActiveTab
  } = useCart();

  // Metrics Calculations
  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => ['pending', 'processing'].includes(o.orderStatus?.toLowerCase())).length;
  const lowStockProducts = products.filter(p => p.stock <= 15);
  const totalCustomers = customers.length;
  const totalUsers = users?.length || 0;

  const weeklySalesData = [
    { day: 'Mon', amount: 14200, height: '45%' },
    { day: 'Tue', amount: 19800, height: '62%' },
    { day: 'Wed', amount: 16500, height: '52%' },
    { day: 'Thu', amount: 24300, height: '78%' },
    { day: 'Fri', amount: 31200, height: '95%' },
    { day: 'Sat', amount: 28400, height: '88%' },
    { day: 'Sun', amount: 21900, height: '68%' }
  ];

  const handleQuickRestock = (productId, currentStock) => {
    updateStock(productId, currentStock + 20);
  };

  return (
    <div className="admin-page-content">
      {/* Top Welcome & Quick Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            Super Admin Control Center
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Store health: <span style={{ color: '#22C55E', fontWeight: '600' }}>● All Robotics Fulfillment Systems Operational</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="admin-action-pill-btn primary" onClick={() => setAdminActiveTab('products')}>
            + New Product
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('users')}>
            User Logins ({totalUsers})
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('orders')}>
            Orders ({pendingOrders} Pending)
          </button>
        </div>
      </div>

      {/* 4 Stat KPI Cards */}
      <div className="admin-stats-grid">
        {/* Total Gross Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Gross Store Revenue</span>
            <div className="admin-stat-icon icon-revenue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">₹{Math.round(totalRevenue).toLocaleString('en-IN')}</div>
          <div className="admin-stat-footer">
            <span className="stat-trend-up">▲ 24.8%</span>
            <span>vs previous month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Total Orders</span>
            <div className="admin-stat-icon icon-orders">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{totalOrders}</div>
          <div className="admin-stat-footer">
            <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{pendingOrders} awaiting dispatch</span>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Catalog Products</span>
            <div className="admin-stat-icon icon-products">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{products.length}</div>
          <div className="admin-stat-footer">
            <span>{lowStockProducts.length > 0 ? (
              <span style={{ color: '#EF4444', fontWeight: '600' }}>⚠ {lowStockProducts.length} low stock</span>
            ) : 'All items in stock'}</span>
          </div>
        </div>

        {/* Customers */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Robotics Labs &amp; Makers</span>
            <div className="admin-stat-icon icon-customers">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
              </svg>
            </div>
          </div>
          <div className="admin-stat-value">{totalCustomers}</div>
          <div className="admin-stat-footer">
            <span className="stat-trend-up">▲ 18%</span>
            <span>active university labs</span>
          </div>
        </div>
      </div>

      {/* Analytics & Inventory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Weekly Revenue Velocity Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
              Weekly Dispatch Velocity (₹)
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Last 7 Days</span>
          </div>

          <div style={{ padding: '24px' }}>
            <div className="admin-chart-bar-container">
              {weeklySalesData.map(item => (
                <div key={item.day} className="admin-chart-bar-col">
                  <div
                    className="admin-chart-bar-fill"
                    style={{ height: item.height }}
                    title={`₹${item.amount.toLocaleString('en-IN')}`}
                  ></div>
                  <span className="admin-chart-bar-label">{item.day}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span>Peak Day: <strong>Friday (₹31,200)</strong></span>
              <span>7-Day Average: <strong>₹22,328 / day</strong></span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts & Quick Restock */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title" style={{ color: '#EF4444' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Low Stock Replenishment Warnings
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#EF4444', fontWeight: '600' }}>
              {lowStockProducts.length} Items
            </span>
          </div>

          <div style={{ padding: '16px 24px', maxHeight: '250px', overflowY: 'auto' }}>
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', padding: '2px', background: 'var(--bg-input)', borderRadius: '6px' }}>
                      <ProductImage type={p.image} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '600', color: 'var(--text-primary)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#EF4444', fontWeight: '600' }}>
                        {p.stock === 0 ? 'Out of Stock' : `Only ${p.stock} units left`}
                      </div>
                    </div>
                  </div>

                  <button
                    className="admin-action-pill-btn"
                    style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    onClick={() => handleQuickRestock(p.id, p.stock)}
                  >
                    +20 Restock
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '28px', color: '#22C55E' }}>
                ✓ All inventory items are well-stocked above threshold.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Snapshot Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            Recent Dispatch Stream
          </h3>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('orders')}>
            View All {orders.length} Orders →
          </button>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Maker Customer</th>
                <th>Total Value</th>
                <th>Payment Status</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id}>
                  <td>
                    <span style={{ fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)' }}>
                      #{o.id}
                    </span>
                  </td>
                  <td>{o.customer?.name || 'Customer'}</td>
                  <td>
                    <strong>₹{Math.round(o.totalAmount || 0).toLocaleString('en-IN')}</strong>
                  </td>
                  <td>
                    <span style={{ color: '#22C55E', fontSize: '0.8rem', fontWeight: '600' }}>
                      ● {o.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-status badge-${o.orderStatus?.toLowerCase()}`}>
                      {o.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
