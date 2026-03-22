const analyticsService = require('../analytics/analytics.service');

const getStats = async (req, res) => {
    try {
        const { short_code } = req.params;
        const stats = await analyticsService.getPublicAnalytics(short_code);

        if (!stats) {
            return res.status(404).json({ message: 'URL not found' });
        }

        res.json(stats);
    } catch (error) {
        console.error('Public Analytics Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { getStats };
