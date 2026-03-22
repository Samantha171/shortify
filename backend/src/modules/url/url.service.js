const db = require('../../config/db');
const { generateCode } = require('../../utils/generateCode');

const createUrl = async (userId, originalUrl, expiryDate, customAlias) => {
    let shortCode;

    const existing = await db.query(
        'SELECT url_id FROM urls WHERE user_id = $1 AND original_url = $2 AND is_active = TRUE',
        [userId, originalUrl]
    );
    if (existing.rows.length > 0) {
        throw new Error('You already have a short link for this URL');
    }

    if (customAlias) {
        const existing = await findByShortCode(customAlias);
        if (existing) {
            throw new Error('Custom alias already in use');
        }
        shortCode = customAlias;
    } else {
        shortCode = generateCode();
    }

    const result = await db.query(
        'INSERT INTO urls (user_id, original_url, short_code, expiry_date) VALUES ($1, $2, $3, $4) RETURNING *',
        [userId, originalUrl, shortCode, expiryDate || null]
    );
    return result.rows[0];
};

const getUserUrls = async (userId, qr_generated) => {
    let query = 'SELECT * FROM urls WHERE user_id = $1';
    let params = [userId];

    if (qr_generated !== undefined) {
        query += ' AND qr_generated = $2';
        params.push(qr_generated === 'true');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    return result.rows;
};

const updateQrGenerated = async (urlId, userId) => {
    await db.query(
        'UPDATE urls SET qr_generated = TRUE WHERE url_id = $1 AND user_id = $2',
        [urlId, userId]
    );
};

const deleteUrl = async (userId, urlId) => {
    await db.query('DELETE FROM urls WHERE url_id = $1 AND user_id = $2', [urlId, userId]);
};

const findByShortCode = async (shortCode) => {
    const result = await db.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    return result.rows[0];
};

const incrementClickCount = async (urlId) => {
    await db.query('UPDATE urls SET click_count = click_count + 1 WHERE url_id = $1', [urlId]);
};

const recordVisit = async (urlId) => {
    await db.query('INSERT INTO visits (url_id) VALUES ($1)', [urlId]);
};

const getStats = async (userId) => {
    const result = await db.query(
        `SELECT 
            COUNT(url_id) as total_links, 
            SUM(click_count) as total_clicks,
            COUNT(CASE WHEN is_active = TRUE AND (expiry_date IS NULL OR expiry_date > NOW()) THEN 1 END) as active_links
        FROM urls 
        WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0];
};

const deactivateUrl = async (urlId) => {
    await db.query('UPDATE urls SET is_active = FALSE WHERE url_id = $1', [urlId]);
};

const bulkCreate = async (userId, entries) => {
    let createdCount = 0;
    let failedCount = 0;
    const errors = [];

    for (let i = 0; i < entries.length; i++) {
        const { original_url, custom_alias, expiry_date } = entries[i];
        const rowNum = i + 1;

        if (!original_url) {
            errors.push({ row: rowNum, reason: 'Original URL is required' });
            failedCount++;
            continue;
        }

        try {
            let finalExpiry = null;
            if (expiry_date) {
                const date = new Date(expiry_date);
                if (isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(expiry_date)) {
                    errors.push({ row: rowNum, reason: 'Invalid date format (use YYYY-MM-DD)' });
                    failedCount++;
                    continue;
                }
                if (date <= new Date()) {
                    errors.push({ row: rowNum, reason: 'Expiry date must be in the future' });
                    failedCount++;
                    continue;
                }
                finalExpiry = expiry_date;
            }

            let shortCode;
            if (custom_alias) {
                const existing = await findByShortCode(custom_alias);
                if (existing) {
                    errors.push({ row: rowNum, reason: `Alias "${custom_alias}" already exists` });
                    failedCount++;
                    continue;
                }
                shortCode = custom_alias;
            } else {
                shortCode = generateCode();
            }

            await db.query(
                'INSERT INTO urls (user_id, original_url, short_code, expiry_date) VALUES ($1, $2, $3, $4)',
                [userId, original_url, shortCode, finalExpiry]
            );
            createdCount++;
        } catch (error) {
            errors.push({ row: rowNum, reason: error.message });
            failedCount++;
        }
    }

    return {
        created: createdCount,
        failed: failedCount,
        errors
    };
};

const updateUrl = async (urlId, userId, { original_url, expiry_date }) => {
    // Check ownership
    const { rows } = await db.query(
        'SELECT * FROM urls WHERE url_id = $1 AND user_id = $2',
        [urlId, userId]
    );

    if (rows.length === 0) {
        const error = new Error('URL not found or unauthorized');
        error.status = 404;
        throw error;
    }

    await db.query(
        'UPDATE urls SET original_url = $1, expiry_date = $2 WHERE url_id = $3',
        [original_url, expiry_date, urlId]
    );

    const updated = await db.query('SELECT * FROM urls WHERE url_id = $1', [urlId]);
    return updated.rows[0];
};

module.exports = {
    createUrl,
    getUserUrls,
    deleteUrl,
    findByShortCode,
    incrementClickCount,
    recordVisit,
    getStats,
    deactivateUrl,
    bulkCreate,
    updateUrl,
    updateQrGenerated
};