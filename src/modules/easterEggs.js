// easterEggs.js - Manages interactive easter egg functionalities

import { animateCurrencyGain, checkLevelUp, showXpBarTemporarily, animateXPGain } from './uiElements.js'; // Added animateXPGain
import { createParticleExplosion } from './utilities.js';
import { addXP } from './gameState.js';

export function initEasterEggs() {
    let clickCount = 0;
    document.querySelector('.logo-title')?.addEventListener('click', function() {
        clickCount++;
        
        if (clickCount >= 5) {
            clickCount = 0;
            
            // Secret reward
            const secret = document.createElement('div');
            secret.textContent = '🎁 SECRET BONUS! +500 XP';
            secret.style.position = 'fixed';
            secret.style.top = '50%';
            secret.style.left = '50%';
            secret.style.transform = 'translate(-50%, -50%)';
            secret.style.fontSize = '48px';
            secret.style.fontWeight = '900';
            secret.style.color = '#9B59B6';
            secret.style.textShadow = '4px 4px 8px rgba(0,0,0,0.8)';
            secret.style.zIndex = '10000';
            secret.style.fontFamily = "'Baloo 2', cursive";
            secret.style.pointerEvents = 'none';
            
            document.body.appendChild(secret);
            
            gsap.fromTo(secret,
                { scale: 0 },
                { scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
            );
            
            gsap.to(secret, {
                y: -100,
                opacity: 0,
                duration: 2,
                delay: 1,
                onComplete: () => secret.remove()
            });
            
            // Give 500 XP instead of gems
            addXP(500); // Add 500 XP
            checkLevelUp(); // Update XP bar and text
            showXpBarTemporarily(); // Show XP bar after XP gain
        }
    });

    // Also include other easter eggs here, like the world map click
    document.getElementById('worldMap')?.addEventListener('click', function() {
        gsap.to(this, {
            scale: 1.1,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        createParticleExplosion(this, '🗺️');
        animateCurrencyGain();
    });

    // Backdrop click for +5 XP
    document.body.addEventListener('click', (event) => {
        const tagName = event.target.tagName;
        const isInteractive = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT'].includes(tagName) ||
                              event.target.closest('.currency-hud, .xp-bar, .notify-form, .footer-link, .feature-card, .department-card, .cert-card, .neural-canvas-container');

        if (!isInteractive) {
            animateXPGain(5, event.clientX, event.clientY);
        }
    });

    console.log('🎮 VMSD Retail Simulation World - Landing Page Loaded');
    console.log('💡 Try clicking around to earn rewards and level up!');
    console.log('🎁 Secret: Click the VMSD logo 5 times for a bonus...');
}
