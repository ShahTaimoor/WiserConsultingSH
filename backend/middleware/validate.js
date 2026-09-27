/**
 * Validation Middleware
 * Validates request using Zod schemas and replaces the request data
 * with the parsed result, so fields not in the schema are stripped.
 */

const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query
      });

      // Only replace the parts the schema actually defines
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.params !== undefined) req.params = parsed.params;
      if (parsed.query !== undefined) {
        // Express 5 exposes req.query as a getter, so plain assignment is ignored
        Object.defineProperty(req, 'query', {
          value: parsed.query,
          writable: true,
          configurable: true,
          enumerable: true
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = validate;
