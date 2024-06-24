
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const cookie = require('cookie');
const { sessionIdGenerator, getCookiesSession, checkSession, storeSessions } = require('../manageCookies');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.writeHead(409, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User already exists' }));
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    const sessionId = sessionIdGenerator();
    storeSessions[sessionId] = { userId: newUser._id, timestamp: Date.now() };

    res.setHeader('Set-Cookie', [
      cookie.serialize('sessionId', sessionId, { httpOnly: true, path: '/', sameSite: 'Lax', secure: true }),
      cookie.serialize('authenticated', 'true', { path: '/', sameSite: 'Lax', secure: true })
    ]);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User registered successfully' }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === 'admin@gmail.com' && password === 'admin123') {
        // Handle admin login
        const sessionId = sessionIdGenerator();
        storeSessions[sessionId] = { userId: 'admin', timestamp: Date.now() };

        res.setHeader('Set-Cookie', [
          cookie.serialize('sessionId', sessionId, { httpOnly: true, path: '/', sameSite: 'Lax', secure: true }),
          cookie.serialize('authenticated', 'true', { path: '/', sameSite: 'Lax', secure: true })
        ]);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: sessionId, isAdmin: true }));
        return;
    }
    
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid email or password' }));
      return;
    }
    const sessionId = sessionIdGenerator();
    storeSessions[sessionId] = { userId: user._id, timestamp: Date.now() };

    res.setHeader('Set-Cookie', [
      cookie.serialize('sessionId', sessionId, { httpOnly: true, path: '/', sameSite: 'Lax', secure: true }),
      cookie.serialize('authenticated', 'true', { path: '/', sameSite: 'Lax', secure: true })
    ]);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ token: sessionId, isAdmin: false }));
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Internal Server Error' }));
  }
};



module.exports = {
  register,
  login
};
