const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createUrl, getUrls, markQrGenerated, deleteUrl, getStats, bulkUpload, editUrl } = require('./url.controller');
const { protect } = require('../../middleware/auth.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, createUrl);
router.post('/bulk', protect, upload.single('file'), bulkUpload);
router.get('/', protect, getUrls);
router.get('/stats', protect, getStats);
router.put('/:id', protect, editUrl);
router.patch('/:id/qr', protect, markQrGenerated);
router.delete('/:id', protect, deleteUrl);

module.exports = router;
