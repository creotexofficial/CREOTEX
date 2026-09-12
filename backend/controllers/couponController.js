import asyncHandler from '../utils/asyncHandler.js';
import Coupon from '../models/Coupon.js';

// @desc    Validate coupon code against subtotal
// @route   POST /api/coupons/validate
// @access  Public
export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;

  if (!code) {
    res.status(400);
    throw new Error('Please provide coupon code');
  }

  const coupon = await Coupon.findOne({
    code: code.trim().toUpperCase(),
    isActive: true
  });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid or expired coupon code');
  }

  // Check expiry date
  if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
    res.status(400);
    throw new Error('This coupon code has expired');
  }

  // Check minimum order value
  const cartSubtotal = Number(subtotal) || 0;
  if (coupon.minOrderValue && cartSubtotal < coupon.minOrderValue) {
    res.status(400);
    throw new Error(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon`);
  }

  // Check usage limit
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error('Coupon usage limit reached');
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (cartSubtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  res.json({
    success: true,
    message: `Coupon '${coupon.code}' applied successfully!`,
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.min(discountAmount, cartSubtotal),
      minOrderValue: coupon.minOrderValue,
      maxDiscount: coupon.maxDiscount
    }
  });
});

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons
// @access  Public / Admin
export const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  res.json({
    success: true,
    count: coupons.length,
    data: coupons
  });
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    expiryDate,
    usageLimit,
    isActive,
    description
  } = req.body;

  if (!code || discountValue === undefined) {
    res.status(400);
    throw new Error('Coupon code and discount value are required');
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    res.status(400);
    throw new Error('A coupon with this code already exists');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    minOrderValue: minOrderValue ? Number(minOrderValue) : 0,
    maxDiscount: maxDiscount ? Number(maxDiscount) : null,
    expiryDate: expiryDate ? new Date(expiryDate) : null,
    usageLimit: usageLimit ? Number(usageLimit) : 1000,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    description: description || ''
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  if (req.body.code) coupon.code = req.body.code.toUpperCase();
  if (req.body.discountType) coupon.discountType = req.body.discountType;
  if (req.body.discountValue !== undefined) coupon.discountValue = Number(req.body.discountValue);
  if (req.body.minOrderValue !== undefined) coupon.minOrderValue = Number(req.body.minOrderValue);
  if (req.body.maxDiscount !== undefined) coupon.maxDiscount = req.body.maxDiscount ? Number(req.body.maxDiscount) : null;
  if (req.body.expiryDate !== undefined) coupon.expiryDate = req.body.expiryDate ? new Date(req.body.expiryDate) : null;
  if (req.body.usageLimit !== undefined) coupon.usageLimit = Number(req.body.usageLimit);
  if (req.body.isActive !== undefined) coupon.isActive = Boolean(req.body.isActive);
  if (req.body.description !== undefined) coupon.description = req.body.description;

  const updatedCoupon = await coupon.save();

  res.json({
    success: true,
    message: 'Coupon updated successfully',
    data: updatedCoupon
  });
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }

  await Coupon.deleteOne({ _id: coupon._id });

  res.json({
    success: true,
    message: 'Coupon removed successfully'
  });
});
