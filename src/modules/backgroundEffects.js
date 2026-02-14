// backgroundEffects.js - Manages floating clouds and other background visual effects

export function initClouds() {
    const cloudsContainer = document.getElementById('clouds');
    const cloudCount = 15;

    for (let i = 0; i < cloudCount; i++) {
        const cloud = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        cloud.setAttribute('viewBox', '0 0 256.00007 256.00002');
        cloud.setAttribute('class', 'cloud'); // Add class here

        const gElement = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        gElement.setAttribute('transform', 'translate(-362.5464,-406.21469)');

        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', 'm 465.83684,466.9869 c -18.8823,0 -37.6499,7.7751 -51.0017,21.127 -8.4122,8.4121 -14.6043,18.9734 -18.0383,30.3583 -8.2539,1.5581 -16.0492,5.5866 -21.9931,11.5304 -7.7473,7.7473 -12.2573,18.6331 -12.2573,29.5895 0,10.9565 4.51,21.8458 12.2573,29.5931 7.7474,7.7473 18.6367,12.2573 29.5931,12.2573 l 187.4365,0 c 6.9935,0 13.9453,-2.8775 18.8904,-7.8224 4.9452,-4.9451 7.8227,-11.8971 7.8227,-18.8906 0,-6.9935 -2.8775,-13.9417 -7.8227,-18.8868 -4.9147,-4.9149 -11.8119,-7.784 -18.7617,-7.8193 -1.3562,-12.6709 -7.0967,-24.867 -16.1148,-33.8851 -10.3847,-10.3847 -24.9798,-16.4314 -39.666,-16.4314 -3.5656,0 -7.1233,0.3656 -10.6192,1.0539 -2.5582,-3.8175 -5.4715,-7.3951 -8.7235,-10.6469 -13.3518,-13.3519 -32.1193,-21.127 -51.0017,-21.127 z');
        // Removed inline style fill to allow CSS to control it

        gElement.appendChild(pathElement);
        cloud.appendChild(gElement);
        
        // cloud.className = 'cloud'; // No longer needed here as it's set above
        
        const width = Math.random() * 150 + 100;
        const height = width * 0.6;
        
        cloud.style.width = width + 'px';
        cloud.style.height = height + 'px';
        cloud.style.top = Math.random() * 100 + '%';
        cloud.style.left = Math.random() * 100 + '%';
        cloud.style.animationDuration = (Math.random() * 40 + 40) + 's';
        cloud.style.animationDelay = (Math.random() * -60) + 's';
        
        cloudsContainer.appendChild(cloud);
    }
}
