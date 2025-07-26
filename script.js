// Main application script
class CyberAwarenessGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.init();
    }

    init() {
        this.loadStats();
        this.setupEventListeners();
        this.updateDisplay();
        this.initializeAnimations();
    }

    loadStats() {
        this.stats = this.storage.getStats();
    }

    updateDisplay() {
        // Update main statistics
        document.getElementById('totalScore').textContent = this.stats.totalScore;
        document.getElementById('gamesCompleted').textContent = this.stats.gamesCompleted;
        
        // Update best scores for each game
        document.getElementById('phishingBest').textContent = this.stats.bestScores.phishing;
        document.getElementById('matchingBest').textContent = this.stats.bestScores.matching;
        document.getElementById('spotBest').textContent = this.stats.bestScores.spotDanger;
        document.getElementById('passwordBest').textContent = this.stats.bestScores.passwordStrength;
        document.getElementById('wifiBest').textContent = this.stats.bestScores.wifiSecurity;
        document.getElementById('malwareBest').textContent = this.stats.bestScores.malwareIdentification;
        document.getElementById('privacyBest').textContent = this.stats.bestScores.dataPrivacyQuiz;
    }

    setupEventListeners() {
        // Listen for storage changes from other tabs/windows
        window.addEventListener('storage', () => {
            this.loadStats();
            this.updateDisplay();
        });

        // Add click events to game cards for better interaction
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach(card => {
            const playBtn = card.querySelector('.play-btn');
            
            card.addEventListener('click', (e) => {
                if (e.target === playBtn || playBtn.contains(e.target)) {
                    return; // Let the button handle its own click
                }
                
                const gameType = card.dataset.game;
                if (gameType) {
                    startGame(gameType);
                }
            });

            // Add keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const gameType = card.dataset.game;
                    if (gameType) {
                        startGame(gameType);
                    }
                }
            });

            // Make cards focusable
            card.setAttribute('tabindex', '0');
        });
    }

    initializeAnimations() {
        // Add loading animation to game cards
        const gameCards = document.querySelectorAll('.game-card');
        gameCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';

            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Add scroll animations for tips section
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        const tipCards = document.querySelectorAll('.tip-card');
        tipCards.forEach(card => observer.observe(card));
    }
}

// Game navigation functions
function startGame(gameType) {
    const gameUrls = {
        'phishing': './games/phishing-drag-drop.html',
        'matching': './games/social-engineering-match.html',
        'spot-danger': './games/spot-the-danger.html',
        'password-strength': './games/password-strength.html',
        'wifi-security': './games/wifi-security.html',
        'malware-identification': './games/malware-identification.html',
        'data-privacy-quiz': './games/data-privacy-quiz.html'
    };

    if (gameUrls[gameType]) {
        // Add loading effect
        const card = document.querySelector(`[data-game="${gameType}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                window.location.href = gameUrls[gameType];
            }, 150);
        } else {
            window.location.href = gameUrls[gameType];
        }
    } else {
        console.error('Unknown game type:', gameType);
    }
}

// Animation utilities
function animateScore(element, newScore) {
    const currentScore = parseInt(element.textContent) || 0;
    const increment = Math.ceil((newScore - currentScore) / 20);

    function updateScore() {
        const current = parseInt(element.textContent) || 0;
        if (current < newScore) {
            element.textContent = Math.min(current + increment, newScore);
            requestAnimationFrame(updateScore);
        }
    }

    updateScore();
}

// Utility functions
function formatScore(score) {
    return score.toLocaleString();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const game = new CyberAwarenessGame();

    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            console.log(`Application loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    // Add error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        // Could send to analytics service here
    });

    // Add visibility change handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Save state when tab becomes hidden
            game.storage.saveStats(game.stats);
        } else {
            // Refresh stats when tab becomes visible
            game.loadStats();
            game.updateDisplay();
        }
    });
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CyberAwarenessGame, startGame, animateScore };
}
