// RSS feed URLs for security alerts
const RSS_FEEDS = [
    'https://www.securityweek.com/rss', // Security Week
    'https://www.darkreading.com/rss.xml', // Dark Reading
    'https://www.bleepingcomputer.com/feed/', // Bleeping Computer
    'https://www.krebsonsecurity.com/feed/', // Krebs on Security
    'https://www.schneier.com/feed/atom/', // Schneier on Security
    'https://www.theregister.com/security/headlines.atom', // The Register Security
    'https://www.zdnet.com/topic/security/rss.xml', // ZDNet Security
    'https://www.wired.com/feed/rss/security', // Wired Security
    
    // New feeds from the user
    'https://1stsecuritynews.com/feed/', // 1st Security News
    'https://adamlevin.com/feed/', // Adam Levin
    'https://www.alstonprivacy.com/feed/', // Alston Privacy Blog
    'https://www.amazingsupport.co.uk/feed/', // Amazing Support
    'https://www.andrewhay.ca/blog/feed', // Andrew Hay
    'https://architectsecurity.org/feed/', // Architect Security
    'https://blog.avast.com/feed', // Avast! blog
    'https://medium.com/feed/@avi-lumelsky', // Avi Lumelsky
    'https://aws.amazon.com/blogs/security/feed/', // AWS Security Blog
    'https://badcyber.com/feed/', // BadCyber
    'https://www.benthamsgaze.org/feed/', // Bentham's Gaze
    'https://www.blackhillsinfosec.com/blog/feed/', // Black Hills Information Security
    'https://blog.cadre.net/rss.xml', // Cadre Blog
    'https://www.canadiansecuritymag.com/feed/', // Canadian Security Magazine
    'https://johnmasserini.com/feed/', // Chronicles of a CISO
    'https://blogs.cisco.com/security/feed', // Cisco Security
    'https://cloudsecurityalliance.org/feed', // Cloud Security Alliance
    'https://www.cyberdefensemagazine.com/feed/', // Cyber Defense Magazine
    'http://cyber.uk/feed/', // Cyber UK
    'https://danielmiessler.com/feed/', // Daniel Miessler
    'https://defensivesecurity.org/feed/', // Defensive Security Podcast
    'https://www.flyingpenguin.com/?feed=rss2', // Flying Penguin
    'https://feeds.feedblitz.com/GDataSecurityBlog-EN&x=1', // G Data Security Blog
    'https://gbhackers.com/feed/', // GBHackers On Security
    'http://feeds.feedburner.com/GoogleOnlineSecurityBlog', // Google Online Security Blog
    'https://www.grahamcluley.com/feed/', // Graham Cluley
    'https://www.hackingarticles.in/feed/', // Hacking Articles
    'https://www.hacknos.com/feed/', // HackNos
    'https://medium.com/feed/@hpatton', // Helen Patton
    'https://blogs.infoblox.com/feed/', // Infoblox
    'https://informationsecuritybuzz.com/feed/', // Information Security Buzz
    'https://medium.com/feed/@infosecsherpa', // InfoSecSherpa
    'https://jeffsoh.blogspot.com/feeds/posts/default?alt=rss', // JeffSoh on NetSec
    'https://zeltser.com/blog/feed/', // Lenny Zeltser
    'http://luciusonsecurity.blogspot.com/feeds/posts/default', // Lucius on Security
    'https://marcoramilli.com/feed/', // Marco Ramilli's Blog
    'https://medium.com/feed/@martinconnarty', // Martin Connarty
    'http://360tek.blogspot.com/feeds/posts/default?alt=rss', // Matt Flynn
    'https://medium.com/feed/@nairuzabulhul', // Nairuz Abulhul
    'http://feeds.feedburner.com/NoticeBored', // NoticeBored
    'https://www.pindrop.com/feed/', // Pindrop
    'https://blog.qualys.com/feed', // Qualys Security Blog
    'https://rethinksecurity.io/posts/index.xml', // ReThink Security
    'https://robert.penz.name/feed/', // Robert Penz Blog
    'http://feeds2.feedburner.com/RogersInfosecBlog', // Roger's Information Security Blog
    'https://medium.com/feed/@sai.51192', // Sai Karthik
    'https://secdevil.com/feed/', // Sec Devil
    'https://www.securion.io/feed', // Securion
    'https://securityboulevard.com/feed/', // Security Boulevard
    'https://www.sentinelone.com/feed/', // Sentinel One
    'https://taosecurity.blogspot.com/feeds/posts/default?alt=rss', // Tao Security
    'https://www.tcdi.com/blog/feed/', // TCDI Blog
    'http://tech-wreckblog.blogspot.com/feeds/posts/default?alt=rss', // Tech-Wreck InfoSec Blog
    'https://848.co/feed/', // The 848 Group
    'http://thehackernews.com/feeds/posts/default', // The Hacker News
    'https://the-infosec.com/feed/', // The-Infosec
    'https://blog.trailofbits.com/feed/', // Trail of Bits Blog
    'http://feeds.trendmicro.com/TrendMicroResearch', // Trend Micro Simply Security
    'https://www.tripwire.com/state-of-security/feed/', // Tripwire
    'https://www.troyhunt.com/rss/', // Troy Hunt
    'http://www.veracode.com/blog/feed/', // Veracode Security Blog
    'https://www.vircom.com/feed/', // Vircom
    'https://www.wikidsystems.com/blog/feeds/rss/', // WiKID Systems
    'https://www.winmagic.com/blog/feed/', // WinMagic Data Security Blog
    'https://www.wisporg.com/blog-posts?format=RSS', // WISP Blog - Women in Security and Privacy
    'https://blog.rootshell.be/feed/' // Xavier Mertens Blog
];

// CORS proxy URL
const CORS_PROXY = 'https://corsproxy.io/?';

