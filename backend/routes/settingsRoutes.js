const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');
const { uploadLogo } = require('../config/cloudinary');

// Public route to get current settings (used by website elements)
router.get('/settings', settingsController.getSettings);

// Admin route to update settings, including optional logo image file
router.put('/admin/settings', isAuthorized, isAdmin, uploadLogo.single('logo'), settingsController.updateSettings);

module.exports = router;
