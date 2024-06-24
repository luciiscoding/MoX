
const { getCookiesSession, checkSession, storeSessions } = require('../manageCookies');

exports.protect = (req, res, next) => {
  const cookies = getCookiesSession(req);
  const sessionId = cookies.sessionId;
  if (!sessionId || !storeSessions[sessionId] || checkSession(storeSessions[sessionId])) {
    res.writeHead(401, { 'Content-Type': 'text/plain' }).end('Not authenticated');
    return;
  }
  req.user = { userId: storeSessions[sessionId].userId };
  next();
};

exports.adminOnly = (req, res, next) => {
  const cookies = getCookiesSession(req);
  const sessionId = cookies.sessionId;
  if (!sessionId || !storeSessions[sessionId] || checkSession(storeSessions[sessionId])) {
    res.writeHead(401, { 'Content-Type': 'text/plain' }).end('Not authenticated');
    return;
  }
  
  req.user = { userId: storeSessions[sessionId].userId };
  next();
};
