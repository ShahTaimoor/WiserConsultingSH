/**
 * User Routes
 * Only routes - no business logic, no DB queries
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const {
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require('../validations/userValidation');

// Login (admin only)
router.post('/login', authLimiter, validate(loginSchema), userController.login.bind(userController));

// Logout
router.get('/logout', userController.logout.bind(userController));
router.post('/logout', userController.logout.bind(userController));

// Update profile (Authorized users)
router.put(
  '/update-profile',
  isAuthorized,
  validate(updateProfileSchema),
  userController.updateProfile.bind(userController)
);

// Forgot password - send reset email
router.post(
  '/forgot-password',
  authLimiter,
  validate(forgotPasswordSchema),
  userController.forgotPassword.bind(userController)
);

// Reset password - set new password with token
router.post(
  '/reset-password',
  authLimiter,
  validate(resetPasswordSchema),
  userController.resetPassword.bind(userController)
);

module.exports = router;
