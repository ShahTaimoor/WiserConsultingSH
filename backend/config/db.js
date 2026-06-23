// config/db.js
const mongoose = require("mongoose");
const dns = require('dns');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        // Fix local Node SRV resolution issues for mongodb+srv URIs
        dns.setServers(['8.8.8.8', '8.8.4.4']);

        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI environment variable is not defined");
        }

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        logger.info('✅ MongoDB connected successfully');

        mongoose.connection.on('connected', () => {
            logger.info(`MongoDB connected to ${mongoose.connection.host}:${mongoose.connection.port}`);
        });

        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
        });

    } catch (err) {
        logger.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
