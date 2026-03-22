const db = require('../../config/db');

const getUrlAnalytics = async (urlId, userId) => {
    // Verify ownership
    const urlCheck = await db.query('SELECT * FROM urls WHERE url_id = $1 AND user_id = $2', [urlId, userId]);
    if (urlCheck.rows.length === 0) return null;

    const visits = await db.query(
        'SELECT * FROM visits WHERE url_id = $1 ORDER BY visited_at DESC LIMIT 50',
        [urlId]
    );

    const lastVisited = visits.rows.length > 0 ? visits.rows[0].visited_at : null;

    return {
        url: urlCheck.rows[0],
        totalClicks: urlCheck.rows[0].click_count,
        lastVisited,
        recentVisits: visits.rows
    };
};

const getClickTrends = async (urlId, userId) => {
    // Verify ownership
    const urlCheck = await db.query('SELECT * FROM urls WHERE url_id = $1 AND user_id = $2', [urlId, userId]);
    if (urlCheck.rows.length === 0) return null;

    const result = await db.query(
        `SELECT TO_CHAR(visited_at, 'YYYY-MM-DD') as date, COUNT(*) as clicks 
         FROM visits 
         WHERE url_id = $1 
         GROUP BY date 
         ORDER BY date ASC`,
        [urlId]
    );

    return result.rows;
};

const getPublicAnalytics = async (shortCode) => {
    const urlResult = await db.query('SELECT * FROM urls WHERE short_code = $1', [shortCode]);
    if (urlResult.rows.length === 0) return null;

    const url = urlResult.rows[0];

    const visits = await db.query(
        'SELECT visited_at FROM visits WHERE url_id = $1 ORDER BY visited_at DESC LIMIT 50',
        [url.url_id]
    );

    const trend = await db.query(
        `SELECT TO_CHAR(visited_at, 'YYYY-MM-DD') as date, COUNT(*) as clicks 
         FROM visits 
         WHERE url_id = $1 
         GROUP BY date 
         ORDER BY date ASC`,
        [url.url_id]
    );

    return {
        url_details: {
            original_url: url.original_url,
            short_code: url.short_code,
            created_at: url.created_at,
            expiry_date: url.expiry_date
        },
        total_clicks: url.click_count,
        trend: trend.rows,
        recent_visits: visits.rows.map(v => v.visited_at)
    };
};

module.exports = { getUrlAnalytics, getClickTrends, getPublicAnalytics };