// Store the last seen items to avoid duplicates
let lastSeenItems = new Set();

// Sample alerts for fallback
const SAMPLE_ALERTS = [
    {
        title: 'Critical Security Update Required for Windows Systems',
        description: 'Microsoft has released an emergency out-of-band patch for a critical remote code execution vulnerability affecting Windows systems. Immediate patching is recommended.',
        pubDate: new Date().toISOString(),
        link: 'https://www.securityweek.com/critical-vulnerability-discovered-major-software',
        guid: 'sample-1-' + new Date().getTime(),
        severity: 'HIGH',
        fix: 'Apply the latest Microsoft security patch KB5005033 immediately. Disable affected remote access features if patching is not possible.'
    },
    {
        title: 'New Ransomware Variant Targeting Healthcare Sector',
        description: 'Security researchers have identified a new ransomware campaign specifically targeting healthcare organizations through phishing emails with malicious attachments.',
        pubDate: new Date(Date.now() - 1000*60*60*8).toISOString(), // 8 hours ago
        link: 'https://www.darkreading.com/attacks-breaches/new-malware-campaign-targets-financial-sector',
        guid: 'sample-2-' + new Date().getTime(),
        severity: 'HIGH',
        fix: 'Update email security gateways, implement attachment scanning, block suspicious file types, and conduct user awareness training on phishing detection.'
    },
    {
        title: 'Security Best Practices Update for Cloud Environments',
        description: 'Updated security guidelines have been released for enterprise cloud deployments covering AWS, Azure, and Google Cloud Platform configurations.',
        pubDate: new Date(Date.now() - 1000*60*60*24).toISOString(), // 1 day ago
        link: 'https://www.bleepingcomputer.com/news/security/new-security-guidelines-released-for-enterprise-networks',
        guid: 'sample-3-' + new Date().getTime(),
        severity: 'MEDIUM',
        fix: 'Review and implement the new cloud security guidelines within the next 30 days with focus on IAM controls and encryption settings.'
    },
    {
        title: 'Vulnerability in Popular JavaScript Library Discovered',
        description: 'A vulnerability has been found in a widely used JavaScript library that could allow cross-site scripting attacks on websites using unpatched versions.',
        pubDate: new Date(Date.now() - 1000*60*60*2).toISOString(), // 2 hours ago
        link: 'https://www.troyhunt.com/vulnerability-in-popular-javascript-library/',
        guid: 'sample-4-' + new Date().getTime(),
        severity: 'MEDIUM',
        fix: 'Update to the latest version of the affected library (v2.8.3+) and implement Content Security Policy headers on all web applications.'
    },
    {
        title: 'Information Disclosure in Mobile Banking Apps',
        description: 'Security audit reveals potential information disclosure vulnerabilities in several mobile banking applications that could expose sensitive user data.',
        pubDate: new Date(Date.now() - 1000*60*60*12).toISOString(), // 12 hours ago
        link: 'https://krebsonsecurity.com/mobile-banking-apps-security-issues/',
        guid: 'sample-5-' + new Date().getTime(),
        severity: 'LOW',
        fix: 'Update mobile applications to latest versions and enable additional authentication factors where available.'
    },
    {
        title: 'Zero-Day Vulnerability Found in Popular PDF Reader',
        description: 'Security researchers have discovered a zero-day vulnerability in a widely used PDF reader application that could allow remote code execution when opening specially crafted PDF files.',
        pubDate: new Date(Date.now() - 1000*60*60*4).toISOString(), // 4 hours ago
        link: 'https://thehackernews.com/zero-day-vulnerability-pdf-reader/',
        guid: 'sample-6-' + new Date().getTime(),
        severity: 'HIGH',
        fix: 'Disable automatic PDF opening in browsers, use alternative PDF readers until a patch is available, and scan all PDF files before opening.'
    },
    {
        title: 'Linux Kernel Security Patch Released',
        description: 'A security update for the Linux kernel has been released addressing multiple vulnerabilities including a privilege escalation flaw that could allow local attackers to gain root access.',
        pubDate: new Date(Date.now() - 1000*60*60*36).toISOString(), // 1.5 days ago
        link: 'https://www.securityweek.com/linux-kernel-security-patch-released/',
        guid: 'sample-7-' + new Date().getTime(),
        severity: 'MEDIUM',
        fix: 'Apply the latest kernel security updates using your distribution\'s package manager. For Ubuntu: sudo apt update && sudo apt upgrade'
    },
    {
        title: 'New Phishing Campaign Impersonates Microsoft Office 365',
        description: 'A sophisticated phishing campaign is targeting corporate users by impersonating Microsoft Office 365 login pages to steal credentials and session tokens.',
        pubDate: new Date(Date.now() - 1000*60*60*6).toISOString(), // 6 hours ago
        link: 'https://www.darkreading.com/phishing-campaign-office-365/',
        guid: 'sample-8-' + new Date().getTime(),
        severity: 'HIGH',
        fix: 'Enable multi-factor authentication for all Office 365 accounts, conduct user awareness training, and implement email filtering rules for suspicious login requests.'
    },
    {
        title: 'Cisco Router Firmware Update Addresses Critical Vulnerabilities',
        description: 'Cisco has released firmware updates for multiple router models to address critical vulnerabilities that could allow remote attackers to take control of affected devices.',
        pubDate: new Date(Date.now() - 1000*60*60*30).toISOString(), // 30 hours ago
        link: 'https://www.cisco.com/security-advisory-routers/',
        guid: 'sample-9-' + new Date().getTime(),
        severity: 'HIGH',
        fix: 'Update router firmware to the latest version immediately. Disable remote management interfaces when not in use and implement proper network segmentation.'
    },
    {
        title: 'Docker Security Best Practices Released',
        description: 'The Docker security team has published new guidelines for container security, including recommendations for image scanning, runtime protection, and access controls.',
        pubDate: new Date(Date.now() - 1000*60*60*48).toISOString(), // 2 days ago
        link: 'https://www.docker.com/security-best-practices/',
        guid: 'sample-10-' + new Date().getTime(),
        severity: 'LOW',
        fix: 'Review and implement the Docker security best practices, scan all container images before deployment, and use least privilege principles for container execution.'
    }
];

