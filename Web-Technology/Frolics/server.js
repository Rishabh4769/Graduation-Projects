const express = require('express');
const { userInfo } = require('os');
const path = require('path');
const app = express();
const port = 3000;

app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// views = /template
app.set('views', path.join(__dirname, 'template'));

// Middleware to parse JSON bodies
app.use(express.json());

// Dashboard route
app.get('/home', (req, res) => {
  res.render('index');
});

app.get('/register', (req, res) => {
  res.render('auth/signup');
});

app.get('/login', (req, res) => {
  res.render('auth/login');
});

app.get('/logout', (req, res) => {
  req.session?.destroy?.(() => {});
  res.redirect('/login');
});


// ============================================
// USER DASHBOARD - Fixed
// ============================================
app.use('/user/:userId/:username', (req, res, next) => {
  const { userId, username } = req.params;
  res.locals.userdetails = {
    id: userId,
    username: username,
    firstName: 'Rishabh',
    lastName: 'Joshi',
    email: `${username}@frolics.com`,
    phone: '+91 9876543210'
  };

  next();
});

app.get('/user/:userId/:username/dashboard', (req, res) => {
  res.render('users/userDashboard', { userdetails: res.locals.userdetails });
});
// ============================================
// USER PROFILE - Fixed
// ============================================
app.get('/user/:userId/:username/profile', (req, res) => {
  const { userId, username } = req.params;
  const mockUser = {
    id: userId,
    username: username,
    firstName: 'Rishabh',
    lastName: 'Joshi',
    email: `${username}@frolics.com`,
    phone: '+91 9876543210',
    college: 'Darshan University',
    enrollmentNo: '25010101631',
    createdAt: new Date(),
    role: 'user'
  };

  res.render('users/userProfile', {
    title: `${mockUser.firstName}'s Profile | Frolics`,
    userdetails: mockUser
  });
});
// user event route
app.get('/user/:userId/:username/events', (req, res) => {
  res.render('users/userEvents');
});


// ============================================
// ADMIN DASHBOARD - Fixed
// ============================================
app.use('/admin/:adminId/:adminname', (req, res, next) => {
  const { adminId, adminname } = req.params;
  res.locals.admindetails = {  // ✅ Fixed: admindetails
    id: adminId,
    username: adminname,
    firstName: 'Admin',
    lastName: 'Frolics',
    email: `admin@${adminname}.frolics.com`,
    phone: '+91 9999999999',
    role: 'admin'
  };
  next();
});
app.get('/admin/:adminId/:adminname', (req, res) => {
  res.render('admin/adminDashboard', { admindetails: res.locals.admindetails });
});
// ============================================
// ADMIN PROFILE - Fixed
// ============================================
app.get('/admin/:userId/:username/profile', (req, res) => {
  const { userId, username } = req.params;
  const mockAdmin = {
    id: userId,
    username: username,
    firstName: 'Admin',
    lastName: 'Frolics',
    email: `admin@${username}.frolics.com`,
    phone: '+91 9999999999',
    role: 'admin',
    createdAt: new Date()
  };

  res.render('admin/adminProfile', {
    title: 'Admin Profile | Frolics',
    admindetails: mockAdmin
  });
});


// Fallback /dashboard (no userId)
app.get('/dashboard', (req, res) => {
  res.render('index');
});

// Optional 404 handler for all other routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/home`);
});