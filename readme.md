# Cyber Awareness Game

## Overview

This is an interactive web-based cybersecurity training game that teaches users about various cyber threats through engaging mini-games. The application features multiple game modules covering different aspects of cybersecurity including phishing detection, password security, social engineering, malware identification, and data privacy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Technology Stack**: Pure HTML5, CSS3, and vanilla JavaScript
- **Design Pattern**: Modular JavaScript classes with utility services
- **UI Framework**: Custom CSS with FontAwesome icons for consistent theming
- **Responsive Design**: Mobile-first approach with flexbox and CSS Grid layouts

### File Organization
- **Main Files**: `index.html`, `styles.css`, `script.js` serve as the landing page and core application
- **Game Modules**: Individual games located in `/games/` directory with paired HTML and JS files
- **Utilities**: Shared services in `/utils/` directory for storage and feedback systems

## Key Components

### Core Game Engine
- **Main Application Class**: `CyberAwarenessGame` manages the overall application state
- **Individual Game Classes**: Each game (phishing, password strength, etc.) has its own dedicated class
- **Utility Services**: `GameStorage` for data persistence and `FeedbackSystem` for user notifications

### Game Modules
1. **Phishing Detective**: Drag-and-drop interface for identifying email threats
2. **Social Engineering Match**: Matching game connecting attack techniques with descriptions
3. **Spot the Danger**: Click-to-find security threats in various interfaces
4. **Password Strength Analyzer**: Interactive password creation and validation
5. **Wi-Fi Security Simulator**: Scenario-based network security decisions
6. **Malware Identification**: File analysis and threat detection
7. **Data Privacy Quiz**: Knowledge-based quiz on privacy regulations

### Shared Components
- **Score Management**: Persistent scoring system across all games
- **Feedback System**: Toast notifications and visual feedback
- **Storage Service**: LocalStorage-based data persistence
- **Timer System**: Game duration tracking and display

## Data Flow

1. **Game Launch**: User selects game from main menu → Individual game initializes
2. **Score Tracking**: Game events → Score updates → Storage service → Display refresh
3. **Progress Persistence**: Game completion → Statistics update → LocalStorage save
4. **Cross-Game Communication**: Storage events trigger display updates across browser tabs

## External Dependencies

- **FontAwesome 6.0.0**: Icon library served via CDN for consistent UI iconography
- **No Backend Required**: Fully client-side application with no server dependencies
- **Browser Storage**: Relies on localStorage for all data persistence

## Deployment Strategy

### Static Hosting Ready
- **No Build Process**: Direct deployment of source files
- **CDN Compatibility**: All assets can be served statically
- **Progressive Enhancement**: Core functionality works without JavaScript

### Browser Requirements
- **Modern Browser Support**: ES6+ features used throughout
- **localStorage Support**: Required for score persistence
- **CSS Grid/Flexbox**: For responsive layouts

### Performance Considerations
- **Lazy Loading**: Games load individually when accessed
- **Minimal Dependencies**: Only one external dependency (FontAwesome)
- **Efficient Storage**: Compact JSON serialization for game data

The application follows a modular architecture where each game is self-contained but shares common utilities and styling. The design prioritizes simplicity, maintainability, and educational effectiveness over complex technical solutions.