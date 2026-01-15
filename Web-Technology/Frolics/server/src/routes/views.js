const express = require('express');
const router = express.Router();

// Home page
router.get('/home', (req, res) => {
    res.render('index', { 
        title: 'Frolics',
        subtitle: 'Home page'
    });
});

router.get('/register',(req,res) => {
    res.render('auth/signup')
});

router.get('/login',(req,res) => {
    res.render('auth/login')
});

// User Dashboard
router.get('/users/dashboard', (req, res) => {
    res.render('users/dashboard', { 
        title: 'Welcome to Dashboard',
        subtitle: 'Manage your events and activities',
        userName: 'John Doe',        // From session
        userEmail: 'john@example.com',
        userInitials: 'JD'
    });
});


// Add these to your existing views.js
router.get('/users/events/list', (req, res) => {
    res.render('users/events/eventList', { 
        title: 'Events List',
        subtitle: 'Discover amazing events and register now!',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        userInitials: 'JD'
    });
});

router.get('/users/events/upcoming', (req, res) => {
    res.render('users/events/upcoming', { title: 'Upcoming Events', subtitle:null });
});
router.get('/users/events/past', (req, res) => {
    res.render('users/events/past', { title: 'Past Events', subtitle:null });
});
router.get('/users/groups/mine', (req, res) => {
    res.render('users/groups/mine', { title: 'My Groups', subtitle:null });
});
router.get('/users/groups/create', (req, res) => {
    res.render('users/groups/create', { title: 'Create Group', subtitle:null });
});
router.get('/users/groups/join', (req, res) => {
    res.render('users/groups/join', { title: 'Join Group', subtitle:null });
});
router.get('/users/profile', (req, res) => {
    // Mock user data (replace with req.user later)
    const userdetails = {
        id: 1,
        username: 'rishabh',
        firstName: 'Rishabh',
        lastName: 'Patel',
        email: 'rishabh@frolics.com',
        phone: '+91 9876543210',
        createdAt: new Date(),
        role: 'user'
    };

    res.render('users/profile', { 
        title: 'Profile | Frolics',
        // Profile page data
        userdetails: userdetails,
        // NAVBAR data (these were missing!)
        userInitials: userdetails.firstName.charAt(0).toUpperCase() + userdetails.lastName.charAt(0).toUpperCase(),
        userName: `${userdetails.firstName} ${userdetails.lastName}`,
        userEmail: userdetails.email
    });
});



module.exports = router;