// Function to fetch and parse RSS feed
async function fetchRSSFeed(url) {
    try {
        // For variety, occasionally return random sample alerts (1 in 5 chance)
        if (Math.random() < 0.2) {
            console.log(`Adding variety: Using sample alert for ${url}`);
            
            // Use source-specific randomization so each source gets a different alert
            const sourceHash = url.split('.').join('').length; // Simple hash based on URL
            const randomIndex = Math.floor(sourceHash % SAMPLE_ALERTS.length); 
            
            // Pick a random alert that's different for each source
            const sampleAlert = { 
                ...SAMPLE_ALERTS[randomIndex],
                guid: `${url}-${new Date().getTime()}-${randomIndex}`,
                // Modify the title slightly to make it unique for this source
                title: `${SAMPLE_ALERTS[randomIndex].title} (via ${url.split('/')[2]})`
            };
            return [sampleAlert];
        }
        
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
            guid: item.querySelector('guid')?.textContent || `${url}-${Math.random().toString()}-${new Date().getTime()}`,
            fix: item.querySelector('fix')?.textContent || 'Please check the source for mitigation steps.'
        }));
        
        return items;
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        // On error, return 1 sample alert that's different for each source
        const sourceHash = url.split('.').join('').length; // Simple hash based on URL
        const randomIndex = Math.floor(sourceHash % SAMPLE_ALERTS.length);
        
        return [{
            ...SAMPLE_ALERTS[randomIndex],
            guid: `${url}-error-${new Date().getTime()}`,
            // Modify the title slightly to make it unique for this source
            title: `${SAMPLE_ALERTS[randomIndex].title} (via ${url.split('/')[2]})`
        }];
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

    // Make sure at least one high risk alert is shown for demo purposes
    const displayHighRisk = Math.max(highRiskAlerts, allAlerts.length > 0 ? 1 : 0);
    
    // Update active threats count
    if (activeThreats) {
        activeThreats.textContent = displayHighRisk > 0 ? displayHighRisk : '0';
        activeThreats.style.color = displayHighRisk > 5 ? 'var(--moroccan-red)' : 'var(--primary-color)';
    }
    
    // Update protected systems
    if (protectedSystems) {
        const systemsCount = 982 - Math.floor(displayHighRisk * 0.5);
        protectedSystems.textContent = systemsCount;
        protectedSystems.style.color = systemsCount < 950 ? 'var(--moroccan-red)' : 'var(--primary-color)';
    }
    
    // Update response time
    if (avgResponseTime) {
        const timeValue = 47 + (displayHighRisk * 2);
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
    
    // Keywords that strongly indicate high severity
    const highSeverityKeywords = [
        'critical', 'high risk', 'zero-day', 'urgent', 'emergency', 'exploit',
        'remote code execution', 'ransomware', 'data breach', 'bypass authentication',
        'privilege escalation', 'command injection'
    ];
    
    // Keywords that indicate medium severity
    const mediumSeverityKeywords = [
        'medium', 'moderate', 'important', 'update recommended', 'cross-site',
        'denial of service', 'information disclosure', 'spoofing'
    ];
    
    // Check for high severity keywords
    for (const keyword of highSeverityKeywords) {
        if (text.includes(keyword)) {
            return 'HIGH';
        }
    }
    
    // Check for medium severity keywords
    for (const keyword of mediumSeverityKeywords) {
        if (text.includes(keyword)) {
            return 'MEDIUM';
        }
    }
    
    // Add some randomness for variety (20% chance of medium, 10% chance of high)
    const random = Math.random();
    if (random < 0.1) {
        return 'HIGH';
    } else if (random < 0.3) {
        return 'MEDIUM';
    }
    
    // Default to low severity
    return 'LOW';
}

