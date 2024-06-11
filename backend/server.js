// backend/server.js
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const apiController = require('./controllers/api-controller');

const PORT = 7081;
const MONGOURL = "mongodb://localhost:27017/MoX";

// Connect to MongoDB
mongoose.connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error(`Failed to connect to MongoDB: ${err.message}`);
});

// Function to serve static files
const serveStaticFile = (filePath, contentType, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 - Internal Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

// Function to handle API requests
const handleApiRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  const id = pathParts.length === 2 ? pathParts[1] : null;

  if (req.method === 'GET' && pathParts[0] === 'api' && pathParts[1] === 'users') {
    if (id) {
      apiController.getUser(req, res, id);
    } else {
      apiController.getUsers(req, res);
    }
  } else if (req.method === 'POST' && pathParts[0] === 'api' && pathParts[1] === 'users') {
    apiController.createUser(req, res);
  } else if (req.method === 'PUT' && pathParts[0] === 'api' && pathParts[1] === 'users' && id) {
    apiController.updateUser(req, res, id);
  } else if (req.method === 'DELETE' && pathParts[0] === 'api' && pathParts[1] === 'users' && id) {
    apiController.deleteUser(req, res, id);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

// Function to handle other view requests
const handleViewRequest = (req, res) => {
  const filePath = path.join(__dirname, '../frontend', req.url);
  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'application/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
    case '.png':
      contentType = 'image/png';
      break;
    case '.jpg':
      contentType = 'image/jpeg';
      break;
    case '.json':
      contentType = 'application/json';
      break;
    case '.html':
      contentType = 'text/html';
      break;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - File Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 - Internal Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
};

// Create server and handle requests
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname } = parsedUrl;

  if (pathname.startsWith('/api')) {
    handleApiRequest(req, res);
  } else {
    handleViewRequest(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
