/**
 * User Controller
 * Handles HTTP requests and responses
 * Only validates request, calls service, returns response
 */

const userService = require('../services/userService');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');
const { authCookieOptions } = require('../utils/cookieOptions');

class UserController {
  /**
   * Login user
   */
  login = asyncHandler(async (req, res) => {
    const { email, name, password } = req.body;
    const result = await userService.login(email, name, password);

    const token = result.token;
    res.cookie('token', token, {
      ...authCookieOptions(req),
      maxAge: 365 * 24 * 60 * 60 * 1000
    });

    return ApiResponse.success(res, { user: result.user, token }, 'Login successful');
  })

  /**
   * Logout user
   */
  logout = (req, res) => {
    res.clearCookie('token', authCookieOptions(req));

    return ApiResponse.success(res, null, 'Logged out successfully');
  }

  /**
   * Update user profile
   */
  updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    // Only allow profile fields — never role, email or password
    const { name, phone, address, city } = req.body;
    const updateData = Object.fromEntries(
      Object.entries({ name, phone, address, city }).filter(([, v]) => v !== undefined)
    );
    const result = await userService.updateProfile(userId, updateData);

    return ApiResponse.success(res, result, 'Profile updated successfully');
  })

  /**
   * Forgot password - sends reset email
   */
  forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    return ApiResponse.success(res, null, result.message);
  })

  /**
   * Reset password - validates token and sets new password
   */
  resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    const result = await userService.resetPassword(token, password);
    return ApiResponse.success(res, null, result.message);
  })
}

module.exports = new UserController();

