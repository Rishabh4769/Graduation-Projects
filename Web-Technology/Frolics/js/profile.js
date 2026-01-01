// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Stars effect (same as dashboard)
    createStars();
    createShootingStars();

    // Profile form handling
    const profileForm = document.getElementById('profileForm');
    const deleteBtn = document.getElementById('deleteAccount');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.querySelector('.close');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDelete = document.getElementById('confirmDeleteBtn');
    const confirmInput = document.getElementById('confirmDelete');

    // Form submission
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);
        
        try {
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                body: formData
            });
            
            if (response.ok) {
                showNotification('Profile updated successfully!', 'success');
            } else {
                showNotification('Failed to update profile', 'error');
            }
        } catch (error) {
            showNotification('Network error. Please try again.', 'error');
        }
    });

    // Delete account modal
    deleteBtn.addEventListener('click', () => {
        deleteModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    cancelDelete.addEventListener('click', () => {
        deleteModal.style.display = 'none';
        confirmInput.value = '';
        confirmDelete.disabled = true;
    });

    // Confirm delete input
    confirmInput.addEventListener('input', () => {
        confirmDelete.disabled = confirmInput.value !== 'DELETE';
    });

    confirmDelete.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/profile/delete', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                window.location.href = '/logout';
            }
        } catch (error) {
            showNotification('Failed to delete account', 'error');
        }
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === deleteModal) {
            deleteModal.style.display = 'none';
            confirmInput.value = '';
            confirmDelete.disabled = true;
        }
    });

    // Notification helper
    function showNotification(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});

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