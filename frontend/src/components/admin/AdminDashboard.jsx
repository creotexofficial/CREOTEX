import React from 'react';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  GraduationCap,
  Database,
  AlertTriangle,
  Plus,
  Flame,
  Layers,
  Bot,
  Image as ImageIcon,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Check,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { ProductImage } from '../../data/productImages';

export const AdminDashboard = () => {
  const {
    products,
    orders,
    customers,
    users,
    coupons,
    storeSettings,
    updateStock,
    setAdminActiveTab
  } = useCart();

  // Metrics Calculations (Memoized for high performance)
  const metrics = React.useMemo(() => {
    let rev = 0;
    let pending = 0;
    for (let i = 0; i < orders.length; i++) {
      rev += orders[i].totalAmount || 0;
      const st = (orders[i].orderStatus || '').toLowerCase();
      if (st === 'pending' || st === 'processing') pending++;
    }
    const lowStock = (products || []).filter(p => p.stock <= 15);
    return {
      totalRevenue: rev,
      totalOrders: orders.length,
      pendingOrders: pending,
      lowStockProducts: lowStock,
      totalCustomers: customers.length,
      totalUsers: users?.length || 0
    };
  }, [orders, products, customers.length, users?.length]);

  const {
    totalRevenue,
    totalOrders,
    pendingOrders,
    lowStockProducts,
    totalCustomers,
    totalUsers
  } = metrics;

  // Real Database Records Count
  const totalDbRecords = React.useMemo(() => (
    (products?.length || 0) +
    (orders?.length || 0) +
    (customers?.length || 0) +
    (totalUsers || 0) +
    (Array.isArray(coupons) ? coupons.length : Object.keys(coupons || {}).length)
  ), [products?.length, orders?.length, customers?.length, totalUsers, coupons]);

  // Calculate Real Database Memory / Storage Footprint (Memoized)
  const formatStorageSize = (bytes) => {
    if (!bytes || bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 2));
    return `${value} ${sizes[i]}`;
  };

  const dbSizeBytes = React.useMemo(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        let lsBytes = 0;
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('creotex_')) {
            const val = localStorage.getItem(key) || '';
            lsBytes += key.length + val.length;
          }
        }
        if (lsBytes > 0) return lsBytes;
      }
      return totalDbRecords * 1024;
    } catch {
      return totalDbRecords * 1024;
    }
  }, [totalDbRecords]);

  const formattedDbSize = React.useMemo(() => formatStorageSize(dbSizeBytes), [dbSizeBytes]);

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
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></span>
            <span>All 3D Printing Systems & Database Nodes Operational</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="admin-action-pill-btn primary" onClick={() => setAdminActiveTab('products')}>
            <Plus size={15} />
            <span>New Product</span>
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('filaments')}>
            <Layers size={15} style={{ color: '#EA580C' }} />
            <span>3D Filaments Hub</span>
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('categories')}>
            <Layers size={15} style={{ color: '#0EA5E9' }} />
            <span>3D Navbar</span>
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('users')}>
            <Users size={15} />
            <span>Users ({totalUsers})</span>
          </button>
          <button className="admin-action-pill-btn" onClick={() => setAdminActiveTab('orders')}>
            <ShoppingCart size={15} />
            <span>Orders ({pendingOrders} Pending)</span>
          </button>
        </div>
      </div>

      {/* 5 Stat KPI Cards (Including Real Database Memory) */}
      <div className="admin-stats-grid">
        {/* Total Gross Revenue */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Gross Store Revenue</span>
            <div className="admin-stat-icon icon-revenue">
              <TrendingUp size={20} />
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
              <ShoppingCart size={20} />
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
              <Package size={20} />
            </div>
          </div>
          <div className="admin-stat-value">{products.length}</div>
          <div className="admin-stat-footer">
            <span>
              {lowStockProducts.length > 0 ? (
                <span style={{ color: '#EF4444', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={13} /> {lowStockProducts.length} low stock
                </span>
              ) : (
                'All items in stock'
              )}
            </span>
          </div>
        </div>

        {/* Customers */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">3D Makers & Lab Accounts</span>
            <div className="admin-stat-icon icon-customers">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="admin-stat-value">{totalCustomers}</div>
          <div className="admin-stat-footer">
            <span className="stat-trend-up">▲ 18%</span>
            <span>active 3D printing accounts</span>
          </div>
        </div>

        {/* 5th Card: Database Memory / Storage */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Database Memory</span>
            <div className="admin-stat-icon icon-database">
              <Database size={20} />
            </div>
          </div>
          <div className="admin-stat-value" style={{ color: '#06B6D4' }}>{formattedDbSize}</div>
          <div className="admin-stat-footer">
            <span style={{ color: '#06B6D4', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#06B6D4' }}></span>
              {totalDbRecords} active records
            </span>
            <span>• Live Storage</span>
          </div>
        </div>
      </div>

      {/* Storefront Layout & Content Control Center Shortcuts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div
          onClick={() => setAdminActiveTab('filaments')}
          style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.12) 0%, rgba(249, 115, 22, 0.06) 100%)',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            borderRadius: '12px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className="admin-quick-action-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(234, 88, 12, 0.15)',
              color: '#EA580C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>3D Filaments & Spool Hub</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Manage 17 materials, swatches & spool specs</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#EA580C', fontWeight: '700' }}>
            <span>Manage</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('hero-banners')}
          style={{
            background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.10) 0%, rgba(245, 158, 11, 0.05) 100%)',
            border: '1px solid rgba(234, 88, 12, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className="admin-quick-action-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.15)',
              color: '#F59E0B',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ImageIcon size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>Hero Banners & Slider</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Slides, side cards & 3D promotional banners</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#EA580C', fontWeight: '700' }}>
            <span>Manage</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('categories')}
          style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.10) 0%, rgba(59, 130, 246, 0.05) 100%)',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className="admin-quick-action-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.15)',
              color: '#0EA5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>Navbar 3D Categories</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>3 Main Sections: Filaments, Prints, Custom Studio</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0EA5E9', fontWeight: '700' }}>
            <span>Manage</span>
            <ArrowRight size={14} />
          </div>
        </div>

        <div
          onClick={() => setAdminActiveTab('orders')}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(5, 150, 105, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          className="admin-quick-action-card"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShoppingCart size={22} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: 'var(--text-primary)', display: 'block' }}>Orders & Fulfillment</strong>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Customer orders, payments & parcel dispatch</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#10B981', fontWeight: '700' }}>
            <span>Manage</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Analytics & Inventory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Weekly Revenue Velocity Chart */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">
              <BarChart3 size={18} />
              <span>Weekly Dispatch Velocity (₹)</span>
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
              <AlertTriangle size={18} />
              <span>Low Stock Replenishment Warnings</span>
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
                    style={{ fontSize: '0.75rem', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => handleQuickRestock(p.id, p.stock)}
                  >
                    <Plus size={12} />
                    <span>20 Restock</span>
                  </button>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '28px', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} />
                <span>All inventory items are well-stocked above threshold.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Snapshot Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <h3 className="admin-card-title">
            <Clock size={18} />
            <span>Recent Dispatch Stream</span>
          </h3>
          <button
            className="admin-action-pill-btn"
            onClick={() => setAdminActiveTab('orders')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>View All {orders.length} Orders</span>
            <ArrowRight size={14} />
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
                    <span style={{ color: '#22C55E', fontSize: '0.8rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22C55E' }}></span>
                      {o.paymentStatus}
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
