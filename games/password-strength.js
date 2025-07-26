// Password Strength Analyzer Game
class PasswordStrengthGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentLevel = 1;
        this.maxLevels = 5;
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.passwordsCreated = 0;
        this.currentChallenge = null;
        this.commonPasswords = new Set([
            'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
            'admin', 'welcome', 'letmein', 'monkey', 'dragon', 'sunshine',
            'princess', 'football', 'charlie', 'aa123456', 'donald', 'batman',
            'superman', 'michael', 'computer', 'liverpool', 'jordan', 'harley'
        ]);
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChallenge();
        this.updateDisplay();
        this.feedback.gameStarted('Password Strength Analyzer');
    }

    setupEventListeners() {
        const passwordInput = document.getElementById('passwordInput');
        const togglePassword = document.getElementById('togglePassword');
        const submitBtn = document.getElementById('submitPassword');
        const generateBtn = document.getElementById('generatePassword');
        const clearBtn = document.getElementById('clearPassword');
        const hintBtn = document.getElementById('hintBtn');

        // Password input events
        passwordInput.addEventListener('input', () => {
            this.analyzePassword();
        });

        passwordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !submitBtn.disabled) {
                this.submitPassword();
            }
        });

        // Toggle password visibility
        togglePassword.addEventListener('click', () => {
            this.togglePasswordVisibility();
        });

        // Button events
        submitBtn.addEventListener('click', () => {
            this.submitPassword();
        });

        generateBtn.addEventListener('click', () => {
            this.generateExamplePassword();
        });

        clearBtn.addEventListener('click', () => {
            this.clearPassword();
        });

        hintBtn.addEventListener('click', () => {
            this.showHint();
        });
    }

    loadChallenge() {
        this.currentChallenge = this.getChallengeData(this.currentLevel);
        
        document.getElementById('challengeTitle').textContent = this.currentChallenge.title;
        document.getElementById('challengeDescription').textContent = this.currentChallenge.description;
        
        this.renderCriteria();
        this.clearPassword();
    }

    getChallengeData(level) {
        const challenges = {
            1: {
                title: "Challenge 1: Basic Security",
                description: "Create a password that meets basic security requirements.",
                requirements: {
                    minLength: 8,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: false,
                    noCommonPasswords: true,
                    noPersonalInfo: false
                },
                hint: "Use at least 8 characters with uppercase, lowercase, and numbers.",
                points: 100
            },
            2: {
                title: "Challenge 2: Enhanced Security",
                description: "Create a stronger password with special characters.",
                requirements: {
                    minLength: 10,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    noCommonPasswords: true,
                    noPersonalInfo: false
                },
                hint: "Add special characters like !@#$%^&* to make it stronger.",
                points: 150
            },
            3: {
                title: "Challenge 3: Long and Strong",
                description: "Create a long password that's easy to remember but hard to crack.",
                requirements: {
                    minLength: 14,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    noCommonPasswords: true,
                    noPersonalInfo: true
                },
                hint: "Try using a passphrase with multiple words, numbers, and symbols.",
                points: 200
            },
            4: {
                title: "Challenge 4: Professional Grade",
                description: "Create a password suitable for important business accounts.",
                requirements: {
                    minLength: 16,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    noCommonPasswords: true,
                    noPersonalInfo: true,
                    noSequentialChars: true
                },
                hint: "Avoid sequential characters like 'abc' or '123'. Use random combinations.",
                points: 250
            },
            5: {
                title: "Challenge 5: Maximum Security",
                description: "Create the ultimate secure password for high-value accounts.",
                requirements: {
                    minLength: 20,
                    requireUppercase: true,
                    requireLowercase: true,
                    requireNumbers: true,
                    requireSpecialChars: true,
                    noCommonPasswords: true,
                    noPersonalInfo: true,
                    noSequentialChars: true,
                    noDictionaryWords: true
                },
                hint: "Create a complex passphrase with mixed case, numbers, symbols, and avoid dictionary words.",
                points: 300
            }
        };

        return challenges[level] || challenges[1];
    }

    renderCriteria() {
        const criteriaList = document.getElementById('criteriaList');
        const req = this.currentChallenge.requirements;
        
        criteriaList.innerHTML = '';

        const criteria = [
            { key: 'minLength', text: `At least ${req.minLength} characters long`, check: (pwd) => pwd.length >= req.minLength },
            { key: 'requireUppercase', text: 'Contains uppercase letters (A-Z)', check: (pwd) => /[A-Z]/.test(pwd), enabled: req.requireUppercase },
            { key: 'requireLowercase', text: 'Contains lowercase letters (a-z)', check: (pwd) => /[a-z]/.test(pwd), enabled: req.requireLowercase },
            { key: 'requireNumbers', text: 'Contains numbers (0-9)', check: (pwd) => /[0-9]/.test(pwd), enabled: req.requireNumbers },
            { key: 'requireSpecialChars', text: 'Contains special characters (!@#$%^&*)', check: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), enabled: req.requireSpecialChars },
            { key: 'noCommonPasswords', text: 'Not a common password', check: (pwd) => !this.commonPasswords.has(pwd.toLowerCase()), enabled: req.noCommonPasswords },
            { key: 'noPersonalInfo', text: 'Doesn\'t contain obvious personal info', check: (pwd) => this.checkPersonalInfo(pwd), enabled: req.noPersonalInfo },
            { key: 'noSequentialChars', text: 'No sequential characters (abc, 123)', check: (pwd) => this.checkSequential(pwd), enabled: req.noSequentialChars },
            { key: 'noDictionaryWords', text: 'Avoids common dictionary words', check: (pwd) => this.checkDictionaryWords(pwd), enabled: req.noDictionaryWords }
        ];

        criteria.forEach(criterion => {
            if (criterion.enabled !== false) {
                const item = document.createElement('div');
                item.className = 'criteria-item not-met';
                item.dataset.key = criterion.key;
                item.innerHTML = `
                    <i class="fas fa-times"></i>
                    <span>${criterion.text}</span>
                `;
                criteriaList.appendChild(item);
            }
        });
    }

    analyzePassword() {
        const password = document.getElementById('passwordInput').value;
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');
        const submitBtn = document.getElementById('submitPassword');

        if (!password) {
            strengthBar.style.width = '0%';
            strengthBar.style.backgroundColor = '#e9ecef';
            strengthText.textContent = 'Enter a password to see its strength';
            strengthText.className = 'strength-text';
            submitBtn.disabled = true;
            return;
        }

        // Calculate strength score
        let score = 0;
        let maxScore = 0;
        let metCriteria = 0;
        let totalCriteria = 0;

        // Check each criterion
        document.querySelectorAll('.criteria-item').forEach(item => {
            const key = item.dataset.key;
            totalCriteria++;
            
            let met = false;
            switch (key) {
                case 'minLength':
                    met = password.length >= this.currentChallenge.requirements.minLength;
                    break;
                case 'requireUppercase':
                    met = /[A-Z]/.test(password);
                    break;
                case 'requireLowercase':
                    met = /[a-z]/.test(password);
                    break;
                case 'requireNumbers':
                    met = /[0-9]/.test(password);
                    break;
                case 'requireSpecialChars':
                    met = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                    break;
                case 'noCommonPasswords':
                    met = !this.commonPasswords.has(password.toLowerCase());
                    break;
                case 'noPersonalInfo':
                    met = this.checkPersonalInfo(password);
                    break;
                case 'noSequentialChars':
                    met = this.checkSequential(password);
                    break;
                case 'noDictionaryWords':
                    met = this.checkDictionaryWords(password);
                    break;
            }

            if (met) {
                item.className = 'criteria-item met';
                item.querySelector('i').className = 'fas fa-check';
                metCriteria++;
                score += 10;
            } else {
                item.className = 'criteria-item not-met';
                item.querySelector('i').className = 'fas fa-times';
            }
            
            maxScore += 10;
        });

        // Additional scoring factors
        score += Math.min(password.length * 2, 20); // Length bonus
        score += this.calculateEntropy(password) / 4; // Entropy bonus

        const percentage = Math.min((score / (maxScore + 25)) * 100, 100);

        // Update strength meter
        strengthBar.style.width = percentage + '%';
        
        if (percentage < 30) {
            strengthBar.style.backgroundColor = '#dc3545';
            strengthText.textContent = 'Weak';
            strengthText.className = 'strength-text weak';
        } else if (percentage < 60) {
            strengthBar.style.backgroundColor = '#ffc107';
            strengthText.textContent = 'Fair';
            strengthText.className = 'strength-text fair';
        } else if (percentage < 80) {
            strengthBar.style.backgroundColor = '#fd7e14';
            strengthText.textContent = 'Good';
            strengthText.className = 'strength-text good';
        } else {
            strengthBar.style.backgroundColor = '#28a745';
            strengthText.textContent = 'Strong';
            strengthText.className = 'strength-text strong';
        }

        // Enable submit button if all criteria are met
        submitBtn.disabled = metCriteria < totalCriteria;
    }

    calculateEntropy(password) {
        const charSets = [
            /[a-z]/.test(password) ? 26 : 0, // lowercase
            /[A-Z]/.test(password) ? 26 : 0, // uppercase
            /[0-9]/.test(password) ? 10 : 0, // numbers
            /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 32 : 0 // special chars
        ];
        
        const poolSize = charSets.reduce((sum, size) => sum + size, 0);
        return poolSize > 0 ? Math.log2(Math.pow(poolSize, password.length)) : 0;
    }

    checkPersonalInfo(password) {
        const personal = ['john', 'doe', 'admin', 'user', 'test', '2024', '2025'];
        const lower = password.toLowerCase();
        return !personal.some(info => lower.includes(info));
    }

    checkSequential(password) {
        const sequences = ['abc', 'bcd', 'cde', '123', '234', '345', 'qwe', 'wer', 'ert'];
        const lower = password.toLowerCase();
        return !sequences.some(seq => lower.includes(seq));
    }

    checkDictionaryWords(password) {
        const commonWords = ['password', 'welcome', 'computer', 'internet', 'security', 'login', 'access'];
        const lower = password.toLowerCase();
        return !commonWords.some(word => lower.includes(word));
    }

    submitPassword() {
        const password = document.getElementById('passwordInput').value;
        
        // Calculate final score
        const challengeScore = this.currentChallenge.points;
        const lengthBonus = Math.max(0, password.length - this.currentChallenge.requirements.minLength) * 5;
        const totalScore = challengeScore + lengthBonus;
        
        this.score += totalScore;
        this.passwordsCreated++;

        this.feedback.correctAnswer(`Excellent password! +${totalScore} points`);

        if (this.currentLevel < this.maxLevels) {
            setTimeout(() => {
                this.currentLevel++;
                this.loadChallenge();
                this.updateDisplay();
                this.feedback.info(`Moving to level ${this.currentLevel}!`);
            }, 2000);
        } else {
            setTimeout(() => {
                this.endGame();
            }, 2000);
        }

        this.updateDisplay();
    }

    generateExamplePassword() {
        const req = this.currentChallenge.requirements;
        let password = '';

        // Base components
        const words = ['Cyber', 'Secure', 'Shield', 'Guard', 'Vault', 'Strong'];
        const symbols = '!@#$%^&*';
        const numbers = '0123456789';

        // Build password
        password += words[Math.floor(Math.random() * words.length)];
        password += (Math.floor(Math.random() * 100) + 10).toString();
        
        if (req.requireSpecialChars) {
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }
        
        // Add more complexity for higher levels
        if (req.minLength > 12) {
            password += words[Math.floor(Math.random() * words.length)];
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }
        
        if (req.minLength > 16) {
            password += (Math.floor(Math.random() * 100) + 10).toString();
            password += symbols[Math.floor(Math.random() * symbols.length)];
        }

        // Ensure minimum length
        while (password.length < req.minLength) {
            password += Math.random() < 0.5 ? 
                symbols[Math.floor(Math.random() * symbols.length)] :
                (Math.floor(Math.random() * 10)).toString();
        }

        document.getElementById('passwordInput').value = password;
        this.analyzePassword();
        
        this.feedback.info('Example password generated! Study it and create your own.');
    }

    clearPassword() {
        document.getElementById('passwordInput').value = '';
        this.analyzePassword();
    }

    togglePasswordVisibility() {
        const passwordInput = document.getElementById('passwordInput');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        this.hintsLeft--;
        this.feedback.hintUsed(this.hintsLeft);
        
        setTimeout(() => {
            this.feedback.info(this.currentChallenge.hint, {
                title: '💡 Hint',
                duration: 8000
            });
        }, 500);

        this.updateDisplay();
    }

    endGame() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Completion bonus
        this.score += 500;
        
        const stats = this.storage.updateGameScore('password-strength', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.passwordStrength, 'Password Strength Analyzer');
        
        setTimeout(() => {
            const timeString = `${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}`;
            alert(`Congratulations!\n\nYou've mastered password security!\nFinal Score: ${this.score}\nTime: ${timeString}\nPasswords Created: ${this.passwordsCreated}\n\nYou're now a password security expert!`);
            window.location.href = '../index.html';
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('passwordsCreated').textContent = this.passwordsCreated;
        document.getElementById('hintsLeft').textContent = this.hintsLeft;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PasswordStrengthGame();
});
