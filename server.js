const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Proxy requests to /netlify/functions to the function server
app.use('/netlify/functions', createProxyMiddleware({
  target: 'http://localhost:8888', // Adjust the port if necessary
  changeOrigin: true,
  pathRewrite: {
    '^/netlify/functions': '',
  },
}));

// Fallback to serving index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = 3000; // You can change the port if needed
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
