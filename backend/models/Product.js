import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Please enter product name'],
      trim: true
    },
    sku: {
      type: String,
      required: [true, 'Please enter SKU code'],
      unique: true,
      trim: true,
      uppercase: true
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true,
      index: true
    },
    categoryLabel: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Please enter selling price'],
      min: [0, 'Price must be non-negative']
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discount: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: [true, 'Please specify inventory stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isDeal: {
      type: Boolean,
      default: false
    },
    badge: {
      type: String,
      default: ''
    },
    shortDesc: {
      type: String,
      default: ''
    },
    fullDescription: {
      type: String,
      default: ''
    },
    specs: {
      type: Map,
      of: String,
      default: {}
    },
    tags: {
      type: [String],
      default: []
    },
    image: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      default: []
    },
    datasheetSku: {
      type: String,
      default: ''
    },
    subCategory: {
      type: String,
      default: '',
      trim: true,
      index: true
    },
    colors: [
      {
        name: { type: String, default: '' },
        hex: { type: String, default: '#000000' },
        image: { type: String, default: '' }
      }
    ],
    spoolTypes: {
      type: [String],
      default: ['Filament with Spool', 'Refill']
    },
    weights: {
      type: [String],
      default: ['1 kg', '3 kg']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual id mapping for frontend compatibility
productSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

// Text index for search
productSchema.index({
  name: 'text',
  shortDesc: 'text',
  sku: 'text',
  tags: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;
