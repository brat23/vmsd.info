// loadingScreen.js - Handles the loading screen logic and initial entry animations

export function initLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            startEntryAnimations();
        }, 500);
    }, 2000);
}

function startEntryAnimations() {
    // Animate hero elements
    // Temporarily removed gsap.from for .logo-container for debugging
    // gsap.from('.logo-container', {
    //     duration: 1.2,
    //     y: -100,
    //     opacity: 0,
    //     ease: 'bounce.out'
    // });

    gsap.from('.coming-soon-badge', {
        duration: 1,
        scale: 0,
        rotation: 360,
        delay: 0.5,
        ease: 'back.out(1.7)'
    });

    gsap.from('.tagline', {
        duration: 1,
        y: 50,
        opacity: 0,
        delay: 0.8,
        ease: 'power3.out'
    });

    // Animate currency HUD container
    gsap.to('.currency-hud', {
        opacity: 1,
        duration: 0.5,
        delay: 0.8 // Start slightly before or with the items
    });

    // Animate individual currency items
    gsap.fromTo('.currency-item',
        { x: 200, opacity: 0 }, // From state
        { duration: 0.8, x: 0, opacity: 1, stagger: 0.2, delay: 1, ease: 'back.out(1.7)' } // To state
    );

    // Animate XP bar
    gsap.from('.xp-bar', {
        duration: 1,
        y: -100,
        opacity: 0, // Animate FROM opacity 0
        delay: 0.7,
        ease: 'power3.out'
    });
}
