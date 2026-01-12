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

// Login form - auto-login from signup data or manual
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Hide previous messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // Basic validation
    if (!email || !password) {
        errorMessage.textContent = 'Please fill in all fields.';
        errorMessage.classList.add('show');
        return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address.';
        errorMessage.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        errorMessage.classList.add('show');
        return;
    }
    
    // ✅ NEW: Check for signup session data first
    const storedEmail = localStorage.getItem('signupEmail');
    const storedPassword = localStorage.getItem('signupPassword');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    loginBtn.disabled = true;
    
    // Step 1: Validating...
    loginBtn.textContent = 'Validating...';
    
    setTimeout(() => {
        // AUTO-LOGIN: Match signup credentials
        if (storedEmail === email && storedPassword === password && userId && username) {
            loginBtn.textContent = '✓ Auto-login successful!';
            loginBtn.style.backgroundColor = '#10b981';
            
            successMessage.textContent = 'Welcome back! Redirecting to dashboard...';
            successMessage.classList.add('show');
            
            setTimeout(() => {
                window.location.href = `/${userId}/${username}/dashboard`;
            }, 1000);
            return;
        }
        
        // MANUAL LOGIN: Demo static creds
        const demoCreds = {
            'demo@frolic.com': 'demo123',
            'admin@frolic.com': 'admin123'
        };
        
        if (demoCreds[email] === password) {
            // Demo login - generate temp userId/username
            const tempId = `demo_${Date.now()}`;
            const tempName = email.split('@')[0];
            
            loginBtn.textContent = '✓ Login successful!';
            loginBtn.style.backgroundColor = '#10b981';
            
            successMessage.textContent = 'Welcome! Redirecting to dashboard...';
            successMessage.classList.add('show');
            
            setTimeout(() => {
                window.location.href = `/${tempId}/${tempName}/dashboard`;
            }, 1000);
        } else {
            // Invalid login
            loginBtn.textContent = 'Login';
            loginBtn.disabled = false;
            loginBtn.style.backgroundColor = '';
            
            errorMessage.textContent = 'Invalid email or password.';
            errorMessage.classList.add('show');
        }
    }, 800);
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

// Real-time email validation indicator
document.getElementById('email')?.addEventListener('input', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value.length > 0) {
        if (emailRegex.test(this.value)) {
            this.style.borderColor = '#10b981'; // Green
        } else {
            this.style.borderColor = '#f59e0b'; // Orange
        }
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
});

// Real-time password validation indicator
document.getElementById('password')?.addEventListener('input', function() {
    if (this.value.length >= 6) {
        this.style.borderColor = '#10b981'; // Green
    } else if (this.value.length > 0) {
        this.style.borderColor = '#f59e0b'; // Orange
    } else {
        this.style.borderColor = 'rgba(255, 255, 255, 0.15)';
    }
});
