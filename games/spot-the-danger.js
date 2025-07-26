// Spot the Danger Game
class SpotTheDangerGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentScenario = 1;
        this.maxScenarios = 5;
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.foundDangers = [];
        this.totalDangers = 0;
        this.scenarioData = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadScenario();
        this.updateDisplay();
        this.feedback.gameStarted('Spot the Danger');
    }

    setupEventListeners() {
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });

        // Check answers button
        document.getElementById('checkAnswers').addEventListener('click', () => {
            this.checkAnswers();
        });

        // Next scenario button
        document.getElementById('nextScenario').addEventListener('click', () => {
            this.nextScenario();
        });

        // Reset scenario button
        document.getElementById('resetScenario').addEventListener('click', () => {
            this.resetScenario();
        });
    }

    loadScenario() {
        this.scenarioData = this.getScenarioData(this.currentScenario);
        this.foundDangers = [];
        this.totalDangers = this.scenarioData.dangers.length;
        
        const container = document.getElementById('scenarioContainer');
        container.innerHTML = this.scenarioData.html;
        
        this.setupDangerElements();
        this.updateDisplay();
    }

    getScenarioData(scenario) {
        const scenarios = {
            1: {
                title: "Suspicious Website",
                html: `
                    <div class="scenario-title">
                        <h3><i class="fas fa-globe"></i> Banking Website</h3>
                        <p>You're visiting what appears to be your bank's website. Can you spot the dangers?</p>
                    </div>
                    <div class="mock-browser">
                        <div class="browser-bar">
                            <div class="url-bar">
                                <i class="fas fa-lock" style="color: red;"></i>
                                <span class="danger-item" data-id="insecure-url" data-type="insecure-connection">
                                    http://bank0famerica.com/login
                                </span>
                            </div>
                        </div>
                        <div class="website-content">
                            <div class="bank-header">
                                <h2>Bank of America</h2>
                                <div class="danger-item" data-id="urgent-popup" data-type="suspicious-popup">
                                    <div class="popup-warning">
                                        ⚠️ URGENT: Your account will be closed! Click here to verify immediately!
                                    </div>
                                </div>
                            </div>
                            <div class="login-form">
                                <h3>Secure Login</h3>
                                <input type="text" placeholder="Username" />
                                <input type="password" placeholder="Password" />
                                <div class="danger-item" data-id="download-link" data-type="malicious-download">
                                    <a href="#" style="color: blue;">Download our new security app (required)</a>
                                </div>
                                <button>Login</button>
                            </div>
                            <div class="footer">
                                <p>Contact us: 
                                    <span class="danger-item" data-id="phone-scam" data-type="suspicious-contact">
                                        Call 1-800-BANK-NOW for urgent account issues
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                `,
                dangers: [
                    { id: "insecure-url", type: "insecure-connection", hint: "Look at the URL - is it secure and spelled correctly?" },
                    { id: "urgent-popup", type: "suspicious-popup", hint: "Banks don't usually show urgent popups demanding immediate action" },
                    { id: "download-link", type: "malicious-download", hint: "Legitimate banks don't require you to download apps to login" },
                    { id: "phone-scam", type: "suspicious-contact", hint: "This phone number format looks suspicious for a major bank" }
                ]
            },
            2: {
                title: "Email Interface",
                html: `
                    <div class="scenario-title">
                        <h3><i class="fas fa-envelope"></i> Email Client</h3>
                        <p>You're checking your email. Look for dangerous elements in the messages.</p>
                    </div>
                    <div class="mock-email">
                        <div class="email-list">
                            <div class="email-item">
                                <div class="email-header">
                                    <strong>From:</strong> 
                                    <span class="danger-item" data-id="fake-sender" data-type="spoofed-email">
                                        security@paypaI.com
                                    </span>
                                </div>
                                <div class="email-subject">
                                    <strong>Subject:</strong> Account Verification Required
                                </div>
                                <div class="email-body">
                                    <p>Dear Customer,</p>
                                    <p>
                                        <span class="danger-item" data-id="urgent-threat" data-type="social-engineering">
                                            Your account will be suspended in 24 hours
                                        </span> 
                                        if you don't verify your information.
                                    </p>
                                    <p>
                                        <span class="danger-item" data-id="malicious-link" data-type="phishing-link">
                                            Click here to verify: http://paypal-verification.tk/secure
                                        </span>
                                    </p>
                                    <div class="danger-item" data-id="attachment" data-type="suspicious-attachment">
                                        <i class="fas fa-paperclip"></i> 
                                        <a href="#">account_verification.exe</a>
                                    </div>
                                </div>
                            </div>
                            <div class="email-item">
                                <div class="email-header">
                                    <strong>From:</strong> 
                                    <span class="danger-item" data-id="ceo-fraud" data-type="business-email-compromise">
                                        ceo@your-company.co.in
                                    </span>
                                </div>
                                <div class="email-subject">
                                    <strong>Subject:</strong> Urgent Wire Transfer
                                </div>
                                <div class="email-body">
                                    <p>
                                        <span class="danger-item" data-id="urgent-request" data-type="social-engineering">
                                            I need you to wire $50,000 immediately for a confidential deal.
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                dangers: [
                    { id: "fake-sender", type: "spoofed-email", hint: "Look closely at the sender's email address - is it spelled correctly?" },
                    { id: "urgent-threat", type: "social-engineering", hint: "Urgent threats are common social engineering tactics" },
                    { id: "malicious-link", type: "phishing-link", hint: "The URL doesn't match the official PayPal domain" },
                    { id: "attachment", type: "suspicious-attachment", hint: "Executable files in emails are highly suspicious" },
                    { id: "ceo-fraud", type: "business-email-compromise", hint: "Check the domain - is this really your CEO's email?" },
                    { id: "urgent-request", type: "social-engineering", hint: "CEOs don't usually request wire transfers via email" }
                ]
            },
            3: {
                title: "Software Download",
                html: `
                    <div class="scenario-title">
                        <h3><i class="fas fa-download"></i> Software Download Site</h3>
                        <p>You're looking to download software. Identify the dangerous elements.</p>
                    </div>
                    <div class="mock-download-site">
                        <div class="site-header">
                            <h2>Free Software Downloads</h2>
                            <div class="danger-item" data-id="fake-security" data-type="scareware">
                                <div class="security-warning">
                                    🚨 WARNING: Your computer is infected! Download our cleaner now!
                                </div>
                            </div>
                        </div>
                        <div class="download-section">
                            <div class="software-item">
                                <h3>Adobe Reader</h3>
                                <div class="download-buttons">
                                    <button class="download-btn legitimate">Download from Adobe</button>
                                    <div class="danger-item" data-id="fake-download" data-type="malware-download">
                                        <button class="download-btn fake">FAST DOWNLOAD (Recommended)</button>
                                    </div>
                                </div>
                            </div>
                            <div class="software-item">
                                <h3>Video Codec Pack</h3>
                                <p>
                                    <span class="danger-item" data-id="bundled-software" data-type="potentially-unwanted-program">
                                        Includes bonus antivirus and browser toolbars!
                                    </span>
                                </p>
                                <button class="download-btn">Download Now</button>
                            </div>
                            <div class="ads-section">
                                <div class="danger-item" data-id="fake-ad" data-type="malicious-advertisement">
                                    <div class="fake-download-ad">
                                        <h4>You've Won $1000!</h4>
                                        <button>Claim Prize</button>
                                    </div>
                                </div>
                                <div class="danger-item" data-id="update-scam" data-type="fake-software-update">
                                    <div class="update-notification">
                                        Your Flash Player is out of date! 
                                        <button>Update Now</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                dangers: [
                    { id: "fake-security", type: "scareware", hint: "Legitimate antivirus warnings don't appear on random websites" },
                    { id: "fake-download", type: "malware-download", hint: "Always download software from official sources, not third-party sites" },
                    { id: "bundled-software", type: "potentially-unwanted-program", hint: "Be wary of software that includes 'bonus' programs" },
                    { id: "fake-ad", type: "malicious-advertisement", hint: "Prize notifications on download sites are almost always scams" },
                    { id: "update-scam", type: "fake-software-update", hint: "Software updates should come from the official software, not random websites" }
                ]
            },
            4: {
                title: "Social Media",
                html: `
                    <div class="scenario-title">
                        <h3><i class="fab fa-facebook"></i> Social Media Platform</h3>
                        <p>You're browsing social media. Look for security threats and privacy risks.</p>
                    </div>
                    <div class="mock-social-media">
                        <div class="social-header">
                            <h2>FaceSpace</h2>
                            <div class="user-info">Welcome, John Doe</div>
                        </div>
                        <div class="posts-feed">
                            <div class="post">
                                <div class="post-header">
                                    <strong>Friend Request from:</strong>
                                    <span class="danger-item" data-id="fake-profile" data-type="catfishing">
                                        Sarah Johnson (Mutual friends: 0)
                                    </span>
                                </div>
                                <div class="post-content">
                                    <p>Hi! I saw your profile and thought we should be friends!</p>
                                </div>
                            </div>
                            <div class="post">
                                <div class="post-header">
                                    <strong>Your Friend Mike shared:</strong>
                                </div>
                                <div class="post-content">
                                    <div class="danger-item" data-id="quiz-scam" data-type="data-harvesting">
                                        <h4>Which Disney Princess Are You?</h4>
                                        <p>Answer these fun questions to find out! 
                                        (Requires access to your friends list and personal info)</p>
                                        <button>Take Quiz</button>
                                    </div>
                                </div>
                            </div>
                            <div class="post">
                                <div class="post-header">
                                    <strong>Sponsored Post:</strong>
                                </div>
                                <div class="post-content">
                                    <div class="danger-item" data-id="crypto-scam" data-type="investment-scam">
                                        <h4>🚀 Make $5000 in Bitcoin Daily!</h4>
                                        <p>Join our exclusive group! Send $100 to get started!</p>
                                        <button>Join Now</button>
                                    </div>
                                </div>
                            </div>
                            <div class="post">
                                <div class="post-content">
                                    <div class="danger-item" data-id="oversharing" data-type="privacy-risk">
                                        <p><strong>John Doe</strong> is going on vacation to Hawaii from June 15-25! 
                                        House will be empty - can't wait for the break!</p>
                                    </div>
                                </div>
                            </div>
                            <div class="post">
                                <div class="post-content">
                                    <div class="danger-item" data-id="chain-letter" data-type="social-engineering">
                                        <p>⚠️ URGENT: Facebook will start charging $5.99/month unless you share this post! 
                                        Copy and paste to avoid charges!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                dangers: [
                    { id: "fake-profile", type: "catfishing", hint: "Be suspicious of friend requests from people with no mutual friends" },
                    { id: "quiz-scam", type: "data-harvesting", hint: "Fun quizzes often collect your personal data for malicious purposes" },
                    { id: "crypto-scam", type: "investment-scam", hint: "Get-rich-quick schemes are almost always scams" },
                    { id: "oversharing", type: "privacy-risk", hint: "Sharing vacation plans publicly can make you a target for burglary" },
                    { id: "chain-letter", type: "social-engineering", hint: "Social media platforms don't communicate policy changes through chain posts" }
                ]
            },
            5: {
                title: "Mobile App Store",
                html: `
                    <div class="scenario-title">
                        <h3><i class="fas fa-mobile-alt"></i> Mobile App Store</h3>
                        <p>You're browsing for apps to download. Identify the security risks.</p>
                    </div>
                    <div class="mock-app-store">
                        <div class="store-header">
                            <h2>App Store</h2>
                            <div class="search-bar">Search for apps...</div>
                        </div>
                        <div class="apps-grid">
                            <div class="app-item">
                                <h4>
                                    <span class="danger-item" data-id="fake-app" data-type="malicious-app">
                                        WhatsApp Messanger
                                    </span>
                                </h4>
                                <p>Developer: Unknown Developer</p>
                                <p>Downloads: 523</p>
                                <p>Rating: ⭐⭐⭐⭐⭐ (5 reviews)</p>
                                <button class="install-btn">Install</button>
                            </div>
                            <div class="app-item">
                                <h4>Super Battery Booster Pro</h4>
                                <p>
                                    <span class="danger-item" data-id="excessive-permissions" data-type="privacy-violation">
                                        Permissions: Camera, Microphone, Contacts, Location, SMS, Call Logs
                                    </span>
                                </p>
                                <p>Downloads: 1M+</p>
                                <p>Rating: ⭐⭐⭐⭐⭐</p>
                                <button class="install-btn">Install</button>
                            </div>
                            <div class="app-item">
                                <h4>
                                    <span class="danger-item" data-id="copycat-app" data-type="app-impersonation">
                                        Instagram Pro+
                                    </span>
                                </h4>
                                <p>Developer: Social Media Tools Inc</p>
                                <p>Downloads: 50K</p>
                                <p>
                                    <span class="danger-item" data-id="fake-features" data-type="misleading-app">
                                        "Download photos and videos, see who viewed your profile!"
                                    </span>
                                </p>
                                <button class="install-btn">Install</button>
                            </div>
                            <div class="app-item">
                                <h4>Free WiFi Password Finder</h4>
                                <p>
                                    <span class="danger-item" data-id="suspicious-functionality" data-type="potentially-harmful-app">
                                        "Access any WiFi network for free! No passwords needed!"
                                    </span>
                                </p>
                                <p>Downloads: 100K</p>
                                <button class="install-btn">Install</button>
                            </div>
                            <div class="sponsored-section">
                                <div class="danger-item" data-id="sideload-prompt" data-type="security-bypass">
                                    <h4>Can't find the app you want?</h4>
                                    <p>Enable "Unknown Sources" to install apps from anywhere!</p>
                                    <button>Enable Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                dangers: [
                    { id: "fake-app", type: "malicious-app", hint: "Check app names carefully - this one has a spelling error" },
                    { id: "excessive-permissions", type: "privacy-violation", hint: "A battery app shouldn't need access to camera, contacts, and SMS" },
                    { id: "copycat-app", type: "app-impersonation", hint: "Instagram doesn't have official 'Pro+' versions" },
                    { id: "fake-features", type: "misleading-app", hint: "Apps claiming to show profile viewers are usually scams" },
                    { id: "suspicious-functionality", type: "potentially-harmful-app", hint: "Apps that bypass WiFi security are illegal and dangerous" },
                    { id: "sideload-prompt", type: "security-bypass", hint: "Enabling unknown sources makes your device vulnerable to malware" }
                ]
            }
        };

        return scenarios[scenario] || scenarios[1];
    }

    setupDangerElements() {
        const dangerElements = document.querySelectorAll('.danger-item');
        
        dangerElements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.handleDangerClick(element);
            });

            // Add visual indication that element is clickable
            element.style.cursor = 'pointer';
            element.style.position = 'relative';
        });
    }

    handleDangerClick(element) {
        const dangerId = element.dataset.id;
        
        if (this.foundDangers.includes(dangerId)) {
            return; // Already found
        }

        if (this.scenarioData.dangers.some(danger => danger.id === dangerId)) {
            // Correct danger found
            element.classList.add('found');
            this.foundDangers.push(dangerId);
            this.score += 50;
            
            this.feedback.correctAnswer('Danger spotted!');
            
            // Check if all dangers found
            if (this.foundDangers.length >= this.totalDangers) {
                setTimeout(() => {
                    this.feedback.success('All dangers found in this scenario!');
                    document.getElementById('nextScenario').style.display = 'inline-block';
                }, 1000);
            }
        } else {
            // Wrong click
            element.classList.add('wrong');
            this.score = Math.max(0, this.score - 10);
            
            this.feedback.incorrectAnswer('That\'s not a danger. Keep looking!');
            
            setTimeout(() => {
                element.classList.remove('wrong');
            }, 1000);
        }

        this.updateDisplay();
    }

    checkAnswers() {
        let foundCount = 0;
        let totalScore = 0;

        // Show all correct answers
        this.scenarioData.dangers.forEach(danger => {
            const element = document.querySelector(`[data-id="${danger.id}"]`);
            if (element) {
                if (this.foundDangers.includes(danger.id)) {
                    foundCount++;
                    totalScore += 50;
                } else {
                    // Highlight missed dangers
                    element.classList.add('missed');
                    element.style.backgroundColor = 'rgba(255, 193, 7, 0.5)';
                }
            }
        });

        const percentage = (foundCount / this.totalDangers) * 100;
        
        if (percentage === 100) {
            this.feedback.success('Perfect! You found all the dangers!');
        } else if (percentage >= 75) {
            this.feedback.success(`Great job! You found ${foundCount}/${this.totalDangers} dangers.`);
        } else if (percentage >= 50) {
            this.feedback.warning(`Good effort! You found ${foundCount}/${this.totalDangers} dangers.`);
        } else {
            this.feedback.warning(`Keep practicing! You found ${foundCount}/${this.totalDangers} dangers.`);
        }

        document.getElementById('nextScenario').style.display = 'inline-block';
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        // Find the first unfound danger
        const unfoundDanger = this.scenarioData.dangers.find(danger => 
            !this.foundDangers.includes(danger.id)
        );

        if (unfoundDanger) {
            this.hintsLeft--;
            this.feedback.hintUsed(this.hintsLeft);
            
            setTimeout(() => {
                this.feedback.info(unfoundDanger.hint, {
                    title: '💡 Hint',
                    duration: 6000
                });
            }, 500);
        } else {
            this.feedback.info('You\'ve found all the dangers in this scenario!');
        }

        this.updateDisplay();
    }

    nextScenario() {
        if (this.currentScenario < this.maxScenarios) {
            this.currentScenario++;
            this.loadScenario();
            document.getElementById('nextScenario').style.display = 'none';
        } else {
            this.endGame();
        }
    }

    resetScenario() {
        // Clear all found dangers and visual feedback
        document.querySelectorAll('.danger-item').forEach(element => {
            element.classList.remove('found', 'wrong', 'missed');
            element.style.backgroundColor = '';
        });

        this.foundDangers = [];
        document.getElementById('nextScenario').style.display = 'none';
        this.updateDisplay();

        this.feedback.info('Scenario reset. Try to find all the dangers!');
    }

    endGame() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Bonus points for completion
        this.score += 200;
        
        const stats = this.storage.updateGameScore('spot-danger', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.spotDanger, 'Spot the Danger');
        
        setTimeout(() => {
            const timeString = `${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}`;
            alert(`Congratulations!\n\nAll scenarios completed!\nFinal Score: ${this.score}\nTime: ${timeString}\n\nYou've mastered danger detection!`);
            window.location.href = '../index.html';
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('foundCount').textContent = this.foundDangers.length;
        document.getElementById('totalDangers').textContent = this.totalDangers;
        document.getElementById('currentScenario').textContent = this.currentScenario;
        document.getElementById('hintsLeft').textContent = this.hintsLeft;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpotTheDangerGame();
});
