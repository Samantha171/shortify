const analyticsService = require('./analytics.service');

const getAnalytics = async (req, res) => {
    const { url_id } = req.params;
    const userId = req.user.user_id;

    try {
        const analytics = await analyticsService.getUrlAnalytics(url_id, userId);
        if (!analytics) {
            return res.status(404).json({ message: 'Analytics not found for this URL' });
        }
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTrends = async (req, res) => {
    const { url_id } = req.params;
    const userId = req.user.user_id;

    try {
        const trends = await analyticsService.getClickTrends(url_id, userId);
        if (!trends) {
            return res.status(404).json({ message: 'Trends not found or unauthorized' });
        }
        res.json(trends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAnalytics, getTrends };
