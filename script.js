// RSS feed URLs for security alerts
const RSS_FEEDS = [
    'https://www.securityweek.com/rss', // Security Week
    'https://www.darkreading.com/rss.xml', // Dark Reading
    'https://www.bleepingcomputer.com/feed/', // Bleeping Computer
    'https://www.krebsonsecurity.com/feed/', // Krebs on Security
    'https://www.schneier.com/feed/atom/', // Schneier on Security
    'https://www.theregister.com/security/headlines.atom', // The Register Security
    'https://www.zdnet.com/topic/security/rss.xml', // ZDNet Security
    'https://www.wired.com/feed/rss/security' // Wired Security
];

// CORS proxy URL
const CORS_PROXY = 'https://corsproxy.io/?';

// Store the last seen items to avoid duplicates
let lastSeenItems = new Set();

// Sample alerts for fallback
const SAMPLE_ALERTS = [
    {
        title: 'Critical Security Update Required',
        description: 'A new critical vulnerability has been discovered in widely used software. Immediate patching is recommended.',
        pubDate: new Date().toISOString(),
        link: 'https://www.securityweek.com/critical-vulnerability-discovered-major-software',
        guid: 'sample-1',
        severity: 'HIGH',
        fix: 'Apply the latest security patch (version 2.3.4) immediately. Disable affected features if patching is not possible.'
    },
    {
        title: 'New Malware Campaign Detected',
        description: 'Security researchers have identified a new malware campaign targeting financial institutions.',
        pubDate: new Date().toISOString(),
        link: 'https://www.darkreading.com/attacks-breaches/new-malware-campaign-targets-financial-sector',
        guid: 'sample-2',
        severity: 'HIGH',
        fix: 'Update antivirus definitions, implement network segmentation, and monitor for suspicious activity.'
    },
    {
        title: 'Security Best Practices Update',
        description: 'Updated security guidelines have been released for enterprise networks.',
        pubDate: new Date().toISOString(),
        link: 'https://www.bleepingcomputer.com/news/security/new-security-guidelines-released-for-enterprise-networks',
        guid: 'sample-3',
        severity: 'MEDIUM',
        fix: 'Review and implement the new security guidelines within the next 30 days.'
    }
];

