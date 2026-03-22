const express = require('express');
const router = express.Router();
const { getAnalytics, getTrends } = require('./analytics.controller');
const { protect } = require('../../middleware/auth.middleware');

router.get('/:url_id', protect, getAnalytics);
router.get('/:url_id/trends', protect, getTrends);

module.exports = router;
