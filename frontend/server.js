const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./src/utils/api'); 

const app = express();
const PORT = 3000;

// Load SSL certificate and key
const options = {
  key: fs.readFileSync(path.join(__dirname, 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: true, credentials: true }));

// API routes
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await api.login(username, password);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { username, password, email, name } = req.body;
    const data = await api.signup(username, password, email, name);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/logout', async (req, res) => {
  try {
    await api.logout();
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/current-user', async (req, res) => {
  try {
    const data = await api.getCurrentUser();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/user-settings', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const data = await api.updateUserSettings(name, email, password);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/hotel_search', async (req, res) => {
  try {
    const { hotelid } = req.query;
    const data = await api.getHotelDetails(hotelid);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/account', async (req, res) => {
  try {
    const data = await api.getAccountInfo();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/governorate-info/:governorate', async (req, res) => {
  try {
    const governorate = req.params.governorate;
    const data = await api.getGovernorateInfo(governorate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const data = await api.searchHotels(query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the 'frontend/build' directory
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

// Fallback route to serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server is running on https://localhost:${PORT}`);
});