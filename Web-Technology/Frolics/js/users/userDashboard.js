// Stars Effect
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    const numberOfStars = 150;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        // Random size
        const sizes = ['small', 'medium', 'large'];
        const size = sizes[Math.floor(Math.random() * sizes.length)];
        star.classList.add(size);

        // Random speed
        const speeds = ['', 'fast', 'slow'];
        const speed = speeds[Math.floor(Math.random() * speeds.length)];
        if (speed) star.classList.add(speed);

        // Random delay
        star.style.animationDelay = Math.random() * 4 + 's';

        starsContainer.appendChild(star);
    }
}

function createShootingStars() {
    const starsContainer = document.getElementById('starsContainer');
    
    setInterval(() => {
        const shootingStar = document.createElement('div');
        shootingStar.classList.add('shooting-star');
        
        // Random start position (left side)
        shootingStar.style.left = Math.random() * 20 + '%';
        shootingStar.style.top = Math.random() * 40 + '%';
        
        // Random speed and delay
        shootingStar.style.animationDuration = (Math.random() * 1.5 + 2.5) + 's';
        shootingStar.style.animationDelay = Math.random() * 2 + 's';
        
        starsContainer.appendChild(shootingStar);
        
        // Auto-remove after animation
        setTimeout(() => {
            if (shootingStar.parentNode) {
                shootingStar.remove();
            }
        }, 5000);
    }, 3500); // New shooting star every 3.5 seconds
}

// Smooth scrolling for nav links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects to stats cards
function initCardAnimations() {
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Initialize everything when DOM is loaded
window.addEventListener('load', () => {
    createStars();
    createShootingStars();
    initSmoothScroll();
    initCardAnimations();
});

// Additional enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Nav active state on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.querySelector('a').getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});
document.getElementById('logoutBtn')?.addEventListener('click', function () {
    // Clear client-side session
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('signupEmail');
    localStorage.removeItem('signupPassword');

    // Optional: small feedback
    this.textContent = 'Logging out...';
    this.disabled = true;

    setTimeout(() => {
        window.location.href = '/login';
    }, 500);
});
