const db = require('../../config/db');

const getUrlAnalytics = async (urlId, userId) => {
    const urlCheck = await db.query('SELECT * FROM urls WHERE url_id = $1 AND user_id = $2', [urlId, userId]);
    if (urlCheck.rows.length === 0) return null;

    const visits = await db.query(
        'SELECT visited_at, country, city FROM visits WHERE url_id = $1 ORDER BY visited_at DESC LIMIT 5',
        [urlId]
    );

    const lastVisited = visits.rows.length > 0 ? visits.rows[0].visited_at : null;

    const countryStats = await db.query(
        'SELECT country, COUNT(*) as clicks FROM visits WHERE url_id = $1 GROUP BY country ORDER BY clicks DESC',
        [urlId]
    );

    const browserStats = await db.query(
        'SELECT browser, COUNT(*) as clicks FROM visits WHERE url_id = $1 AND browser IS NOT NULL GROUP BY browser ORDER BY clicks DESC',
        [urlId]
    );

    const deviceStats = await db.query(
        'SELECT device, COUNT(*) as clicks FROM visits WHERE url_id = $1 AND device IS NOT NULL GROUP BY device ORDER BY clicks DESC',
        [urlId]
    );

    return {
        url: urlCheck.rows[0],
        totalClicks: urlCheck.rows[0].click_count,
        lastVisited,
        recentVisits: visits.rows,
        country_distribution: countryStats.rows,
        browser_distribution: browserStats.rows,
        device_distribution: deviceStats.rows
    };
};

const getClickTrends = async (urlId, userId) => {
    const urlCheck = await db.query('SELECT * FROM urls WHERE url_id = $1 AND user_id = $2', [urlId, userId]);
    if (urlCheck.rows.length === 0) return null;

    const result = await db.query(
        `SELECT DATE(visited_at) as date, COUNT(*) as clicks 
         FROM visits 
         WHERE url_id = $1 
         GROUP BY DATE(visited_at) 
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
        'SELECT visited_at, country, city FROM visits WHERE url_id = $1 ORDER BY visited_at DESC LIMIT 5',
        [url.url_id]
    );

    const trend = await db.query(
        `SELECT DATE(visited_at) as date, COUNT(*) as clicks 
         FROM visits 
         WHERE url_id = $1 
         GROUP BY DATE(visited_at) 
         ORDER BY date ASC`,
        [url.url_id]
    );

    const countryStats = await db.query(
        'SELECT country, COUNT(*) as clicks FROM visits WHERE url_id = $1 GROUP BY country ORDER BY clicks DESC',
        [url.url_id]
    );

    const browserStats = await db.query(
        'SELECT browser, COUNT(*) as clicks FROM visits WHERE url_id = $1 AND browser IS NOT NULL GROUP BY browser ORDER BY clicks DESC',
        [url.url_id]
    );

    const deviceStats = await db.query(
        'SELECT device, COUNT(*) as clicks FROM visits WHERE url_id = $1 AND device IS NOT NULL GROUP BY device ORDER BY clicks DESC',
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
        recent_visits: visits.rows.map(v => v.visited_at),
        country_distribution: countryStats.rows,
        browser_distribution: browserStats.rows,
        device_distribution: deviceStats.rows
    };
};

module.exports = { getUrlAnalytics, getClickTrends, getPublicAnalytics };