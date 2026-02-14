// uiElements.js - Manages XP bar, level, and currency HUD updates and animations

import { currentXP, currentLevel, getXpNeededForLevel, addXP, resetXP, incrementLevel, getCurrentXP, getCurrentLevel, getResourceCoins, addResourceCoins, getSkillPoints, addSkillPoints, getVmsdGems, addVmsdGems } from './gameState.js';
import { createParticleExplosion } from './utilities.js'; // Assuming particle effects are in utilities

let xpBarHideTimeout;

// New function to initialize the UI based on current game state
export function initializeUIState() {
    // Update XP Bar and Level
    const xpFill = document.getElementById('xpFill');
    const xpText = document.querySelector('.xp-bar .xp-text');
    const currentXPValue = getCurrentXP();
    const currentLevelValue = getCurrentLevel();
    const requiredXP = getXpNeededForLevel(currentLevelValue);

    xpText.textContent = `Level ${currentLevelValue} • ${currentXPValue} / ${requiredXP} XP`;
    xpFill.style.transform = `scaleX(${currentXPValue / requiredXP})`;

    // Update Currency HUD
    document.querySelector('[data-currency="rc"]').textContent = getResourceCoins().toLocaleString();
    document.querySelector('[data-currency="sp"]').textContent = getSkillPoints().toLocaleString();
    document.querySelector('[data-currency="vg"]').textContent = getVmsdGems().toLocaleString();
}

export function showXpBarTemporarily() {
    const xpBar = document.querySelector('.xp-bar');
    gsap.killTweensOf(xpBar); // Kill any existing fade-out tweens
    gsap.to(xpBar, { opacity: 1, duration: 0.3, onComplete: () => {
        clearTimeout(xpBarHideTimeout);
        xpBarHideTimeout = setTimeout(() => {
            gsap.to(xpBar, { opacity: 0, duration: 1 });
        }, 5000); // Hide after 5 seconds
    }});
}

export function animateCurrencyGain(type = 'rc') {
    const currencyElement = document.querySelector(`[data-currency="${type}"]`);
    let currentValue;
    let updateFunction;

    switch (type) {
        case 'rc':
            currentValue = getResourceCoins();
            updateFunction = addResourceCoins;
            break;
        case 'sp':
            currentValue = getSkillPoints();
            updateFunction = addSkillPoints;
            break;
        case 'vg':
            currentValue = getVmsdGems();
            updateFunction = addVmsdGems;
            break;
        default:
            console.warn('Unknown currency type:', type);
            return;
    }
    
    const gainAmount = type === 'vg' ? Math.floor(Math.random() * 5 + 1) :
                       type === 'sp' ? Math.floor(Math.random() * 20 + 10) :
                       Math.floor(Math.random() * 100 + 50);
    
    const oldValue = currentValue; // Store current value before update
    updateFunction(gainAmount); // Update the global state
    
    // Get the *actual* new value from the gameState after the update
    let finalNewValue;
    switch (type) {
        case 'rc':
            finalNewValue = getResourceCoins();
            break;
        case 'sp':
            finalNewValue = getSkillPoints();
            break;
        case 'vg':
            finalNewValue = getVmsdGems();
            break;
        default:
            finalNewValue = 0; // Fallback
    }

    currencyElement.textContent = finalNewValue.toLocaleString();
    
    // Animate number change in DOM
    gsap.to({ value: oldValue }, { // Animate FROM the actual old value
        value: finalNewValue, // Animate TO the actual new value
        duration: 1,
        ease: 'power2.out',
        onUpdate: function() {
            currencyElement.textContent = Math.floor(this.targets()[0].value).toLocaleString();
        }
    });
    
    // Scale animation
    gsap.fromTo(currencyElement.parentElement,
        { scale: 1 },
        { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1 }
    );
    
    // Show gain indicator
    const gainIndicator = document.createElement('div');
    gainIndicator.textContent = `+${gainAmount}`;
    gainIndicator.style.position = 'fixed';
    gainIndicator.style.color = '#2ECC71';
    gainIndicator.style.fontSize = '24px';
    gainIndicator.style.fontWeight = '800';
    gainIndicator.style.pointerEvents = 'none';
    gainIndicator.style.zIndex = '10000';
    gainIndicator.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
    
    const rect = currencyElement.getBoundingClientRect();
    gainIndicator.style.left = rect.right + 'px';
    gainIndicator.style.top = rect.top + 'px';
    
    document.body.appendChild(gainIndicator);
    
    gsap.to(gainIndicator, {
        y: -50,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out',
        onComplete: () => gainIndicator.remove()
    });
    
    // Add XP for any interaction that gains currency
    const randomXpGain = Math.floor(Math.random() * 60) + 20; // XP between 20 and 80
    addXP(randomXpGain); 
    checkLevelUp();
    showXpBarTemporarily(); // Show XP bar temporarily on any gain
}

