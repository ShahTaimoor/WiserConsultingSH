// server.js
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const path = require("path");
require("dotenv").config();
require("./config/passport");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const formSubmissionRoutes = require('./routes/formSubmissionRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const teamRoutes = require('./routes/teamRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const contentRoutes = require('./routes/contentRoutes');
const contactRoutes = require('./routes/contactRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { apiLimiter, authLimiter, uploadLimiter } = require('./middleware/rateLimiter');
const sanitize = require('./middleware/sanitize');
const logger = require('./utils/logger');

const app = express();

// Middlewares
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
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
};
app.use(cors(corsOptions));

// Input sanitization (must be before body parsing)
app.use(sanitize);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
app.use('/api', apiLimiter);

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes with rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api', userRoutes);
app.use('/api', formSubmissionRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', teamRoutes);
app.use('/api', serviceRoutes);
app.use('/api', contentRoutes);
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
    console.error('Full error details:', error);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
};

startServer();
