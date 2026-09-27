const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

// Middleware to check if user is authorized
const isAuthorized = async (req, res, next) => {
    try {
        // Handle case where cookies might be undefined
        const cookies = req.cookies || {};
        const { token } = cookies;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Please log in first.' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userRepository.findById(decodedToken.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User not found.' });
        }

        // Only admins can sign in; reject any older non-admin tokens
        if (user.role !== 1) {
            return res.status(401).json({ success: false, message: 'Please log in first.' });
        }

        req.user = user;
        next();
    } catch (error) {
        // Expected for old/expired tokens (e.g. after JWT_SECRET changed) — clear the cookie so the browser stops sending it
        logger.warn(`Rejected auth token: ${error.message}`);
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });
        return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
    }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ success: false, message: 'User not authenticated.' });
        }

        if (user.role !== 1) {
            return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
        }

        next();
    } catch (error) {
        logger.error('Error in isAdmin middleware:', error.message);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = {
    isAuthorized,
    isAdmin,
};
