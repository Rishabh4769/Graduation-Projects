// Create falling stars animation
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    const numberOfStars = 50;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        star.style.left = Math.random() * 100 + '%';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        star.style.animationDelay = Math.random() * 5 + 's';
        
        const size = Math.random() * 3 + 2;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        starsContainer.appendChild(star);
    }
}

// Initialize stars on page load
window.addEventListener('load', createStars);

// Signup form - capture credentials → personalized dashboard redirect
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const terms = document.getElementById('terms').checked;
    const createBtn = document.getElementById('createBtn');
    const successMessage = document.getElementById('successMessage');
    
    // [ALL YOUR EXISTING VALIDATION - UNCHANGED]
    if (!firstName || !lastName) {
        alert('Please enter your full name.');
        return;
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
        alert('Name should contain only letters.');
        return;
    }
    if (!email) {
        alert('Please enter your email address.');
        return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    if (!password) {
        alert('Please enter a password.');
        return;
    }
    if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        return;
    }
    if (!terms) {
        alert('Please accept the Terms & Conditions.');
        return;
    }
    
    // ✅ NEW: Generate unique userId and username slug
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substr(2, 4);
    const userId = `u${timestamp}${randomSuffix}`; // e.g., u1704256789123_abcd
    const usernameSlug = `${firstName.toLowerCase().trim().replace(/\s+/g, '_')}_${lastName.toLowerCase().trim().replace(/\s+/g, '_')}`; // john_doe
    
    // UI feedback
    createBtn.disabled = true;
    createBtn.textContent = 'Creating account...';
    successMessage.textContent = `Welcome ${firstName}! Setting up your dashboard...`;
    successMessage.classList.add('show');
    
    // Store user data (localStorage for demo, JWT in production)
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', usernameSlug);
    localStorage.setItem('fullName', `${firstName} ${lastName}`);
    localStorage.setItem('email', email);
    
    // Redirect to personalized dashboard matching your route
    setTimeout(() => {
        window.location.href = `/login`;
        // → /u1704256789123_abcd/john_doe/dashboard
        // Matches: app.get('/:userId/:username/dashboard', ...)
    }, 1500);
});

// [KEEP ALL YOUR OTHER CODE UNCHANGED]
document.getElementById('changeMethod')?.addEventListener('click', function() {
    window.location.href = '/login';
});

// Password strength indicator
document.getElementById('password')?.addEventListener('input', function() {
    const password = this.value;
    let color = '#ef4444'; // Red
    
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
        color = '#10b981'; // Green
    } else if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
        color = '#f59e0b'; // Orange
    }
    
    this.style.borderColor = password.length > 0 ? color : 'rgba(255, 255, 255, 0.15)';
});

// Input focus animation
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});
