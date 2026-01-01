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

// Login form validation and redirect
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');
    const loginBtn = document.getElementById('loginBtn');
    
    // Hide previous messages
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    
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
    
    // Password minimum length
    if (password.length < 6) {
        errorMessage.textContent = 'Password must be at least 6 characters.';
        errorMessage.classList.add('show');
        return;
    }
    
    // Start the cool multi-step process
    loginBtn.disabled = true;
    
    // Step 1: Validating credentials
    loginBtn.textContent = 'Validating...';
    
    setTimeout(() => {
        // Step 2: Processing
        loginBtn.textContent = 'Processing...';
        
        setTimeout(() => {
            // Step 3: Success
            loginBtn.textContent = '✓ Authenticated';
            loginBtn.style.backgroundColor = '#10b981';
            
            // Show success message
            successMessage.textContent = '✓ Login successful! Welcome back!';
            successMessage.classList.add('show');
            
            // Step 4: Redirect
            setTimeout(() => {
                successMessage.textContent = ' Redirecting to dashboard...';
                
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 500);
            }, 800);
        }, 600);
    }, 600);
});

// Google login redirect with animation
document.getElementById('googleLogin')?.addEventListener('click', function() {
    const successMessage = document.getElementById('successMessage');
    
    this.textContent = 'Connecting...';
    this.disabled = true;
    
    setTimeout(() => {
        successMessage.textContent = '✓ Google authentication successful!';
        successMessage.classList.add('show');
        
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
    }, 800);
});

// GitHub login redirect with animation
document.getElementById('githubLogin')?.addEventListener('click', function() {
    const successMessage = document.getElementById('successMessage');
    
    this.textContent = 'Connecting...';
    this.disabled = true;
    
    setTimeout(() => {
        successMessage.textContent = '✓ GitHub authentication successful!';
        successMessage.classList.add('show');
        
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1000);
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
