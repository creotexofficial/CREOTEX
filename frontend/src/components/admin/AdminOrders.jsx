import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Eye,
  Trash2,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Package
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';

export const AdminOrders = () => {
  const { orders, updateOrderStatus, deleteOrder } = useCart();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || o.orderStatus?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'badge-delivered';
      case 'shipped': return 'badge-shipped';
      case 'processing': return 'badge-processing';
      case 'pending': return 'badge-pending';
      case 'cancelled': return 'badge-cancelled';
      default: return 'badge-processing';
    }
  };

  return (
    <div className="admin-page-content">
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">
              <ShoppingBag size={20} />
              <span>Orders &amp; Fulfillment Dispatch Hub</span>
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Total Orders: <strong>{orders.length}</strong> | Pending/Processing: <strong>{orders.filter(o => ['pending', 'processing'].includes(o.orderStatus?.toLowerCase())).length}</strong>
            </div>
          </div>

          <div className="admin-table-controls">
            <div className="admin-search-wrapper">
              <Search size={15} />
              <input
                type="text"
                className="admin-search-input"
                placeholder="Search Order ID, Maker Name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <select
              className="admin-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="all">All Order Statuses</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID / Date</th>
                <th>Maker Customer</th>
                <th>Purchased Items</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(ord => (
                  <tr key={ord.id}>
                    <td>
                      <div>
                        <span style={{ fontWeight: '700', fontFamily: 'JetBrains Mono, monospace', color: 'var(--primary)' }}>
                          #{ord.id}
                        </span>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {ord.date}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                          {ord.customer?.name || 'Customer'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                          {ord.customer?.city || 'India'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ord.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {ord.items?.length} line item(s)
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        ₹{Math.round(ord.totalAmount || 0).toLocaleString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-status ${getStatusBadgeClass(ord.orderStatus)}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-table-icon"
                          title="Inspect Order Manifest"
                          onClick={() => setSelectedOrder(ord)}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-table-icon danger"
                          title="Delete Order Record"
                          onClick={() => {
                            if (window.confirm(`Delete order record #${ord.id}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No orders match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AdminOrderDetailModal
        order={selectedOrder}
        isOpen={Boolean(selectedOrder)}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
      />
    </div>
  );
};
