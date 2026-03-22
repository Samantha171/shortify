const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const {
    login,
    signup,
    changePassword,
    deleteAccount,
    getMe
} = require('./auth.controller');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/change-password', protect, changePassword);
router.delete('/delete-account', protect, deleteAccount);

module.exports = router;
