/**
 * Input Sanitization Middleware
 * Prevents XSS and injection attacks
 */

const sanitize = (req, res, next) => {
  // Recursively sanitize object
  const sanitizeObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return typeof obj === 'string' ? sanitizeString(obj) : obj;
    }

    // Handle Mongoose documents and special objects
    if (obj.constructor && obj.constructor.name === 'model') {
      // If it's a Mongoose document, convert to plain object
      try {
        obj = obj.toObject ? obj.toObject() : obj;
      } catch (e) {
        // If toObject fails, just return as is
        return obj;
      }
    }

    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }

    const sanitized = {};
    // Use Object.keys instead of hasOwnProperty for better compatibility
    for (const key of Object.keys(obj)) {
      try {
        sanitized[key] = sanitizeObject(obj[key]);
      } catch (e) {
        // Skip properties that can't be accessed
        continue;
      }
    }
    return sanitized;
  };

  // Basic string sanitization
  const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/[<>]/g, ''); // Remove angle brackets
  };

  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  // Express 5 exposes req.query as a getter, so plain assignment is silently ignored
  if (req.query && typeof req.query === 'object') {
    Object.defineProperty(req, 'query', {
      value: sanitizeObject(req.query),
      writable: true,
      configurable: true,
      enumerable: true
    });
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeObject(req.params);
  }

  next();
};

module.exports = sanitize;

