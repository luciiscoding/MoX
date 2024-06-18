const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const movieController = require('./controllers/movie-controller');

const PORT = 7081;
const MONGOURL = "mongodb://localhost:27017/MoX";

// Connect to MongoDB
mongoose.connect(MONGOURL);

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

// CORS middleware
const setCorsHeaders = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
  } else {
    next();
  }
};

// Function to handle API requests
const handleApiRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
  const id = pathParts.length === 2 ? pathParts[1] : null;

  // Set CORS headers
  setCorsHeaders(req, res, async () => {
    console.log(`Handling request for ${req.method} ${req.url}`);
    console.log(`Headers: ${JSON.stringify(req.headers)}`);

    // Parse JSON body
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
        console.log(`Body: ${JSON.stringify(req.body)}`);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
        return;
      }

      if (req.method === 'GET' && pathParts[0] === 'api') {
        if (pathParts[1] === 'movies') {
          if (id) {
            movieController.getMovie(req, res, id);
          } else {
            movieController.getMovies(req, res);
          }
        }
      } else if (req.method === 'POST' && pathParts[0] === 'api' && pathParts[1] === 'movies') {
        movieController.createMovie(req, res);
      } else if (req.method === 'PUT' && pathParts[0] === 'api' && pathParts[1] === 'movies' && id) {
        movieController.updateMovie(req, res, id);
      } else if (req.method === 'DELETE' && pathParts[0] === 'api' && pathParts[1] === 'movies' && id) {
        movieController.deleteMovie(req, res, id);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
  });
};

// Function to handle view requests
const handleViewRequest = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname === '/' ? '/home.html' : parsedUrl.pathname;
  const filePath = path.join(__dirname, '../frontend', pathname);
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

  serveStaticFile(filePath, contentType, res);
};

// Create server and handle requests
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api')) {
    handleApiRequest(req, res);
  } else {
    handleViewRequest(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
