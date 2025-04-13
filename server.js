const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { DOMParser } = require('xmldom');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Using the RSS feeds from script.js
const RSS_FEEDS = [
    'https://feeds.feedburner.com/TheHackersNews',
    'https://krebsonsecurity.com/feed/',
    'https://www.darkreading.com/rss.xml',
    'https://www.bleepingcomputer.com/feed/',
    'https://www.securityweek.com/feed/',
    'https://nakedsecurity.sophos.com/feed',
    'https://www.schneier.com/feed/atom',
    'https://www.zdnet.com/topic/security/rss.xml',
    'https://www.infosecurity-magazine.com/rss/news/',
    'https://threatpost.com/feed/'
];

let cachedFeeds = [];
let lastUpdate = 0;
const UPDATE_INTERVAL = 30000; // Update every 30 seconds

// Function to fetch and parse RSS feed
async function fetchRSSFeed(url) {
    try {
        const response = await fetch(url);
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        
        // Try both 'item' (RSS) and 'entry' (Atom) tags
        const items = xmlDoc.getElementsByTagName("item").length > 0 
            ? xmlDoc.getElementsByTagName("item")
            : xmlDoc.getElementsByTagName("entry");
        
        return Array.from(items).map(item => {
            // Get title
            const title = item.getElementsByTagName("title")[0]?.textContent || '';
            
            // Get description (try different tags)
            const description = 
                item.getElementsByTagName("description")[0]?.textContent || 
                item.getElementsByTagName("summary")[0]?.textContent || 
                item.getElementsByTagName("content")[0]?.textContent || '';
            
            // Get publication date (try different date formats)
            const pubDate = 
                item.getElementsByTagName("pubDate")[0]?.textContent || 
                item.getElementsByTagName("published")[0]?.textContent || 
                item.getElementsByTagName("updated")[0]?.textContent || 
                new Date().toUTCString();
            
            return { title, description, pubDate };
        });
    } catch (error) {
        console.error(`Error fetching RSS feed ${url}:`, error);
        return [];
    }
}

