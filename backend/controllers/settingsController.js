const Settings = require('../models/Settings');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class SettingsController {
  // Get site settings
  getSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if doesn't exist
      settings = await Settings.create({});
      logger.info('Default site settings initialized in database');
    }
    
    return apiResponse.success(res, settings, 'Settings retrieved successfully');
  });

  // Update site settings
  updateSettings = asyncHandler(async (req, res) => {
    let settings = await Settings.findOne();
    
    const updates = {};

    // Parse social links
    if (req.body.socialLinks) {
      try {
        updates.socialLinks = typeof req.body.socialLinks === 'string' 
          ? JSON.parse(req.body.socialLinks) 
          : req.body.socialLinks;
      } catch (err) {
        updates.socialLinks = req.body.socialLinks;
      }
    } else {
      updates.socialLinks = {
        facebook: req.body['socialLinks.facebook'] !== undefined ? req.body['socialLinks.facebook'] : (settings?.socialLinks?.facebook || ''),
        instagram: req.body['socialLinks.instagram'] !== undefined ? req.body['socialLinks.instagram'] : (settings?.socialLinks?.instagram || ''),
        linkedin: req.body['socialLinks.linkedin'] !== undefined ? req.body['socialLinks.linkedin'] : (settings?.socialLinks?.linkedin || ''),
      };
    }

    // Parse contact info
    if (req.body.contactInfo) {
      try {
        updates.contactInfo = typeof req.body.contactInfo === 'string' 
          ? JSON.parse(req.body.contactInfo) 
          : req.body.contactInfo;
      } catch (err) {
        updates.contactInfo = req.body.contactInfo;
      }
    } else {
      updates.contactInfo = {
        email: req.body['contactInfo.email'] !== undefined ? req.body['contactInfo.email'] : (settings?.contactInfo?.email || 'taimour448@gmail.com'),
        phone: req.body['contactInfo.phone'] !== undefined ? req.body['contactInfo.phone'] : (settings?.contactInfo?.phone || '+92 313 0922988'),
        phone2: req.body['contactInfo.phone2'] !== undefined ? req.body['contactInfo.phone2'] : (settings?.contactInfo?.phone2 || '+92 3065779097'),
        address: req.body['contactInfo.address'] !== undefined ? req.body['contactInfo.address'] : (settings?.contactInfo?.address || 'Deans Trade Center, UG 390, Peshawar, Pakistan'),
        officeHours: req.body['contactInfo.officeHours'] !== undefined ? req.body['contactInfo.officeHours'] : (settings?.contactInfo?.officeHours || 'Monday - Saturday: 9:00 AM - 6:00 PM PKT'),
      };
    }

    // Handle uploaded file (logo)
    if (req.file && req.file.path) {
      updates.logoUrl = req.file.path; // Cloudinary URL
    } else if (req.body.logoUrl !== undefined) {
      updates.logoUrl = req.body.logoUrl;
    }

    if (!settings) {
      settings = await Settings.create(updates);
      logger.info('Site settings created');
    } else {
      settings = await Settings.findOneAndUpdate(
        {},
        updates,
        { new: true, runValidators: true }
      );
      logger.info('Site settings updated');
    }
    
    return apiResponse.success(res, settings, 'Settings updated successfully');
  });
}

module.exports = new SettingsController();
