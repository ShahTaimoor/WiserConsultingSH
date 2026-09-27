/**
 * User Validation Schemas using Zod
 */

const { z } = require('zod');

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').trim().toLowerCase().optional(),
    name: z.string().min(1, 'Name is required').trim().optional(),
    password: z.string().min(1, 'Password is required')
  }).refine(data => data.email || data.name, {
    message: 'Either email or name is required'
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(1).trim().optional(),
    phone: z.string().trim().optional(),
    address: z.string().trim().optional(),
    city: z.string().trim().optional()
  })
});

const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format').trim().toLowerCase()
  })
});

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters')
  })
});

module.exports = {
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema
};

