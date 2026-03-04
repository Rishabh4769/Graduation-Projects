require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const SERVER_PORT = process.env.SERVER_PORT || 3030;
const CLIENT_PORT = process.env.CLIENT_PORT || 4040;
const connectDB = require('./config/database');


// Connect MongoDB
connectDB();

// MIDDLEWARE - API ONLY
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// **ROUTES**
app.use('/', require('./routes/routes'));

// **API ROUTES** (Keep these perfect!)
app.use('/api/login', require('./APIs/auth/login_api'));
app.use('/api/users', require('./APIs/user_api'));
app.use('/api/events', require('./APIs/event_api'));
app.use('/api/departments', require('./APIs/department_api'));
app.use('/api/participants', require('./APIs/participant_api'));
app.use('/api/groups', require('./APIs/group_api'));
app.use('/api/winners', require('./APIs/winner_api'));
app.use('/api/institutes', require('./APIs/institutes_api'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client-side/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client-side/build/index.html'));
  });
}

app.listen(SERVER_PORT, () => {
  console.log(`Frolics API running at http://localhost:${SERVER_PORT}/api/events`);
  console.log(`Frolics Frontend running at http://localhost:${CLIENT_PORT}`);
});
