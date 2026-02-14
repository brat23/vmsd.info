// main.js - Orchestrates the initialization of all modules

import { initLoadingScreen } from './modules/loadingScreen.js';
import { initClouds } from './modules/backgroundEffects.js';
import { initFeatures, initDepartments, initCertifications } from './modules/sectionRenderer.js';
import { initNeuralNetwork, startStopNeuralAnimation } from './modules/neuralNetwork.js';
import { initScrollAnimations } from './modules/scrollAnimations.js';
import { initParticleEffects } from './modules/utilities.js'; // Assuming particle effects are utilities for now
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
});

