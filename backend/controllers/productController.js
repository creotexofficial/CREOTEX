import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';

// @desc    Fetch all products with filtering, search & sorting
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    tag,
    search,
    minPrice,
    maxPrice,
    sort,
    featured,
    deal,
    page = 1,
    limit = 100
  } = req.query;

  const query = { isActive: true };

  // Category filter
  if (category && category !== 'all') {
    query.category = category;
  }

  // Tag filter
  if (tag && tag !== 'all') {
    query.tags = { $in: [tag] };
  }

  // Featured or Deal flags
  if (featured === 'true') {
    query.isFeatured = true;
  }
  if (deal === 'true') {
    query.isDeal = true;
  }

  // Price range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Search keyword (matches name, shortDesc, sku, or tags)
  if (search && search.trim() !== '') {
    const searchRegex = new RegExp(search.trim(), 'i');
    query.$or = [
      { name: searchRegex },
      { shortDesc: searchRegex },
      { sku: searchRegex },
      { category: searchRegex },
      { categoryLabel: searchRegex },
      { tags: { $in: [searchRegex] } }
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-low') {
    sortOption = { price: 1 };
  } else if (sort === 'price-high') {
    sortOption = { price: -1 };
  } else if (sort === 'rating') {
    sortOption = { rating: -1, reviewsCount: -1 };
  } else if (sort === 'featured') {
    sortOption = { isFeatured: -1, rating: -1 };
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limitNum);

  res.json({
    success: true,
    count: products.length,
    total,
    totalPages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: products
  });
});

// @desc    Fetch single product by ID or customId (e.g. 'fast-001')
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }

  if (!product) {
    product = await Product.findOne({ customId: id });
  }

  if (!product) {
    product = await Product.findOne({ sku: id.toUpperCase() });
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found in catalog');
  }

  res.json({
    success: true,
    data: product
  });
});

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    sku,
    category,
    categoryLabel,
    price,
    originalPrice,
    discount,
    stock,
    isBestSeller,
    isFeatured,
    isDeal,
    badge,
    shortDesc,
    specs,
    tags,
    image,
    datasheetSku,
    subCategory,
    colors,
    spoolTypes,
    weights
  } = req.body;

  if (!name || !sku || !category || price === undefined) {
    res.status(400);
    throw new Error('Please provide name, sku, category, and price');
  }

  const customId = req.body.customId || `ctx-${Date.now()}`;

  const product = await Product.create({
    customId,
    name,
    sku: sku.toUpperCase(),
    category,
    categoryLabel: categoryLabel || category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    discount: discount || '',
    stock: Number(stock) || 0,
    isBestSeller: Boolean(isBestSeller),
    isFeatured: Boolean(isFeatured),
    isDeal: Boolean(isDeal),
    badge: badge || '',
    shortDesc: shortDesc || '',
    specs: specs || {},
    tags: Array.isArray(tags) ? tags : [],
    image: image || 'default-component',
    datasheetSku: datasheetSku || '',
    subCategory: subCategory || '',
    colors: Array.isArray(colors) ? colors : [],
    spoolTypes: Array.isArray(spoolTypes) ? spoolTypes : ['Filament with Spool', 'Refill'],
    weights: Array.isArray(weights) ? weights : ['1 kg', '3 kg']
  });

  res.status(201).json({
    success: true,
    message: 'Product added successfully to catalog',
    data: product
  });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({ customId: id });
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fieldsToUpdate = [
    'name', 'sku', 'category', 'categoryLabel', 'price', 'originalPrice',
    'discount', 'rating', 'reviewsCount', 'stock', 'isBestSeller',
    'isFeatured', 'isDeal', 'badge', 'shortDesc', 'fullDescription',
    'specs', 'tags', 'image', 'datasheetSku', 'isActive',
    'subCategory', 'colors', 'spoolTypes', 'weights'
  ];

  fieldsToUpdate.forEach((field) => {
    if (req.body[field] !== undefined) {
      if (field === 'sku') {
        product[field] = req.body[field].toUpperCase();
      } else {
        product[field] = req.body[field];
      }
    }
  });

  const updatedProduct = await product.save();

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let product;
  if (mongoose.Types.ObjectId.isValid(id)) {
    product = await Product.findById(id);
  }
  if (!product) {
    product = await Product.findOne({ customId: id });
  }

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Product.deleteOne({ _id: product._id });

  res.json({
    success: true,
    message: 'Product removed from catalog'
  });
});

// @desc    Get product categories with counts
// @route   GET /api/products/categories/all
// @access  Public
export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$category',
        label: { $first: '$categoryLabel' },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: categories
  });
});
