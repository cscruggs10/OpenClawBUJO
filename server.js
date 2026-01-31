require('dotenv').config();
const express = require('express');
const path = require('path');

const journalRoutes = require('./routes/journal');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Journal API
app.use('/api/journal', journalRoutes);

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'OpenClaw BUJO',
    timestamp: new Date().toISOString() 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n📓 OpenClaw BUJO running on port ${PORT}`);
  console.log(`📊 Access at: http://localhost:${PORT}\n`);
});
