const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for team member images
const teamImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'team-members',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    // Always store as WebP; images are already resized in the browser, this is only a safety limit
    format: 'webp',
    transformation: [{ width: 1792, height: 1024, crop: 'limit', quality: 85 }],
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
    // Always store as WebP; images are already resized in the browser, this is only a safety limit
    format: 'webp',
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 85 }],
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
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    // Always store as WebP; images are already resized in the browser, this is only a safety limit
    format: 'webp',
    transformation: [{ width: 600, height: 200, crop: 'limit', quality: 85 }],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `logo-${uniqueSuffix}`;
    },
    resource_type: 'image',
  },
});

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

module.exports = {
  cloudinary,
  uploadTeamImage,
  uploadPortfolioImage,
  uploadLogo,
};