// Function to fetch and parse RSS feed
async function fetchRSSFeed(url) {
    try {
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
            headers: {
                'Accept': 'application/xml, text/xml, */*',
                'Content-Type': 'application/xml'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        // Check for XML parsing errors
        const parserError = xmlDoc.querySelector('parsererror');
        if (parserError) {
            throw new Error('XML parsing error: ' + parserError.textContent);
        }
        
        const items = Array.from(xmlDoc.querySelectorAll('item')).map(item => ({
            title: item.querySelector('title')?.textContent || 'No title',
            description: item.querySelector('description')?.textContent || 'No description',
            pubDate: item.querySelector('pubDate')?.textContent || new Date().toISOString(),
            link: item.querySelector('link')?.textContent || '#',
            guid: item.querySelector('guid')?.textContent || Math.random().toString(),
            fix: item.querySelector('fix')?.textContent || 'Please check the source for mitigation steps.'
        }));
        
        return items;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return SAMPLE_ALERTS;
    }
}

// Function to create alert element
function createAlertElement(item) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${item.severity.toLowerCase()}`;
    
    // Create a link wrapper for the entire alert
    const alertLink = document.createElement('a');
    alertLink.href = item.link || '#';
    alertLink.target = '_blank';
    alertLink.className = 'alert-link';
    
    // Create the alert content
    const alertContent = document.createElement('div');
    alertContent.className = 'alert-content';
    
    // Add severity badge
    const severityBadge = document.createElement('span');
    severityBadge.className = `severity ${item.severity.toLowerCase()}`;
    severityBadge.textContent = item.severity.toUpperCase();
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = item.title;
    
    // Add description
    const description = document.createElement('p');
    description.textContent = item.description;
    
    // Add fix information if available
    const fixInfo = document.createElement('div');
    fixInfo.className = 'fix-info';
    fixInfo.innerHTML = `
        <strong>Recommended Fix:</strong> ${item.fix || 'Please check the source for mitigation steps.'}
    `;
    
    // Add date
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = `Published: ${new Date(item.pubDate).toLocaleString()}`;
    
    // Add source link
    const source = document.createElement('div');
    source.className = 'source';
    source.innerHTML = `<i class="fas fa-external-link-alt"></i> View Source`;
    
    // Assemble the alert
    alertContent.appendChild(severityBadge);
    alertContent.appendChild(title);
    alertContent.appendChild(description);
    alertContent.appendChild(fixInfo);
    alertContent.appendChild(date);
    alertContent.appendChild(source);
    
    alertLink.appendChild(alertContent);
    alertDiv.appendChild(alertLink);
    
    return alertDiv;
}

// Filter Controls
const severityFilter = document.getElementById('severityFilter');
const dateFilter = document.getElementById('dateFilter');
const sortOrder = document.getElementById('sortOrder');

// Security Stats
const activeThreats = document.getElementById('activeThreats');
const protectedSystems = document.getElementById('protectedSystems');
const avgResponseTime = document.getElementById('avgResponseTime');

// Store alerts for filtering
let allAlerts = [];

// Function to filter alerts
function filterAlerts() {
    const severity = severityFilter.value;
    const dateRange = dateFilter.value;
    const sort = sortOrder.value;
    
    let filteredAlerts = [...allAlerts];
    
    // Filter by severity
    if (severity !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => 
            alert.severity.toLowerCase() === severity
        );
    }
    
    // Filter by date
    const now = new Date();
    if (dateRange !== 'all') {
        filteredAlerts = filteredAlerts.filter(alert => {
            const alertDate = new Date(alert.pubDate);
            switch (dateRange) {
                case 'today':
                    return alertDate.toDateString() === now.toDateString();
                case 'week':
                    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
                    return alertDate >= weekAgo;
                case 'month':
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    return alertDate >= monthAgo;
                default:
                    return true;
            }
        });
    }
    
    // Sort alerts
    filteredAlerts.sort((a, b) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        
        switch (sort) {
            case 'newest':
                return dateB - dateA;
            case 'oldest':
                return dateA - dateB;
            case 'severity':
                const severityOrder = { high: 3, medium: 2, low: 1 };
                return severityOrder[b.severity.toLowerCase()] - severityOrder[a.severity.toLowerCase()];
            default:
                return 0;
        }
    });
    
    return filteredAlerts;
}

// Update alerts display
function updateAlertsDisplay() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';
    
    const filteredAlerts = filterAlerts();
    
    filteredAlerts.forEach(alert => {
        const alertElement = createAlertElement(alert);
        container.appendChild(alertElement);
    });
    
    // Update stats
    updateSecurityStats();
}

// Initialize security stats
function initializeSecurityStats() {
    // Set initial values
    if (activeThreats) activeThreats.textContent = '9';
    if (protectedSystems) protectedSystems.textContent = '982';
    if (avgResponseTime) avgResponseTime.textContent = '47ms';
}

// Update security stats based on alerts
function updateSecurityStats() {
    const alerts = document.querySelectorAll('.alert');
    const highRiskAlerts = Array.from(alerts).filter(alert => 
        alert.querySelector('.severity')?.textContent === 'HIGH'
    ).length;

    // Update active threats count
    if (activeThreats) {
        activeThreats.textContent = highRiskAlerts;
        activeThreats.style.color = highRiskAlerts > 5 ? 'var(--moroccan-red)' : 'var(--primary-color)';
    }
    
    // Update protected systems
    if (protectedSystems) {
        const systemsCount = 982 - Math.floor(highRiskAlerts * 0.5);
        protectedSystems.textContent = systemsCount;
        protectedSystems.style.color = systemsCount < 950 ? 'var(--moroccan-red)' : 'var(--primary-color)';
    }
    
    // Update response time
    if (avgResponseTime) {
        const timeValue = 47 + (highRiskAlerts * 2);
        avgResponseTime.textContent = `${timeValue}ms`;
        avgResponseTime.style.color = timeValue > 60 ? 'var(--moroccan-red)' : 'var(--primary-color)';
    }
}

// Event listeners for filters
severityFilter.addEventListener('change', updateAlertsDisplay);
dateFilter.addEventListener('change', updateAlertsDisplay);
sortOrder.addEventListener('change', updateAlertsDisplay);

// Function to determine alert severity
function determineSeverity(title, description) {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('critical') || text.includes('high risk') || text.includes('zero-day')) {
        return 'HIGH';
    } else if (text.includes('medium') || text.includes('moderate')) {
        return 'MEDIUM';
    } else {
        return 'LOW';
    }
}

// Modify the existing updateAlerts function
async function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';
    
    let allItems = [];
    
    // Try to fetch from all feeds
    for (const feedUrl of RSS_FEEDS) {
        try {
            const items = await fetchRSSFeed(feedUrl);
            allItems = allItems.concat(items);
        } catch (error) {
            console.error(`Error fetching from ${feedUrl}:`, error);
        }
    }
    
    // If no items were fetched successfully, use sample alerts
    if (allItems.length === 0) {
        allItems = SAMPLE_ALERTS;
    }
    
    // Process and display items
    allItems.forEach(item => {
        if (!lastSeenItems.has(item.guid)) {
            lastSeenItems.add(item.guid);
            allAlerts.push({
                ...item,
                severity: determineSeverity(item.title, item.description)
            });
        }
    });
    
    // Update the display with filtered alerts
    updateAlertsDisplay();
    
    // Update security stats
    updateSecurityStats();
    
    // Update last update time
    document.getElementById('lastUpdate').textContent = `Last updated: ${new Date().toLocaleString()}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Initialize security stats
    initializeSecurityStats();
    
    // Set up refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', updateAlerts);
    }
    
    // Initial load
    updateAlerts();
    
    // Auto-refresh every 5 minutes
    setInterval(updateAlerts, 5 * 60 * 1000);
});

