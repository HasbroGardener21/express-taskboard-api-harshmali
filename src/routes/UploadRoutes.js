const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const authMiddleware = require('../middleware/authMiddleware');

// Configure Cloudinary 3rd-Party API
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'taskboard_uploads',
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif']
  }
});

const upload = multer({ storage: storage });

// The Upload Endpoint (Graceful error handling included)
router.post('/', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded or invalid format.' });
    }
    // Successfully hit 3rd party API and got the image URL back
    res.json({ 
      message: 'File uploaded successfully via Cloudinary API',
      imageUrl: req.file.path 
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Failed to upload to 3rd party API', error: error.message });
  }
});

module.exports = router;