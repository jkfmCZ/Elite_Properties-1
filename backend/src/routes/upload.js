// backend/src/routes/upload.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Cesta ke kořenovému adresáři backendu
const backendRoot = path.resolve(__dirname, '..', '..'); 

// Ujistíme se, že složky pro upload existují
const uploadsDir = path.join(backendRoot, 'uploads');
const imagesDir = path.join(uploadsDir, 'images');
const toursDir = path.join(uploadsDir, 'tours');
fs.mkdirSync(imagesDir, { recursive: true });
fs.mkdirSync(toursDir, { recursive: true });

// Nastavení úložiště pro multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'mainImage') {
      cb(null, imagesDir);
    } else if (file.fieldname === 'tourFile') {
      cb(null, toursDir);
    }
  },
  filename: (req, file, cb) => {
    // Vytvoříme unikátní jméno souboru
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint pro nahrávání, chráněný autentizací
router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'tourFile', maxCount: 1 },
  ]),
  (req, res) => {
    const imageUrl = req.files.mainImage ? `/uploads/images/${req.files.mainImage[0].filename}` : '';
    const tourUrl = req.files.tourFile ? `/uploads/tours/${req.files.tourFile[0].filename}` : '';

    res.json({
      success: true,
      message: 'Files uploaded successfully',
      imageUrl,
      tourUrl,
    });
  }
);

module.exports = router;