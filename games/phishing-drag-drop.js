class PhishingDragDropGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentLevel = 1;
        this.score = 0;
        this.maxLevel = 5;
        this.emails = this.generateEmails();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadLevel();
        this.updateDisplay();
    }

    generateEmails() {
        return [
            {
                level: 1,
                from: "security@paypal.com",
                subject: "Verify Your Account",
                content: `
                    <div class="email-header">
                        <strong>From:</strong> <span class="draggable safe">security@paypal.com</span><br>
                        <strong>Subject:</strong> Verify Your Account
                    </div>
                    <div class="email-body">
                        <p>Dear valued customer,</p>
                        <p>We noticed unusual activity on your account. Please <span class="draggable dangerous">click here immediately</span> to verify your identity.</p>
                        <p>If you don't verify within <span class="draggable dangerous">24 hours</span>, your account will be <span class="draggable dangerous">permanently suspended</span>.</p>
                        <p><a href="#" class="draggable dangerous">http://paypal-security.suspicious-site.com/verify</a></p>
                        <p>Thank you,<br>
                        <span class="draggable safe">PayPal Security Team</span></p>
                    </div>
                `
            },
            {
                level: 2,
                from: "noreply@amazon.com",
                subject: "Your Order #AMZ123456",
                content: `
                    <div class="email-header">
                        <strong>From:</strong> <span class="draggable dangerous">noreply@amaz0n.com</span><br>
                        <strong>Subject:</strong> Your Order #AMZ123456
                    </div>
                    <div class="email-body">
                        <p>Hello,</p>
                        <p>Your recent order has been <span class="draggable dangerous">cancelled due to payment issues</span>.</p>
                        <p>To resolve this, please <span class="draggable dangerous">download the attached file</span> and run it on your computer.</p>
                        <p><span class="draggable dangerous">Attachment: invoice.exe</span></p>
                        <p>Or visit: <span class="draggable dangerous">www.amazon-support.tk/resolve</span></p>
                        <p>Order Total: <span class="draggable safe">$127.99</span></p>
                        <p>Best regards,<br>
                        <span class="draggable safe">Amazon Customer Service</span></p>
                    </div>
                `
            },
            {
                level: 3,
                from: "admin@yourcompany.com",
                subject: "URGENT: System Maintenance",
                content: `
                    <div class="email-header">
                        <strong>From:</strong> <span class="draggable dangerous">admin@y0urcompany.com</span><br>
                        <strong>Subject:</strong> URGENT: System Maintenance
                    </div>
                    <div class="email-body">
                        <p>All Staff,</p>
                        <p>We are performing <span class="draggable dangerous">emergency maintenance</span> on our systems.</p>
                        <p><span class="draggable dangerous">Provide your login credentials</span> by replying to this email to maintain access.</p>
                        <p>Username: _______</p>
                        <p>Password: _______</p>
                        <p><span class="draggable dangerous">This is extremely urgent</span> - failure to comply will result in account lockout.</p>
                        <p>Time: <span class="draggable safe">3:00 PM EST</span></p>
                        <p>IT Department</p>
                    </div>
                `
            },
            {
                level: 4,
                from: "winner@lottery-international.org",
                subject: "CONGRATULATIONS! You've Won $50,000!",
                content: `
                    <div class="email-header">
                        <strong>From:</strong> <span class="draggable dangerous">winner@lottery-international.org</span><br>
                        <strong>Subject:</strong> <span class="draggable dangerous">CONGRATULATIONS! You've Won $50,000!</span>
                    </div>
                    <div class="email-body">
                        <p><span class="draggable dangerous">WINNER!</span></p>
                        <p>You have been selected in our <span class="draggable dangerous">international lottery</span>!</p>
                        <p>Prize Amount: <span class="draggable dangerous">$50,000 USD</span></p>
                        <p>To claim your prize, please <span class="draggable dangerous">send $500 processing fee</span> to:</p>
                        <p><span class="draggable dangerous">Bitcoin Address: 1A2B3C4D5E6F...</span></p>
                        <p><span class="draggable dangerous">Act now - offer expires in 48 hours!</span></p>
                        <p>Reference Number: <span class="draggable safe">LTR-2025-001</span></p>
                        <p>Lottery Commission</p>
                    </div>
                `
            },
            {
                level: 5,
                from: "ceo@company.com",
                subject: "Wire Transfer Request - Confidential",
                content: `
                    <div class="email-header">
                        <strong>From:</strong> <span class="draggable dangerous">ceo@c0mpany.com</span><br>
                        <strong>Subject:</strong> Wire Transfer Request - Confidential
                    </div>
                    <div class="email-body">
                        <p>Hi [Employee Name],</p>
                        <p>I need you to <span class="draggable dangerous">process an urgent wire transfer</span>.</p>
                        <p>Amount: <span class="draggable dangerous">$25,000</span></p>
                        <p>To: <span class="draggable dangerous">Offshore Account #123456789</span></p>
                        <p><span class="draggable dangerous">Keep this confidential</span> - it's for a sensitive acquisition.</p>
                        <p><span class="draggable dangerous">Use the new banking system</span> I sent you the link for.</p>
                        <p>Time is critical - <span class="draggable dangerous">complete by end of day</span>.</p>
                        <p>Date: <span class="draggable safe">January 15, 2025</span></p>
                        <p>Thanks,<br>CEO</p>
                    </div>
                `
            }
        ];
    }

    loadLevel() {
        const email = this.emails.find(e => e.level === this.currentLevel);
        if (email) {
            document.getElementById('emailContainer').innerHTML = email.content;
            this.setupDragAndDrop();
        }
        this.updateProgress();
    }

    setupDragAndDrop() {
        const draggables = document.querySelectorAll('.draggable');
        const dropZones = document.querySelectorAll('.drop-zone');

        // Setup draggable elements
        draggables.forEach(draggable => {
            draggable.draggable = true;
            draggable.addEventListener('dragstart', this.handleDragStart.bind(this));
            draggable.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            // Touch events for mobile
            draggable.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: false});
            draggable.addEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
            draggable.addEventListener('touchend', this.handleTouchEnd.bind(this), {passive: false});
        });

        // Setup drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
            zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        });
    }

    handleDragStart(e) {
        e.dataTransfer.setData('text/plain', '');
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
    }

    handleDragEnter(e) {
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        if (!e.target.contains(e.relatedTarget)) {
            e.target.classList.remove('drag-over');
        }
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        if (this.draggedElement) {
            e.target.appendChild(this.draggedElement);
            this.draggedElement = null;
        }
    }

    // Touch events for mobile support
    handleTouchStart(e) {
        e.preventDefault();
        this.touchElement = e.target;
        e.target.style.opacity = '0.7';
    }

    handleTouchMove(e) {
        e.preventDefault();
        if (this.touchElement) {
            const touch = e.touches[0];
            this.touchElement.style.position = 'fixed';
            this.touchElement.style.left = touch.clientX - 50 + 'px';
            this.touchElement.style.top = touch.clientY - 25 + 'px';
            this.touchElement.style.zIndex = '1000';
        }
    }

    handleTouchEnd(e) {
        e.preventDefault();
        if (this.touchElement) {
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = elementBelow?.closest('.drop-zone');
            
            if (dropZone) {
                dropZone.appendChild(this.touchElement);
            }
            
            this.touchElement.style.position = '';
            this.touchElement.style.left = '';
            this.touchElement.style.top = '';
            this.touchElement.style.zIndex = '';
            this.touchElement.style.opacity = '';
            this.touchElement = null;
        }
    }

    checkAnswers() {
        const dangerZone = document.getElementById('dangerZone');
        const safeZone = document.getElementById('safeZone');
        let correct = 0;
        let total = 0;

        // Check items in danger zone
        const dangerItems = dangerZone.querySelectorAll('.draggable');
        dangerItems.forEach(item => {
            total++;
            if (item.classList.contains('dangerous')) {
                correct++;
                item.style.background = 'rgba(0,255,136,0.3)';
                item.style.border = '2px solid #00ff88';
            } else {
                item.style.background = 'rgba(255,107,107,0.3)';
                item.style.border = '2px solid #ff6b6b';
            }
        });

        // Check items in safe zone
        const safeItems = safeZone.querySelectorAll('.draggable');
        safeItems.forEach(item => {
            total++;
            if (item.classList.contains('safe')) {
                correct++;
                item.style.background = 'rgba(0,255,136,0.3)';
                item.style.border = '2px solid #00ff88';
            } else {
                item.style.background = 'rgba(255,107,107,0.3)';
                item.style.border = '2px solid #ff6b6b';
            }
        });

        // Calculate score
        const levelScore = Math.max(0, (correct - (total - correct)) * 10);
        this.score += levelScore;

        if (correct === total) {
            this.feedback.show(`Perfect! Level ${this.currentLevel} completed!`, 'success');
            document.getElementById('nextLevel').style.display = 'block';
        } else {
            this.feedback.show(`${correct}/${total} correct. Try again!`, 'error');
        }

        this.updateDisplay();
        document.getElementById('checkAnswers').disabled = true;
    }

    nextLevel() {
        if (this.currentLevel < this.maxLevel) {
            this.currentLevel++;
            this.loadLevel();
            document.getElementById('nextLevel').style.display = 'none';
            document.getElementById('checkAnswers').disabled = false;
            this.updateDisplay();
        } else {
            this.completeGame();
        }
    }

    completeGame() {
        const stats = this.storage.getStats();
        const newBest = Math.max(stats.bestScores.phishing, this.score);
        
        this.storage.updateScore('phishing', this.score, newBest);
        this.feedback.show(`Game completed! Final score: ${this.score}`, 'success');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentLevel').textContent = this.currentLevel;
    }

    updateProgress() {
        const progress = (this.currentLevel - 1) / this.maxLevel * 100;
        document.getElementById('progressBar').style.width = progress + '%';
    }

    setupEventListeners() {
        document.getElementById('checkAnswers').addEventListener('click', () => this.checkAnswers());
        document.getElementById('nextLevel').addEventListener('click', () => this.nextLevel());
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PhishingDragDropGame();
});
