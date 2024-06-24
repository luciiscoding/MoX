
const path = require('path');
const fs = require('fs');

function handleViewRequest(req, res) {
    const filePath = path.join(__dirname, '../../frontend/html/start-page.html');
    console.log('Serving file:', filePath);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>Internal Server Error</h1>');
            return;
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    });
}

module.exports = { handleViewRequest };
