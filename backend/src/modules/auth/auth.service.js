const db = require('../../config/db');
const bcrypt = require('bcryptjs');

const signup = async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id, name, email',
        [name, email, hashedPassword]
    );
    return result.rows[0];
};

const login = async (email, password) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    return null;
};

const findByEmail = async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const updateLastLogin = async (userId) => {
    await db.query('UPDATE users SET last_login = NOW() WHERE user_id = $1', [userId]);
};

const getUserProfile = async (userId) => {
    const result = await db.query(
        'SELECT user_id, name, email, created_at, last_login FROM users WHERE user_id = $1',
        [userId]
    );
    return result.rows[0];
};

const changePassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE user_id = $1', [hashedPassword, userId]);
};

const deleteAccount = async (userId) => {
    // Cascade delete handles URLs and visits if schema is set up with ON DELETE CASCADE
    await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
};

module.exports = { signup, login, findByEmail, updateLastLogin, getUserProfile, changePassword, deleteAccount };
