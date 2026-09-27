/**
 * FormSubmission Validation Schemas using Zod
 */

const { z } = require('zod');

const createSubmissionSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').trim(),
    email: z.string().email('Invalid email format').trim().toLowerCase(),
    phone: z.string().min(1, 'Phone is required').trim(),
    formType: z.string().trim().default('contact'),
    subject: z.string().trim().optional(),
    message: z.string().trim().optional(),
    destinationCountry: z.string().trim().optional(),
    otherCountry: z.string().trim().optional(),
    visaType: z.string().trim().optional(),
    fromDate: z.string().trim().optional(),
    toDate: z.string().trim().optional(),
    purpose: z.string().trim().optional(),
    additionalData: z.record(z.any()).optional()
  })
});

const updateStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Submission ID is required')
  }),
  body: z.object({
    status: z.enum(['pending', 'reviewed', 'contacted', 'completed'], {
      errorMap: () => ({ message: 'Status must be one of: pending, reviewed, contacted, completed' })
    })
  })
});

const addAdminCommentSchema = z.object({
  params: z.object({
    submissionId: z.string().min(1, 'Submission ID is required'),
    documentId: z.string().min(1, 'Document ID is required')
  }),
  body: z.object({
    comment: z.string().min(1, 'Comment is required').trim()
  })
});

const addCustomerCommentSchema = z.object({
  params: z.object({
    submissionId: z.string().min(1, 'Submission ID is required')
  }),
  body: z.object({
    message: z.string().min(1, 'Message is required').trim()
  })
});

const getSubmissionByEmailSchema = z.object({
  params: z.object({
    email: z.string().email('Invalid email format')
  })
});

const deleteSubmissionSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Submission ID is required')
  })
});

const getFileUrlSchema = z.object({
  params: z.object({
    submissionId: z.string().min(1, 'Submission ID is required'),
    documentId: z.string().min(1, 'Document ID is required')
  })
});

module.exports = {
  createSubmissionSchema,
  updateStatusSchema,
  addAdminCommentSchema,
  addCustomerCommentSchema,
  getSubmissionByEmailSchema,
  deleteSubmissionSchema,
  getFileUrlSchema
};

