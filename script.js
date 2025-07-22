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
    }

    loadStats() {
        this.stats = this.storage.getStats();
    }

    updateDisplay() {
        document.getElementById('totalScore').textContent = this.stats.totalScore;
        document.getElementById('gamesCompleted').textContent = this.stats.gamesCompleted;
        document.getElementById('phishingBest').textContent = this.stats.bestScores.phishing;
        document.getElementById('matchingBest').textContent = this.stats.bestScores.matching;
        document.getElementById('spotBest').textContent = this.stats.bestScores.spotDanger;
    }

    setupEventListeners() {
        // Add any global event listeners here
        window.addEventListener('storage', () => {
            this.loadStats();
            this.updateDisplay();
        });
    }
}

// Game navigation functions
function startGame(gameType) {
    const gameUrls = {
        'phishing': './games/phishing-drag-drop.html',
        'matching': './games/social-engineering-match.html',
        'spot-danger': './games/spot-the-danger.html'
    };
    
    if (gameUrls[gameType]) {
        window.location.href = gameUrls[gameType];
    }
}

// Animation utilities
function animateScore(element, newScore) {
    const currentScore = parseInt(element.textContent);
    const increment = Math.ceil((newScore - currentScore) / 20);
    
    function updateScore() {
        const current = parseInt(element.textContent);
        if (current < newScore) {
            element.textContent = Math.min(current + increment, newScore);
            requestAnimationFrame(updateScore);
        }
    }
    
    updateScore();
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
});
