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

module.exports = { signup, login, findByEmail };
