const Contact = require('../models/Contact');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class ContactController {
  // Create contact submission (public)
  createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ name, email, phone, subject, message });
    logger.info(`Contact submission created: ${contact._id}`);
    return apiResponse.success(res, contact, 'Contact submission received successfully', 201);
  });

  // Get all contact submissions (admin only)
  getAllContacts = asyncHandler(async (req, res) => {
    const { status, isDeleted } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (status && status !== 'all') filter.status = status;
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';
    
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 });
    
    return apiResponse.success(res, contacts, 'Contacts retrieved successfully');
  });

  // Get single contact
  getContactById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    
    if (!contact) {
      return apiResponse.error(res, 'Contact not found', 404);
    }
    
    return apiResponse.success(res, contact, 'Contact retrieved successfully');
  });

  // Update contact status
  updateContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return apiResponse.error(res, 'Contact not found', 404);
    }
    
    logger.info(`Contact updated: ${id}`);
    return apiResponse.success(res, contact, 'Contact updated successfully');
  });

  // Delete contact (soft delete)
  deleteContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await Contact.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!contact) {
      return apiResponse.error(res, 'Contact not found', 404);
    }
    
    logger.info(`Contact deleted: ${id}`);
    return apiResponse.success(res, contact, 'Contact deleted successfully');
  });
}

module.exports = new ContactController();
