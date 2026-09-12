import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public / Private (supports guests and authenticated users)
export const createOrder = asyncHandler(async (req, res) => {
  const {
    customer,
    items,
    subtotal,
    discount,
    shipping,
    tax,
    totalAmount,
    couponApplied,
    paymentMethod,
    paymentStatus
  } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  if (!customer || !customer.name || !customer.email || !customer.phone || !customer.address) {
    res.status(400);
    throw new Error('Customer information (name, email, phone, address, pincode) is required');
  }

  // Create Order in DB
  const order = new Order({
    user: req.user ? req.user._id : null,
    customer,
    items,
    subtotal: Number(subtotal) || 0,
    discount: Number(discount) || 0,
    shipping: Number(shipping) || 0,
    tax: Number(tax) || 0,
    totalAmount: Number(totalAmount) || 0,
    couponApplied: couponApplied || null,
    paymentMethod: paymentMethod || 'UPI (Google Pay)',
    paymentStatus: paymentStatus || 'Paid',
    orderStatus: 'Processing',
    timeline: [
      {
        status: 'Order Placed',
        note: `Order received via ${paymentMethod || 'UPI'}`
      }
    ]
  });

  const createdOrder = await order.save();

  // Deduct product stock & increment sales asynchronously
  try {
    for (const item of items) {
      if (item.id) {
        await Product.findOneAndUpdate(
          { $or: [{ customId: item.id }, { sku: item.sku }] },
          { $inc: { stock: -Math.abs(item.quantity || 1) } }
        );
      }
    }

    // Update or create Customer CRM entry
    if (customer.email) {
      await Customer.findOneAndUpdate(
        { email: customer.email.toLowerCase() },
        {
          $set: {
            name: customer.name,
            phone: customer.phone,
            city: customer.city,
            address: customer.address,
            pincode: customer.pincode
          },
          $inc: {
            totalOrders: 1,
            totalSpent: Math.round(Number(totalAmount) || 0)
          }
        },
        { upsert: true, new: true }
      );
    }
  } catch (err) {
    console.error('Non-critical inventory/customer update warning:', err.message);
  }

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: createdOrder
  });
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [
      { user: req.user._id },
      { 'customer.email': req.user.email.toLowerCase() }
    ]
  }).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.orderStatus = status;
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    filter.$or = [
      { orderId: new RegExp(s, 'i') },
      { 'customer.name': new RegExp(s, 'i') },
      { 'customer.email': new RegExp(s, 'i') },
      { trackingNumber: new RegExp(s, 'i') }
    ];
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get order by ID or orderId (e.g. 'ORD-9482')
// @route   GET /api/orders/:id
// @access  Public / Authenticated
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let order;
  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  }

  if (!order) {
    order = await Order.findOne({ orderId: id.toUpperCase() });
  }

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  res.json({
    success: true,
    data: order
  });
});

// @desc    Update order status, shipping & tracking
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { orderStatus, trackingNumber, trackingCarrier, note, paymentStatus } = req.body;

  let order;
  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  }
  if (!order) {
    order = await Order.findOne({ orderId: id.toUpperCase() });
  }

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
  if (trackingCarrier !== undefined) order.trackingCarrier = trackingCarrier;
  if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

  if (orderStatus || note) {
    order.timeline.push({
      status: orderStatus || order.orderStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${orderStatus}`
    });
  }

  const updatedOrder = await order.save();

  res.json({
    success: true,
    message: 'Order status updated successfully',
    data: updatedOrder
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let order;
  if (mongoose.Types.ObjectId.isValid(id)) {
    order = await Order.findById(id);
  }
  if (!order) {
    order = await Order.findOne({ orderId: id.toUpperCase() });
  }

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  await Order.deleteOne({ _id: order._id });

  res.json({
    success: true,
    message: 'Order deleted successfully'
  });
});
