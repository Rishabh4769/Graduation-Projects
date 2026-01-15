const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../../client/public')));

// VIEW ENGINE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../../client/views'));

// ROUTES - CLEAN!
app.use('/', require('./routes/views'));

app.listen(port, () => {
  console.log(`Frolics server running at http://localhost:${port}`);
});
