const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 1. MIDDLEWARE FIRST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/public'))); // CSS/JS/images

// 2. VIEW ENGINE CONFIG
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views'));

// 3. TEMPLATE ROUTES (HTML pages - root paths)
app.get('/', (req, res) => res.render('events/list'));           // /
app.get('/institutes', (req, res) => res.render('institutes/list')); // /institutes
app.get('/events', (req, res) => res.render('events/list'));     // /events  
app.get('/groups', (req, res) => res.render('groups/list'));     // /groups
app.get('/login', (req, res) => res.render('auth/login'));       // /login
app.get('/register', (req, res) => res.render('auth/register')); // /register

// 4. API ROUTES (JSON data - /api/* prefix)
app.use('/api/auth', require('./src/routes/auth'));      // POST /api/auth/login
app.use('/api/users', require('./src/routes/users'));        // GET/POST /api/users
app.use('/api/institutes', require('./src/routes/institutes')) // GET/POST /api/institutes
app.use('/api/events', require('./src/routes/events'));      // GET/POST /api/events
app.use('/api/groups', require('./src/routes/groups'));      // GET/POST /api/groups  
app.use('/api/participants', require('./src/routes/participants')); // GET/POST /api/participants
app.use('/api/winners', require('./src/routes/winners'));    // GET/POST /api/winners

// 5. Catch-all for client-side routing (future SPA)
app.get('*', (req, res) => res.render('events/list')); 

app.listen(port, () => {
  console.log(`Frolics server running at http://localhost:${port}`);
});
