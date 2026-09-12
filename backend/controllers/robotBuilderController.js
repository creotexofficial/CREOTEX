import asyncHandler from '../utils/asyncHandler.js';
import RobotBuilderConfig from '../models/RobotBuilder.js';

// @desc    Get Robot Builder presets, slots and configuration
// @route   GET /api/robot-builder
// @access  Public
export const getRobotBuilderData = asyncHandler(async (req, res) => {
  let config = await RobotBuilderConfig.findOne();

  if (!config) {
    config = {
      presets: {},
      slots: [],
      settings: {
        builderTitle: 'Custom Competition Combat & Race Robot Configurator',
        enableDiscounts: true,
        bundleDiscountPercent: 10
      }
    };
  }

  res.json({
    success: true,
    data: config
  });
});

// @desc    Update Robot Builder Presets
// @route   PUT /api/robot-builder/presets
// @access  Private/Admin
export const updatePresets = asyncHandler(async (req, res) => {
  let config = await RobotBuilderConfig.findOne();

  if (!config) {
    config = new RobotBuilderConfig();
  }

  config.presets = req.body.presets || config.presets;
  const updated = await config.save();

  res.json({
    success: true,
    message: 'Robot Builder presets updated successfully',
    data: updated.presets
  });
});

// @desc    Update Robot Builder Slots
// @route   PUT /api/robot-builder/slots
// @access  Private/Admin
export const updateSlots = asyncHandler(async (req, res) => {
  let config = await RobotBuilderConfig.findOne();

  if (!config) {
    config = new RobotBuilderConfig();
  }

  config.slots = req.body.slots || config.slots;
  const updated = await config.save();

  res.json({
    success: true,
    message: 'Robot Builder slots updated successfully',
    data: updated.slots
  });
});

// @desc    Update Robot Builder Global Settings
// @route   PUT /api/robot-builder/settings
// @access  Private/Admin
export const updateBuilderSettings = asyncHandler(async (req, res) => {
  let config = await RobotBuilderConfig.findOne();

  if (!config) {
    config = new RobotBuilderConfig();
  }

  config.settings = { ...config.settings, ...req.body };
  const updated = await config.save();

  res.json({
    success: true,
    message: 'Robot Builder settings updated successfully',
    data: updated.settings
  });
});
