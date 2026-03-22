const express = require('express');
const router = express.Router();
const publicController = require('./public.controller');

router.get('/:short_code', publicController.getStats);

module.exports = router;
