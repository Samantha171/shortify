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
    res.json(req.user);
};

module.exports = { signup, login, getMe };
