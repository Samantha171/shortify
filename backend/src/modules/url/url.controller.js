const urlService = require('./url.service');
const { parse } = require('csv-parse/sync');
const db = require('../../config/db');

const createUrl = async (req, res) => {
    const { original_url, expiry_date, custom_alias } = req.body;
    const userId = req.user.user_id;
    try {
        const url = await urlService.createUrl(userId, original_url, expiry_date, custom_alias);
        res.status(201).json(url);
    } catch (error) {
        if (error.message === 'Custom alias already in use') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};

const getUrls = async (req, res) => {
    const userId = req.user.user_id;
    const { qr_generated } = req.query;
    try {
        const urls = await urlService.getUserUrls(userId, qr_generated);
        res.json(urls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const markQrGenerated = async (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    try {
        await urlService.updateQrGenerated(id, userId);
        res.json({ message: 'QR marked as generated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUrl = async (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    try {
        await urlService.deleteUrl(userId, id);
        res.json({ message: 'URL deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStats = async (req, res) => {
    const userId = req.user.user_id;
    try {
        const stats = await urlService.getStats(userId);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const redirect = async (req, res) => {
    const { short_code } = req.params;
    const frontendUrl = process.env.FRONTEND_URL || 'https://shortify-app.vercel.app';
    
    try {
        const url = await urlService.findByShortCode(short_code);

        if (!url) {
            return res.redirect(`${frontendUrl}/expired`);
        }

        if (!url.is_active) {
            return res.redirect(`${frontendUrl}/expired`);
        }

        if (url.expiry_date && new Date(url.expiry_date) < new Date()) {
            await urlService.deactivateUrl(url.url_id);
            return res.redirect(`${frontendUrl}/expired`);
        }

        await urlService.incrementClickCount(url.url_id);
        
        // Redirect immediately
        res.redirect(url.original_url);

        // Async Geolocation and Visit Recording
        (async () => {
            try {
                const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                           req.headers['x-real-ip'] || 
                           req.socket.remoteAddress;
                
                let country = 'Unknown';
                let city = 'Unknown';

                // Skip geolocation for local IPs
                if (ip && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('192.168.')) {
                    try {
                        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
                        const geoData = await geoRes.json();
                        country = geoData.country_name || 'Unknown';
                        city = geoData.city || 'Unknown';
                    } catch (geoErr) {
                        console.error('Geolocation API failed:', geoErr);
                    }
                }

                await db.query(
                    'INSERT INTO visits (url_id, country, city) VALUES ($1, $2, $3)',
                    [url.url_id, country, city]
                );
            } catch (err) {
                console.error('Visit recording background task failed:', err);
            }
        })();

    } catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ message: error.message });
        }
    }
};

const bulkUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const records = parse(req.file.buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const result = await urlService.bulkCreate(req.user.user_id, records);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to parse CSV: ' + error.message });
    }
};

const editUrl = async (req, res) => {
    const { id } = req.params;
    const { original_url, expiry_date } = req.body;

    if (!original_url) {
        return res.status(400).json({ message: 'Original URL is required' });
    }

    try {
        if (expiry_date) {
            const date = new Date(expiry_date);
            if (isNaN(date.getTime()) || date <= new Date()) {
                return res.status(400).json({ message: 'Expiry date must be in the future' });
            }
        }

        const updated = await urlService.updateUrl(id, req.user.user_id, {
            original_url,
            expiry_date
        });

        res.json({ message: 'Link updated successfully', url: updated });
    } catch (error) {
        const status = error.status || 500;
        res.status(status).json({ message: error.message });
    }
};

module.exports = { createUrl, getUrls, markQrGenerated, deleteUrl, getStats, redirect, bulkUpload, editUrl };