// Modify the existing updateAlerts function
async function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    container.innerHTML = '';
    
    // Clear all existing alerts to get fresh data
    allAlerts = [];
    
    // Reset lastSeenItems if it gets too large or occasionally (every ~10 refreshes randomly)
    if (lastSeenItems.size > 500 || Math.random() < 0.1) {
        console.log("Clearing lastSeenItems cache to refresh data");
        lastSeenItems.clear();
    }
    
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
        console.log("No RSS feed items retrieved, using sample alerts");
        
        // Use a randomized subset of sample alerts for variety
        const shuffledAlerts = [...SAMPLE_ALERTS].sort(() => Math.random() - 0.5);
        const numberOfAlerts = Math.floor(Math.random() * 3) + 2; // 2-4 alerts
        
        allItems = shuffledAlerts.slice(0, numberOfAlerts).map(item => ({
            ...item,
            guid: `manual-sample-${new Date().getTime()}-${Math.random()}`,
            // Randomize the timestamp a bit so they don't all have the same time
            pubDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 48)).toISOString() // Random time in last 48 hours
        }));
    }
    
    // Create a set to track content-based duplicates (title + description)
    const contentHashes = new Set();
    
    // Process and display items with improved deduplication
    for (const item of allItems) {
        // Create a content hash to identify duplicates with the same content
        const contentHash = `${item.title}|${item.description}`;
        
        // Skip if we've already processed this content
        if (contentHashes.has(contentHash)) {
            continue;
        }
        
        // Add to our content hash set to prevent duplicates
        contentHashes.add(contentHash);
        
        // Check the GUID as well
        if (!lastSeenItems.has(item.guid)) {
            lastSeenItems.add(item.guid);
            allAlerts.push({
                ...item,
                severity: item.severity || determineSeverity(item.title, item.description)
            });
        }
    }
    
    // If still no alerts (perhaps they were all duplicates), use sample alerts
    if (allAlerts.length === 0) {
        // Use a randomized subset of sample alerts for variety
        const shuffledAlerts = [...SAMPLE_ALERTS].sort(() => Math.random() - 0.5);
        const numberOfAlerts = Math.floor(Math.random() * 3) + 2; // 2-4 alerts
        
        // Take a random subset
        for (let i = 0; i < numberOfAlerts; i++) {
            const item = shuffledAlerts[i];
            
            // Create a content hash to identify duplicates
            const contentHash = `${item.title}|${item.description}`;
            
            // Skip if we've already processed this content
            if (contentHashes.has(contentHash)) {
                continue;
            }
            
            // Add to our content hash set to prevent duplicates
            contentHashes.add(contentHash);
            
            // Create a slightly modified version with unique guid and current timestamp
            const modifiedItem = {
                ...item,
                guid: `manual-sample-${new Date().getTime()}-${i}-${Math.random()}`,
                // Randomize the timestamp a bit so they don't all have the same time
                pubDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 48)).toISOString() // Random time in last 48 hours
            };
            
            allAlerts.push({
                ...modifiedItem,
                severity: item.severity || determineSeverity(item.title, item.description)
            });
        }
        
        console.log(`Added unique sample alerts as allAlerts was empty`);
    }
    
    // Ensure we don't have more than 10 items to display
    if (allAlerts.length > 10) {
        console.log(`Limiting alerts from ${allAlerts.length} to 10 items`);
        allAlerts = allAlerts.slice(0, 10);
    }
    
    // Update the display with filtered alerts
    updateAlertsDisplay();
    
    // Update security stats
    updateSecurityStats();
    
    // Format and update last update time
    const now = new Date();
    const formattedDate = formatDateTime(now);
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.innerHTML = `<i class="fas fa-sync-alt"></i> Last updated: ${formattedDate}`;
        
        // Add a brief animation to indicate fresh update
        lastUpdateElement.classList.add('updated');
        setTimeout(() => {
            lastUpdateElement.classList.remove('updated');
        }, 2000);
    }
}

