require('dotenv').config();
console.log('PORT from env:', process.env.PORT);
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const connectDB = require('./config/database');

// connect mongodb
connectDB();

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../client/public')));

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../client/views'));

// ROUTES - CLEAN!
app.use('/', require('./routes/routes'));

// APIs
app.use('/api/users', require('./APIs/user_api'));

app.listen(PORT, () => {
  console.log(`Frolics server running at http://localhost:${PORT}/dashboard`);
});