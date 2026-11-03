import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Coupon from '../models/Coupon.js';

// Helper to format bytes into readable units
const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// @desc    Get Admin Dashboard Analytics & Metrics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Parallel aggregate queries for high performance (zero full-collection memory dumps)
  const [
    totalProducts,
    totalUsers,
    totalCustomers,
    totalCoupons,
    totalOrders,
    lowStockCount,
    recentOrders,
    orderAggregation
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
    Customer.countDocuments(),
    Coupon.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ isActive: true, stock: { $lte: 10 } }),
    Order.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      }
    ])
  ]);

  // Aggregate Order KPIs from aggregation pipeline
  let totalRevenue = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  (orderAggregation || []).forEach(group => {
    totalRevenue += group.revenue || 0;
    const status = (group._id || '').toLowerCase();
    if (status === 'processing' || status === 'pending') {
      processingOrders += group.count;
    } else if (status === 'shipped') {
      shippedOrders += group.count;
    } else if (status === 'delivered') {
      deliveredOrders += group.count;
    } else if (status === 'cancelled') {
      cancelledOrders += group.count;
    }
  });

  // Calculate Database Memory / Storage
  let dbStorage = {
    dataSizeBytes: 0,
    storageSizeBytes: 0,
    totalSizeBytes: 0,
    formattedSize: '0 KB',
    totalRecords: totalProducts + totalUsers + totalCustomers + totalCoupons + totalOrders,
    collectionsCount: 6,
    isLiveMongo: false,
    source: 'Local MongoDB / In-Memory JSON'
  };

  try {
    if (mongoose.connection && mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const stats = await mongoose.connection.db.stats();
      const realDataSize = stats.dataSize || 0;
      const realStorageSize = stats.storageSize || 0;
      const realTotalSize = stats.totalSize || (realStorageSize + (stats.indexSize || 0));

      dbStorage = {
        dataSizeBytes: realDataSize,
        storageSizeBytes: realStorageSize,
        totalSizeBytes: realTotalSize,
        formattedSize: formatBytes(realDataSize > 0 ? realDataSize : realStorageSize),
        formattedStorageSize: formatBytes(realStorageSize),
        totalRecords: stats.objects || dbStorage.totalRecords,
        collectionsCount: stats.collections || 6,
        indexSizeBytes: stats.indexSize || 0,
        isLiveMongo: true,
        source: 'MongoDB Live Engine'
      };
    } else {
      // Fast lightweight estimate based on record count without memory spikes
      const estimatedBytes = dbStorage.totalRecords * 1024;
      dbStorage = {
        dataSizeBytes: estimatedBytes,
        storageSizeBytes: estimatedBytes,
        totalSizeBytes: estimatedBytes,
        formattedSize: formatBytes(estimatedBytes),
        formattedStorageSize: formatBytes(estimatedBytes),
        totalRecords: dbStorage.totalRecords,
        collectionsCount: 6,
        isLiveMongo: false,
        source: 'Creotex Application DB'
      };
    }
  } catch (err) {
    console.error('Database stats warning:', err.message);
  }

  res.json({
    success: true,
    data: {
      metrics: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalProducts,
        totalCustomers: totalCustomers || totalUsers,
        totalUsers,
        lowStockCount,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        databaseMemory: dbStorage
      },
      recentOrders,
      statusBreakdown: {
        Processing: processingOrders,
        Shipped: shippedOrders,
        Delivered: deliveredOrders,
        Cancelled: cancelledOrders
      }
    }
  });
});
