// utilities.js - Contains general utility functions like sound effects and particle animations

// ==================== SOUND EFFECTS (PLACEHOLDER) ====================
export function playClickSound() {
    // In production, use Web Audio API or Howler.js
    // For now, just visual feedback
    console.log('🔊 Click sound');
}

// ==================== PARTICLE EFFECTS ====================
export function initParticleEffects() {
    // Add hover effects to all interactive elements
    document.querySelectorAll('.feature-card, .department-card, .cert-card').forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            createHoverParticles(e.target);
        });
    });
}

export function createHoverParticles(element) {
    const rect = element.getBoundingClientRect();
    const particleCount = 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px';
        particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
        document.body.appendChild(particle);
        
        gsap.to(particle, {
            y: -100,
            opacity: 0,
            duration: 1,
            ease: 'power1.out',
            onComplete: () => particle.remove()
        });
    }
}

export function createParticleExplosion(element, emoji) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = emoji;
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.fontSize = (Math.random() * 30 + 20) + 'px';
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const distance = Math.random() * 150 + 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.to(particle, {
            x: x,
            y: y,
            rotation: Math.random() * 360,
            opacity: 0,
            scale: Math.random() + 0.5,
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => particle.remove()
        });
    }
}

// ==================== RIPPLE EFFECT ====================
export function createRipple(event) {
    const button = event.currentTarget;

    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
    circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}
