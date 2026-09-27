/**
 * Assessment Routes
 * Only routes - no business logic, no DB queries
 */

const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const { uploadFields, uploadFieldsLocal } = require('../config/cloudinary');
const validate = require('../middleware/validate');
const { isAuthorized, isAdmin } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');
const { createSubmissionSchema } = require('../validations/formSubmissionValidation');

// Submit assessment (Cloudinary)
router.post(
  '/submit-assessment',
  uploadLimiter,
  uploadFields,
  validate(createSubmissionSchema),
  assessmentController.createSubmission.bind(assessmentController)
);

// Submit assessment (Local)
router.post(
  '/submit-assessment-local',
  uploadLimiter,
  uploadFieldsLocal,
  validate(createSubmissionSchema),
  assessmentController.createSubmission.bind(assessmentController)
);

// Merge PDFs
router.post('/merge-pdfs', isAuthorized, isAdmin, assessmentController.mergePDFs.bind(assessmentController));

// Compress PDFs
router.post('/compress-pdfs', isAuthorized, isAdmin, assessmentController.compressPDFs.bind(assessmentController));

module.exports = router;
