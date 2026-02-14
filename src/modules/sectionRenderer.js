// sectionRenderer.js - Renders dynamic content for Features, Departments, and Certifications sections

import { animateCurrencyGain } from './uiElements.js';
import { createParticleExplosion } from './utilities.js';
import { playClickSound } from './utilities.js'; // Assuming playClickSound is a utility

const featuresData = [
    {
        icon: '🎮',
        color: 'linear-gradient(135deg, #FF6B6B, #C92A2A)',
        title: 'Gamified Progression',
        description: 'Level up through 200+ engaging levels with a strategy-game styled progression system. Unlock departments, campaigns, and strategic tools as you master retail fundamentals.'
    },
    {
        icon: '🏪',
        color: 'linear-gradient(135deg, #4A90E2, #2E5C8A)',
        title: 'Store Simulation Engine',
        description: 'Run realistic retail simulations where walker behavior, conversion rates, and sales performance respond to your visual merchandising decisions in real-time.'
    },
    {
        icon: '💰',
        color: 'linear-gradient(135deg, #F39C12, #D68910)',
        title: 'Multi-Currency Economy',
        description: 'Earn Revenue Coins from sales, collect Skill Points from learning modules, and unlock VMSD Gems for certifications. Balance resources strategically for optimal growth.'
    },
    {
        icon: '🧠',
        color: 'linear-gradient(135deg, #9B59B6, #7D3C98)',
        title: 'Neural Skill Graph',
        description: 'Visualize your cognitive skill landscape in 3D. Track mastery depth, interest alignment, and cross-functional connections as your expertise evolves organically.'
    },
    {
        icon: '📊',
        color: 'linear-gradient(135deg, #27AE60, #1E8449)',
        title: 'Performance Analytics',
        description: 'Deep-dive into campaign ROI, conversion metrics, footfall analysis, and budget efficiency. Make data-driven decisions backed by retail industry standards.'
    },
    {
        icon: '🎯',
        color: 'linear-gradient(135deg, #E74C3C, #C0392B)',
        title: 'Strategic Scenarios',
        description: 'Face real-world retail challenges: seasonal campaigns, competitor launches, budget constraints, and crisis management. Build strategic thinking through simulation.'
    },
    {
        icon: '🏆',
        color: 'linear-gradient(135deg, #FFD700, #FFA500)',
        title: 'Professional Certifications',
        description: 'Earn industry-recognized certifications through simulation performance and peer-reviewed case studies. QR-verified credentials for your professional profile.'
    },
    {
        icon: '👥',
        color: 'linear-gradient(135deg, #3498DB, #2874A6)',
        title: 'Community Ecosystem',
        description: 'Share case studies, showcase portfolio work, and engage with retail professionals. Merit-based visibility rewards substance over popularity.'
    },
    {
        icon: '🎨',
        color: 'linear-gradient(135deg, #E91E63, #AD1457)',
        title: 'Dual Interface Modes',
        description: 'Switch between Explorer Mode (gamified) and Executive Mode (professional dashboard). Same backend, different aesthetics for your preference.'
    },
    {
        icon: '📈',
        color: 'linear-gradient(135deg, #00BCD4, #0097A7)',
        title: 'Budget Allocation System',
        description: 'Distribute revenue across campaigns, store upgrades, team hiring, and maintenance. Economic balance engine prevents idle capital stagnation.'
    },
    {
        icon: '🌐',
        color: 'linear-gradient(135deg, #FF9800, #EF6C00)',
        title: 'Cross-Department Mastery',
        description: 'Progress from Visual Merchandising to Marketing, Finance, Operations, and Leadership. Build T-shaped expertise with balanced or specialized paths.'
    },
    {
        icon: '🔗',
        color: 'linear-gradient(135deg, #607D8B, #455A64)',
        title: 'Public Profile Identity',
        description: 'Your professional identity at vmsd.in/username. Showcase skills, certifications, portfolio, and 3D avatar in a Behance-meets-LinkedIn experience.'
    }
];

