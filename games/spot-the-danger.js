class SpotTheDangerGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentLevel = 1;
        this.score = 0;
        this.maxLevel = 4;
        this.foundDangers = [];
        this.wrongClicks = 0;
        this.maxWrongClicks = 3;
        this.interfaces = this.generateInterfaces();
        this.init();
    }

    init() {
        console.log('Initializing Spot the Danger game...');
        this.setupEventListeners();
        this.loadLevel();
        this.updateDisplay();
        console.log('Game initialized. Current level:', this.currentLevel);
    }

    generateInterfaces() {
        return [
            {
                level: 1,
                title: "Suspicious Email Inbox",
                description: "Find the dangerous elements in this email interface",
                content: `
                    <div class="email-interface">
                        <div class="email-header-bar">
                            <span>📧 Email - Inbox</span>
                            <div class="email-controls">
                                <button class="danger-element" data-hint="Suspicious download button">📥 Download All Attachments</button>
                            </div>
                        </div>
                        <div class="email-list">
                            <div class="email-item safe">
                                <span class="sender">mom@family.com</span>
                                <span class="subject">Happy Birthday!</span>
                                <span class="time">2:30 PM</span>
                            </div>
                            <div class="email-item danger-element" data-hint="Suspicious sender and urgent subject">
                                <span class="sender">urgent@b4nk-security.com</span>
                                <span class="subject">🚨 URGENT: Verify Account NOW</span>
                                <span class="time">11:45 AM</span>
                            </div>
                            <div class="email-item safe">
                                <span class="sender">newsletter@company.com</span>
                                <span class="subject">Weekly Updates</span>
                                <span class="time">9:15 AM</span>
                            </div>
                            <div class="email-item danger-element" data-hint="Suspicious attachment and sender">
                                <span class="sender">winner@lottery.biz</span>
                                <span class="subject">🎉 You Won $10,000! 📎</span>
                                <span class="time">Yesterday</span>
                            </div>
                        </div>
                    </div>
                `,
                dangerCount: 3
            },
            {
                level: 2,
                title: "File System Explorer",
                description: "Identify suspicious files and folders",
                content: `
                    <div class="file-explorer">
                        <div class="explorer-header">
                            <span>📁 File Explorer - Downloads</span>
                        </div>
                        <div class="file-list">
                            <div class="file-item safe">
                                <span class="file-icon">📄</span>
                                <span class="file-name">resume.pdf</span>
                                <span class="file-size">1.2 MB</span>
                            </div>
                            <div class="file-item danger-element" data-hint="Executable file disguised as document">
                                <span class="file-icon">📄</span>
                                <span class="file-name">invoice.pdf.exe</span>
                                <span class="file-size">15.8 MB</span>
                            </div>
                            <div class="file-item safe">
                                <span class="file-icon">📊</span>
                                <span class="file-name">report.xlsx</span>
                                <span class="file-size">890 KB</span>
                            </div>
                            <div class="file-item danger-element" data-hint="Suspicious software from unknown source">
                                <span class="file-icon">⚙️</span>
                                <span class="file-name">SystemCleaner.exe</span>
                                <span class="file-size">45.2 MB</span>
                            </div>
                            <div class="file-item danger-element" data-hint="Hidden file with suspicious extension">
                                <span class="file-icon">❓</span>
                                <span class="file-name">.hidden_virus.bat</span>
                                <span class="file-size">2 KB</span>
                            </div>
                            <div class="file-item safe">
                                <span class="file-icon">🖼️</span>
                                <span class="file-name">vacation.jpg</span>
                                <span class="file-size">3.4 MB</span>
                            </div>
                        </div>
                    </div>
                `,
                dangerCount: 3
            },
            {
                level: 3,
                title: "Social Media Profile",
                description: "Spot privacy and security issues on this profile",
                content: `
                    <div class="social-media">
                        <div class="profile-header">
                            <div class="profile-info">
                                <h3>John Smith</h3>
                                <p class="danger-element" data-hint="Publicly sharing location">📍 Currently at: Home - 123 Main St, Anytown</p>
                            </div>
                            <div class="privacy-settings danger-element" data-hint="Public profile with sensitive info">
                                🌍 Public Profile
                            </div>
                        </div>
                        <div class="posts">
                            <div class="post safe">
                                <p>Had a great dinner with friends! 🍕</p>
                                <span class="post-time">2 hours ago</span>
                            </div>
                            <div class="post danger-element" data-hint="Sharing too much personal info">
                                <p>Just got my new credit card! Number ends in 1234, so excited! 💳</p>
                                <span class="post-time">4 hours ago</span>
                            </div>
                            <div class="post safe">
                                <p>Beautiful sunset today 🌅</p>
                                <span class="post-time">1 day ago</span>
                            </div>
                            <div class="post danger-element" data-hint="Announcing absence from home">
                                <p>Going on vacation for 2 weeks! House will be empty, can't wait! ✈️</p>
                                <span class="post-time">2 days ago</span>
                            </div>
                        </div>
                    </div>
                `,
                dangerCount: 4
            },
            {
                level: 4,
                title: "Corporate Network Dashboard",
                description: "Find security vulnerabilities in this network interface",
                content: `
                    <div class="network-dashboard">
                        <div class="dashboard-header">
                            <h3>Network Security Dashboard</h3>
                            <div class="user-info danger-element" data-hint="Admin logged in without MFA">
                                👤 admin (No 2FA) - Full Access
                            </div>
                        </div>
                        <div class="network-stats">
                            <div class="stat-box safe">
                                <h4>Active Users</h4>
                                <span class="stat-number">247</span>
                            </div>
                            <div class="stat-box danger-element" data-hint="Suspicious login activity">
                                <h4>Failed Logins</h4>
                                <span class="stat-number">1,847</span>
                            </div>
                            <div class="stat-box safe">
                                <h4>Uptime</h4>
                                <span class="stat-number">99.9%</span>
                            </div>
                        </div>
                        <div class="connections">
                            <h4>Recent Connections</h4>
                            <div class="connection safe">
                                <span>192.168.1.100 - Employee Laptop</span>
                            </div>
                            <div class="connection danger-element" data-hint="Connection from suspicious location">
                                <span>103.45.67.89 - Unknown (Russia) - Admin Access</span>
                            </div>
                            <div class="connection safe">
                                <span>192.168.1.50 - Conference Room</span>
                            </div>
                            <div class="connection danger-element" data-hint="Unencrypted connection">
                                <span>10.0.0.15 - File Server (HTTP - No SSL)</span>
                            </div>
                        </div>
                    </div>
                `,
                dangerCount: 4
            }
        ];
    }

    loadLevel() {
        const interface = this.interfaces.find(i => i.level === this.currentLevel);
        if (!interface) {
            console.error('Interface not found for level:', this.currentLevel);
            return;
        }

        // Update UI elements
        const titleElement = document.querySelector('h1');
        const instructionsElement = document.querySelector('.game-instructions');
        const interfaceElement = document.getElementById('dangerInterface');
        
        if (titleElement) {
            titleElement.innerHTML = `<i class="fas fa-search"></i> ${interface.title}`;
        }
        if (instructionsElement) {
            instructionsElement.textContent = interface.description;
        }
        if (interfaceElement) {
            interfaceElement.innerHTML = interface.content;
        }
        
        this.foundDangers = [];
        this.wrongClicks = 0;
        
        // Wait a moment for DOM to update before setting up handlers
        setTimeout(() => {
            this.setupClickHandlers();
            this.updateFoundCount();
            this.updateProgress();
        }, 100);
    }

    setupClickHandlers() {
        const dangerElements = document.querySelectorAll('.danger-element');
        const safeElements = document.querySelectorAll('.safe, .email-interface, .file-explorer, .social-media, .network-dashboard');
        
        // Add click handlers to danger elements
        dangerElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleDangerClick(element);
            });
        });

        // Add click handlers to safe elements (to penalize incorrect clicks)
        safeElements.forEach(element => {
            element.addEventListener('click', (e) => {
                // Don't penalize clicks on already found dangers or other interactive elements
                if (!e.target.classList.contains('danger-element') && 
                    !e.target.classList.contains('found') &&
                    !e.target.closest('.danger-element')) {
                    this.handleSafeClick(element);
                }
            });
        });
    }

    handleDangerClick(element) {
        if (element.classList.contains('found')) return;

        element.classList.add('found');
        this.foundDangers.push(element);
        this.score += 25;
        
        this.feedback.show('Danger spotted! +25 points', 'success');
        this.updateDisplay();
        this.updateFoundCount();
        this.updateProgress();

        const interface = this.interfaces.find(i => i.level === this.currentLevel);
        if (this.foundDangers.length === interface.dangerCount) {
            setTimeout(() => this.levelComplete(), 1000);
        }
    }

    handleSafeClick(element) {
        this.wrongClicks++;
        this.score = Math.max(0, this.score - 5);
        
        element.classList.add('wrong');
        setTimeout(() => element.classList.remove('wrong'), 500);
        
        this.feedback.show(`Wrong! -5 points (${this.wrongClicks}/${this.maxWrongClicks} mistakes)`, 'error');
        this.updateDisplay();

        if (this.wrongClicks >= this.maxWrongClicks) {
            this.feedback.show('Too many mistakes! Level failed.', 'error');
            setTimeout(() => this.resetLevel(), 2000);
        }
    }

    getHint() {
        const interface = this.interfaces.find(i => i.level === this.currentLevel);
        if (!interface) {
            this.feedback.show('Please wait for the level to load!', 'warning');
            return;
        }

        const unFoundDangers = document.querySelectorAll('.danger-element:not(.found)');
        
        if (unFoundDangers.length === 0) {
            this.feedback.show('All dangers have been found!', 'info');
            return;
        }

        const randomDanger = unFoundDangers[Math.floor(Math.random() * unFoundDangers.length)];
        const hint = randomDanger.dataset.hint || 'Look for something suspicious here!';
        
        // Temporarily highlight the element
        randomDanger.style.border = '3px dashed #ffe66d';
        randomDanger.style.boxShadow = '0 0 15px rgba(255, 230, 109, 0.5)';
        randomDanger.style.animation = 'pulse 1s ease-in-out 3';
        
        setTimeout(() => {
            randomDanger.style.border = '';
            randomDanger.style.boxShadow = '';
            randomDanger.style.animation = '';
        }, 4000);
        
        this.feedback.show(`Hint: ${hint}`, 'info');
        this.score = Math.max(0, this.score - 10); // Penalty for using hint
        this.updateDisplay();
    }

    levelComplete() {
        const bonusPoints = Math.max(0, (this.maxWrongClicks - this.wrongClicks) * 10);
        this.score += bonusPoints + 50; // Completion bonus
        
        this.feedback.show(`Level ${this.currentLevel} completed! Bonus: +${bonusPoints + 50} points`, 'success');
        document.getElementById('nextLevel').style.display = 'block';
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
        this.foundDangers = [];
        this.wrongClicks = 0;
        this.loadLevel();
        this.updateDisplay();
    }

    completeGame() {
        const stats = this.storage.getStats();
        const newBest = Math.max(stats.bestScores.spotDanger, this.score);
        
        this.storage.updateScore('spotDanger', this.score, newBest);
        this.feedback.show(`Game completed! Final score: ${this.score}`, 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateFoundCount() {
        const interface = this.interfaces.find(i => i.level === this.currentLevel);
        document.getElementById('foundCount').textContent = this.foundDangers.length;
        document.getElementById('totalDangers').textContent = interface.dangerCount;
    }

    updateProgress() {
        const interface = this.interfaces.find(i => i.level === this.currentLevel);
        const progress = this.foundDangers.length / interface.dangerCount * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }

    setupEventListeners() {
        const hintButton = document.getElementById('hintButton');
        const nextLevelButton = document.getElementById('nextLevel');
        
        if (hintButton) {
            hintButton.addEventListener('click', () => {
                console.log('Hint button clicked');
                this.getHint();
            });
        } else {
            console.error('Hint button not found!');
        }
        
        if (nextLevelButton) {
            nextLevelButton.addEventListener('click', () => this.nextLevel());
        }
    }
}

// Additional CSS for this game
const gameStyles = `
.email-interface, .file-explorer, .social-media, .network-dashboard {
    background: #2a2a2a;
    border-radius: 8px;
    padding: 20px;
    margin: 10px 0;
}

.email-header-bar, .explorer-header, .dashboard-header {
    background: #1a1a1a;
    padding: 10px 15px;
    border-radius: 5px;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.email-item, .file-item, .post, .connection {
    display: flex;
    padding: 12px 15px;
    margin: 5px 0;
    background: rgba(255,255,255,0.05);
    border-radius: 5px;
    transition: all 0.3s ease;
    cursor: pointer;
}

.email-item:hover, .file-item:hover, .post:hover, .connection:hover {
    background: rgba(255,255,255,0.1);
}

.sender, .file-name {
    flex: 1;
    font-weight: 600;
}

.subject {
    flex: 2;
    color: #ccc;
}

.time, .file-size {
    flex: 0.5;
    color: #888;
    text-align: right;
}

.network-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.stat-box {
    background: rgba(255,255,255,0.05);
    padding: 15px;
    border-radius: 5px;
    text-align: center;
}

.stat-number {
    display: block;
    font-size: 2rem;
    font-weight: bold;
    color: #00d4ff;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.privacy-settings {
    background: rgba(255,107,107,0.2);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.9rem;
}

.post-time {
    color: #888;
    font-size: 0.8rem;
    margin-left: auto;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = gameStyles;
document.head.appendChild(styleSheet);

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SpotTheDangerGame();
});