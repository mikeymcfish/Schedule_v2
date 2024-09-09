const express = require('express');
const path = require('path');
const api = require('./api.cjs');

const app = express();

app.use(express.json());

// Serve API routes
app.use('/api', api);

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));