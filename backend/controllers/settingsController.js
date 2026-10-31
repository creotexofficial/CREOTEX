import asyncHandler from '../utils/asyncHandler.js';
import StoreSettings from '../models/StoreSettings.js';

// @desc    Get store configuration and settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  let settings = await StoreSettings.findOne();

  if (!settings) {
    settings = await StoreSettings.create({
      storeName: 'CreotexShop Robotics & Maker Superstore',
      storeTagline: 'High-Performance Robotics Kits, Motors, Drivers & Prototyping Gear',
      contactEmail: 'admin@creotex.in',
      supportPhone: '+91 80 4912 8800',
      gstRate: 18,
      freeShippingThreshold: 999,
      standardShippingCost: 79,
      currencySymbol: '₹',
      announcementBanner: '⚡ Free Express Shipping on all Robotics Orders over ₹999 across India!',
      bannerActive: true,
      maintenanceMode: false
    });
  }

  res.json({
    success: true,
    data: settings
  });
});

// @desc    Update store settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await StoreSettings.findOne();

  if (!settings) {
    settings = new StoreSettings();
  }

  const fields = [
    'storeName', 'storeTagline', 'contactEmail', 'supportPhone',
    'gstRate', 'freeShippingThreshold', 'standardShippingCost',
    'currencySymbol', 'announcementBanner', 'bannerActive', 'maintenanceMode',
    'navbarCategories', 'heroSlides', 'heroSideBanners', 'filamentSubcategories',
    'flashDealsSettings', 'filamentSectionSettings'
  ];

  fields.forEach(f => {
    if (req.body[f] !== undefined) {
      settings[f] = req.body[f];
    }
  });

  const updatedSettings = await settings.save();

  res.json({
    success: true,
    message: 'Store settings updated successfully',
    data: updatedSettings
  });
});
