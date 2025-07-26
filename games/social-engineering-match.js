// Social Engineering Matching Game
class SocialEngineeringGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.matches = new Map();
        this.correctMatches = 0;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMatchingItems();
        this.updateDisplay();
        this.feedback.gameStarted('Social Engineering Match');
    }

    setupEventListeners() {
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });

        // Check answers button
        document.getElementById('checkAnswers').addEventListener('click', () => {
            this.checkAllAnswers();
        });

        // Reset game button
        document.getElementById('resetGame').addEventListener('click', () => {
            this.resetGame();
        });
    }

    loadMatchingItems() {
        const matchingData = this.getMatchingData();
        
        // Shuffle the arrays for randomization
        const shuffledTechniques = this.shuffleArray([...matchingData.techniques]);
        const shuffledDescriptions = this.shuffleArray([...matchingData.descriptions]);

        this.renderColumn('techniquesColumn', shuffledTechniques, 'technique');
        this.renderColumn('descriptionsColumn', shuffledDescriptions, 'description');
    }

    getMatchingData() {
        return {
            techniques: [
                { id: 'phishing', text: 'Phishing', description: 'Fraudulent emails designed to steal credentials or install malware' },
                { id: 'pretexting', text: 'Pretexting', description: 'Creating false scenarios to gain trust and extract information' },
                { id: 'baiting', text: 'Baiting', description: 'Offering something enticing to trigger malicious downloads or actions' },
                { id: 'tailgating', text: 'Tailgating', description: 'Following authorized personnel into secure areas without permission' },
                { id: 'quid-pro-quo', text: 'Quid Pro Quo', description: 'Offering services in exchange for information or access' },
                { id: 'spear-phishing', text: 'Spear Phishing', description: 'Highly targeted phishing attacks aimed at specific individuals' },
                { id: 'scareware', text: 'Scareware', description: 'False warnings about computer infections to trick users into downloading malware' },
                { id: 'watering-hole', text: 'Watering Hole', description: 'Compromising websites frequently visited by target organizations' }
            ],
            descriptions: [
                { id: 'phishing', text: 'Fraudulent emails designed to steal credentials or install malware' },
                { id: 'pretexting', text: 'Creating false scenarios to gain trust and extract information' },
                { id: 'baiting', text: 'Offering something enticing to trigger malicious downloads or actions' },
                { id: 'tailgating', text: 'Following authorized personnel into secure areas without permission' },
                { id: 'quid-pro-quo', text: 'Offering services in exchange for information or access' },
                { id: 'spear-phishing', text: 'Highly targeted phishing attacks aimed at specific individuals' },
                { id: 'scareware', text: 'False warnings about computer infections to trick users into downloading malware' },
                { id: 'watering-hole', text: 'Compromising websites frequently visited by target organizations' }
            ]
        };
    }

    renderColumn(columnId, items, type) {
        const column = document.getElementById(columnId);
        column.innerHTML = '';

        items.forEach(item => {
            const element = document.createElement('div');
            element.className = 'matching-item';
            element.dataset.id = item.id;
            element.dataset.type = type;
            element.textContent = type === 'technique' ? item.text : item.text;
            
            element.addEventListener('click', () => {
                this.selectItem(element, type);
            });

            column.appendChild(element);
        });
    }

    selectItem(element, type) {
        if (element.classList.contains('matched')) {
            return; // Already matched
        }

        // Clear previous selections of the same type
        if (type === 'technique') {
            if (this.selectedTechnique) {
                this.selectedTechnique.classList.remove('selected');
            }
            this.selectedTechnique = element;
        } else {
            if (this.selectedDescription) {
                this.selectedDescription.classList.remove('selected');
            }
            this.selectedDescription = element;
        }

        element.classList.add('selected');

        // Check if we have both selections
        if (this.selectedTechnique && this.selectedDescription) {
            this.attemptMatch();
        }
    }

    attemptMatch() {
        const techniqueId = this.selectedTechnique.dataset.id;
        const descriptionId = this.selectedDescription.dataset.id;

        if (techniqueId === descriptionId) {
            // Correct match
            this.selectedTechnique.classList.remove('selected');
            this.selectedDescription.classList.remove('selected');
            this.selectedTechnique.classList.add('matched');
            this.selectedDescription.classList.add('matched');

            this.matches.set(techniqueId, descriptionId);
            this.correctMatches++;
            this.score += 100;

            this.feedback.correctAnswer('Perfect match!');
            
            // Check if all matches are complete
            if (this.correctMatches >= 8) {
                setTimeout(() => this.gameComplete(), 1000);
            }
        } else {
            // Incorrect match
            this.selectedTechnique.classList.add('incorrect');
            this.selectedDescription.classList.add('incorrect');

            this.feedback.incorrectAnswer('Not a match. Try again!');

            setTimeout(() => {
                this.selectedTechnique.classList.remove('selected', 'incorrect');
                this.selectedDescription.classList.remove('selected', 'incorrect');
            }, 1000);
        }

        // Clear selections
        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.updateDisplay();
    }

    checkAllAnswers() {
        let score = 0;
        const totalPossible = 8;

        // Visual feedback for all items
        document.querySelectorAll('.matching-item').forEach(item => {
            if (item.classList.contains('matched')) {
                score += 100;
            }
        });

        const percentage = (this.correctMatches / totalPossible) * 100;
        
        if (percentage === 100) {
            this.feedback.success('Perfect! All matches are correct!');
        } else if (percentage >= 75) {
            this.feedback.success(`Great job! ${this.correctMatches}/${totalPossible} correct matches.`);
        } else if (percentage >= 50) {
            this.feedback.warning(`Good effort! ${this.correctMatches}/${totalPossible} correct matches.`);
        } else {
            this.feedback.warning(`Keep trying! ${this.correctMatches}/${totalPossible} correct matches.`);
        }

        if (this.correctMatches >= 8) {
            setTimeout(() => this.gameComplete(), 2000);
        }
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        const hints = [
            "Phishing involves fraudulent emails trying to steal your information.",
            "Pretexting is when attackers create fake scenarios to gain your trust.",
            "Baiting offers something tempting to trick you into dangerous actions.",
            "Tailgating is when someone follows you into a secure area without permission.",
            "Quid Pro Quo attacks offer help in exchange for information or access.",
            "Spear Phishing targets specific individuals with personalized attacks.",
            "Scareware shows fake warnings to trick you into downloading malware.",
            "Watering Hole attacks compromise websites that targets frequently visit."
        ];

        this.hintsLeft--;
        const randomHint = hints[Math.floor(Math.random() * hints.length)];
        
        this.feedback.hintUsed(this.hintsLeft);
        
        setTimeout(() => {
            this.feedback.info(randomHint, {
                title: '💡 Hint',
                duration: 6000
            });
        }, 500);

        this.updateDisplay();
    }

    resetGame() {
        // Clear all selections and matches
        document.querySelectorAll('.matching-item').forEach(item => {
            item.classList.remove('selected', 'matched', 'incorrect');
        });

        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.matches.clear();
        this.correctMatches = 0;
        this.score = 0;
        this.startTime = Date.now();

        // Reload matching items with new shuffle
        this.loadMatchingItems();
        this.updateDisplay();

        this.feedback.info('Game reset! Try to match all techniques with their descriptions.');
    }

    gameComplete() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Bonus points for speed
        const timeBonus = Math.max(0, 300 - finalTime) * 2; // 2 points per second under 5 minutes
        this.score += timeBonus;

        const stats = this.storage.updateGameScore('matching', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.matching, 'Social Engineering Match');
        
        setTimeout(() => {
            const timeString = `${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}`;
            alert(`Congratulations!\n\nAll matches completed!\nFinal Score: ${this.score}\nTime: ${timeString}\n\nYou've mastered social engineering awareness!`);
            window.location.href = '../index.html';
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('matchCount').textContent = this.correctMatches;
        document.getElementById('hintsLeft').textContent = this.hintsLeft;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SocialEngineeringGame();
});
