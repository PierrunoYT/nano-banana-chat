const { createServer } = require('http');
const { parse } = require('url');
const { join } = require('path');
const fs = require('fs');

const server = createServer((req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  // Serve static files from public directory
  let filePath = join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.statusCode = 404;
    res.end('Not Found');
    return;
  }

  // Get file extension for content type
  const ext = filePath.split('.').pop();
  const contentTypes = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml'
  };

  const contentType = contentTypes[ext] || 'text/plain';
  res.setHeader('Content-Type', contentType);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});