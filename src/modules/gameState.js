// gameState.js - Manages core game state like XP, Level, and Currency

export let currentXP = 0; // Initial XP, starts from 0 as requested
export let currentLevel = 1; // Initial Level


// Currency state variables
let resourceCoins = 500; // Initial RC, matching HTML
let skillPoints = 50;   // Initial SP, matching HTML
let vmsdGems = 5;      // Initial VG, matching HTML

const GAME_STATE_KEY = 'vmsdGameState';

function saveGameState() {
    const state = {
        currentXP,
        currentLevel,
        resourceCoins,
        skillPoints,
        vmsdGems,
    };
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
}

function loadGameState() {
    const savedState = localStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            currentXP = state.currentXP || 0;
            currentLevel = state.currentLevel || 1;
            resourceCoins = state.resourceCoins || 500;
            skillPoints = state.skillPoints || 50;
            vmsdGems = state.vmsdGems || 5;
        } catch (e) {
            console.error("Error parsing saved game state:", e);
            // If parsing fails, reset to initial state
            currentXP = 0;
            currentLevel = 1;
            resourceCoins = 500;
            skillPoints = 50;
            vmsdGems = 5;
        }
    }
}

// Load state when the module initializes
loadGameState();

export const getXpNeededForLevel = (level) => level * 1000; // XP needed increases with level

export function addXP(amount) {
    currentXP += amount;
    saveGameState();
}

export function resetXP() {
    currentXP = 0;
    saveGameState();
}

export function incrementLevel() {
    currentLevel++;
    saveGameState();
}

export function getCurrentXP() {
    return currentXP;
}

export function getCurrentLevel() {
    return currentLevel;
}

export function getResourceCoins() { return resourceCoins; }
export function addResourceCoins(amount) {
    resourceCoins += amount;
    saveGameState();
}

export function getSkillPoints() { return skillPoints; }
export function addSkillPoints(amount) {
    skillPoints += amount;
    saveGameState();
}

export function getVmsdGems() { return vmsdGems; }
export function addVmsdGems(amount) {
    vmsdGems += amount;
    saveGameState();
}