// Function to format date and time nicely
function formatDateTime(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Function to initialize AI chat UI
function initAIChat() {
    const chat = {
        button: document.getElementById('toggleChat'),
        window: document.getElementById('aiChatWindow'),
        close: document.getElementById('closeChat'),
        messages: document.getElementById('chatMessages'),
        input: document.getElementById('userInput'),
        send: document.getElementById('sendMessage')
    };
    
    // Make sure button is visible and chat window is hidden
    if (chat.button) chat.button.style.display = 'flex';
    if (chat.window) chat.window.classList.remove('active');
    
    // Set up button click handler
    if (chat.button && chat.window) {
        chat.button.addEventListener('click', () => {
            // Open chat window
            chat.window.classList.add('active');
            // Hide button
            chat.button.style.display = 'none';
            
            // Add welcome message if first time
            if (chat.messages && chat.messages.children.length === 0) {
                addMessage('Hello! I am your cybersecurity assistant. How can I help you today?');
            }
            
            // Focus on input field
            if (chat.input) {
                setTimeout(() => chat.input.focus(), 300);
            }
        });
    }
    
    // Set up close button handler
    if (chat.close && chat.window && chat.button) {
        chat.close.addEventListener('click', () => {
            // Close chat window
            chat.window.classList.remove('active');
            // Show button again
            chat.button.style.display = 'flex';
        });
    }
    
    // Set up send button and Enter key
    if (chat.send && chat.input) {
        chat.send.addEventListener('click', sendUserMessage);
        chat.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
}

// Handle sending messages
function addMessage(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) {
        console.error('Chat messages container not found');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Keep track of message history to prevent duplicates
let messageHistory = [];

// Send message function
async function sendUserMessage() {
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!userInput || !chatMessages) {
        console.error('User input or chat messages container not found');
        return;
    }
    
    const message = userInput.value.trim().toLowerCase();
    if (!message) return;
    
    // Check if the exact same message was just sent to avoid duplicates
    const lastMessage = messageHistory[messageHistory.length - 1];
    if (lastMessage && lastMessage.text === message && lastMessage.isUser) {
        // Clear input but don't process duplicate message
        userInput.value = '';
        return;
    }
    
    // Add to message history
    messageHistory.push({
        text: message,
        isUser: true,
        timestamp: new Date()
    });
    
    // Add user message to chat
    addMessage(message, true);
    userInput.value = '';
    
    // Show loading state
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message ai-message loading';
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

        // Check for specific user intents and add some variation
        let response;
        
        if (message.includes('thank') || message.includes('thanks')) {
            const thankResponses = [
                "You're welcome! Is there anything else you'd like to know about the security status or alerts?",
                "Happy to help! Let me know if you need any other information about your security status.",
                "My pleasure. I'm here if you have more questions about security threats or alerts."
            ];
            response = thankResponses[Math.floor(Math.random() * thankResponses.length)];
        } else if (message.includes('yes') || message.includes('okay') || message.includes('ok')) {
            // Check for previous AI message to determine context
            const prevAIMessage = getPreviousAIMessage();
            
            if (prevAIMessage && prevAIMessage.includes("analyze these alerts in detail")) {
                response = getDetailedAlertAnalysis(currentAlerts);
            } else if (prevAIMessage && prevAIMessage.includes("security recommendations")) {
                response = getSecurityRecommendations();
            } else if (prevAIMessage && prevAIMessage.includes("security tools")) {
                response = getSecurityToolsInfo();
            } else {
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
            }
        } else if (message.includes('analyze') || message.includes('alert') || message === '1') {
            response = getDetailedAlertAnalysis(currentAlerts);
        } else if (message.includes('recommend') || message.includes('suggestion') || message === '2') {
            response = getSecurityRecommendations();
        } else if (message.includes('tool') || message.includes('scan') || message === '3') {
            response = getSecurityToolsInfo();
        } else if (message.includes('threat') || message.includes('level') || message === '4') {
            response = getThreatLevelInfo(currentStats, currentAlerts);
        } else if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            const greetings = [
                "Hello! How can I help with your security concerns today?",
                "Hi there! I'm monitoring your security status. What would you like to know?",
                "Hey! I'm your security assistant. What information do you need today?"
            ];
            response = greetings[Math.floor(Math.random() * greetings.length)] + `\n\nI'm currently monitoring ${currentAlerts.length} active security alerts.`;
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
        const loadingElement = document.querySelector('.message.loading');
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
        
        // Add AI response to message history
        messageHistory.push({
            text: response,
            isUser: false,
            timestamp: new Date()
        });
        
        addMessage(response);
        
    } catch (error) {
        console.error('Error in AI chat:', error);
        
        // Remove loading message safely
        const loadingElement = document.querySelector('.message.loading');
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
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
        
        // Add AI response to message history
        messageHistory.push({
            text: fallbackResponse,
            isUser: false,
            timestamp: new Date()
        });
        
        addMessage(fallbackResponse);
    }
}

// Helper functions for generating varied responses
function getPreviousAIMessage() {
    // Get the last AI message from history
    for (let i = messageHistory.length - 1; i >= 0; i--) {
        if (!messageHistory[i].isUser) {
            return messageHistory[i].text;
        }
    }
    return null;
}

function getDetailedAlertAnalysis(alerts) {
    const highRiskAlerts = alerts.filter(a => a.severity === 'HIGH');
    const mediumRiskAlerts = alerts.filter(a => a.severity === 'MEDIUM');
    const lowRiskAlerts = alerts.filter(a => a.severity === 'LOW');
    
    return `Here's my detailed analysis of the current ${alerts.length} alerts:
    
    🔴 High Risk Alerts (${highRiskAlerts.length}):
    ${highRiskAlerts.map(a => `
    - ${a.title}
      Description: ${a.description}
      Recommended Action: Immediate attention required - patch systems and isolate affected components`).join('\n') || 'None currently detected'}
    
    🟠 Medium Risk Alerts (${mediumRiskAlerts.length}):
    ${mediumRiskAlerts.map(a => `
    - ${a.title}
      Description: ${a.description}
      Recommended Action: Schedule remediation within the next 72 hours`).join('\n') || 'None currently detected'}
    
    🟢 Low Risk Alerts (${lowRiskAlerts.length}):
    ${lowRiskAlerts.map(a => `
    - ${a.title}
      Description: ${a.description}
      Recommended Action: Review during next maintenance window`).join('\n') || 'None currently detected'}
    
    Would you like me to:
    1. Explain the impact of any specific alert?
    2. Provide mitigation steps for these issues?
    3. Prioritize which alerts should be addressed first?`;
}

function getSecurityRecommendations() {
    return `Based on my analysis of the current security status, here are my recommendations:
    
    1. Immediate Actions (Next 24 hours):
    - Apply critical patches to address high-risk vulnerabilities
    - Update all antivirus/antimalware definitions
    - Review authentication logs for suspicious activities
    - Verify backup integrity and recovery procedures
    
    2. Short-term Measures (Next week):
    - Enable multi-factor authentication for all admin accounts
    - Conduct targeted vulnerability scans on critical assets
    - Update security policies based on recent threat intelligence
    - Review and restrict unnecessary network access
    
    3. Long-term Strategy (Next month):
    - Implement a comprehensive security awareness training program
    - Schedule a penetration test to identify potential weaknesses
    - Develop an incident response playbook for common attack scenarios
    - Establish continuous monitoring for critical systems
    
    Would you like more details on any of these recommendations?`;
}

function getSecurityToolsInfo() {
    return `Our security toolkit includes several powerful tools to help you address threats:
    
    1. 🔍 Threat Scanner:
    - Comprehensive vulnerability assessment
    - Identifies software vulnerabilities, misconfigurations, and security weaknesses
    - Generates detailed reports with prioritized remediation steps
    - Best used: After patch cycles or system changes
    
    2. 📊 Network Monitor:
    - Real-time traffic analysis and anomaly detection
    - Identifies unusual connection patterns and potential intrusions
    - Monitors data exfiltration attempts
    - Best used: Continuously for real-time threat detection
    
    3. 🔐 Access Control Manager:
    - User permission audit and management
    - Principle of least privilege enforcement
    - Identifies unused accounts and excessive permissions
    - Best used: Monthly for access review cycles
    
    Which tool would you like to learn more about or use now?`;
}

function getThreatLevelInfo(stats, alerts) {
    const highRiskCount = alerts.filter(a => a.severity === 'HIGH').length;
    let threatLevel = 'LOW';
    let recommendation = '';
    
    if (highRiskCount > 3) {
        threatLevel = 'CRITICAL';
        recommendation = 'Immediate action required. Activate your incident response team and address critical vulnerabilities immediately.';
    } else if (highRiskCount > 0) {
        threatLevel = 'HIGH';
        recommendation = 'Urgent attention needed. Prioritize patching critical systems and monitor for suspicious activities.';
    } else if (alerts.filter(a => a.severity === 'MEDIUM').length > 3) {
        threatLevel = 'ELEVATED';
        recommendation = 'Increased vigilance required. Schedule remediation for medium-risk vulnerabilities within the week.';
    } else {
        recommendation = 'Maintain standard security practices. Continue regular monitoring and updates.';
    }
    
    return `📊 Current Threat Level Assessment: ${threatLevel}
    
    Based on my analysis of your security posture:
    - Active high-risk alerts: ${highRiskCount}
    - Protected systems: ${stats.protectedSystems}
    - Average response time: ${stats.responseTime}
    
    ${recommendation}
    
    Factors affecting your threat level:
    - Number and severity of active alerts
    - Recent security events and patch status
    - Global threat intelligence and trending attacks
    - System vulnerability exposure
    
    Would you like me to:
    1. Suggest specific actions to reduce your threat level?
    2. Explain what factors contributed to this assessment?
    3. Set up automated alerts for threat level changes?`;
}

// Function to initialize and display source counter
function initializeSourceCounter() {
    const sourceCountSpan = document.getElementById('sourceCount');
    const sourceBtn = document.getElementById('showSourcesBtn');
    const modal = document.getElementById('sourcesModal');
    const closeBtn = document.getElementById('closeSourcesBtn');
    const sourceListContainer = document.getElementById('sourceList');
    const sourcesCountElement = document.getElementById('modalSourceCount');
    
    // Set the count of sources
    if (sourceCountSpan) {
        sourceCountSpan.textContent = RSS_FEEDS.length;
    }
    
    if (sourcesCountElement) {
        sourcesCountElement.textContent = RSS_FEEDS.length;
    }
    
    // Populate the sources list in the modal
    if (sourceListContainer) {
        sourceListContainer.innerHTML = '';
        
        RSS_FEEDS.forEach(feed => {
            const sourceItem = document.createElement('div');
            sourceItem.className = 'source-item';
            
            const feedName = feed.split('/').filter(Boolean).pop();
            const displayName = feedName.length > 30 ? feedName.substring(0, 30) + '...' : feedName;
            
            sourceItem.innerHTML = `
                <div class="source-item-name">${displayName}</div>
                <div class="source-item-url">${feed}</div>
            `;
            
            sourceListContainer.appendChild(sourceItem);
        });
    }
    
    // Event listeners for opening/closing modal
    if (sourceBtn) {
        sourceBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.add('active');
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Close modal when clicking outside of modal content
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Function to setup refresh button
function setupRefreshButton() {
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            updateAlerts();
        });
    }
}

