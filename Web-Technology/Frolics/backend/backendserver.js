const express = require('express');
const path = require('path');
const routes = require('./routes/routes');
const app = express();
const port = 3000;

// 1. MIDDLEWARE FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public'))); // CSS/JS/images

// 2. VIEW ENGINE CONFIG (ONLY on main app)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../frontend/views'));

// 3. Mount your routes
app.use('/', routes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
