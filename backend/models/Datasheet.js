import mongoose from 'mongoose';

const datasheetSchema = new mongoose.Schema(
  {
    customId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Please provide datasheet title'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Please select category'],
      trim: true
    },
    format: {
      type: String,
      default: 'PDF'
    },
    size: {
      type: String,
      default: '1.5 MB'
    },
    downloads: {
      type: Number,
      default: 0
    },
    sku: {
      type: String,
      default: '',
      trim: true
    },
    fileUrl: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    lastUpdated: {
      type: String,
      default: () => new Date().toISOString().split('T')[0]
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

datasheetSchema.virtual('id').get(function () {
  return this.customId || this._id.toHexString();
});

const Datasheet = mongoose.model('Datasheet', datasheetSchema);

export default Datasheet;
