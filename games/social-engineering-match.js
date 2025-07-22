class SocialEngineeringMatch {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentLevel = 1;
        this.score = 0;
        this.maxLevel = 3;
        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.matchedPairs = [];
        this.levels = this.generateLevels();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLevel();
        this.updateDisplay();
    }

    generateLevels() {
        return [
            {
                level: 1,
                title: "Basic Social Engineering Techniques",
                pairs: [
                    {
                        technique: "Phishing",
                        description: "Fraudulent emails designed to steal personal information"
                    },
                    {
                        technique: "Pretexting",
                        description: "Creating fake scenarios to gain trust and extract information"
                    },
                    {
                        technique: "Baiting",
                        description: "Offering something enticing to trigger malicious actions"
                    },
                    {
                        technique: "Tailgating",
                        description: "Following someone into a restricted area without authorization"
                    },
                    {
                        technique: "Scareware",
                        description: "Fake warnings about malware to trick users into downloading malicious software"
                    }
                ]
            },
            {
                level: 2,
                title: "Advanced Attack Methods",
                pairs: [
                    {
                        technique: "Spear Phishing",
                        description: "Targeted phishing attacks against specific individuals or organizations"
                    },
                    {
                        technique: "CEO Fraud",
                        description: "Impersonating executives to authorize fraudulent transactions"
                    },
                    {
                        technique: "Quid Pro Quo",
                        description: "Offering a service or benefit in exchange for information or access"
                    },
                    {
                        technique: "Watering Hole",
                        description: "Compromising websites frequently visited by the target audience"
                    },
                    {
                        technique: "Social Media Mining",
                        description: "Gathering personal information from social platforms for targeted attacks"
                    }
                ]
            },
            {
                level: 3,
                title: "Psychological Manipulation Tactics",
                pairs: [
                    {
                        technique: "Authority",
                        description: "Pretending to be someone in a position of power to gain compliance"
                    },
                    {
                        technique: "Urgency",
                        description: "Creating false time pressure to bypass normal security procedures"
                    },
                    {
                        technique: "Social Proof",
                        description: "Claiming others have already complied to encourage similar behavior"
                    },
                    {
                        technique: "Fear Mongering",
                        description: "Using threats and scary consequences to motivate immediate action"
                    },
                    {
                        technique: "Reciprocity",
                        description: "Doing small favors to create obligation and willingness to help"
                    }
                ]
            }
        ];
    }

    loadLevel() {
        const level = this.levels.find(l => l.level === this.currentLevel);
        if (!level) return;

        document.querySelector('h1').innerHTML = `<i class="fas fa-user-secret"></i> ${level.title}`;
        
        const techniques = level.pairs.map(p => p.technique);
        const descriptions = level.pairs.map(p => p.description);
        
        // Shuffle arrays to make matching more challenging
        this.shuffleArray(techniques);
        this.shuffleArray(descriptions);
        
        this.populateColumn('techniquesColumn', techniques, 'technique');
        this.populateColumn('descriptionsColumn', descriptions, 'description');
        
        this.matchedPairs = [];
        this.updateMatchCount();
        this.updateProgress();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    populateColumn(columnId, items, type) {
        const column = document.getElementById(columnId);
        column.innerHTML = '';
        
        items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'matching-item';
            itemElement.dataset.type = type;
            itemElement.dataset.content = item;
            itemElement.textContent = item;
            itemElement.addEventListener('click', () => this.selectItem(itemElement, type));
            column.appendChild(itemElement);
        });
    }

    selectItem(element, type) {
        // If already matched, do nothing
        if (element.classList.contains('matched')) return;

        if (type === 'technique') {
            // Clear previous selection
            if (this.selectedTechnique) {
                this.selectedTechnique.classList.remove('selected');
            }
            this.selectedTechnique = element;
            element.classList.add('selected');
        } else {
            // Clear previous selection
            if (this.selectedDescription) {
                this.selectedDescription.classList.remove('selected');
            }
            this.selectedDescription = element;
            element.classList.add('selected');
        }

        // Check if we have both selections
        if (this.selectedTechnique && this.selectedDescription) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const technique = this.selectedTechnique.dataset.content;
        const description = this.selectedDescription.dataset.content;
        
        const level = this.levels.find(l => l.level === this.currentLevel);
        const correctPair = level.pairs.find(p => p.technique === technique && p.description === description);
        
        if (correctPair) {
            // Correct match
            this.selectedTechnique.classList.remove('selected');
            this.selectedDescription.classList.remove('selected');
            this.selectedTechnique.classList.add('matched');
            this.selectedDescription.classList.add('matched');
            
            this.matchedPairs.push(correctPair);
            this.score += 20;
            
            this.feedback.show('Correct match!', 'success');
            this.updateMatchCount();
            
            if (this.matchedPairs.length === level.pairs.length) {
                setTimeout(() => this.levelComplete(), 1000);
            }
        } else {
            // Incorrect match
            this.selectedTechnique.classList.remove('selected');
            this.selectedDescription.classList.remove('selected');
            this.selectedTechnique.classList.add('incorrect');
            this.selectedDescription.classList.add('incorrect');
            
            this.score = Math.max(0, this.score - 5);
            this.feedback.show('Incorrect match. Try again!', 'error');
            
            setTimeout(() => {
                this.selectedTechnique.classList.remove('incorrect');
                this.selectedDescription.classList.remove('incorrect');
            }, 1000);
        }
        
        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.updateDisplay();
    }

    levelComplete() {
        this.feedback.show(`Level ${this.currentLevel} completed!`, 'success');
        document.getElementById('nextLevel').style.display = 'block';
        
        // Bonus points for completing the level
        this.score += 50;
        this.updateDisplay();
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.loadLevel();
            document.getElementById('nextLevel').style.display = 'none';
            this.updateDisplay();
        } else {
            this.completeGame();
        }
    }

    resetLevel() {
        this.selectedTechnique = null;
        this.selectedDescription = null;
        this.matchedPairs = [];
        this.loadLevel();
        this.updateDisplay();
    }

    completeGame() {
        const stats = this.storage.getStats();
        const newBest = Math.max(stats.bestScores.matching, this.score);
        
        this.storage.updateScore('matching', this.score, newBest);
        this.feedback.show(`Game completed! Final score: ${this.score}`, 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateMatchCount() {
        const level = this.levels.find(l => l.level === this.currentLevel);
        document.getElementById('matchCount').textContent = this.matchedPairs.length;
        document.getElementById('totalMatches').textContent = level.pairs.length;
    }

    updateProgress() {
        const level = this.levels.find(l => l.level === this.currentLevel);
        const progress = this.matchedPairs.length / level.pairs.length * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }

    setupEventListeners() {
        document.getElementById('resetLevel').addEventListener('click', () => this.resetLevel());
        document.getElementById('nextLevel').addEventListener('click', () => this.nextLevel());
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SocialEngineeringMatch();
});
