const express = require('express');
const router = express.Router();

// 🚀 SINGLE DUMMY USER FUNCTION (Zero Mongo!)
const getCurrentUser = (req, res, next) => {
    
    const userData = {
        id: 1,
        username: 'rishabh',
        firstName: 'Rishabh',
        lastName: 'Patel',
        email: 'rishabh@frolics.com',
        phone: '+91 9876543210',
        enrollmentNo: '25010101631',
        college: 'Darshan University',
        role: 'user',
        createdAt: new Date('2025-01-10'),
        // Navbar computed fields
        userInitials: 'RP',
        userName: 'Rishabh Patel'
    };

    req.userData = userData;
    next();
};

// Home page
router.get('/dashboard', (req, res) => {
    res.render('index', { 
        title: 'Frolics',
        subtitle: 'Home page'
    });
});

router.get('/register', (req, res) => {
    res.render('auth/signup');
});

router.get('/login', (req, res) => {
    res.render('auth/login');
});

// ALL USER PAGES use SINGLE dummy userData!
router.get('/users/dashboard', getCurrentUser, (req, res) => {
    res.render('users/dashboard', { 
        title: 'Dashboard | Frolics',
        subtitle: 'Manage your events and activities',
        userData: req.userData
    });
});

router.get('/users/events/list', getCurrentUser, (req, res) => {
    res.render('users/events/events', { 
        title: 'Events List | Frolics',
        subtitle: 'Discover amazing events and register now!',
        userData: req.userData
    });
});

router.get('/users/events/upcoming', getCurrentUser, (req, res) => {
    res.render('users/events/upcoming', { 
        title: 'Upcoming Events | Frolics',
        userData: req.userData
    });
});

router.get('/users/events/past', getCurrentUser, (req, res) => {
    res.render('users/events/past', { 
        title: 'Past Events | Frolics',
        userData: req.userData
    });
});

router.get('/users/groups/mine', getCurrentUser, (req, res) => {
    res.render('users/groups/mine', { 
        title: 'My Groups | Frolics',
        userData: req.userData
    });
});

router.get('/users/groups/create', getCurrentUser, (req, res) => {
    res.render('users/groups/create', { 
        title: 'Create Group | Frolics',
        userData: req.userData
    });
});

router.get('/users/groups/join', getCurrentUser, (req, res) => {
    res.render('users/groups/join', { 
        title: 'Join Group | Frolics',
        userData: req.userData
    });
});

router.get('/users/profile', getCurrentUser, (req, res) => {
    res.render('users/profile', { 
        title: 'Profile | Frolics',
        userData: req.userData
    });
});

// Admin routes
router.get('/admin/dashboard', getCurrentUser, (req, res) => {
    res.render('admin/dashboard', { 
        title: 'Admin Dashboard | Frolics',
        adminData: req.userData
    });
});
module.exports = router;