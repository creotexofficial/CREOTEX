import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Customer from '../models/Customer.js';

// @desc    Get all customers with filtering & search
// @route   GET /api/customers
// @access  Private/Admin
export const getAllCustomers = asyncHandler(async (req, res) => {
  const { tier, status, search } = req.query;
  const filter = {};

  if (tier && tier !== 'all') {
    filter.tier = tier;
  }

  if (status && status !== 'all') {
    filter.status = status;
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    filter.$or = [
      { name: new RegExp(s, 'i') },
      { email: new RegExp(s, 'i') },
      { phone: new RegExp(s, 'i') },
      { city: new RegExp(s, 'i') }
    ];
  }

  const customers = await Customer.find(filter).sort({ totalSpent: -1, createdAt: -1 });

  res.json({
    success: true,
    count: customers.length,
    data: customers
  });
});

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
// @access  Private/Admin
export const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  res.json({
    success: true,
    data: customer
  });
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Private/Admin
export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, tier, city, address, state, pincode, status } = req.body;

  if (!name || !email) {
    res.status(400);
    throw new Error('Customer name and email are required');
  }

  const existing = await Customer.findOne({ email: email.toLowerCase() });
  if (existing) {
    res.status(400);
    throw new Error('A customer with this email already exists');
  }

  const customer = await Customer.create({
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    tier: tier || 'Hobbyist',
    city: city || '',
    address: address || '',
    state: state || '',
    pincode: pincode || '',
    status: status || 'Active'
  });

  res.status(201).json({
    success: true,
    message: 'Customer record created successfully',
    data: customer
  });
});

// @desc    Update customer details & status
// @route   PUT /api/customers/:id
// @access  Private/Admin
export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const fields = ['name', 'email', 'phone', 'tier', 'city', 'state', 'address', 'pincode', 'status', 'totalOrders', 'totalSpent'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      customer[f] = req.body[f];
    }
  });

  const updatedCustomer = await customer.save();

  res.json({
    success: true,
    message: 'Customer updated successfully',
    data: updatedCustomer
  });
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = asyncHandler(async (req, res) => {
  const identifier = req.params.id;
  let customer;

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    customer = await Customer.findById(identifier);
  }
  if (!customer) {
    customer = await Customer.findOne({ customId: identifier });
  }

  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  await Customer.deleteOne({ _id: customer._id });

  res.json({
    success: true,
    message: 'Customer removed successfully'
  });
});
