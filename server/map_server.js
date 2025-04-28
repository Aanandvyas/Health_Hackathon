import express from 'express';
import path from 'path';

// Deriving __dirname for ES module
const __dirname = new URL('.', import.meta.url).pathname;
const app = express();
const port = 8000; // You can set any port you want

// Serve static files from the 'map_service' directory
app.use('/map_service', express.static(path.join(__dirname, 'resources', 'map_service')));

// Serve the map.html file at the /map route
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'resources', 'map_service', 'map.html'));
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
