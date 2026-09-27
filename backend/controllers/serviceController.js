const Service = require('../models/Service');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class ServiceController {
  // Get all services
  getAllServices = asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const services = await Service.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    return apiResponse.success(res, services, 'Services retrieved successfully');
  });

  // Get single service
  getServiceById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await Service.findById(id);
    
    if (!service) {
      return apiResponse.error(res, 'Service not found', 404);
    }
    
    return apiResponse.success(res, service, 'Service retrieved successfully');
  });

  // Create service
  createService = asyncHandler(async (req, res) => {
    const service = await Service.create(req.body);
    logger.info(`Service created: ${service._id}`);
    return apiResponse.success(res, service, 'Service created successfully', 201);
  });

  // Update service
  updateService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!service) {
      return apiResponse.error(res, 'Service not found', 404);
    }
    
    logger.info(`Service updated: ${id}`);
    return apiResponse.success(res, service, 'Service updated successfully');
  });

  // Delete service (soft delete)
  deleteService = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!service) {
      return apiResponse.error(res, 'Service not found', 404);
    }
    
    logger.info(`Service soft deleted: ${id}`);
    return apiResponse.success(res, service, 'Service deleted successfully');
  });
}

module.exports = new ServiceController();
