const express = require('express');
const router = express.Router();

// Home page
router.get('/home', (req, res) => {
    res.render('index', { 
        title: 'Frolics',
        subtitle: 'Home page'
    });
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
    res.render('users/events/upcoming', { title: 'Upcoming Events' });
});
router.get('/users/events/past', (req, res) => {
    res.render('users/events/past', { title: 'Past Events' });
});
router.get('/users/groups/mine', (req, res) => {
    res.render('users/groups/mine', { title: 'My Groups' });
});
router.get('/users/groups/create', (req, res) => {
    res.render('users/groups/create', { title: 'Create Group' });
});
router.get('/users/groups/join', (req, res) => {
    res.render('users/groups/join', { title: 'Join Group' });
});


module.exports = router;
