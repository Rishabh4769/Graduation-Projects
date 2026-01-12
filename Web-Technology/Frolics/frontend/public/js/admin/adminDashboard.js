// ============================================
// ADMIN DASHBOARD JAVASCRIPT
// ============================================

// Stars Effect
function createStars() {
    const starsContainer = document.getElementById('starsContainer');
    // Slightly more stars for the admin view if you like, or keep it same
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

// Shooting Stars
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
    }, 3500);
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

// Admin Card Animations
function initCardAnimations() {
    // 1. Stats Cards
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 2. Overview Cards (Admin specific)
    document.querySelectorAll('.overview-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px)';
            this.style.borderColor = 'rgba(59, 130, 246, 0.4)'; // Highlight border
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    });

    // 3. List Items (Events/Users)
    document.querySelectorAll('.event-item, .user-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(6px)';
            this.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.background = 'rgba(255, 255, 255, 0.05)';
        });
    });
}

// Initialize everything
window.addEventListener('load', () => {
    createStars();
    createShootingStars();
    initSmoothScroll();
    initCardAnimations();
});

// Scrollspy for Nav
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        // Only update if we are on a hash link
        if(current) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                const href = link.querySelector('a').getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});
