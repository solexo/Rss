// Dashboard.js - Advanced Cybersecurity Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeThreatMap();
    initializeAttackGraphs();
    initializeSecurityCharts();
    initializeDefenseSystem();
    initializeAnimations();
    
    // Update stats with random values for demo purposes
    updateDashboardStats();
    setInterval(updateDashboardStats, 5000);
});

// Initialize the global threat map
function initializeThreatMap() {
    const mapElement = document.getElementById('threatMap');
    if (!mapElement) return;
    
    // Initialize Leaflet map
    const map = L.map(mapElement, {
        center: [20, 0],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: false,
        attributionControl: false
    });
    
    // Add a dark-themed map layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd'
    }).addTo(map);
    
    // Generate some random attack points
    generateRandomAttacks(map);
    
    // Update attack counters
    document.getElementById('totalAttacks').textContent = Math.floor(Math.random() * 1000) + 3000;
    document.getElementById('blockedAttacks').textContent = Math.floor(Math.random() * 5000) + 15000;
}

// Generate random attack points on the map
function generateRandomAttacks(map) {
    const attackLocations = [
        { lat: 37.7749, lng: -122.4194, severity: 'high' }, // San Francisco
        { lat: 40.7128, lng: -74.0060, severity: 'high' },  // New York
        { lat: 51.5074, lng: -0.1278, severity: 'medium' }, // London
        { lat: 48.8566, lng: 2.3522, severity: 'low' },     // Paris
        { lat: 52.5200, lng: 13.4050, severity: 'medium' }, // Berlin
        { lat: 35.6762, lng: 139.6503, severity: 'high' },  // Tokyo
        { lat: 22.3193, lng: 114.1694, severity: 'medium' },// Hong Kong
        { lat: -33.8688, lng: 151.2093, severity: 'low' },  // Sydney
        { lat: 55.7558, lng: 37.6173, severity: 'high' },   // Moscow
        { lat: 19.4326, lng: -99.1332, severity: 'medium' },// Mexico City
        { lat: -23.5505, lng: -46.6333, severity: 'low' },  // São Paulo
        { lat: 28.6139, lng: 77.2090, severity: 'high' },   // New Delhi
        { lat: 31.2304, lng: 121.4737, severity: 'high' },  // Shanghai
        { lat: 1.3521, lng: 103.8198, severity: 'medium' }, // Singapore
        { lat: -34.6037, lng: -58.3816, severity: 'low' }   // Buenos Aires
    ];
    
    // Add 20 more random points
    for (let i = 0; i < 20; i++) {
        const lat = (Math.random() * 140) - 70; // -70 to 70
        const lng = (Math.random() * 340) - 170; // -170 to 170
        const severityTypes = ['high', 'medium', 'low'];
        const severity = severityTypes[Math.floor(Math.random() * severityTypes.length)];
        
        attackLocations.push({ lat, lng, severity });
    }
    
    // Create markers for each attack
    attackLocations.forEach(location => {
        let markerColor = '#00C851'; // low
        if (location.severity === 'high') {
            markerColor = '#ff4444';
        } else if (location.severity === 'medium') {
            markerColor = '#ffbb33';
        }
        
        // Create pulse circle
        const circle = L.circleMarker([location.lat, location.lng], {
            radius: 5,
            color: markerColor,
            fillColor: markerColor,
            fillOpacity: 0.8,
            weight: 2
        }).addTo(map);
        
        // Animate the circle to simulate pulse
        animatePulse(circle, markerColor);
    });
}

// Animate attack point pulses
function animatePulse(circle, color) {
    let radius = 5;
    let opacity = 0.8;
    
    setInterval(() => {
        radius += 1;
        opacity -= 0.1;
        
        if (radius > 15) {
            radius = 5;
            opacity = 0.8;
        }
        
        circle.setStyle({
            radius: radius,
            fillOpacity: opacity
        });
    }, 200);
}

