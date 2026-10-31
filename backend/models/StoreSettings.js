import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      default: 'CreotexShop Robotics & Maker Superstore'
    },
    storeTagline: {
      type: String,
      default: 'High-Performance Robotics Kits, Motors, Drivers & Prototyping Gear'
    },
    contactEmail: {
      type: String,
      default: 'admin@creotex.in'
    },
    supportPhone: {
      type: String,
      default: '+91 80 4912 8800'
    },
    gstRate: {
      type: Number,
      default: 18
    },
    freeShippingThreshold: {
      type: Number,
      default: 999
    },
    standardShippingCost: {
      type: Number,
      default: 79
    },
    currencySymbol: {
      type: String,
      default: '₹'
    },
    announcementBanner: {
      type: String,
      default: '⚡ Free Express Shipping on all Robotics Orders over ₹999 across India!'
    },
    bannerActive: {
      type: Boolean,
      default: true
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    navbarCategories: {
      type: [mongoose.Schema.Types.Mixed],
      default: undefined
    },
    heroSlides: {
      type: [mongoose.Schema.Types.Mixed],
      default: undefined
    },
    heroSideBanners: {
      type: [mongoose.Schema.Types.Mixed],
      default: undefined
    },
    filamentSubcategories: {
      type: [mongoose.Schema.Types.Mixed],
      default: undefined
    },
    flashDealsSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined
    },
    filamentSectionSettings: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined
    }
  },
  {
    timestamps: true
  }
);

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);

export default StoreSettings;