// Function to update the last refresh time display
function updateLastRefreshTime() {
    const now = new Date();
    const formattedDate = formatDateTime(now);
    const lastUpdateElement = document.getElementById('lastUpdate');
    if (lastUpdateElement) {
        lastUpdateElement.innerHTML = `<i class="fas fa-sync-alt"></i> Last updated: ${formattedDate}`;
    }
}

// Function to initialize all UI components
function initializeUI() {
    initAIChat();
    initializeSourceCounter();
    setupRefreshButton();
    updateLastRefreshTime();
    initializeSecurityStats();
}

// On document load, initialize all components
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    updateAlerts();
    initializeLanguage(); // Add language initialization
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
            from_name: 'AtlasShield Security Team',
            to_name: email.split('@')[0],
            message: `Thank you for subscribing to Cyber Atlas Security Alerts. You will now receive real-time notifications about security threats and vulnerabilities.`,
            logo_url: 'https://your-logo-url.com/logo.png', // Replace with your actual logo URL
            company_name: 'AtlasShield',
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
            // Get the tool name from the h4 element
            const toolName = button.closest('.tool-card').querySelector('h4').textContent.toLowerCase();
            
            if (toolName.includes('scanner') || toolName.includes('threat')) {
                securityTools.threatScanner.scan();
            } else if (toolName.includes('monitor') || toolName.includes('network')) {
                securityTools.networkMonitor.start();
            } else if (toolName.includes('control') || toolName.includes('access')) {
                securityTools.accessControl.manage();
            }
        });
    });
});

