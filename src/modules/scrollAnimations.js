// scrollAnimations.js - Manages all GSAP ScrollTrigger animations

import { startStopNeuralAnimation, neuralAnimationRunning } from './neuralNetwork.js'; // Import neural network animation control

export function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    
    // World Map Animation
    gsap.from('#worldMap', {
        scrollTrigger: {
            trigger: '#worldMap',
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: true, // Link animation to scroll position
            toggleActions: 'play none none none' // Scrub handles the reverse automatically
        },
        scale: 0.8,
        opacity: 0,
        ease: 'power3.out' // Duration will be controlled by scroll distance with scrub
    });
    
    // Features Cards (animations temporarily disabled as per user request)
    // gsap.from('.feature-card', {
    //     scrollTrigger: {
    //         trigger: '.features-grid',
    //         start: 'top 70%',
    //         toggleActions: 'play none none none'
    //     },
    //     y: 100,
    //     opacity: 0,
    //     duration: 0.8,
    //     stagger: 0.1,
    //     ease: 'back.out(1.7)'
    // });
    
    // Departments Cards (animations temporarily disabled as per user request)
    // gsap.from('.department-card', {
    //     scrollTrigger: {
    //         trigger: '.departments-grid',
    //         start: 'top 70%',
    //         toggleActions: 'play none none none'
    //     },
    //     scale: 0,
    //     rotation: 180,
    //     opacity: 0,
    //     duration: 0.8,
    //     stagger: 0.08,
    //     ease: 'back.out(1.7)'
    // });
    
    // Certification Cards (animations temporarily disabled as per user request)
    // gsap.from('.cert-card', {
    //     scrollTrigger: {
    //         trigger: '.cert-cards',
    //         start: 'top 70%',
    //         toggleActions: 'play none none none'
    //     },
    //     x: -200,
    //     opacity: 0,
    //     duration: 1,
    //     stagger: 0.15,
    //     ease: 'power3.out'
    // });
    
    // Neural Canvas entry animation
    gsap.from('.neural-canvas-container', {
        scrollTrigger: {
            trigger: '.neural-canvas-container',
            start: 'top 80%',
            end: 'bottom 20%', // Added end to define scrub range
            scrub: true, // Link animation to scroll position
            toggleActions: 'play none none none'
        },
        scale: 0.5,
        opacity: 0,
        ease: 'power3.out'
    });


    
    // CTA Box
    gsap.from('.cta-box', {
        scrollTrigger: {
            trigger: '.cta-box',
            start: 'top 80%',
            end: 'bottom 20%', // Added end to define scrub range
            scrub: true, // Link animation to scroll position
            toggleActions: 'play none none none' // Scrub handles the reverse automatically
        },
        scale: 0,
        rotation: 360,
        opacity: 0,
        ease: 'back.out(1.7)'
    });
    
    // Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 85%',
                end: 'bottom 20%', // Added end to define scrub range
                scrub: true, // Link animation to scroll position
                toggleActions: 'play none none none' // Scrub handles the reverse automatically
            },
            y: -50,
            opacity: 0,
            ease: 'power3.out'
        });
    });
}
