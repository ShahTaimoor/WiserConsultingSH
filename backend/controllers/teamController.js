const Team = require('../models/Team');
const asyncHandler = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const logger = require('../utils/logger');

class TeamController {
  // Helper function to parse FormData arrays
  parseFormDataArrays(body) {
    const parsed = { ...body };
    
    // Helper to parse array fields
    const parseArrayField = (fieldName) => {
      // Check if it's already an array
      if (Array.isArray(body[fieldName])) {
        return body[fieldName];
      }
      
      // Check if it's an object with numeric keys (parsed by some parsers)
      if (body[fieldName] && typeof body[fieldName] === 'object' && !Array.isArray(body[fieldName])) {
        const obj = body[fieldName];
        const keys = Object.keys(obj).map(k => parseInt(k)).sort((a, b) => a - b);
        return keys.map(k => obj[k]).filter(v => v !== undefined && v !== null);
      }
      
      // Check for indexed array format like skills[0], skills[1]
      const indexedKeys = Object.keys(body).filter(key => {
        const match = key.match(new RegExp(`^${fieldName}\\[(\\d+)\\]$`));
        return match !== null;
      });
      
      if (indexedKeys.length > 0) {
        return indexedKeys
          .sort((a, b) => {
            const indexA = parseInt(a.match(/\[(\d+)\]/)?.[1] || '0');
            const indexB = parseInt(b.match(/\[(\d+)\]/)?.[1] || '0');
            return indexA - indexB;
          })
          .map(key => body[key])
          .filter(v => v !== undefined && v !== null && v !== '');
      }
      
      // Check if it's a single string value
      if (typeof body[fieldName] === 'string' && body[fieldName].trim() !== '') {
        return [body[fieldName]];
      }
      
      return [];
    };
    
    // Parse array fields
    parsed.role = parseArrayField('role');
    parsed.skills = parseArrayField('skills');
    parsed.expertise = parseArrayField('expertise');
    parsed.achievements = parseArrayField('achievements');
    
    // Parse boolean and number fields
    if (parsed.isActive !== undefined) {
      parsed.isActive = parsed.isActive === 'true' || parsed.isActive === true;
    }
    if (parsed.order !== undefined) {
      parsed.order = parseInt(parsed.order) || 0;
    }
    
    // Remove indexed keys from parsed object to avoid confusion
    Object.keys(parsed).forEach(key => {
      if (key.match(/^(role|skills|expertise|achievements)\[\d+\]$/)) {
        delete parsed[key];
      }
    });
    
    return parsed;
  }

  // Get all team members
  getAllTeamMembers = asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const filter = { isDeleted: false }; // Default: exclude deleted
    
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const teamMembers = await Team.find(filter)
      .sort({ order: 1, createdAt: -1 });
    
    // Sort by role priority: CEO > Project Manager > Full Stack > Others
    const sortedMembers = teamMembers.sort((a, b) => {
      // Handle role as string or array - get the first/highest priority role
      const rolesA = Array.isArray(a.role) 
        ? a.role.map(r => String(r).toLowerCase()) 
        : [String(a.role || '').toLowerCase()];
      const rolesB = Array.isArray(b.role) 
        ? b.role.map(r => String(r).toLowerCase()) 
        : [String(b.role || '').toLowerCase()];
      
      const getPriority = (roles) => {
        for (const role of roles) {
          if (role.includes('ceo')) return 1;
          if (role.includes('project manager')) return 2;
          if (role.includes('full stack')) return 3;
        }
        return 4;
      };
      
      const priorityA = getPriority(rolesA);
      const priorityB = getPriority(rolesB);
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by order field, then by name
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.name.localeCompare(b.name);
    });
    
    return apiResponse.success(res, sortedMembers, 'Team members retrieved successfully');
  });

  // Get single team member
  getTeamMemberById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await Team.findById(id);
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    return apiResponse.success(res, member, 'Team member retrieved successfully');
  });

  // Create team member
  createTeamMember = asyncHandler(async (req, res) => {
    // Parse FormData arrays and other fields
    const memberData = this.parseFormDataArrays(req.body);
    
    // If an image file was uploaded, use the Cloudinary URL
    if (req.file && req.file.path) {
      memberData.image = req.file.path; // Cloudinary URL
    } else if (!memberData.image) {
      // Default to emoji if no image provided
      memberData.image = '👨‍💼';
    }
    
    const member = await Team.create(memberData);
    logger.info(`Team member created: ${member._id}`);
    return apiResponse.success(res, member, 'Team member created successfully', 201);
  });

  // Update team member
  updateTeamMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Parse FormData arrays and other fields
    const updateData = this.parseFormDataArrays(req.body);
    
    // If an image file was uploaded, use the Cloudinary URL
    if (req.file && req.file.path) {
      updateData.image = req.file.path; // Cloudinary URL
    }
    // If no new image uploaded and image field is empty string, keep existing image
    // (don't update image field if it's not provided)
    if (updateData.image === '') {
      delete updateData.image;
    }
    
    const member = await Team.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    logger.info(`Team member updated: ${id}`);
    return apiResponse.success(res, member, 'Team member updated successfully');
  });

  // Delete team member (soft delete)
  deleteTeamMember = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await Team.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    
    if (!member) {
      return apiResponse.error(res, 'Team member not found', 404);
    }
    
    logger.info(`Team member soft deleted: ${id}`);
    return apiResponse.success(res, member, 'Team member deleted successfully');
  });
}

module.exports = new TeamController();