// Function to update feeds cache
async function updateFeeds() {
    try {
        const feedPromises = RSS_FEEDS.map(feed => fetchRSSFeed(feed));
        const feedResults = await Promise.all(feedPromises);
        cachedFeeds = feedResults.flat().sort((a, b) => 
            new Date(b.pubDate) - new Date(a.pubDate)
        );
        lastUpdate = Date.now();
        console.log(`Feeds updated at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
        console.error('Error updating feeds:', error);
    }
}

// API endpoint for security logs
app.get('/api/security-logs', async (req, res) => {
    try {
        // Update feeds if needed
        if (Date.now() - lastUpdate > UPDATE_INTERVAL) {
            await updateFeeds();
        }
        
        // Count different types of threats
        const threatCounts = {
            malware: 0,
            phishing: 0,
            ddos: 0,
            zeroDay: 0,
            ransomware: 0
        };
        
        cachedFeeds.forEach(item => {
            const title = item.title.toLowerCase();
            const description = item.description.toLowerCase();
            
            if (title.includes('malware') || description.includes('malware')) {
                threatCounts.malware++;
            }
            if (title.includes('phishing') || description.includes('phishing')) {
                threatCounts.phishing++;
            }
            if (title.includes('ddos') || description.includes('ddos') || 
                title.includes('denial of service') || description.includes('denial of service')) {
                threatCounts.ddos++;
            }
            if (title.includes('zero-day') || description.includes('zero-day') || 
                title.includes('zero day') || description.includes('zero day')) {
                threatCounts.zeroDay++;
            }
            if (title.includes('ransomware') || description.includes('ransomware')) {
                threatCounts.ransomware++;
            }
        });
        
        // Calculate total threats and other metrics
        const totalThreats = Object.values(threatCounts).reduce((a, b) => a + b, 0);
        
        res.json({
            ...threatCounts,
            totalThreats,
            protectedSystems: Math.max(1, Math.floor(totalThreats * 1.5)),
            avgResponseTime: Math.max(50, 50 + (totalThreats * 2)),
            alerts: cachedFeeds.slice(0, 5).map(item => ({
                ...item,
                severity: getSeverity(item.title, item.description)
            }))
        });
    } catch (error) {
        console.error('Error processing security logs:', error);
        res.status(500).json({ error: 'Failed to process security logs' });
    }
});

// Helper function to determine severity based on content
function getSeverity(title, description) {
    const content = (title + ' ' + description).toLowerCase();
    
    // High severity indicators
    const highSeverityKeywords = [
        'critical', 'severe', 'urgent', 'emergency', 'exploit', 'vulnerability',
        'zero-day', 'zero day', 'ransomware', 'data breach', 'compromised',
        'attack', 'hack', 'intrusion', 'malware', 'trojan', 'worm', 'virus',
        'backdoor', 'rootkit', 'spyware', 'adware', 'botnet', 'ddos',
        'denial of service', 'phishing', 'social engineering', 'credential theft',
        'unauthorized access', 'privilege escalation', 'remote code execution',
        'sql injection', 'xss', 'cross-site scripting', 'buffer overflow',
        'heap overflow', 'stack overflow', 'format string', 'race condition',
        'time-of-check to time-of-use', 'toctou', 'arbitrary code execution',
        'arbitrary file upload', 'arbitrary file read', 'arbitrary file write',
        'arbitrary file delete', 'arbitrary file overwrite', 'arbitrary file rename',
        'arbitrary file move', 'arbitrary file copy', 'arbitrary file link',
        'arbitrary file unlink', 'arbitrary file chmod', 'arbitrary file chown',
        'arbitrary file chgrp', 'arbitrary file truncate', 'arbitrary file append',
        'arbitrary file prepend', 'arbitrary file insert', 'arbitrary file replace',
        'arbitrary file delete', 'arbitrary file overwrite', 'arbitrary file rename',
        'arbitrary file move', 'arbitrary file copy', 'arbitrary file link',
        'arbitrary file unlink', 'arbitrary file chmod', 'arbitrary file chown',
        'arbitrary file chgrp', 'arbitrary file truncate', 'arbitrary file append',
        'arbitrary file prepend', 'arbitrary file insert', 'arbitrary file replace'
    ];
    
    // Medium severity indicators
    const mediumSeverityKeywords = [
        'warning', 'alert', 'important', 'patch', 'update', 'fix',
        'security update', 'security fix', 'security patch', 'security advisory',
        'security bulletin', 'security notice', 'security alert', 'security warning',
        'security issue', 'security vulnerability', 'security flaw', 'security bug',
        'security defect', 'security weakness', 'security limitation', 'security restriction',
        'security constraint', 'security requirement', 'security recommendation',
        'security suggestion', 'security advice', 'security tip', 'security best practice',
        'security guideline', 'security standard', 'security policy', 'security procedure',
        'security process', 'security measure', 'security control', 'security mechanism',
        'security feature', 'security function', 'security capability', 'security property',
        'security attribute', 'security characteristic', 'security quality', 'security aspect',
        'security factor', 'security element', 'security component', 'security part',
        'security piece', 'security item', 'security object', 'security entity',
        'security unit', 'security module', 'security subsystem', 'security system'
    ];
    
    // Check for high severity keywords
    if (highSeverityKeywords.some(keyword => content.includes(keyword))) {
        return 'high';
    }
    
    // Check for medium severity keywords
    if (mediumSeverityKeywords.some(keyword => content.includes(keyword))) {
        return 'medium';
    }
    
    // Default to low severity
    return 'low';
}

// Initial feed update
updateFeeds();

// Set up periodic feed updates
setInterval(updateFeeds, UPDATE_INTERVAL);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 
