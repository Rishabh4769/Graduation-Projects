// src/utils/js/stars.js

export function createShootingStars() {
  // support both legacy id and modern class usage
  const container = document.getElementById('starsContainer') || document.querySelector('.stars-container');
  if (!container) return;

  const colors = [
    '255,255,255',   // white
    '180,220,255',   // icy blue
    '255,240,200'    // warm
  ];

  const intervalId = setInterval(() => {
    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Size (2-5px) - exposed to CSS via --size
    const size = Math.random() * 3 + 2; // 2-5px
    star.style.setProperty('--size', size + 'px');

    // Random spawn position
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';

    // Visual vars used by CSS
    const color = colors[Math.floor(Math.random() * colors.length)];
    star.style.setProperty('--color', color);

    const angle = Math.random() * 40 + 10; // 10-50deg
    star.style.setProperty('--angle', angle + 'deg');

    const duration = Math.random() * 1.5 + 2.5; // 2.5-4s
    star.style.setProperty('--duration', duration + 's');
    star.style.animationDuration = duration + 's';

    // small tail element (purely decorative)
    const tail = document.createElement('div');
    tail.classList.add('shooting-star-tail');
    star.appendChild(tail);

    container.appendChild(star);

    // Cleanup after animation completes
    setTimeout(() => star.remove(), duration * 1000 + 600);
  }, 3000); // spawn a star every 400ms (balanced look/perf)

  return intervalId;
}
