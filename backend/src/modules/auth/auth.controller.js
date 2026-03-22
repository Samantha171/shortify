const db = require('../../config/db');
const bcrypt = require('bcryptjs');
const authService = require('./auth.service');
const { generateToken } = require('./auth.utils');

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await authService.findByEmail(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await authService.signup(name, email, password);
        res.status(201).json({
            ...user,
            token: generateToken(user.user_id),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authService.login(email, password);
        if (user) {
            await authService.updateLastLogin(user.user_id);
            res.json({
                ...user,
                token: generateToken(user.user_id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await authService.getUserProfile(req.user.user_id);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { current_password, new_password } = req.body;
    const userId = req.user.user_id;

    try {
        const user = await db.query('SELECT password FROM users WHERE user_id = $1', [userId]);
        const isMatch = await bcrypt.compare(current_password, user.rows[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        await authService.changePassword(userId, new_password);
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAccount = async (req, res) => {
    try {
        await authService.deleteAccount(req.user.user_id);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { signup, login, getMe, changePassword, deleteAccount };
