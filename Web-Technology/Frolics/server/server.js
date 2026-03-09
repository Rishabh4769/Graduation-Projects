require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const SERVER_PORT = process.env.SERVER_PORT || 3030;
const CLIENT_PORT = process.env.CLIENT_PORT || 4040;

const connectDB = require('./config/database');

// Connect to MongoDB
connectDB();

// Middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:4040', 
    'http://localhost:3000',
    'https://your-frontend-domain.com'
  ];

  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/routes'));
app.use('/api/login',    require('./APIs/auth/login_api'));
app.use('/api/register', require('./APIs/auth/register_api'));
app.use('/api/users',    require('./APIs/user_api'));
app.use('/api/events',   require('./APIs/event_api'));
app.use('/api/departments', require('./APIs/department_api'));
app.use('/api/participants', require('./APIs/participant_api'));
app.use('/api/groups',   require('./APIs/group_api'));
app.use('/api/winners',  require('./APIs/winner_api'));
app.use('/api/institutes', require('./APIs/institutes_api'));

// Serve React build in production only
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, '../../client-side/build');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

// Start server
app.listen(SERVER_PORT, () => {
  console.log(`Frolics Backend API running at http://localhost:${SERVER_PORT}`);
  console.log(`(Frontend expected at http://localhost:${CLIENT_PORT})`);
  console.log(`Test API: http://localhost:${SERVER_PORT}/api/events`);
});