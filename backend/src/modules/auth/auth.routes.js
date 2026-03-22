const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('./auth.controller');
const { protect } = require('../../middleware/auth.middleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