// AI Assistant functionality
const toggleChat = document.getElementById('toggleChat');
const closeChat = document.getElementById('closeChat');
const aiChatWindow = document.getElementById('aiChatWindow');
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendMessage = document.getElementById('sendMessage');

// Toggle chat window
toggleChat.addEventListener('click', () => {
    aiChatWindow.classList.toggle('active');
});

closeChat.addEventListener('click', () => {
    aiChatWindow.classList.remove('active');
});

// Handle sending messages
function addMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message function
async function sendUserMessage() {
    const message = userInput.value.trim().toLowerCase();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        // Show loading state
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai-message';
        loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Get current alerts and stats for context
            const currentAlerts = Array.from(document.querySelectorAll('.alert')).map(alert => ({
                title: alert.querySelector('h3')?.textContent || '',
                description: alert.querySelector('p')?.textContent || '',
                severity: alert.querySelector('.severity')?.textContent || ''
            }));

            const currentStats = {
                activeThreats: document.getElementById('activeThreats')?.textContent || '0',
                protectedSystems: document.getElementById('protectedSystems')?.textContent || '0',
                responseTime: document.getElementById('avgResponseTime')?.textContent || '0ms'
            };

            // Check for specific user intents
            let response;
            if (message.includes('thank') || message.includes('thanks')) {
                response = "You're welcome! Is there anything else you'd like to know about the security status or alerts?";
            } else if (message.includes('yes') || message.includes('okay') || message.includes('ok')) {
                response = `I see ${currentAlerts.length} active alerts in the system. Here's a detailed analysis:
                
                1. High Priority Alerts:
                ${currentAlerts.filter(a => a.severity === 'HIGH').map(a => `- ${a.title}`).join('\n') || 'None'}
                
                2. System Status:
                - ${currentStats.activeThreats} active threats
                - ${currentStats.protectedSystems} protected systems
                - Average response time: ${currentStats.responseTime}
                
                Would you like me to:
                1. Explain any specific alert in detail?
                2. Provide recommendations for addressing these threats?
                3. Show you how to use our security tools?
                4. Analyze the network status?`;
            } else if (message.includes('analyze') || message.includes('alert')) {
                const highRiskAlerts = currentAlerts.filter(a => a.severity === 'HIGH');
                response = `Here's a detailed analysis of the current alerts:
                
                High Risk Alerts (${highRiskAlerts.length}):
                ${highRiskAlerts.map(a => `
                - ${a.title}
                  Description: ${a.description}
                  Recommended Action: Immediate attention required`).join('\n') || 'None'}
                
                Would you like me to:
                1. Provide specific mitigation steps?
                2. Explain the impact of these threats?
                3. Show you how to use our security tools to address these?`;
            } else if (message.includes('recommend') || message.includes('suggestion')) {
                response = `Based on the current security status, here are my recommendations:
                
                1. Immediate Actions:
                - Review and address all high-risk alerts
                - Update security protocols
                - Run a comprehensive system scan
                
                2. Preventive Measures:
                - Enable real-time monitoring
                - Update all security software
                - Review access controls
                
                3. Long-term Strategies:
                - Implement regular security audits
                - Train staff on security protocols
                - Maintain backup systems
                
                Would you like me to elaborate on any of these recommendations?`;
            } else if (message.includes('tool') || message.includes('scan')) {
                response = `Our security tools can help you address these threats:
                
                1. Threat Scanner:
                - Run comprehensive system scans
                - Identify vulnerabilities
                - Generate detailed reports
                
                2. Network Monitor:
                - Track real-time traffic
                - Detect suspicious activity
                - Monitor connection attempts
                
                3. Access Control:
                - Manage user permissions
                - Review access logs
                - Implement security policies
                
                Which tool would you like to learn more about?`;
            } else {
                // If no specific intent is detected, provide a contextual response
                response = `I see ${currentAlerts.length} active alerts in the system. Here's what I can tell you:
                
                1. Current Status:
                - Active Threats: ${currentStats.activeThreats}
                - Protected Systems: ${currentStats.protectedSystems}
                - Response Time: ${currentStats.responseTime}
                
                2. Recent Alerts:
                ${currentAlerts.slice(0, 3).map(alert => `
                - ${alert.severity} Alert: ${alert.title}
                  ${alert.description}`).join('\n')}
                
                Would you like me to:
                1. Analyze these alerts in detail?
                2. Provide security recommendations?
                3. Explain how to use our security tools?
                4. Help you understand the current threat level?`;
            }
            
            // Remove loading message and add response
            chatMessages.removeChild(loadingDiv);
            addMessage(response);
            
        } catch (error) {
            console.error('Error:', error);
            // Remove loading message
            if (loadingDiv && loadingDiv.parentNode) {
                chatMessages.removeChild(loadingDiv);
            }
            
            // Provide a fallback response
            const fallbackResponse = `I apologize for the technical difficulty. Here's what I can tell you about the current security status:
            
            1. Active Alerts: ${document.querySelectorAll('.alert').length}
            2. System Status:
               - Active Threats: ${document.getElementById('activeThreats')?.textContent || '0'}
               - Protected Systems: ${document.getElementById('protectedSystems')?.textContent || '0'}
            
            Would you like me to:
            1. Explain the current alerts?
            2. Provide security recommendations?
            3. Show you how to use our security tools?`;
            
            addMessage(fallbackResponse);
        }
    }
}

