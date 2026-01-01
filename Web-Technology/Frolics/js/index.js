// Create static blinking stars
function createStars() {
    const starsContainer = document.querySelector('.stars-container');
    const numberOfStars = 200; // More stars since they're static

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        // Random size
        const sizeClass = Math.random() > 0.7 ? 'large' : (Math.random() > 0.5 ? 'medium' : 'small');
        star.classList.add(sizeClass);
        
        // Random speed
        const speedClass = Math.random() > 0.7 ? 'fast' : (Math.random() > 0.4 ? 'slow' : '');
        if (speedClass) star.classList.add(speedClass);
        
        // Random animation delay for natural effect
        star.style.animationDelay = Math.random() * 4 + 's';
        
        starsContainer.appendChild(star);
    }
}

// Initialize stars on page load
window.addEventListener('load', createStars);

// Smooth scroll for "Learn More" button
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


// Initialize stars on page load
window.addEventListener('load', createStars);

// Smooth scroll for "Learn More" button
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
