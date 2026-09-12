import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide customer email'],
      unique: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    tier: {
      type: String,
      enum: ['Maker Pro', 'Enterprise Lab', 'Student Maker', 'Hobbyist', 'VIP'],
      default: 'Hobbyist'
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Suspended'],
      default: 'Active'
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    },
    joinedDate: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

customerSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
