// RSS feed URLs for security alerts
const RSS_FEEDS = [
    'https://nvd.nist.gov/feeds/xml/cve/misc/nvd-rss.xml', // NVD RSS feed
    'https://www.us-cert.gov/ncas/alerts.xml' // US-CERT alerts
];

// Store the last seen items to avoid duplicates
let lastSeenItems = new Set();

// Function to fetch and parse RSS feed
async function fetchRSSFeed(url) {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        return [];
    }
}

// Function to create alert element
function createAlertElement(item) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert';
    
    // Extract severity from title or description
    const severity = item.title.toLowerCase().includes('high') ? 'high' :
                    item.title.toLowerCase().includes('medium') ? 'medium' : 'low';
    
    alertDiv.innerHTML = `
        <span class="severity ${severity}">${severity.toUpperCase()}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="date">Published: ${new Date(item.pubDate).toLocaleString()}</div>
    `;
    
    return alertDiv;
}

// Function to update the alerts container
async function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = ''; // Clear existing alerts
    
    for (const feedUrl of RSS_FEEDS) {
        const items = await fetchRSSFeed(feedUrl);
        
        items.forEach(item => {
            if (!lastSeenItems.has(item.guid)) {
                lastSeenItems.add(item.guid);
                const alertElement = createAlertElement(item);
                container.appendChild(alertElement);
            }
        });
    }
    
    // Update last update time
    document.getElementById('lastUpdate').textContent = `Last updated: ${new Date().toLocaleString()}`;
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initial load
    updateAlerts();
    
    // Set up refresh button
    document.getElementById('refreshBtn').addEventListener('click', updateAlerts);
    
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
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';
        
        try {
            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'message ai-message';
            loadingDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Thinking...';
            chatMessages.appendChild(loadingDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyAPA1fGbs_NH7RZj1FAmI12V83qDhM83Bs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are a cybersecurity expert assistant for Cyber Atlas, a Moroccan security team. 
                            The user is viewing our security monitoring dashboard. 
                            Please provide helpful, accurate information about: ${message}
                            
                            If the question is about security threats, vulnerabilities, or cybersecurity best practices, 
                            provide detailed, actionable advice. If it's about our platform, explain features and functionality.
                            Keep responses concise and professional.`
                        }]
                    }]
                })
            });
            
            // Remove loading message
            chatMessages.removeChild(loadingDiv);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
                const aiResponse = data.candidates[0].content.parts[0].text;
                addMessage(aiResponse);
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Error:', error);
            addMessage('I apologize, but I encountered an issue processing your request. Please try rephrasing your question or try again later.');
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