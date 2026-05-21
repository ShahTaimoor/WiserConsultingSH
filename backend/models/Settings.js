const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    logoUrl: {
      type: String,
      default: '/logo.png',
    },
    socialLinks: {
      facebook: {
        type: String,
        default: '',
        trim: true,
      },
      instagram: {
        type: String,
        default: '',
        trim: true,
      },
      linkedin: {
        type: String,
        default: '',
        trim: true,
      },
    },
    contactInfo: {
      email: {
        type: String,
        default: 'taimour448@gmail.com',
        trim: true,
        lowercase: true,
      },
      phone: {
        type: String,
        default: '+92 313 0922988',
        trim: true,
      },
      phone2: {
        type: String,
        default: '+92 3065779097',
        trim: true,
      },
      address: {
        type: String,
        default: 'Deans Trade Center, UG 390, Peshawar, Pakistan',
        trim: true,
      },
      officeHours: {
        type: String,
        default: 'Monday - Saturday: 9:00 AM - 6:00 PM PKT',
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Settings', settingsSchema);