export function checkLevelUp() {
    const xpFill = document.getElementById('xpFill');
    const xpText = document.querySelector('.xp-bar .xp-text');

    const requiredXP = getXpNeededForLevel(getCurrentLevel()); // Use dynamic XP requirement

    // Calculate progress towards next level
    let xpProgress = getCurrentXP(); // currentXP now directly represents progress for the current level
    let progressRatio = xpProgress / requiredXP;

    // Update XP bar fill
    gsap.to(xpFill, {
        scaleX: progressRatio,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
            // Check for level up after animation completes
            if (getCurrentXP() >= requiredXP) {
                levelUp(); 
            }
        }
    });

    // Update XP text
    xpText.textContent = `Level ${getCurrentLevel()} • ${xpProgress} / ${requiredXP} XP`;
}

export function levelUp() {
    const xpText = document.querySelector('.xp-bar .xp-text');
    const xpFill = document.getElementById('xpFill');

    let requiredXPForCurrentLevel = getXpNeededForLevel(getCurrentLevel());
    let hasLeveledUp = false;

    // Handle multiple level-ups in one go if currentXP is very high
    while (getCurrentXP() >= requiredXPForCurrentLevel) {
        hasLeveledUp = true;
        incrementLevel(); // Use incrementLevel from gameState
        resetXP(); // Use resetXP from gameState (currentXP = 0 for the new level)
        requiredXPForCurrentLevel = getXpNeededForLevel(getCurrentLevel()); // Get XP needed for the new level

        // Trigger level up animation/badge
        const levelUpBadge = document.createElement('div');
        levelUpBadge.textContent = `⬆️ LEVEL ${getCurrentLevel()} UP! ⬆️`;
        levelUpBadge.style.position = 'fixed';
        levelUpBadge.style.top = '50%';
        levelUpBadge.style.left = '50%';
        levelUpBadge.style.transform = 'translate(-50%, -50%)';
        levelUpBadge.style.fontSize = '72px';
        levelUpBadge.style.fontWeight = '900';
        levelUpBadge.style.color = '#FFD700';
        levelUpBadge.style.textShadow = '4px 4px 8px rgba(0,0,0,0.8)';
        levelUpBadge.style.zIndex = '10000';
        levelUpBadge.style.fontFamily = "'Baloo 2', cursive";
        levelUpBadge.style.pointerEvents = 'none';
        document.body.appendChild(levelUpBadge);
        
        gsap.fromTo(levelUpBadge,
            { scale: 0, rotation: -180 },
            { 
                scale: 1, 
                rotation: 0, 
                duration: 0.8, 
                ease: 'back.out(1.7)',
                onComplete: () => {
                    gsap.to(levelUpBadge, {
                        scale: 0,
                        opacity: 0,
                        duration: 0.5,
                        delay: 1.5,
                        onComplete: () => levelUpBadge.remove()
                    });
                }
            }
        );
        
        // Particle explosion
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = ['🎉', '⭐', '✨', '🏆', '💎'][Math.floor(Math.random() * 5)];
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.fontSize = (Math.random() * 40 + 20) + 'px';
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 50;
            const distance = Math.random() * 400 + 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            gsap.to(particle, {
                x: x,
                y: y,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: 2,
                ease: 'power2.out',
                onComplete: () => particle.remove()
            });
        }
    }

    // Update the XP bar and text for the new state after all level-ups (if any)
    const newProgressRatio = getCurrentXP() / requiredXPForCurrentLevel;
    gsap.to(xpFill, {
        scaleX: newProgressRatio,
        duration: 0.5,
        ease: 'power2.out'
    });
    xpText.textContent = `Level ${getCurrentLevel()} • ${getCurrentXP()} / ${requiredXPForCurrentLevel} XP`;
}