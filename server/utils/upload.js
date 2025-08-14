const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage for different file types
const createStorage = (folder, allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"]) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: `fly-thoughts/${folder}`,
            allowed_formats: allowedFormats,
            transformation: [
                { width: 1200, height: 630, crop: "limit", quality: "auto" }
            ]
        }
    });
};

// Avatar upload configuration
const avatarStorage = createStorage("avatars");
const avatarUpload = multer({ 
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

// Post thumbnail upload configuration
const thumbnailStorage = createStorage("thumbnails");
const thumbnailUpload = multer({ 
    storage: thumbnailStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

// Content images upload configuration
const contentStorage = createStorage("content");
const contentUpload = multer({ 
    storage: contentStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

module.exports = {
    cloudinary,
    avatarUpload,
    thumbnailUpload,
    contentUpload
};