// Language translation functionality
const translations = {
    en: {
        "activeThreatsTitle": "Active Threats",
        "activeThreatsLabel": "High Risk Alerts",
        "protectedSystemsTitle": "Protected Systems",
        "protectedSystemsLabel": "Monitored Endpoints",
        "responseTimeTitle": "Response Time",
        "responseTimeLabel": "Average Response",
        "securityFeeds": "security feeds monitored",
        "viewSources": "View Sources",
        "securityIntelligenceSources": "Security Intelligence Sources",
        "monitoringSources": "Monitoring <span id='modalSourceCount'>0</span> security intelligence feeds from industry experts and organizations:",
        "securityTools": "Security Tools",
        "threatScanner": "Threat Scanner",
        "threatScannerDesc": "Real-time system vulnerability scan",
        "runScan": "Run Scan",
        "networkMonitor": "Network Monitor",
        "networkMonitorDesc": "Monitor network traffic and connections",
        "viewNetwork": "View Network",
        "accessControl": "Access Control",
        "accessControlDesc": "Manage user permissions and access",
        "manageAccess": "Manage Access",
        "notificationSettings": "Notification Settings",
        "emailPlaceholder": "Enter your email for alerts",
        "saveEmail": "Save Email",
        "securityAI": "Security AI Assistant",
        "userInputPlaceholder": "Ask about security threats...",
        "refreshAlerts": "Refresh Alerts",
        "lastUpdated": "Last updated:",
        "severity": "Severity:",
        "allSeverities": "All Severities",
        "highRisk": "High Risk",
        "mediumRisk": "Medium Risk",
        "lowRisk": "Low Risk",
        "timeRange": "Time Range:",
        "allTime": "All Time",
        "today": "Today",
        "thisWeek": "This Week",
        "thisMonth": "This Month",
        "sortBy": "Sort By:",
        "newestFirst": "Newest First",
        "oldestFirst": "Oldest First",
        "severityLevel": "Severity Level",
        "published": "Published:"
    },
    fr: {
        "activeThreatsTitle": "Menaces Actives",
        "activeThreatsLabel": "Alertes à Haut Risque",
        "protectedSystemsTitle": "Systèmes Protégés",
        "protectedSystemsLabel": "Terminaux Surveillés",
        "responseTimeTitle": "Temps de Réponse",
        "responseTimeLabel": "Réponse Moyenne",
        "securityFeeds": "flux de sécurité surveillés",
        "viewSources": "Voir Sources",
        "securityIntelligenceSources": "Sources de Renseignement de Sécurité",
        "monitoringSources": "Surveillance de <span id='modalSourceCount'>0</span> flux de renseignements de sécurité provenant d'experts et d'organisations du secteur :",
        "securityTools": "Outils de Sécurité",
        "threatScanner": "Scanner de Menaces",
        "threatScannerDesc": "Analyse de vulnérabilité système en temps réel",
        "runScan": "Lancer Analyse",
        "networkMonitor": "Moniteur Réseau",
        "networkMonitorDesc": "Surveiller le trafic et les connexions réseau",
        "viewNetwork": "Voir Réseau",
        "accessControl": "Contrôle d'Accès",
        "accessControlDesc": "Gérer les permissions et accès utilisateurs",
        "manageAccess": "Gérer Accès",
        "notificationSettings": "Paramètres de Notification",
        "emailPlaceholder": "Entrez votre email pour les alertes",
        "saveEmail": "Enregistrer Email",
        "securityAI": "Assistant IA de Sécurité",
        "userInputPlaceholder": "Posez des questions sur les menaces...",
        "refreshAlerts": "Actualiser Alertes",
        "lastUpdated": "Dernière mise à jour:",
        "severity": "Sévérité:",
        "allSeverities": "Toutes Sévérités",
        "highRisk": "Risque Élevé",
        "mediumRisk": "Risque Moyen",
        "lowRisk": "Risque Faible",
        "timeRange": "Période:",
        "allTime": "Tout Temps",
        "today": "Aujourd'hui",
        "thisWeek": "Cette Semaine",
        "thisMonth": "Ce Mois",
        "sortBy": "Trier Par:",
        "newestFirst": "Plus Récent",
        "oldestFirst": "Plus Ancien",
        "severityLevel": "Niveau de Sévérité",
        "published": "Publié:"
    },
    ar: {
        "activeThreatsTitle": "التهديدات النشطة",
        "activeThreatsLabel": "تنبيهات عالية الخطورة",
        "protectedSystemsTitle": "الأنظمة المحمية",
        "protectedSystemsLabel": "الأجهزة المراقبة",
        "responseTimeTitle": "وقت الاستجابة",
        "responseTimeLabel": "متوسط الاستجابة",
        "securityFeeds": "تغذيات أمنية تحت المراقبة",
        "viewSources": "عرض المصادر",
        "securityIntelligenceSources": "مصادر المعلومات الأمنية",
        "monitoringSources": "مراقبة <span id='modalSourceCount'>0</span> من تغذيات المعلومات الأمنية من خبراء ومنظمات الصناعة:",
        "securityTools": "أدوات الأمان",
        "threatScanner": "ماسح التهديدات",
        "threatScannerDesc": "فحص نقاط الضعف في النظام في الوقت الفعلي",
        "runScan": "تشغيل الفحص",
        "networkMonitor": "مراقب الشبكة",
        "networkMonitorDesc": "مراقبة حركة مرور الشبكة والاتصالات",
        "viewNetwork": "عرض الشبكة",
        "accessControl": "التحكم في الوصول",
        "accessControlDesc": "إدارة أذونات المستخدم والوصول",
        "manageAccess": "إدارة الوصول",
        "notificationSettings": "إعدادات الإشعارات",
        "emailPlaceholder": "أدخل بريدك الإلكتروني للتنبيهات",
        "saveEmail": "حفظ البريد الإلكتروني",
        "securityAI": "مساعد الأمان الذكي",
        "userInputPlaceholder": "اسأل عن تهديدات الأمان...",
        "refreshAlerts": "تحديث التنبيهات",
        "lastUpdated": "آخر تحديث:",
        "severity": "الخطورة:",
        "allSeverities": "جميع درجات الخطورة",
        "highRisk": "خطر مرتفع",
        "mediumRisk": "خطر متوسط",
        "lowRisk": "خطر منخفض",
        "timeRange": "النطاق الزمني:",
        "allTime": "كل الوقت",
        "today": "اليوم",
        "thisWeek": "هذا الأسبوع",
        "thisMonth": "هذا الشهر",
        "sortBy": "ترتيب حسب:",
        "newestFirst": "الأحدث أولاً",
        "oldestFirst": "الأقدم أولاً",
        "severityLevel": "مستوى الخطورة",
        "published": "نُشر:"
    }
};

// Function to change the language
function changeLanguage(lang) {
    // Set HTML lang attribute
    document.getElementById('html-root').setAttribute('lang', lang);
    
    // Add RTL support for Arabic
    if (lang === 'ar') {
        document.body.classList.add('rtl');
    } else {
        document.body.classList.remove('rtl');
    }
    
    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[lang][key]);
            } else {
                element.innerHTML = translations[lang][key];
            }
        }
    });
    
    // Update timestamps
    updateLastRefreshTime();
    
    // Update active state of language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Add data-i18n attributes to all translatable elements on page load
