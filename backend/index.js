// server.js
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const portfolioRoutes = require('./routes/portfolioRoutes');
const teamRoutes = require('./routes/teamRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');
const sanitize = require('./middleware/sanitize');
const logger = require('./utils/logger');

const app = express();

// Running behind Nginx: trust the first proxy so req.ip (and rate limiting) uses the real client IP
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  "https://tech.wiserconsulting.info",
  "https://www.wiserconsulting.info"
];


const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy does not allow access from ${origin}`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Input sanitization (must be after body parsing so req.body exists)
app.use(sanitize);

// Rate limiting
app.use('/api', apiLimiter);

// API Routes with rate limiting
app.use('/api', userRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', teamRoutes);
app.use('/api', contactRoutes);
app.use('/api', settingsRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  });
});

// Central Error Handler (must be last)
const { errorHandler } = require('./middleware/errorHandler');
app.use(errorHandler);

// Start server only after MongoDB connection is established
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      logger.info(`✅ Server running on port ${PORT}`);
      logger.info(`✅ Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
