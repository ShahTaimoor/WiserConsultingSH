const Portfolio = require('../models/Portfolio');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class PortfolioController {
  // Helper function to parse FormData arrays
  parseFormDataArrays(body) {
    const parsed = { ...body };
    
    // Parse existing images array if it exists
    if (body.existingImages) {
      if (typeof body.existingImages === 'string') {
        try {
          parsed.existingImages = JSON.parse(body.existingImages);
        } catch (e) {
          parsed.existingImages = [body.existingImages];
        }
      } else if (Array.isArray(body.existingImages)) {
        parsed.existingImages = body.existingImages;
      }
    }

    // Parse technologies array if it exists
    if (body.technologies) {
      if (typeof body.technologies === 'string') {
        try {
          parsed.technologies = JSON.parse(body.technologies);
        } catch (e) {
          // If not JSON, treat as single value array
          parsed.technologies = [body.technologies];
        }
      } else if (Array.isArray(body.technologies)) {
        parsed.technologies = body.technologies;
      } else if (typeof body.technologies === 'object') {
        // Handle FormData array format: technologies[0], technologies[1], etc.
        parsed.technologies = Object.keys(body.technologies)
          .sort()
          .map(key => body.technologies[key])
          .filter(val => val);
      }
    }
    
    // Parse order and isActive as numbers/booleans
    if (body.order !== undefined) {
      parsed.order = parseInt(body.order) || 0;
    }
    if (body.isActive !== undefined) {
      parsed.isActive = body.isActive === 'true' || body.isActive === true;
    }
    
    return parsed;
  }

  // Get all portfolio items
  getAllPortfolios = asyncHandler(async (req, res) => {
    const { category, isActive, isDeleted } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (category) filter.category = category;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isDeleted !== undefined) filter.isDeleted = isDeleted === 'true';
    
    const portfolios = await Portfolio.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    return apiResponse.success(res, portfolios, 'Portfolios retrieved successfully');
  });

  // Get single portfolio item
  getPortfolioById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findById(id);
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    return apiResponse.success(res, portfolio, 'Portfolio retrieved successfully');
  });

  // Create portfolio item
  createPortfolio = asyncHandler(async (req, res) => {
    // Parse FormData arrays and other fields
    const portfolioData = this.parseFormDataArrays(req.body);
    
    // Collect image URLs from uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.path) images.push(file.path);
      });
    }
    // Also check for image URLs sent as form fields
    if (portfolioData.existingImages && Array.isArray(portfolioData.existingImages)) {
      portfolioData.existingImages.forEach(url => {
        if (url) images.push(url);
      });
    }
    delete portfolioData.existingImages;
    
    portfolioData.images = images.length > 0 ? images : ['🛒'];
    
    const portfolio = await Portfolio.create(portfolioData);
    logger.info(`Portfolio created: ${portfolio._id}`);
    return apiResponse.success(res, portfolio, 'Portfolio created successfully', 201);
  });

  // Update portfolio item
  updatePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Parse FormData arrays and other fields
    const updateData = this.parseFormDataArrays(req.body);
    
    // Collect image URLs from uploaded files and existing images
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        if (file.path) images.push(file.path);
      });
    }
    // Preserve existing images sent from frontend
    if (updateData.existingImages && Array.isArray(updateData.existingImages)) {
      updateData.existingImages.forEach(url => {
        if (url) images.push(url);
      });
    }
    delete updateData.existingImages;
    
    if (images.length > 0) {
      updateData.images = images;
    }
    
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    logger.info(`Portfolio updated: ${id}`);
    return apiResponse.success(res, portfolio, 'Portfolio updated successfully');
  });

  // Delete portfolio item (soft delete)
  deletePortfolio = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const portfolio = await Portfolio.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!portfolio) {
      return apiResponse.error(res, 'Portfolio not found', 404);
    }
    
    logger.info(`Portfolio soft deleted: ${id}`);
    return apiResponse.success(res, portfolio, 'Portfolio deleted successfully');
  });
}

module.exports = new PortfolioController();
