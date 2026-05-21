const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Local storage configuration (Multer disk storage)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// Configure Cloudinary storage with better folder structure
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'form-submissions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
    // Remove transformation for PDFs and other documents
    transformation: (req, file) => {
      // Only apply transformations to images, not PDFs or documents
      if (file.mimetype.startsWith('image/')) {
        return [
          { 
            width: 1000, 
            height: 1000, 
            crop: 'limit',
            quality: 'auto',
            fetch_format: 'auto'
          }
        ];
      }
      // Return empty array for non-images to preserve original format
      return [];
    },
    // Generate unique filenames
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `${file.fieldname}-${uniqueSuffix}`;
    },
    // Set resource type based on file type
    resource_type: (req, file) => {
      if (file.mimetype.startsWith('image/')) {
        return 'image';
      } else if (file.mimetype === 'application/pdf') {
        return 'raw'; // Use 'raw' for PDFs to preserve format
      } else {
        return 'auto';
      }
    },
  },
});

// Configure Cloudinary storage for team member images
const teamImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'team-members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { 
        width: 500, 
        height: 500, 
        crop: 'fill',
        gravity: 'face',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ],
    // Generate unique filenames
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `team-member-${uniqueSuffix}`;
    },
    resource_type: 'image',
  },
});

// Configure Cloudinary storage for portfolio project images
const portfolioImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { 
        width: 1200, 
        height: 800, 
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ],
    // Generate unique filenames
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `portfolio-project-${uniqueSuffix}`;
    },
    resource_type: 'image',
  },
});

// Configure Cloudinary storage for site logo
const logoImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'site-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    transformation: [
      { 
        width: 600, 
        height: 200, 
        crop: 'limit',
        quality: 'auto',
        fetch_format: 'auto'
      }
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `logo-${uniqueSuffix}`;
    },
    resource_type: 'image',
  },
});


// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDF, DOC, DOCX are allowed.'), false);
  }
};

// Image-only file filter for team member photos
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images (JPG, PNG, GIF, WEBP) are allowed.'), false);
  }
};

// Create multer upload instances
const uploadToCloudinary = multer({
  storage: cloudinaryStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

const uploadToLocal = multer({
  storage: localStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter,
});

// Multer instance for team member image uploads (single image)
const uploadTeamImage = multer({
  storage: teamImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: imageFileFilter,
});

// Multer instance for portfolio project image uploads (single image)
const uploadPortfolioImage = multer({
  storage: portfolioImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: imageFileFilter,
});

// Multer instance for site logo uploads (single image)
const uploadLogo = multer({
  storage: logoImageStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit for logo
  },
  fileFilter: imageFileFilter,
});


// Configure upload fields for both local and cloudinary
const uploadFields = uploadToCloudinary.fields([
  { name: "passports" },
  { name: "businessBankStatement" },
  { name: "personalBankStatement" },
  { name: "businessRegistration" },
  { name: "taxpayerCertificate" },
  { name: "incomeTaxReturns" },
  { name: "propertyDocuments" },
  { name: "frcFamily" },
  { name: "frcParents" },
  { name: "marriageCertificate" },
  { name: "invitationLetter" },
  { name: "flightReservation" },
  { name: "hotelReservation" },
  { name: "anyOtherDocuments" },
  { name: "coverLetter" },
]);

const uploadFieldsLocal = uploadToLocal.fields([
  { name: "passports" },
  { name: "businessBankStatement" },
  { name: "personalBankStatement" },
  { name: "businessRegistration" },
  { name: "taxpayerCertificate" },
  { name: "incomeTaxReturns" },
  { name: "propertyDocuments" },
  { name: "frcFamily" },
  { name: "frcParents" },
  { name: "marriageCertificate" },
  { name: "invitationLetter" },
  { name: "flightReservation" },
  { name: "hotelReservation" },
  { name: "anyOtherDocuments" },
  { name: "coverLetter" },
]);

// Function to upload local files to Cloudinary
const uploadLocalToCloudinary = async (filePath, folder = 'form-submissions') => {
  try {
    // Determine resource type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let resourceType = 'auto';
    
    if (ext === '.pdf') {
      resourceType = 'raw';
    } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
      resourceType = 'image';
    }

    const uploadOptions = {
      folder: folder,
      resource_type: resourceType,
    };

    // Only apply transformations for images
    if (resourceType === 'image') {
      uploadOptions.transformation = [
        { 
          width: 1000, 
          height: 1000, 
          crop: 'limit',
          quality: 'auto',
          fetch_format: 'auto'
        }
      ];
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);
    
    // Delete local file after successful upload to Cloudinary
    fs.unlinkSync(filePath);
    
    return result;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// Function to process files (local or cloudinary)
const processFiles = (files, uploadType = 'cloudinary') => {
  const documents = [];
  
  if (files) {
    Object.keys(files).forEach((fieldName) => {
      files[fieldName].forEach((file) => {
        if (uploadType === 'cloudinary') {
          // Cloudinary upload
          documents.push({
            fieldName,
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            cloudinaryUrl: file.path, // Cloudinary URL
            cloudinaryPublicId: file.filename, // Cloudinary public ID
            cloudinaryId: file.filename, // Cloudinary asset ID
            uploadType: 'cloudinary'
          });
        } else {
          // Local upload
          documents.push({
            fieldName,
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
            size: file.size,
            localPath: file.path, // Local file path
            uploadType: 'local'
          });
        }
      });
    });
  }
  
  return documents;
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  uploadToLocal,
  uploadTeamImage,
  uploadPortfolioImage,
  uploadLogo,
  uploadFields,
  uploadFieldsLocal,
  uploadLocalToCloudinary,
  processFiles,
  storage: cloudinaryStorage,
  localStorage,
  uploadsDir
};