export function initFeatures() {
    const grid = document.getElementById('featuresGrid');
    if (!grid) {
        console.warn('Features grid element not found!');
        return;
    }
    
    featuresData.forEach((feature, index) => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <div class="feature-icon" style="background: ${feature.color}">
                ${feature.icon}
            </div>
            <h3 class="feature-title">${feature.title}</h3>
            <p class="feature-description">${feature.description}</p>
        `;
        
        // Add click effect
        card.addEventListener('click', () => {
            createParticleExplosion(card, feature.icon);
            animateCurrencyGain(); // Re-enabled
            playClickSound();
        });
        
        grid.appendChild(card);
    });
}

// ==================== DEPARTMENTS DATA & RENDERING ====================
const departmentsData = [
    { icon: '🎨', name: 'Visual Merchandising', subtitle: 'Display Design • Window Concepts • Planogram Execution' },
    { icon: '📦', name: 'Merchandising & Planning', subtitle: 'Product Mix • Inventory Control • Trend Forecasting' },
    { icon: '🏗️', name: 'Retail Design', subtitle: 'Store Layout • Fixture Planning • Space Optimization' },
    { icon: '✏️', name: 'Graphic Design', subtitle: 'Signage • Brand Collateral • In-Store Communications' },
    { icon: '📢', name: 'Marketing (ATL/BTL/TTL)', subtitle: 'Campaign Strategy • Brand Positioning • Media Planning' },
    { icon: '💻', name: 'Digital Marketing', subtitle: 'Social Media • E-commerce • Performance Analytics' },
    { icon: '⚙️', name: 'Operations Management', subtitle: 'Store Operations • Team Management • Process Optimization' },
    { icon: '🚚', name: 'Supply Chain & Logistics', subtitle: 'Inventory Flow • Vendor Relations • Distribution Strategy' },
    { icon: '💵', name: 'Finance & Budgeting', subtitle: 'P&L Management • Cost Control • ROI Analysis' }
];

export function initDepartments() {
    const grid = document.getElementById('departmentsGrid');
    
    departmentsData.forEach((dept, index) => {
        const card = document.createElement('div');
        card.className = 'department-card';
        card.innerHTML = `
            <div class="department-icon">${dept.icon}</div>
            <div class="department-name">${dept.name}</div>
            <div class="department-subtitle">${dept.subtitle}</div>
        `;
        
        card.addEventListener('click', () => {
            createParticleExplosion(card, dept.icon);
            animateCurrencyGain('sp'); // Re-enabled
            playClickSound();
        });
        
        grid.appendChild(card);
    });
}

// ==================== CERTIFICATIONS DATA & RENDERING ====================
const certificationsData = [
    {
        badge: '🥉',
        title: 'VM Foundation',
        description: 'Master the fundamentals of visual merchandising, window display principles, and customer psychology. Simulation-backed certification with peer review.'
    },
    {
        badge: '🥈',
        title: 'Strategic Merchandiser',
        description: 'Advanced certification covering cross-department integration, campaign strategy, and data-driven decision making across retail functions.'
    },
    {
        badge: '🥇',
        title: 'Retail Leadership',
        description: 'Elite certification demonstrating mastery across all departments, strategic thinking, and proven ability to drive business outcomes at scale.'
    },
    {
        badge: '💎',
        title: 'Industry Authority',
        description: 'Highest tier recognition for thought leadership, community contribution, and demonstrated expertise recognized across the retail industry.'
    }
];

export function initCertifications() {
    const container = document.getElementById('certCards');
    
    certificationsData.forEach((cert, index) => {
        const card = document.createElement('div');
        card.className = 'cert-card';
        card.innerHTML = `
            <div class="cert-badge">${cert.badge}</div>
            <div class="cert-title">${cert.title}</div>
            <div class="cert-description">${cert.description}</div>
        `;
        
        card.addEventListener('click', () => {
            createParticleExplosion(card, cert.badge);
            animateCurrencyGain('vg'); // Re-enabled
            playClickSound();
        });
        
        container.appendChild(card);
    });
}
