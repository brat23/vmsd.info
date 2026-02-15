// main.js - Orchestrates the initialization of all modules

import { initLoadingScreen } from './modules/loadingScreen.js';
import { initClouds } from './modules/backgroundEffects.js';
import { initFeatures, initDepartments, initCertifications } from './modules/sectionRenderer.js';
import { initNeuralNetwork, startStopNeuralAnimation } from './modules/neuralNetwork.js';
import { initScrollAnimations } from './modules/scrollAnimations.js';
import { initParticleEffects, createRipple } from './modules/utilities.js'; // Import createRipple
import { initFormHandler } from './modules/formHandler.js';
import { checkLevelUp, showXpBarTemporarily, initializeUIState } from './modules/uiElements.js'; // For initial XP bar display and temporary visibility
import { initEasterEggs } from './modules/easterEggs.js';


document.addEventListener('DOMContentLoaded', () => {
    try {
        initLoadingScreen();
    } catch (error) {
        console.error('Error in initLoadingScreen:', error);
    }
    try {
        initClouds();
    } catch (error) {
        console.error('Error in initClouds:', error);
    }
    try {
        initFeatures();
    } catch (error)  {
        console.error('Error in initFeatures:', error);
    }
    try {
        initDepartments();
    } catch (error)  {
        console.error('Error in initDepartments:', error);
    }
    try {
        initCertifications();
    } catch (error)  {
        console.error('Error in initCertifications:', error);
    }
    try {
        initNeuralNetwork();
        startStopNeuralAnimation(true); // Start neural network animation immediately
    } catch (error)  {
        console.error('Error in initNeuralNetwork:', error);
    }
    try {
        initScrollAnimations();
    } catch (error)  {
        console.error('Error in initScrollAnimations:', error);
    }
    try {
        initParticleEffects();
    } catch (error)  {
        console.error('Error in initParticleEffects:', error);
    }
    try {
        initFormHandler();
    } catch (error) {
        console.error('Error in initFormHandler:', error);
    }
    try {
        initEasterEggs(); // Initialize easter eggs
    } catch (error) {
        console.error('Error in initEasterEggs:', error);
    }

    // Initialize UI with saved/default state before other updates
    initializeUIState(); 
    checkLevelUp(); // Initialize XP bar display - this might be redundant now, but harmless.
    showXpBarTemporarily(); // Show XP bar temporarily on load

    // Smooth scroll for "Coming Soon" button
    const comingSoonButton = document.getElementById('comingSoonButton');
    if (comingSoonButton) {
        comingSoonButton.style.cursor = 'pointer'; // Indicate clickable
        comingSoonButton.addEventListener('click', () => {
            gsap.to(window, {
                scrollTo: {
                    y: "#ctaSection",
                    offsetY: 50 // Adjust offset if needed
                },
                duration: 1,
                ease: "power2.inOut"
            });
        });
    }

    // Footer link scrolling
    const footerScrollLinks = {
        'aboutFooterLink': '#departmentsSection',
        'featuresFooterLink': '#featuresSection',
        'certificationsFooterLink': '#certificationSection'
    };

    for (const linkId in footerScrollLinks) {
        const link = document.getElementById(linkId);
        const targetId = footerScrollLinks[linkId];
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                gsap.to(window, {
                    scrollTo: {
                        y: targetId,
                        offsetY: 50
                    },
                    duration: 1,
                    ease: "power2.inOut"
                });
            });
        }
    }

    // Apply ripple effect to all buttons and the coming soon badge
    document.querySelectorAll('button, #comingSoonButton').forEach(element => {
        element.addEventListener('mousedown', createRipple);
    });
});
