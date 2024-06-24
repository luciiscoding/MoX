// backend/manageCookies.js
const crypto = require('crypto');

const storeSessions = {};
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const sessionIdGenerator = () => {
    const sessionId = crypto.randomBytes(16).toString('hex');
    return sessionId;
};

const getCookiesSession = (req) => {
    const cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach(cookie => {
            const parts = cookie.split('=');
            cookies[parts.shift().trim()] = decodeURI(parts.join('='));
        });
    }
    return cookies;
};

const checkSession = (session) => {
    return (Date.now() - session.timestamp) > SESSION_TIMEOUT;
};

const deleteSession = () => {
    for (const sessionId in storeSessions) {
        if (checkSession(storeSessions[sessionId])) {
            delete storeSessions[sessionId];
        }
    }
};

// Schedule cleanup function to run every 10 seconds
setInterval(deleteSession, 10 * 1000);

module.exports = {
    sessionIdGenerator,
    getCookiesSession,
    checkSession,
    storeSessions
};
