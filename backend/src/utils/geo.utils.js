/**
 * Robust IP Geolocation utility with timeout and fallbacks.
 * Uses ip-api.com (free tier).
 */

const getGeolocation = async (ip) => {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
        return { country: 'Local', city: 'Local', status: 'success' };
    }

    // Common local/private IP ranges
    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return { country: 'Local', city: 'Local', status: 'success' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    try {
        const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,city`, {
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`Geo API responded with status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'fail') {
            console.warn(`Geo API failed for IP ${ip}: ${data.message}`);
            return { country: 'Unknown', city: 'Unknown', status: 'fail' };
        }

        return {
            country: data.country || 'Unknown',
            city: data.city || 'Unknown',
            status: 'success'
        };
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            console.error(`Geo API timeout for IP: ${ip}`);
        } else {
            console.error(`Geo API error for IP ${ip}:`, error.message);
        }
        return { country: 'Unknown', city: 'Unknown', status: 'error' };
    }
};

module.exports = { getGeolocation };
