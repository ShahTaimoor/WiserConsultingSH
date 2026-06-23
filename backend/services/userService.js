/**
 * User Service
 * Business logic for user operations
 */

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../middleware/errorHandler');

class UserService {
  /**
   * Sign up a new user
   */
  async signup(name, email, password) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmailOrName(email, name);
    if (existingUser) {
      throw new AppError('User with this email or name already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword
    });

    // Remove password from response
    user.password = undefined;

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Login user
   */
  async login(email, name, password) {
    // Find user by email or name
    let user = await userRepository.findByEmail(email);
    if (!user && name) {
      user = await userRepository.findByName(name);
    }

    if (!user) {
      throw new AppError('Invalid credentials', 400);
    }

    // Check if user has password (not Google-only user)
    if (!user.password) {
      throw new AppError('Please use Google authentication', 400);
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 400);
    }

    // Generate JWT token
    const token = this.generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    return {
      user,
      token
    };
  }

  /**
   * Get all users with pagination
   */
  async getAllUsers(skip, limit) {
    const { users, total } = await userRepository.findAll(skip, limit);
    return { users, total };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await userRepository.updateById(userId, updateData);
    updatedUser.password = undefined;

    return {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city
      }
    };
  }

  /**
   * Update user role (Admin only)
   */
  async updateUserRole(userId, role) {
    if (role === undefined || role === null) {
      throw new AppError('Role is required', 400);
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await userRepository.updateById(userId, { role });
    updatedUser.password = undefined;

    return {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        role: updatedUser.role,
        phone: updatedUser.phone,
        address: updatedUser.address,
        city: updatedUser.city
      }
    };
  }

  /**
   * Create admin user
   */
  async createAdmin(name, email, password) {
    // Check if user already exists
    const existingUser = await userRepository.findByEmailOrName(email, name);
    if (existingUser) {
      throw new AppError('User with this email or name already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const user = await userRepository.create({
      name,
      email,
      password: hashedPassword,
      role: 1 // Admin role
    });

    user.password = undefined;

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * Handle Google OAuth user
   * Fetches user info from Google and handles authentication
   */
  async handleGoogleAuth(accessToken) {
    // Fetch user info from Google
    const googleResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    );
    
    if (!googleResponse.ok) {
      throw new AppError('Failed to fetch user info from Google', 400);
    }

    const googleUser = await googleResponse.json();

    if (!googleUser.id) {
      throw new AppError('Invalid access token', 400);
    }

    // Check if user exists by Google ID
    let user = await userRepository.findByGoogleId(googleUser.id);

    if (user) {
      // User exists, generate token
      const token = this.generateToken(user._id);
      user.password = undefined;
      return { user, token };
    }

    // Check if user exists with same email
    user = await userRepository.findByEmail(googleUser.email);

    if (user) {
      // Link Google account to existing user
      await userRepository.updateById(user._id, {
        googleId: googleUser.id,
        avatar: googleUser.picture
      });
      const updatedUser = await userRepository.findById(user._id);
      const token = this.generateToken(updatedUser._id);
      updatedUser.password = undefined;
      return { user: updatedUser, token };
    }

    // Create new user
    user = await userRepository.create({
      googleId: googleUser.id,
      name: googleUser.name,
      email: googleUser.email,
      avatar: googleUser.picture
    });

    const token = this.generateToken(user._id);
    user.password = undefined;

    return { user, token };
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXP || '365d' }
    );
  }

  /**
   * Forgot password – generates reset token and sends email
   */
  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      // Return generic message so we don't leak whether the email exists
      return { message: 'If that email is registered, a reset link has been sent.' };
    }

    if (!user.password) {
      throw new AppError('This account uses Google sign-in. Password reset is not available.', 400);
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

    await userRepository.updateById(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: new Date(tokenExpiry)
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Wiser Consulting" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px">
          <h2 style="color:#1e293b;margin-bottom:8px">Reset Your Password</h2>
          <p style="color:#475569;margin-bottom:24px">Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;background:#1e293b;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px">If you didn't request this, you can safely ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
          <p style="color:#94a3b8;font-size:12px">Or copy this link: <a href="${resetUrl}" style="color:#64748b">${resetUrl}</a></p>
        </div>
      `
    });

    return { message: 'If that email is registered, a reset link has been sent.' };
  }

  /**
   * Reset password – validates token and updates password
   */
  async resetPassword(token, newPassword) {
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      throw new AppError('Invalid or expired reset token.', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updateById(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return { message: 'Password has been reset successfully. You can now log in.' };
  }
}

module.exports = new UserService();

