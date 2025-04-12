# Security Alerts Monitor

A web application that monitors security-related RSS feeds and displays real-time alerts for new security vulnerabilities and threats.

## Features

- Real-time monitoring of security alerts from multiple sources
- Automatic updates every 5 minutes
- Manual refresh button
- Severity-based alert categorization
- Modern, responsive UI
- Duplicate alert prevention

## Sources

The application currently monitors the following security feeds:
- National Vulnerability Database (NVD) RSS feed
- US-CERT Alerts

## How to Use

1. Open `index.html` in a web browser
2. The page will automatically load and display security alerts
3. Click the "Refresh Alerts" button to manually update the alerts
4. Alerts are automatically refreshed every 5 minutes

## Technical Details

The application uses:
- HTML5
- CSS3
- JavaScript (ES6+)
- RSS2JSON API for feed parsing
- Font Awesome for icons

## Note

This application requires an internet connection to fetch the RSS feeds. The RSS2JSON API is used to bypass CORS restrictions and parse the RSS feeds into JSON format. 