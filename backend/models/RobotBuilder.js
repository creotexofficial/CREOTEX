import mongoose from 'mongoose';

const builderOptionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String, default: '' },
  badge: { type: String, default: '' },
  specs: { type: Map, of: String, default: {} }
});

const builderSlotSchema = new mongoose.Schema({
  key: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  options: [builderOptionSchema]
});

const builderPresetSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '🤖' },
  desc: { type: String, default: '' },
  active: { type: Boolean, default: true },
  defaults: {
    type: Map,
    of: String,
    default: {}
  }
});

const robotBuilderConfigSchema = new mongoose.Schema(
  {
    presets: {
      type: Map,
      of: builderPresetSchema,
      default: {}
    },
    slots: [builderSlotSchema],
    settings: {
      builderTitle: {
        type: String,
        default: 'Custom Competition Combat & Race Robot Configurator'
      },
      enableDiscounts: {
        type: Boolean,
        default: true
      },
      bundleDiscountPercent: {
        type: Number,
        default: 10
      }
    }
  },
  {
    timestamps: true
  }
);

const RobotBuilderConfig = mongoose.model('RobotBuilderConfig', robotBuilderConfigSchema);

export default RobotBuilderConfig;
