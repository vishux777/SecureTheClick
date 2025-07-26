// Phishing Detective Drag and Drop Game
class PhishingGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentRound = 1;
        this.maxRounds = 5;
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.draggedElements = [];
        this.correctAnswers = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadRound();
        this.updateDisplay();
        this.feedback.gameStarted('Phishing Detective');
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

        // Next round button
        document.getElementById('nextRound').addEventListener('click', () => {
            this.nextRound();
        });

        // Reset round button
        document.getElementById('resetRound').addEventListener('click', () => {
            this.resetRound();
        });
    }

    loadRound() {
        const gameContent = document.getElementById('gameContent');
        const scenario = this.getScenario(this.currentRound);
        
        gameContent.innerHTML = `
            <div class="email-container">
                <div class="email-header">
                    <div class="email-from">
                        <strong>From:</strong> 
                        <span class="draggable" data-type="${scenario.fromType}" data-id="from">
                            ${scenario.from}
                        </span>
                    </div>
                    <div class="email-subject">
                        <strong>Subject:</strong> ${scenario.subject}
                    </div>
                </div>
                <div class="email-body">
                    ${scenario.body}
                </div>
            </div>
        `;

        this.setupDragAndDrop();
        this.correctAnswers = scenario.correctAnswers;
        this.updateButtons();
    }

    getScenario(round) {
        const scenarios = {
            1: {
                from: "security@paypaI.com",
                fromType: "suspicious-sender",
                subject: "Urgent: Account Verification Required",
                body: `
                    Dear Customer,
                    <br><br>
                    <span class="draggable" data-type="urgent-threat" data-id="urgent1">
                        Your account will be suspended within 24 hours
                    </span> if you don't verify your information immediately.
                    <br><br>
                    Please <span class="draggable" data-type="suspicious-link" data-id="link1">
                        click here to verify your account
                    </span> and provide your 
                    <span class="draggable" data-type="personal-info" data-id="info1">
                        login credentials and social security number
                    </span>.
                    <br><br>
                    Thank you,
                    <br>PayPal Security Team
                `,
                correctAnswers: {
                    "suspicious-sender": ["from"],
                    "urgent-threat": ["urgent1"],
                    "suspicious-link": ["link1"],
                    "personal-info": ["info1"]
                }
            },
            2: {
                from: "noreply@amazon-security.net",
                fromType: "suspicious-sender",
                subject: "Suspicious Activity Detected",
                body: `
                    Hello,
                    <br><br>
                    We've detected 
                    <span class="draggable" data-type="urgent-threat" data-id="urgent2">
                        unauthorized access to your account from Russia
                    </span>. 
                    <span class="draggable" data-type="urgent-threat" data-id="urgent3">
                        Act now to prevent account closure!
                    </span>
                    <br><br>
                    <span class="draggable" data-type="suspicious-link" data-id="link2">
                        Download our security tool immediately
                    </span> and enter your 
                    <span class="draggable" data-type="personal-info" data-id="info2">
                        password and credit card details
                    </span> to secure your account.
                    <br><br>
                    Amazon Security
                `,
                correctAnswers: {
                    "suspicious-sender": ["from"],
                    "urgent-threat": ["urgent2", "urgent3"],
                    "suspicious-link": ["link2"],
                    "personal-info": ["info2"]
                }
            },
            3: {
                from: "it-support@company-server.tk",
                fromType: "suspicious-sender",
                subject: "Email Storage Quota Exceeded",
                body: `
                    IT Department Notice:
                    <br><br>
                    <span class="draggable" data-type="urgent-threat" data-id="urgent4">
                        Your email will be deleted in 2 hours
                    </span> due to storage limits.
                    <br><br>
                    To prevent data loss, 
                    <span class="draggable" data-type="suspicious-link" data-id="link3">
                        click this secure link
                    </span> and confirm your 
                    <span class="draggable" data-type="personal-info" data-id="info3">
                        username, password, and backup email
                    </span>.
                    <br><br>
                    <span class="draggable" data-type="suspicious-link" data-id="link4">
                        http://bit.ly/email-backup-urgent
                    </span>
                    <br><br>
                    IT Support Team
                `,
                correctAnswers: {
                    "suspicious-sender": ["from"],
                    "urgent-threat": ["urgent4"],
                    "suspicious-link": ["link3", "link4"],
                    "personal-info": ["info3"]
                }
            },
            4: {
                from: "winner@lottery-international.biz",
                fromType: "suspicious-sender",
                subject: "CONGRATULATIONS! You've Won $1,000,000",
                body: `
                    CONGRATULATIONS WINNER!
                    <br><br>
                    You have been selected in our international lottery! 
                    <span class="draggable" data-type="urgent-threat" data-id="urgent5">
                        Claim your prize within 48 hours or lose it forever!
                    </span>
                    <br><br>
                    To claim your winnings, provide your 
                    <span class="draggable" data-type="personal-info" data-id="info4">
                        full name, address, phone number, and bank account details
                    </span>.
                    <br><br>
                    <span class="draggable" data-type="suspicious-link" data-id="link5">
                        Click here to claim your prize now!
                    </span>
                    <br><br>
                    International Lottery Commission
                `,
                correctAnswers: {
                    "suspicious-sender": ["from"],
                    "urgent-threat": ["urgent5"],
                    "suspicious-link": ["link5"],
                    "personal-info": ["info4"]
                }
            },
            5: {
                from: "ceo@your-company.co.in",
                fromType: "suspicious-sender",
                subject: "Urgent: Wire Transfer Request",
                body: `
                    Dear Finance Team,
                    <br><br>
                    <span class="draggable" data-type="urgent-threat" data-id="urgent6">
                        I need you to process an urgent wire transfer immediately
                    </span> for a confidential business deal.
                    <br><br>
                    Please transfer $50,000 to the following account and 
                    <span class="draggable" data-type="personal-info" data-id="info5">
                        confirm with your employee ID and banking passwords
                    </span>.
                    <br><br>
                    <span class="draggable" data-type="suspicious-link" data-id="link6">
                        Wire transfer form: secure-bank-forms.net/urgent
                    </span>
                    <br><br>
                    Keep this confidential.
                    <br>CEO
                `,
                correctAnswers: {
                    "suspicious-sender": ["from"],
                    "urgent-threat": ["urgent6"],
                    "suspicious-link": ["link6"],
                    "personal-info": ["info5"]
                }
            }
        };

        return scenarios[round] || scenarios[1];
    }

    setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const dropZones = document.querySelectorAll('.drop-zone');

        // Setup draggable elements
        draggables.forEach(element => {
            element.draggable = true;
            element.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    id: element.dataset.id,
                    type: element.dataset.type,
                    text: element.textContent.trim()
                }));
                element.classList.add('dragging');
            });

            element.addEventListener('dragend', () => {
                element.classList.remove('dragging');
            });
        });

        // Setup drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                this.handleDrop(zone, data);
            });
        });
    }

    handleDrop(zone, data) {
        // Check if element is already in a zone
        const existingItem = zone.querySelector(`[data-id="${data.id}"]`);
        if (existingItem) {
            return; // Already in this zone
        }

        // Remove from other zones
        document.querySelectorAll('.drop-zone .dropped-item').forEach(item => {
            if (item.dataset.id === data.id) {
                item.remove();
            }
        });

        // Add to current zone
        const droppedItem = document.createElement('div');
        droppedItem.className = 'dropped-item';
        droppedItem.dataset.id = data.id;
        droppedItem.dataset.type = data.type;
        droppedItem.innerHTML = `
            <span>${data.text}</span>
            <button class="remove-item" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        zone.appendChild(droppedItem);
        this.updateButtons();
    }

    checkAnswers() {
        let correctCount = 0;
        let totalExpected = 0;

        // Count total expected answers
        Object.values(this.correctAnswers).forEach(answers => {
            totalExpected += answers.length;
        });

        // Check each drop zone
        document.querySelectorAll('.drop-zone').forEach(zone => {
            const zoneType = zone.dataset.type;
            const droppedItems = zone.querySelectorAll('.dropped-item');
            const expectedAnswers = this.correctAnswers[zoneType] || [];

            // Clear previous feedback
            zone.classList.remove('correct', 'incorrect');

            // Check if all expected items are in this zone
            let zoneCorrect = true;
            const foundItems = Array.from(droppedItems).map(item => item.dataset.id);

            expectedAnswers.forEach(expectedId => {
                if (foundItems.includes(expectedId)) {
                    correctCount++;
                } else {
                    zoneCorrect = false;
                }
            });

            // Check for incorrect items in this zone
            foundItems.forEach(foundId => {
                if (!expectedAnswers.includes(foundId)) {
                    zoneCorrect = false;
                }
            });

            // Apply visual feedback
            if (expectedAnswers.length > 0) {
                zone.classList.add(zoneCorrect ? 'correct' : 'incorrect');
            }
        });

        // Calculate score
        const accuracy = totalExpected > 0 ? (correctCount / totalExpected) : 0;
        const roundScore = Math.round(accuracy * 100);
        this.score += roundScore;

        // Show feedback
        if (accuracy >= 0.8) {
            this.feedback.correctAnswer(`Excellent! You identified ${correctCount}/${totalExpected} threats correctly.`);
        } else if (accuracy >= 0.6) {
            this.feedback.warning(`Good effort! You found ${correctCount}/${totalExpected} threats. Keep practicing!`);
        } else {
            this.feedback.incorrectAnswer(`You found ${correctCount}/${totalExpected} threats. Review the hints and try again.`);
        }

        this.updateDisplay();
        document.getElementById('checkAnswers').style.display = 'none';
        document.getElementById('nextRound').style.display = 'inline-block';
    }

    nextRound() {
        if (this.currentRound < this.maxRounds) {
            this.currentRound++;
            this.loadRound();
            this.clearDropZones();
        } else {
            this.endGame();
        }
    }

    resetRound() {
        this.clearDropZones();
        this.updateButtons();
    }

    clearDropZones() {
        document.querySelectorAll('.drop-zone').forEach(zone => {
            zone.querySelectorAll('.dropped-item').forEach(item => item.remove());
            zone.classList.remove('correct', 'incorrect', 'drag-over');
        });
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        const hints = {
            1: "Look for misspelled domains (PaypaI vs PayPal), urgent deadlines, and requests for sensitive information.",
            2: "Check the sender domain carefully, and be suspicious of urgent language and download requests.",
            3: "IT departments rarely use external links or ask for passwords via email.",
            4: "Lottery scams often use urgent deadlines and ask for personal/financial information upfront.",
            5: "CEO fraud emails often bypass normal procedures and request immediate action with financial details."
        };

        this.hintsLeft--;
        this.feedback.hintUsed(this.hintsLeft);
        
        setTimeout(() => {
            this.feedback.info(hints[this.currentRound] || "Look carefully at sender addresses, urgent language, suspicious links, and personal information requests.", {
                title: '💡 Hint',
                duration: 8000
            });
        }, 500);

        this.updateDisplay();
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentRound').textContent = this.currentRound;
        document.getElementById('hintsLeft').textContent = this.hintsLeft;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateButtons() {
        const hasDroppedItems = document.querySelectorAll('.dropped-item').length > 0;
        document.getElementById('checkAnswers').style.display = hasDroppedItems ? 'inline-block' : 'none';
        document.getElementById('nextRound').style.display = 'none';
    }

    endGame() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const stats = this.storage.updateGameScore('phishing', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.phishing, 'Phishing Detective');
        
        setTimeout(() => {
            alert(`Game Complete!\n\nFinal Score: ${this.score}\nTime: ${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}\n\nYou've completed all rounds of Phishing Detective!`);
            window.location.href = '../index.html';
        }, 2000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PhishingGame();
});
