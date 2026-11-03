import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  id: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  sku: { type: String, default: '' },
  image: { type: String, default: '' }
});

const customerInfoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: '' },
  pincode: { type: String, required: true }
});

const statusTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    customer: customerInfoSchema,
    items: [orderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    shipping: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    couponApplied: {
      type: String,
      default: null
    },
    paymentMethod: {
      type: String,
      default: 'UPI (Google Pay)'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
      default: 'Pending'
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing'
    },
    trackingNumber: {
      type: String,
      default: ''
    },
    trackingCarrier: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    timeline: [statusTimelineSchema]
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual id mapping for frontend compatibility
orderSchema.virtual('id').get(function () {
  return this.orderId || this._id.toHexString();
});

// Performance indexes for admin listing and customer lookups
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ 'customer.email': 1 });
orderSchema.index({ user: 1 });

// Auto-generate orderId if not provided
orderSchema.pre('save', function (next) {
  if (!this.orderId) {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    this.orderId = `ORD-${randomNum}`;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
