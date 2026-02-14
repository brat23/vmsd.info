// neuralNetwork.js - Encapsulates all Three.js neural network logic

// Global Three.js variables (within this module's scope)
let scene, camera, renderer, nodes, connections, controls;
let raycaster, mouse, hoveredNode;
export let neuralAnimationRunning = false; // Exported for external control
let mouseMoved = false; // Flag to track mouse movement

const skillNames = [
    'Visual Merchandising', 'Retail Strategy', 'Customer Experience',
    'Inventory Management', 'Supply Chain', 'Digital Marketing',
    'Store Operations', 'Financial Planning', 'Leadership',
    'Brand Management', 'E-commerce', 'Data Analytics',
    'Market Research', 'Product Sourcing', 'Sales Forecasting',
    'Team Leadership', 'Space Planning', 'Promotional Campaigns',
    'Loss Prevention', 'Omnichannel Retail', 'Sustainability',
    'Consumer Psychology', 'Negotiation Skills', 'Trend Analysis'
];

// THREE.JS NEURAL NETWORK ANIMATION LOOP
let animationFrameId = null; // To store the requestAnimationFrame ID
let skillTooltipElement = null; // Cached skillTooltip element

// Internal animation loop function
function animate() {
    // Animate nodes
    nodes.forEach(node => {
        node.position.add(node.userData.velocity);
        
        // Bounce off boundaries
        const limit = 25;
        ['x', 'y', 'z'].forEach(axis => {
            if (Math.abs(node.position[axis]) > limit) {
                node.userData.velocity[axis] *= -1;
            }
        });
        
        // Rotate nodes
        node.rotation.x += 0.01;
        node.rotation.y += 0.01;
    });
    
    // Update connections
    const positions = connections.linesObject.geometry.attributes.position.array;
    let p_index = 0;
    connections.forEach(({ nodeA, nodeB }) => {
        positions[p_index++] = nodeA.position.x;
        positions[p_index++] = nodeA.position.y;
        positions[p_index++] = nodeA.position.z;
        positions[p_index++] = nodeB.position.x;
        positions[p_index++] = nodeB.position.y;
        positions[p_index++] = nodeB.position.z;
    });
    connections.linesObject.geometry.attributes.position.needsUpdate = true;
    
    if (controls) {
        controls.update();
    }

    // Raycasting for hover effect - only if mouse has moved
    if (mouseMoved && raycaster && mouse && nodes.length > 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);

        if (intersects.length > 0) {
            if (hoveredNode != intersects[0].object) {
                if (hoveredNode) hoveredNode.material.emissive.setHex(hoveredNode.currentHex);

                hoveredNode = intersects[0].object;
                hoveredNode.currentHex = hoveredNode.material.emissive.getHex();
                hoveredNode.material.emissive.setHex(0xFF0000);

                if (skillTooltipElement && hoveredNode.userData.skill) {
                    skillTooltipElement.style.left = (mouse.x * (window.innerWidth / 2) + window.innerWidth / 2 + 15) + 'px';
                    skillTooltipElement.style.top = (-mouse.y * (window.innerHeight / 2) + window.innerHeight / 2 + 15) + 'px';
                    skillTooltipElement.textContent = hoveredNode.userData.skill;
                    skillTooltipElement.style.opacity = '1';
                }
            }
        } else {
            if (hoveredNode) {
                hoveredNode.material.emissive.setHex(hoveredNode.currentHex);
                hoveredNode = null;

                if (skillTooltipElement) {
                    skillTooltipElement.style.opacity = '0';
                }
            }
        }
        mouseMoved = false; // Reset flag after raycasting
    }
    
    renderer.render(scene, camera);

    if (neuralAnimationRunning) {
        animationFrameId = requestAnimationFrame(animate);
    }
}

// Exported function to start/stop the neural network animation
export function startStopNeuralAnimation(start) {
    neuralAnimationRunning = start;

    if (neuralAnimationRunning && animationFrameId === null) {
        // Start animation if it's supposed to run and not already running
        animationFrameId = requestAnimationFrame(animate);
    } else if (!neuralAnimationRunning && animationFrameId !== null) {
        // Stop animation if it's supposed to stop and is currently running
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

export function initNeuralNetwork() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) {
        console.warn('Neural canvas element not found!');
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.position.z = 50;
    
    skillTooltipElement = document.getElementById('skillTooltip'); // Cache the tooltip element
    
    // Initialize OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // An animation loop is required when damping is enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 100;
    controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

    // Initialize Raycaster and mouse vector
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const neuralCanvasContainer = document.querySelector('.neural-canvas-container');
    if (neuralCanvasContainer) {
        neuralCanvasContainer.addEventListener('mousemove', (event) => {
            // Calculate mouse position in normalized device coordinates (-1 to +1)
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
            mouseMoved = true; // Mark that the mouse has moved
        });
        neuralCanvasContainer.addEventListener('mouseleave', () => {
            if (hoveredNode) {
                hoveredNode.material.emissive.setHex(hoveredNode.currentHex);
                hoveredNode = null;
            }
            if (skillTooltipElement) {
                skillTooltipElement.style.opacity = '0';
            }
        });
    }

    // Create skill nodes
    nodes = [];
    const nodeCount = 40;
    const nodeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    
    for (let i = 0; i < nodeCount; i++) {
        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 0.3, 0.2 + Math.random() * 0.2), // Darker, subtle hues
            emissive: new THREE.Color().setHSL(Math.random() * 0.1 + 0.6, 0.2, 0.1 + Math.random() * 0.1), // Subtle emissive glow
            specular: 0xAAAAAA, // Brighter specular for reflectiveness
            shininess: 200 // Increased shininess
        });
        
        const node = new THREE.Mesh(nodeGeometry, material);
        
        // Assign a random skill name
        node.userData.skill = skillNames[Math.floor(Math.random() * skillNames.length)];
        
        // Position nodes in 3D space
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 20 + Math.random() * 15;
        
        node.position.x = radius * Math.sin(phi) * Math.cos(theta);
        node.position.y = radius * Math.sin(phi) * Math.sin(theta);
        node.position.z = radius * Math.cos(phi);
        
        node.userData.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02,
            (Math.random() - 0.5) * 0.02
        );
        
        nodes.push(node);
        scene.add(node);
    }
    
    // Create connections
    connections = [];
    const connectionPoints = [];
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x483D8B, // Darker slate blue
        transparent: true, 
        opacity: 0.5 // Slightly increased opacity
    });
    
    for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
            if (Math.random() > 0.85) {
                connectionPoints.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z);
                connectionPoints.push(nodes[j].position.x, nodes[j].position.y, nodes[j].position.z);
                connections.push({ nodeA: nodes[i], nodeB: nodes[j] });
            }
        }
    }

    const connectionGeometry = new THREE.BufferGeometry();
    connectionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPoints, 3));
    const lines = new THREE.LineSegments(connectionGeometry, lineMaterial);
    scene.add(lines);

    // Store the lines object to update its positions in the animate loop
    connections.linesObject = lines;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x4A90E2, 1, 100);
    pointLight1.position.set(20, 20, 20);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x9B59B6, 1, 100);
    pointLight2.position.set(-20, -20, 20);
    scene.add(pointLight2);
    
    // Handle resize
    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        }
    });
}