// Event listeners for sending messages
sendMessage.addEventListener('click', sendUserMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendUserMessage();
    }
});

// Add welcome message when chat is opened
toggleChat.addEventListener('click', () => {
    if (chatMessages.children.length === 0) {
        addMessage('Hello! I am your cybersecurity assistant. How can I help you today?');
    }
});

// Email functionality
const emailInput = document.getElementById('emailInput');
const saveEmail = document.getElementById('saveEmail');
const notificationStatus = document.getElementById('notificationStatus');

// Store emails in localStorage
function saveEmailToStorage(email) {
    const emails = JSON.parse(localStorage.getItem('subscribedEmails') || '[]');
    if (!emails.includes(email)) {
        emails.push(email);
        localStorage.setItem('subscribedEmails', JSON.stringify(emails));
    }
}

// Send confirmation email
async function sendConfirmationEmail(email) {
    try {
        const templateParams = {
            to_email: email,
            from_name: 'Cyber Atlas Security Team',
            to_name: email.split('@')[0],
            message: `Thank you for subscribing to Cyber Atlas Security Alerts. You will now receive real-time notifications about security threats and vulnerabilities.`,
            logo_url: 'https://your-logo-url.com/logo.png', // Replace with your actual logo URL
            company_name: 'Cyber Atlas',
            team_name: 'Moroccan Security Team'
        };

        const response = await emailjs.send(
            'YOUR_EMAILJS_SERVICE_ID', // Replace with your EmailJS service ID
            'YOUR_EMAILJS_TEMPLATE_ID', // Replace with your EmailJS template ID
            templateParams
        );

        return response.status === 200;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

// Handle email subscription
saveEmail.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
        notificationStatus.textContent = 'Please enter a valid email address';
        notificationStatus.style.color = 'var(--moroccan-red)';
        return;
    }

    notificationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    try {
        const success = await sendConfirmationEmail(email);
        if (success) {
            saveEmailToStorage(email);
            notificationStatus.innerHTML = '<i class="fas fa-check"></i> Successfully subscribed! Check your email for confirmation.';
            notificationStatus.style.color = 'var(--primary-color)';
            emailInput.value = '';
        } else {
            throw new Error('Failed to send confirmation email');
        }
    } catch (error) {
        notificationStatus.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to subscribe. Please try again later.';
        notificationStatus.style.color = 'var(--moroccan-red)';
    }
});

