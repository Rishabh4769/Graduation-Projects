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

// Simplified login - direct redirect to dashboard
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const loginBtn = document.getElementById('loginBtn');
    const successMessage = document.getElementById('successMessage');
    
    // Show success message
    loginBtn.textContent = '✓ Redirecting...';
    loginBtn.style.backgroundColor = '#10b981';
    
    successMessage.textContent = 'Redirecting to dashboard...';
    successMessage.classList.add('show');
    
    // Direct redirect after short delay
    setTimeout(() => {
        window.location.href = `/users/dashboard`;
    }, 1000);
});

// Input focus animation (kept for UX)
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
        this.parentElement.style.transition = 'transform 0.2s ease';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Visual feedback (optional - kept for better UX)
document.getElementById('email')?.addEventListener('input', function() {
    this.style.borderColor = this.value.length > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
});

document.getElementById('password')?.addEventListener('input', function() {
    this.style.borderColor = this.value.length > 0 ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
});