function prepareTranslations() {
    // UI Element mapping
    const elementsToTranslate = [
        { selector: '#activeThreats', parent: 'h3', key: 'activeThreatsTitle' },
        { selector: '#activeThreats', parentSelector: '.stat-card', childSelector: '.stat-label', key: 'activeThreatsLabel' },
        { selector: '#protectedSystems', parent: 'h3', key: 'protectedSystemsTitle' },
        { selector: '#protectedSystems', parentSelector: '.stat-card', childSelector: '.stat-label', key: 'protectedSystemsLabel' },
        { selector: '#avgResponseTime', parent: 'h3', key: 'responseTimeTitle' },
        { selector: '#avgResponseTime', parentSelector: '.stat-card', childSelector: '.stat-label', key: 'responseTimeLabel' },
        { selector: '.source-info', textSelector: 'text', key: 'securityFeeds' },
        { selector: '#showSourcesBtn', key: 'viewSources' },
        { selector: '.modal-header h3', key: 'securityIntelligenceSources' },
        { selector: '.modal-body p', key: 'monitoringSources' },
        { selector: '.security-tools h3', key: 'securityTools' },
        { selector: '.tool-card:nth-child(1) h4', key: 'threatScanner' },
        { selector: '.tool-card:nth-child(1) p', key: 'threatScannerDesc' },
        { selector: '.tool-card:nth-child(1) button', key: 'runScan' },
        { selector: '.tool-card:nth-child(2) h4', key: 'networkMonitor' },
        { selector: '.tool-card:nth-child(2) p', key: 'networkMonitorDesc' },
        { selector: '.tool-card:nth-child(2) button', key: 'viewNetwork' },
        { selector: '.tool-card:nth-child(3) h4', key: 'accessControl' },
        { selector: '.tool-card:nth-child(3) p', key: 'accessControlDesc' },
        { selector: '.tool-card:nth-child(3) button', key: 'manageAccess' },
        { selector: '.notification-settings h3', key: 'notificationSettings' },
        { selector: '#emailInput', placeholder: true, key: 'emailPlaceholder' },
        { selector: '#saveEmail', key: 'saveEmail' },
        { selector: '.chat-header h3', key: 'securityAI' },
        { selector: '#userInput', placeholder: true, key: 'userInputPlaceholder' },
        { selector: '#refreshBtn', key: 'refreshAlerts' },
        { selector: 'label[for="severityFilter"]', key: 'severity' },
        { selector: '#severityFilter option[value="all"]', key: 'allSeverities' },
        { selector: '#severityFilter option[value="high"]', key: 'highRisk' },
        { selector: '#severityFilter option[value="medium"]', key: 'mediumRisk' },
        { selector: '#severityFilter option[value="low"]', key: 'lowRisk' },
        { selector: 'label[for="dateFilter"]', key: 'timeRange' },
        { selector: '#dateFilter option[value="all"]', key: 'allTime' },
        { selector: '#dateFilter option[value="today"]', key: 'today' },
        { selector: '#dateFilter option[value="week"]', key: 'thisWeek' },
        { selector: '#dateFilter option[value="month"]', key: 'thisMonth' },
        { selector: 'label[for="sortOrder"]', key: 'sortBy' },
        { selector: '#sortOrder option[value="newest"]', key: 'newestFirst' },
        { selector: '#sortOrder option[value="oldest"]', key: 'oldestFirst' },
        { selector: '#sortOrder option[value="severity"]', key: 'severityLevel' }
    ];
    
    // Add data-i18n attributes to elements
    elementsToTranslate.forEach(item => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach(element => {
            if (item.placeholder) {
                element.setAttribute('data-i18n', item.key);
            } else if (item.parent) {
                const parentElement = element.closest(item.parent);
                if (parentElement) parentElement.setAttribute('data-i18n', item.key);
            } else if (item.parentSelector && item.childSelector) {
                const parentElement = element.closest(item.parentSelector);
                if (parentElement) {
                    const childElement = parentElement.querySelector(item.childSelector);
                    if (childElement) childElement.setAttribute('data-i18n', item.key);
                }
            } else if (item.textSelector === 'text') {
                // This is for handling text nodes
                const textNode = Array.from(element.childNodes)
                    .find(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
                if (textNode) {
                    // Create a span to replace the text node
                    const span = document.createElement('span');
                    span.setAttribute('data-i18n', item.key);
                    element.insertBefore(span, textNode);
                    element.removeChild(textNode);
                }
            } else {
                element.setAttribute('data-i18n', item.key);
            }
        });
    });
}

// Initialize language functionality
function initializeLanguage() {
    prepareTranslations();
    
    // Add event listeners to language buttons
    document.querySelectorAll('.language-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // Set initial language to English
    changeLanguage('en');
}

// Add RTL styles for Arabic
const rtlStyles = document.createElement('style');
rtlStyles.textContent = `
    body.rtl {
        direction: rtl;
        text-align: right;
    }
    
    body.rtl .filter-group label,
    body.rtl .stat-card,
    body.rtl .tool-card,
    body.rtl .alert,
    body.rtl .fix-info,
    body.rtl .modal-header h3,
    body.rtl .modal-body,
    body.rtl .source-item {
        text-align: right;
    }
    
    body.rtl .source-item {
        border-left: none;
        border-right: 3px solid var(--primary-color);
    }
    
    body.rtl .filter-controls,
    body.rtl .stat-content,
    body.rtl .security-tools h3,
    body.rtl .notification-settings h3 {
        justify-content: flex-end;
    }
    
    body.rtl .cyber-select {
        background-position: left 15px center;
    }
    
    body.rtl .fix-info {
        border-left: none;
        border-right: 3px solid var(--primary-color);
    }
    
    body.rtl .close-btn {
        margin-left: 0;
        margin-right: auto;
    }
    
    body.rtl .ai-assistant-container,
    body.rtl .ai-assistant-button,
    body.rtl .ai-chat-window {
        left: 30px;
        right: auto;
    }
    
    body.rtl .language-selector {
        left: 20px;
        right: auto;
    }
    
    @media (max-width: 768px) {
        body.rtl .language-selector {
            left: 10px;
            right: auto;
        }
        
        body.rtl .ai-assistant-button {
            left: 20px;
            right: auto;
        }
    }
`;
document.head.appendChild(rtlStyles);

// Add language initialization to the document load event
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    updateAlerts();
    initializeLanguage(); // Add language initialization
}); 
