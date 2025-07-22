# Cyber Awareness Game

## Overview

This is an interactive cybersecurity training application featuring three different games designed to teach users about various security threats and best practices. The application is built as a client-side web application using vanilla HTML, CSS, and JavaScript, with local storage for persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Vanilla HTML5, CSS3, and JavaScript (ES6+)
- **Architecture Pattern**: Component-based structure with separate game modules
- **Styling**: Custom CSS with modern features (gradients, flexbox, animations)
- **Icons**: Font Awesome 6.0.0 via CDN
- **Responsive Design**: Mobile-first approach with viewport meta tags

### File Structure
```
/
├── index.html              # Main landing page
├── styles.css              # Global styles
├── script.js               # Main application logic
├── games/                  # Individual game modules
│   ├── phishing-drag-drop.html
│   ├── phishing-drag-drop.js
│   ├── social-engineering-match.html
│   ├── social-engineering-match.js
│   ├── spot-the-danger.html
│   └── spot-the-danger.js
└── utils/                  # Shared utilities
    ├── storage.js          # Local storage management
    └── feedback.js         # User feedback system
```

## Key Components

### 1. Main Application (`script.js`)
- **CyberAwarenessGame Class**: Central application controller
- **Responsibilities**: Statistics management, navigation, display updates
- **Storage Integration**: Loads and updates user progress across sessions

### 2. Game Modules
Each game is self-contained with its own HTML and JavaScript files:

#### Phishing Detective (`phishing-drag-drop.js`)
- **Interaction Pattern**: Drag and drop gameplay
- **Learning Focus**: Email security and phishing identification
- **Mechanics**: Users drag suspicious elements from emails to appropriate zones

#### Social Engineering Match (`social-engineering-match.js`)
- **Interaction Pattern**: Click-to-match gameplay
- **Learning Focus**: Social engineering techniques and definitions
- **Mechanics**: Match attack techniques with their descriptions

#### Spot the Danger (`spot-the-danger.js`)
- **Interaction Pattern**: Click-to-identify gameplay
- **Learning Focus**: Interface security and suspicious elements
- **Mechanics**: Find dangerous elements in simulated interfaces

### 3. Utility Systems

#### Storage System (`storage.js`)
- **Purpose**: Manages all persistent data using localStorage
- **Data Structure**: JSON-based storage with error handling
- **Features**: Statistics tracking, best scores, game history, user settings

#### Feedback System (`feedback.js`)
- **Purpose**: Provides user notifications and feedback
- **Implementation**: Dynamic DOM manipulation for toast-style messages
- **Features**: Message queuing, different notification types, auto-dismiss

## Data Flow

### Application Initialization
1. Main application loads and initializes storage system
2. Statistics are retrieved from localStorage
3. Display is updated with current user progress
4. Event listeners are set up for navigation

### Game Flow
1. User selects a game from the main menu
2. Navigation function redirects to specific game HTML
3. Game-specific JavaScript loads and initializes
4. Game state is managed independently
5. Scores and progress are saved to localStorage
6. Feedback system provides real-time user guidance

### Data Persistence
- All data is stored locally using browser localStorage
- No server-side database or external storage required
- Data includes: scores, completion statistics, game history, settings

## External Dependencies

### CDN Dependencies
- **Font Awesome 6.0.0**: Icon library for UI elements
- **URL**: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css`

### Browser APIs
- **localStorage**: For data persistence
- **DOM Events**: For user interactions and navigation
- **CSS3 Features**: Gradients, animations, flexbox, transforms

## Deployment Strategy

### Current Architecture
- **Static Files**: All files are client-side static assets
- **No Build Process**: Direct deployment of source files
- **No Server Requirements**: Can be hosted on any static file server

### Hosting Options
- Static hosting services (Netlify, Vercel, GitHub Pages)
- CDN deployment
- Simple web server (Apache, Nginx)

### Browser Compatibility
- Modern browsers with ES6+ support
- localStorage API support required
- CSS3 features may degrade gracefully on older browsers

### Future Considerations
- Could be enhanced with a backend for user accounts and progress sync
- Progressive Web App (PWA) features could be added
- Analytics integration for learning effectiveness tracking