// Security Tools Functionality
const securityTools = {
    // Threat Scanner
    threatScanner: {
        scan: async function() {
            try {
                const toolCard = document.querySelector('.tool-card:nth-child(1)');
                const button = toolCard.querySelector('button');
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Scanning...';
                
                // Simulate scanning process
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Generate scan results
                const results = {
                    threats: Math.floor(Math.random() * 5),
                    vulnerabilities: Math.floor(Math.random() * 3),
                    recommendations: [
                        'Update system security patches',
                        'Review firewall settings',
                        'Check for suspicious processes'
                    ]
                };
                
                // Update button and show results
                button.disabled = false;
                button.innerHTML = '<i class="fas fa-shield-virus"></i> Scan System';
                
                // Show results in a notification
                const notification = document.createElement('div');
                notification.className = 'tool-notification';
                notification.innerHTML = `
                    <h4>Scan Results</h4>
                    <div class="result-item">
                        <span class="label">Threats Found:</span>
                        <span class="value ${results.threats > 0 ? 'high' : 'safe'}">${results.threats}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Vulnerabilities:</span>
                        <span class="value ${results.vulnerabilities > 0 ? 'medium' : 'safe'}">${results.vulnerabilities}</span>
                    </div>
                    <div class="recommendations">
                        <h5>Recommendations:</h5>
                        <ul>
                            ${results.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                `;
                
                toolCard.appendChild(notification);
                setTimeout(() => notification.remove(), 10000);
                
            } catch (error) {
                console.error('Scan error:', error);
                showToolError('threatScanner', 'Failed to complete scan. Please try again.');
            }
        }
    },
    
    // Network Monitor
    networkMonitor: {
        start: function() {
            try {
                const toolCard = document.querySelector('.tool-card:nth-child(2)');
                const button = toolCard.querySelector('button');
                const isMonitoring = button.getAttribute('data-monitoring') === 'true';
                
                if (isMonitoring) {
                    // Stop monitoring
                    button.innerHTML = '<i class="fas fa-play"></i> Start Monitoring';
                    button.setAttribute('data-monitoring', 'false');
                    clearInterval(window.monitorInterval);
                } else {
                    // Start monitoring
                    button.innerHTML = '<i class="fas fa-pause"></i> Stop Monitoring';
                    button.setAttribute('data-monitoring', 'true');
                    
                    // Simulate network activity
                    window.monitorInterval = setInterval(() => {
                        const stats = {
                            connections: Math.floor(Math.random() * 10),
                            transferRate: Math.floor(Math.random() * 1000)
                        };
                        
                        // Update stats display
                        const statsDisplay = toolCard.querySelector('.tool-stats') || document.createElement('div');
                        statsDisplay.className = 'tool-stats';
                        statsDisplay.innerHTML = `
                            <div class="stat">
                                <span class="label">Active Connections:</span>
                                <span class="value">${stats.connections}</span>
                            </div>
                            <div class="stat">
                                <span class="label">Data Transfer:</span>
                                <span class="value">${stats.transferRate} KB/s</span>
                            </div>
                        `;
                        
                        if (!toolCard.querySelector('.tool-stats')) {
                            toolCard.appendChild(statsDisplay);
                        }
                    }, 2000);
                }
                
            } catch (error) {
                console.error('Monitor error:', error);
                showToolError('networkMonitor', 'Failed to start monitoring. Please try again.');
            }
        }
    },
    
    // Access Control
    accessControl: {
        manage: function() {
            try {
                const toolCard = document.querySelector('.tool-card:nth-child(3)');
                const button = toolCard.querySelector('button');
                
                // Simulate access control panel
                const accessPanel = document.createElement('div');
                accessPanel.className = 'access-panel';
                accessPanel.innerHTML = `
                    <h4>Access Control Panel</h4>
                    <div class="user-list">
                        <div class="user-item">
                            <span class="name">Admin</span>
                            <span class="role">Administrator</span>
                            <span class="status active">Active</span>
                            <button class="edit-btn">Edit</button>
                        </div>
                        <div class="user-item">
                            <span class="name">Security</span>
                            <span class="role">Security Officer</span>
                            <span class="status active">Active</span>
                            <button class="edit-btn">Edit</button>
                        </div>
                        <div class="user-item">
                            <span class="name">User1</span>
                            <span class="role">Standard User</span>
                            <span class="status inactive">Inactive</span>
                            <button class="edit-btn">Edit</button>
                        </div>
                    </div>
                    <div class="access-controls">
                        <button class="add-user-btn">Add User</button>
                        <button class="close-panel-btn">Close</button>
                    </div>
                `;
                
                toolCard.appendChild(accessPanel);
                
                // Add event listeners
                const closeBtn = accessPanel.querySelector('.close-panel-btn');
                closeBtn.addEventListener('click', () => {
                    accessPanel.remove();
                });
                
                const addUserBtn = accessPanel.querySelector('.add-user-btn');
                addUserBtn.addEventListener('click', () => {
                    const userList = accessPanel.querySelector('.user-list');
                    const newUser = document.createElement('div');
                    newUser.className = 'user-item';
                    newUser.innerHTML = `
                        <span class="name">New User</span>
                        <span class="role">Standard User</span>
                        <span class="status active">Active</span>
                        <button class="edit-btn">Edit</button>
                    `;
                    userList.appendChild(newUser);
                });
                
            } catch (error) {
                console.error('Access control error:', error);
                showToolError('accessControl', 'Failed to load access control panel. Please try again.');
            }
        }
    }
};

// Helper function to show tool errors
function showToolError(toolName, message) {
    const toolCard = document.querySelector(`.tool-card:nth-child(${
        toolName === 'threatScanner' ? 1 : toolName === 'networkMonitor' ? 2 : 3
    })`);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'tool-error';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-circle"></i>
        <span>${message}</span>
        <button class="retry-btn">Retry</button>
    `;
    
    toolCard.appendChild(errorDiv);
}

// Initialize security tools
document.addEventListener('DOMContentLoaded', () => {
    // Add click handlers to tool buttons
    document.querySelectorAll('.tool-card button').forEach(button => {
        button.addEventListener('click', () => {
            const toolName = button.closest('.tool-card').querySelector('h3').textContent.toLowerCase();
            
            if (toolName.includes('scanner')) {
                securityTools.threatScanner.scan();
            } else if (toolName.includes('monitor')) {
                securityTools.networkMonitor.start();
            } else if (toolName.includes('control')) {
                securityTools.accessControl.manage();
            }
        });
    });
}); 
