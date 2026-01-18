# VORTIX AI Payment Assistant - Chrome Extension

This is the standalone VORTIX AI Agent implemented as a Chrome Extension. It helps users optimize their payment routes and monitor bank balances in real-time on checkout pages.

## Hackathon Submission Highlights
- **AI-Powered Recommendation**: Analyzes network traffic and bank success rates to suggest the best card.
- **Universal Injection**: Works on any checkout page (configured for `localhost` and `paypal.com` demo sites).
- **Extension UI**: Built with a right-docked sidebar, glassmorphism design, and real-time scanning animations.

## How to Load & Test
1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked**.
5. Select the `vortix-plugin` folder from this project directory.
6. Navigate to `http://localhost:4201/checkout` (or any site with 'checkout' in the URL).
7. Look for the floating **VORTIX** button on the bottom right to trigger the assistant.

## Features implemented
- `manifest.json`: Version 3 architecture.
- `content.js`: Shadow DOM injection for absolute style isolation.
- `styles.css`: Premium cyber-themed UI.
- `popup.html`: Extension status dashboard.
