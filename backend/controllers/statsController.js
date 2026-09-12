import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Coupon from '../models/Coupon.js';
import Datasheet from '../models/Datasheet.js';
import StoreSettings from '../models/StoreSettings.js';
import RobotBuilderConfig from '../models/RobotBuilder.js';

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
  // Parallel aggregate queries for high performance
  const [
    totalProducts,
    totalUsers,
    totalCustomers,
    totalCoupons,
    totalDatasheets,
    orders,
    recentOrders,
    productsList,
    usersList,
    customersList,
    datasheetsList,
    couponsList,
    settingsData,
    builderConfigData
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments(),
    Customer.countDocuments(),
    Coupon.countDocuments(),
    Datasheet.countDocuments(),
    Order.find({}),
    Order.find({}).sort({ createdAt: -1 }).limit(5),
    Product.find({}),
    User.find({}).select('-password'),
    Customer.find({}),
    Datasheet.find({}),
    Coupon.find({}),
    StoreSettings.findOne(),
    RobotBuilderConfig.findOne()
  ]);

  // Aggregate Order KPIs
  let totalRevenue = 0;
  let processingOrders = 0;
  let shippedOrders = 0;
  let deliveredOrders = 0;
  let cancelledOrders = 0;

  orders.forEach((order) => {
    totalRevenue += order.totalAmount || 0;
    if (order.orderStatus === 'Processing' || order.orderStatus === 'Pending') {
      processingOrders++;
    } else if (order.orderStatus === 'Shipped') {
      shippedOrders++;
    } else if (order.orderStatus === 'Delivered') {
      deliveredOrders++;
    } else if (order.orderStatus === 'Cancelled') {
      cancelledOrders++;
    }
  });

  // Calculate low stock products
  const lowStockCount = await Product.countDocuments({
    isActive: true,
    stock: { $lte: 10 }
  });

  // Calculate REAL Database Memory / Storage
  let dbStorage = {
    dataSizeBytes: 0,
    storageSizeBytes: 0,
    totalSizeBytes: 0,
    formattedSize: '0 KB',
    totalRecords: totalProducts + totalUsers + totalCustomers + totalCoupons + totalDatasheets + orders.length,
    collectionsCount: 8,
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
        collectionsCount: stats.collections || 8,
        indexSizeBytes: stats.indexSize || 0,
        isLiveMongo: true,
        source: 'MongoDB Live Engine'
      };
    } else {
      // Calculate accurate UTF-8 byte length from stored documents payload
      const fullPayload = {
        products: productsList,
        users: usersList,
        customers: customersList,
        orders,
        datasheets: datasheetsList,
        coupons: couponsList,
        settings: settingsData,
        builder: builderConfigData
      };
      const jsonStr = JSON.stringify(fullPayload);
      const byteLength = Buffer.byteLength(jsonStr, 'utf8');

      dbStorage = {
        dataSizeBytes: byteLength,
        storageSizeBytes: byteLength,
        totalSizeBytes: byteLength,
        formattedSize: formatBytes(byteLength),
        formattedStorageSize: formatBytes(byteLength),
        totalRecords: dbStorage.totalRecords,
        collectionsCount: 8,
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
        totalOrders: orders.length,
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

