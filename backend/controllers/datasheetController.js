import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Datasheet from '../models/Datasheet.js';

// @desc    Get all technical datasheets & CAD files
// @route   GET /api/datasheets
// @access  Public
export const getAllDatasheets = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category && category !== 'all') {
    filter.category = category;
  }

  if (search && search.trim() !== '') {
    const s = search.trim();
    filter.$or = [
      { title: new RegExp(s, 'i') },
      { sku: new RegExp(s, 'i') },
      { category: new RegExp(s, 'i') }
    ];
  }

  const datasheets = await Datasheet.find(filter).sort({ downloads: -1, createdAt: -1 });

  res.json({
    success: true,
    count: datasheets.length,
    data: datasheets
  });
});

// @desc    Get datasheet by ID or customId (e.g. 'DS-001')
// @route   GET /api/datasheets/:id
// @access  Public
export const getDatasheetById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let datasheet;
  if (mongoose.Types.ObjectId.isValid(id)) {
    datasheet = await Datasheet.findById(id);
  }
  if (!datasheet) {
    datasheet = await Datasheet.findOne({ customId: id });
  }

  if (!datasheet) {
    res.status(404);
    throw new Error('Datasheet not found');
  }

  res.json({
    success: true,
    data: datasheet
  });
});

// @desc    Track download and increment download counter
// @route   POST /api/datasheets/:id/download
// @access  Public
export const trackDownload = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let datasheet;
  if (mongoose.Types.ObjectId.isValid(id)) {
    datasheet = await Datasheet.findById(id);
  }
  if (!datasheet) {
    datasheet = await Datasheet.findOne({ customId: id });
  }

  if (!datasheet) {
    res.status(404);
    throw new Error('Datasheet not found');
  }

  datasheet.downloads += 1;
  await datasheet.save();

  res.json({
    success: true,
    message: 'Download tracked successfully',
    downloads: datasheet.downloads
  });
});

// @desc    Create new datasheet entry
// @route   POST /api/datasheets
// @access  Private/Admin
export const createDatasheet = asyncHandler(async (req, res) => {
  const { title, category, format, size, sku, fileUrl, description } = req.body;

  if (!title || !category) {
    res.status(400);
    throw new Error('Title and category are required');
  }

  const customId = req.body.customId || `DS-${Date.now().toString().slice(-4)}`;

  const datasheet = await Datasheet.create({
    customId,
    title,
    category,
    format: format || 'PDF',
    size: size || '1.5 MB',
    sku: sku || '',
    fileUrl: fileUrl || '',
    description: description || '',
    downloads: 0
  });

  res.status(201).json({
    success: true,
    message: 'Datasheet uploaded successfully',
    data: datasheet
  });
});

// @desc    Update datasheet
// @route   PUT /api/datasheets/:id
// @access  Private/Admin
export const updateDatasheet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let datasheet;
  if (mongoose.Types.ObjectId.isValid(id)) {
    datasheet = await Datasheet.findById(id);
  }
  if (!datasheet) {
    datasheet = await Datasheet.findOne({ customId: id });
  }

  if (!datasheet) {
    res.status(404);
    throw new Error('Datasheet not found');
  }

  const fields = ['title', 'category', 'format', 'size', 'sku', 'fileUrl', 'description', 'downloads'];
  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      datasheet[f] = req.body[f];
    }
  });

  datasheet.lastUpdated = new Date().toISOString().split('T')[0];

  const updatedDatasheet = await datasheet.save();

  res.json({
    success: true,
    message: 'Datasheet updated successfully',
    data: updatedDatasheet
  });
});

// @desc    Delete datasheet
// @route   DELETE /api/datasheets/:id
// @access  Private/Admin
export const deleteDatasheet = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let datasheet;
  if (mongoose.Types.ObjectId.isValid(id)) {
    datasheet = await Datasheet.findById(id);
  }
  if (!datasheet) {
    datasheet = await Datasheet.findOne({ customId: id });
  }

  if (!datasheet) {
    res.status(404);
    throw new Error('Datasheet not found');
  }

  await Datasheet.deleteOne({ _id: datasheet._id });

  res.json({
    success: true,
    message: 'Datasheet removed successfully'
  });
});
