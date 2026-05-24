const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['web', 'mobile', 'enterprise', 'other'],
      default: 'web',
    },
    images: [{
      type: String,
      trim: true,
    }],
    technologies: [{
      type: String,
      trim: true,
    }],
    link: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

portfolioSchema.index({ category: 1 });
portfolioSchema.index({ isActive: 1 });
portfolioSchema.index({ isDeleted: 1 });
portfolioSchema.index({ order: 1 });

module.exports = mongoose.model('Portfolio', portfolioSchema);
