/**
 * Robust IP Geolocation utility with timeout and fallbacks.
 * Uses ip-api.com (free tier).
 */

const getGeolocation = async (ip) => {
    if (!ip || ip === '127.0.0.1' || ip === '::1') {
        return { country: 'Local', city: 'Local', status: 'success' };
    }

    if (ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        return { country: 'Local', city: 'Local', status: 'success' };
    }

    // Try Primary Service (ip-api.com)
    let result = await callGeoApi(`http://ip-api.com/json/${ip}?fields=status,message,country,city`, ip, 'ip-api');
    
    // If Primary fails, try Secondary (freeipapi.com)
    if (result.status !== 'success') {
        console.log(`[GEO] Attempting fallback for IP ${ip}...`);
        result = await callGeoApi(`https://freeipapi.com/api/json/${ip}`, ip, 'freeipapi');
    }

    return result;
};

const callGeoApi = async (url, ip, provider) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2-second timeout

    try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();

        // Handle different response formats
        if (provider === 'ip-api') {
            if (data.status === 'fail') throw new Error(data.message || 'fail');
            return { country: data.country || 'Unknown', city: data.city || 'Unknown', status: 'success' };
        } else if (provider === 'freeipapi') {
            return { country: data.countryName || 'Unknown', city: data.cityName || 'Unknown', status: 'success' };
        }

        return { country: 'Unknown', city: 'Unknown', status: 'error' };
    } catch (error) {
        clearTimeout(timeoutId);
        const engine = provider.toUpperCase();
        if (error.name === 'AbortError') {
            console.error(`[GEO ${engine} TIMEOUT] IP: ${ip}`);
        } else {
            console.error(`[GEO ${engine} ERROR] IP: ${ip}:`, error.message);
        }
        return { country: 'Unknown', city: 'Unknown', status: 'error' };
    }
};

module.exports = { getGeolocation };