// Initialize attack vector graphs and charts
function initializeAttackGraphs() {
    const attackGraph = document.getElementById('attackGraph');
    if (!attackGraph) return;
    
    // Create a force-directed graph with D3.js
    createAttackVectorGraph(attackGraph);
    
    // Create a bar chart for real-time attack types
    const attackTypeCtx = document.getElementById('attackTypeChart');
    if (attackTypeCtx) {
        const attackChart = new Chart(attackTypeCtx, {
            type: 'bar',
            data: {
                labels: ['Malware', 'Phishing', 'DDoS', 'Zero-day', 'Ransomware'],
                datasets: [{
                    data: [0, 0, 0, 0, 0], // Initial values will be updated in real-time
                    backgroundColor: [
                        'rgba(0, 255, 157, 0.6)',
                        'rgba(0, 184, 255, 0.6)',
                        'rgba(255, 0, 255, 0.6)',
                        'rgba(255, 68, 68, 0.6)',
                        'rgba(255, 187, 51, 0.6)'
                    ],
                    borderWidth: 0,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Function to update dashboard with real RSS data
        async function updateDashboardWithRSS() {
            try {
                const response = await fetch('http://localhost:3001/api/security-logs');
                if (!response.ok) {
                    throw new Error('Failed to fetch security logs');
                }
                
                const data = await response.json();
                
                // Update attack distribution chart
                if (attackChart) {
                    attackChart.data.datasets[0].data = [
                        data.malware,
                        data.phishing,
                        data.ddos,
                        data.zeroDay,
                        data.ransomware
                    ];
                    attackChart.update();
                }
                
                // Update threat counters
                document.getElementById('activeThreats').textContent = data.totalThreats;
                document.getElementById('protectedSystems').textContent = data.protectedSystems;
                document.getElementById('avgResponseTime').textContent = data.avgResponseTime + 'ms';
                
                // Update threat feed with real alerts
                const threatFeed = document.getElementById('threatIntelFeed');
                if (threatFeed) {
                    threatFeed.innerHTML = '';
                    data.alerts.forEach(alert => {
                        const threatEntry = document.createElement('div');
                        threatEntry.className = 'threat-entry';
                        threatEntry.innerHTML = `
                            <div class="threat-time">${new Date(alert.pubDate).toLocaleTimeString()}</div>
                            <div class="threat-description">${alert.title}</div>
                            <div class="threat-severity ${getSeverity(alert.title)}">${getSeverity(alert.title)}</div>
                        `;
                        threatFeed.appendChild(threatEntry);
                    });
                }
                
                // Update network traffic based on threat activity
                const networkTraffic = document.getElementById('networkTraffic');
                if (networkTraffic) {
                    const baseTraffic = 100; // Base traffic in GB
                    const activityMultiplier = data.totalThreats * 0.5; // Each threat adds 0.5GB
                    networkTraffic.textContent = Math.round(baseTraffic + activityMultiplier) + ' GB';
                }
                
            } catch (error) {
                console.error('Error updating dashboard with RSS data:', error);
            }
        }
        
        // Helper function to determine threat severity
        function getSeverity(title) {
            const lowerTitle = title.toLowerCase();
            if (lowerTitle.includes('critical') || lowerTitle.includes('emergency')) {
                return 'high';
            } else if (lowerTitle.includes('warning') || lowerTitle.includes('alert')) {
                return 'medium';
            } else {
                return 'low';
            }
        }
        
        // Initial update
        updateDashboardWithRSS();
        
        // Update every 5 minutes
        setInterval(updateDashboardWithRSS, 300000);
    }
    
    // Create a line chart for the timeline
    const timelineCtx = document.getElementById('timelineChart');
    if (timelineCtx) {
        new Chart(timelineCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Threats',
                    data: [65, 59, 80, 81, 56, 95],
                    borderColor: 'rgba(0, 255, 157, 0.8)',
                    backgroundColor: 'rgba(0, 255, 157, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.6)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Create a force-directed graph to show attack vectors
function createAttackVectorGraph(container) {
    // This is a simplified version using D3.js
    // Define nodes (entities) and links (attack vectors)
    const nodes = [
        { id: "internet", group: 1, label: "Internet" },
        { id: "firewall", group: 2, label: "Firewall" },
        { id: "webserver", group: 3, label: "Web Server" },
        { id: "database", group: 4, label: "Database" },
        { id: "appserver", group: 3, label: "App Server" },
        { id: "clientA", group: 5, label: "Client A" },
        { id: "clientB", group: 5, label: "Client B" },
        { id: "attacker", group: 6, label: "Attacker" }
    ];
    
    const links = [
        { source: "attacker", target: "internet", value: 1 },
        { source: "internet", target: "firewall", value: 3 },
        { source: "firewall", target: "webserver", value: 2 },
        { source: "webserver", target: "appserver", value: 1 },
        { source: "appserver", target: "database", value: 3 },
        { source: "webserver", target: "clientA", value: 1 },
        { source: "webserver", target: "clientB", value: 1 },
        { source: "attacker", target: "clientA", value: 1 }
    ];

    // We'll implement the basic structure here
    // A more advanced version would be too lengthy for this file
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append("svg")
        .attr("width", width)
        .attr("height", height);
        
    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));
    
    // Create links
    const link = svg.append("g")
        .attr("stroke", "#00b8ff")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(links)
        .join("line")
        .attr("stroke-width", d => Math.sqrt(d.value));
    
    // Create nodes
    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 10)
        .attr("fill", d => {
            if (d.group === 1) return "#00b8ff"; // Internet
            if (d.group === 2) return "#00ff9d"; // Firewall
            if (d.group === 3) return "#ffbb33"; // Web/App servers
            if (d.group === 4) return "#00C851"; // Database
            if (d.group === 5) return "#ff4444"; // Clients
            return "#ff00ff"; // Attacker
        });
    
    // Add labels
    const text = svg.append("g")
        .selectAll("text")
        .data(nodes)
        .join("text")
        .attr("text-anchor", "middle")
        .attr("dy", 20)
        .attr("fill", "#fff")
        .text(d => d.label)
        .style("font-size", "10px");
    
    // Update positions on simulation tick
    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);
        
        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
        
        text
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });
}

// Initialize security stat charts
function initializeSecurityCharts() {
    // Threat Trend Chart
    const threatTrendCtx = document.getElementById('threatTrendChart');
    if (threatTrendCtx) {
        new Chart(threatTrendCtx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', '', '', '', ''],
                datasets: [{
                    data: [15, 12, 18, 14, 13, 19, 17, 16, 20, 25],
                    borderColor: 'rgba(255, 68, 68, 0.8)',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Systems Chart
    const systemsChartCtx = document.getElementById('systemsChart');
    if (systemsChartCtx) {
        new Chart(systemsChartCtx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', '', '', '', ''],
                datasets: [{
                    data: [850, 900, 950, 930, 980, 970, 990, 1020, 1050, 982],
                    borderColor: 'rgba(0, 184, 255, 0.8)',
                    backgroundColor: 'rgba(0, 184, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: false,
                        beginAtZero: false
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Response Time Chart
    const responseTimeChartCtx = document.getElementById('responseTimeChart');
    if (responseTimeChartCtx) {
        new Chart(responseTimeChartCtx, {
            type: 'line',
            data: {
                labels: ['', '', '', '', '', '', '', '', '', ''],
                datasets: [{
                    data: [65, 62, 55, 58, 50, 45, 48, 47, 43, 47],
                    borderColor: 'rgba(255, 0, 255, 0.8)',
                    backgroundColor: 'rgba(255, 0, 255, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: false,
                        beginAtZero: false,
                        reverse: true
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Network Traffic Chart
    const trafficChartCtx = document.getElementById('trafficChart');
    if (trafficChartCtx) {
        new Chart(trafficChartCtx, {
            type: 'bar',
            data: {
                labels: ['', '', '', '', '', '', '', '', '', ''],
                datasets: [{
                    data: [25, 38, 45, 32, 55, 48, 40, 58, 50, 42],
                    backgroundColor: 'rgba(0, 255, 157, 0.6)',
                    borderWidth: 0,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true
                    },
                    x: {
                        display: false
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Initialize defense system visualization
function initializeDefenseSystem() {
    const hologramContainer = document.getElementById('defenseHologram');
    if (!hologramContainer) return;
    
    // Create a Three.js scene for the hologram
    createDefenseHologram(hologramContainer);
    
    // Set up a particle system for the defense hologram
    setupParticleSystem(hologramContainer);
}

// Create defense hologram using Three.js
function createDefenseHologram(container) {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Add sphere to represent security shield
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff9d,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Add outer shield
    const outerGeometry = new THREE.SphereGeometry(5.5, 32, 32);
    const outerMaterial = new THREE.MeshBasicMaterial({
        color: 0x00b8ff,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const outerSphere = new THREE.Mesh(outerGeometry, outerMaterial);
    scene.add(outerSphere);
    
    // Position camera
    camera.position.z = 15;
    
    // Animate the defense hologram
    function animate() {
        requestAnimationFrame(animate);
        
        sphere.rotation.x += 0.005;
        sphere.rotation.y += 0.01;
        
        outerSphere.rotation.x -= 0.003;
        outerSphere.rotation.y -= 0.007;
        
        renderer.render(scene, camera);
    }
    
    animate();
}

// Set up particle system for defense hologram
function setupParticleSystem(container) {
    // Using Particles.js for a background effect
    particlesJS(container.id, {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#00ff9d"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": true,
                    "speed": 2,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#00b8ff",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": true,
                "straight": false,
                "out_mode": "out",
                "bounce": false
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            }
        },
        "retina_detect": true
    });
}

// Initialize animations for the dashboard
function initializeAnimations() {
    // Use GSAP for animations
    gsap.from('.global-threat-map', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.2
    });
    
    gsap.from('.attack-visualization', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.4
    });
    
    gsap.from('.security-stats .stat-card', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.6
    });
    
    gsap.from('.threat-intelligence', {
        duration: 1,
        y: 50,
        opacity: 0,
        ease: "power3.out",
        delay: 0.8
    });
    
    gsap.from('.security-tools .tool-card', {
        duration: 0.8,
        scale: 0.8,
        opacity: 0,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 1
    });
    
    // Animate counting for statistics
    animateCountingStats();
}

// Animate counting stats
function animateCountingStats() {
    const threatElement = document.getElementById('activeThreats');
    const systemsElement = document.getElementById('protectedSystems');
    const responseTimeElement = document.getElementById('avgResponseTime');
    const networkTrafficElement = document.getElementById('networkTraffic');
    
    if (threatElement) animateValue(threatElement, 0, 9, 1500);
    if (systemsElement) animateValue(systemsElement, 0, 982, 2000);
    if (responseTimeElement) animateValue(responseTimeElement, 100, 47, 1800, 'ms');
    if (networkTrafficElement) animateValue(networkTrafficElement, 0, 128, 1800);
}

// Helper function to animate counting
function animateValue(element, start, end, duration, suffix = '') {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        let value = Math.floor(progress * (end - start) + start);
        
        if (suffix) {
            element.innerText = value + suffix;
        } else {
            element.innerText = value;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Update dashboard stats periodically
function updateDashboardStats() {
    // Simulate random changes in the stats
    
    // Update active threats
    const activeThreats = document.getElementById('activeThreats');
    if (activeThreats) {
        const currentValue = parseInt(activeThreats.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 5) - 2; // Random change between -2 and +2
        if (newValue > 0) activeThreats.textContent = newValue;
    }
    
    // Update protected systems
    const protectedSystems = document.getElementById('protectedSystems');
    if (protectedSystems) {
        const currentValue = parseInt(protectedSystems.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 7) - 3; // Random change between -3 and +3
        if (newValue > 0) protectedSystems.textContent = newValue;
    }
    
    // Update response time
    const avgResponseTime = document.getElementById('avgResponseTime');
    if (avgResponseTime) {
        const currentValue = parseInt(avgResponseTime.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 11) - 5; // Random change between -5 and +5
        if (newValue > 0) avgResponseTime.textContent = newValue + 'ms';
    }
    
    // Update network traffic
    const networkTraffic = document.getElementById('networkTraffic');
    if (networkTraffic) {
        const currentValue = parseInt(networkTraffic.textContent);
        const newValue = currentValue + Math.floor(Math.random() * 15) - 7; // Random change between -7 and +7
        if (newValue > 0) networkTraffic.textContent = newValue + ' GB';
    }
    
    // Update map attack counters
    const totalAttacks = document.getElementById('totalAttacks');
    const blockedAttacks = document.getElementById('blockedAttacks');
    
    if (totalAttacks) {
        const currentValue = parseInt(totalAttacks.textContent);
        const increase = Math.floor(Math.random() * 20) + 5;
        totalAttacks.textContent = currentValue + increase;
    }
    
    if (blockedAttacks) {
        const currentValue = parseInt(blockedAttacks.textContent);
        const increase = Math.floor(Math.random() * 25) + 10;
        blockedAttacks.textContent = currentValue + increase;
    }
    
    // Populate threat intel feed
    updateThreatIntelFeed();
}

// Update the threat intelligence feed
function updateThreatIntelFeed() {
    const feedContainer = document.getElementById('threatIntelFeed');
    if (!feedContainer) return;
    
    const threats = [
        'Detected potential phishing campaign targeting financial institutions',
        'New ransomware variant identified in Eastern Europe',
        'DDoS attack mitigated against cloud infrastructure',
        'Zero-day vulnerability found in popular CMS platform',
        'Malware distribution network dismantled',
        'Credential stuffing attack blocked',
        'SQL injection attempt detected and prevented',
        'XSS vulnerability patched in web application',
        'Insider threat detected through behavior analysis',
        'Advanced persistent threat (APT) group activity identified',
        'Security advisory issued for critical infrastructure',
        'Data exfiltration attempt blocked at network perimeter'
    ];
    
    const threat = threats[Math.floor(Math.random() * threats.length)];
    const timestamp = new Date().toLocaleTimeString();
    
    // Create a new threat entry
    const threatEntry = document.createElement('div');
    threatEntry.className = 'threat-entry';
    threatEntry.innerHTML = `
        <div class="threat-time">${timestamp}</div>
        <div class="threat-description">${threat}</div>
    `;
    
    // Add threat to the feed
    feedContainer.insertBefore(threatEntry, feedContainer.firstChild);
    
    // Limit the number of entries
    if (feedContainer.children.length > 10) {
        feedContainer.removeChild(feedContainer.lastChild);
    }
    
    // Highlight the new entry
    gsap.from(threatEntry, {
        backgroundColor: 'rgba(0, 255, 157, 0.2)',
        duration: 2,
        ease: 'power1.out'
    });
}

// Add CSS for threat entries to the stylesheet
const style = document.createElement('style');
style.innerHTML = `
    .threat-entry {
        border-left: 3px solid var(--primary-color);
        margin-bottom: 10px;
        padding: 8px 12px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 5px;
        font-size: 0.9rem;
    }
    
    .threat-time {
        color: var(--secondary-color);
        font-size: 0.75rem;
        margin-bottom: 4px;
    }
    
    .threat-description {
        color: #fff;
    }
`;
document.head.appendChild(style); 
