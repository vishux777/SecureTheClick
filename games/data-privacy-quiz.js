// Data Privacy Quiz Game
class DataPrivacyQuizGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentQuestion = 1;
        this.totalQuestions = 15;
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.correctAnswers = 0;
        this.selectedAnswer = null;
        this.questions = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadQuestions();
        this.loadQuestion();
        this.updateDisplay();
        this.feedback.gameStarted('Data Privacy Quiz');
    }

    setupEventListeners() {
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });

        // Submit answer button
        document.getElementById('submitAnswer').addEventListener('click', () => {
            this.submitAnswer();
        });

        // Next question button
        document.getElementById('nextQuestion').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Skip question button
        document.getElementById('skipQuestion').addEventListener('click', () => {
            this.skipQuestion();
        });
    }

    loadQuestions() {
        this.questions = this.shuffleArray([
            {
                id: 1,
                text: "What does GDPR stand for?",
                options: [
                    "General Data Protection Regulation",
                    "Global Data Privacy Rights",
                    "General Digital Protection Rules",
                    "Global Digital Privacy Regulation"
                ],
                correct: 0,
                explanation: "GDPR stands for General Data Protection Regulation, a comprehensive data protection law in the EU that took effect in 2018.",
                hint: "Think about the comprehensive European data protection law that started in 2018."
            },
            {
                id: 2,
                text: "Under GDPR, what is the maximum time a company has to notify authorities of a data breach?",
                options: [
                    "24 hours",
                    "48 hours", 
                    "72 hours",
                    "7 days"
                ],
                correct: 2,
                explanation: "Under GDPR, organizations must notify the relevant supervisory authority within 72 hours of becoming aware of a data breach.",
                hint: "It's measured in hours, not days, and it's more than 48 hours but less than a week."
            },
            {
                id: 3,
                text: "What is the 'right to be forgotten' under GDPR?",
                options: [
                    "The right to delete your social media accounts",
                    "The right to have your personal data erased",
                    "The right to forget your password",
                    "The right to anonymous browsing"
                ],
                correct: 1,
                explanation: "The right to be forgotten allows individuals to request that their personal data be erased under certain circumstances.",
                hint: "This right is about removing your personal information from company databases."
            },
            {
                id: 4,
                text: "What constitutes 'personal data' under GDPR?",
                options: [
                    "Only name and address",
                    "Only financial information",
                    "Any information that can identify a person",
                    "Only government-issued ID numbers"
                ],
                correct: 2,
                explanation: "Personal data under GDPR is any information relating to an identifiable person, including names, addresses, photos, email addresses, IP addresses, and more.",
                hint: "GDPR has a very broad definition that includes anything that could identify someone."
            },
            {
                id: 5,
                text: "What is the maximum fine under GDPR for serious violations?",
                options: [
                    "€10 million or 2% of annual turnover",
                    "€20 million or 4% of annual turnover",
                    "€50 million or 10% of annual turnover",
                    "€100 million or 20% of annual turnover"
                ],
                correct: 1,
                explanation: "The maximum GDPR fine is €20 million or 4% of the company's global annual turnover, whichever is higher.",
                hint: "It's in the millions of euros and is based on a percentage of company revenue."
            },
            {
                id: 6,
                text: "What does 'data minimization' mean in privacy law?",
                options: [
                    "Using the smallest possible storage devices",
                    "Collecting only data that is necessary for the stated purpose",
                    "Reducing data file sizes",
                    "Minimizing data processing time"
                ],
                correct: 1,
                explanation: "Data minimization means collecting and processing only the personal data that is adequate, relevant, and limited to what is necessary.",
                hint: "It's about collecting only what you actually need, not about file sizes."
            },
            {
                id: 7,
                text: "What is required for valid consent under GDPR?",
                options: [
                    "Just clicking 'I agree'",
                    "Pre-checked boxes are sufficient",
                    "Clear, specific, informed, and freely given agreement",
                    "Implied consent through website usage"
                ],
                correct: 2,
                explanation: "Valid consent under GDPR must be freely given, specific, informed, and unambiguous. Pre-checked boxes and implied consent are not valid.",
                hint: "Think about what makes consent meaningful and legitimate - it needs to be truly voluntary and informed."
            },
            {
                id: 8,
                text: "Which of these is NOT a data subject right under GDPR?",
                options: [
                    "Right of access",
                    "Right to rectification",
                    "Right to data ownership",
                    "Right to data portability"
                ],
                correct: 2,
                explanation: "There is no 'right to data ownership' under GDPR. The actual rights include access, rectification, erasure, portability, and others.",
                hint: "GDPR gives you rights to control your data, but doesn't make you the 'owner' of it."
            },
            {
                id: 9,
                text: "What is a Data Protection Officer (DPO) required to do?",
                options: [
                    "Only handle data breaches",
                    "Monitor compliance and provide guidance on data protection",
                    "Only train employees",
                    "Only communicate with regulators"
                ],
                correct: 1,
                explanation: "A DPO monitors internal compliance, provides guidance on data protection impact assessments, and serves as a contact point for data subjects and supervisory authorities.",
                hint: "The DPO has a comprehensive role overseeing all aspects of data protection compliance."
            },
            {
                id: 10,
                text: "What is 'pseudonymization' in data privacy?",
                options: [
                    "Using fake names for employees",
                    "Processing data so it cannot be attributed to a person without additional information",
                    "Creating anonymous user accounts",
                    "Encrypting all data files"
                ],
                correct: 1,
                explanation: "Pseudonymization means processing personal data so it can no longer be attributed to a specific person without additional information kept separately.",
                hint: "It's about making data less identifiable while still keeping it useful for processing."
            },
            {
                id: 11,
                text: "When can a company transfer EU personal data to a non-EU country?",
                options: [
                    "Never under any circumstances",
                    "Only with adequate safeguards and legal basis",
                    "Anytime without restrictions",
                    "Only to the United States"
                ],
                correct: 1,
                explanation: "International transfers require adequate safeguards such as adequacy decisions, standard contractual clauses, or binding corporate rules.",
                hint: "Transfers are possible but require proper legal protections to be in place."
            },
            {
                id: 12,
                text: "What is a 'data controller' under GDPR?",
                options: [
                    "A person who controls computer access",
                    "The entity that determines purposes and means of processing personal data",
                    "A software program that manages databases",
                    "An employee who handles customer data"
                ],
                correct: 1,
                explanation: "A data controller is the entity (person, company, authority) that determines the purposes and means of processing personal data.",
                hint: "Think about who makes the decisions about how and why personal data is used."
            },
            {
                id: 13,
                text: "What should you do if you receive a suspicious email asking for personal information?",
                options: [
                    "Provide the information if it looks official",
                    "Forward it to friends to verify",
                    "Delete it and report it as phishing",
                    "Reply asking for more details"
                ],
                correct: 2,
                explanation: "Suspicious emails requesting personal information should be deleted and reported as potential phishing attempts. Never provide personal data via email.",
                hint: "When in doubt about email requests for personal info, the safest approach is to not engage."
            },
            {
                id: 14,
                text: "What is the purpose of a privacy policy?",
                options: [
                    "To make legal documents longer",
                    "To inform users about data collection and processing practices",
                    "To hide what companies do with data",
                    "To meet minimum legal requirements only"
                ],
                correct: 1,
                explanation: "Privacy policies should clearly inform users about what personal data is collected, how it's used, who it's shared with, and what rights users have.",
                hint: "Think about transparency and informing users about data practices."
            },
            {
                id: 15,
                text: "What is 'privacy by design'?",
                options: [
                    "Making privacy policies easy to read",
                    "Building privacy protections into systems from the start",
                    "Designing websites with privacy settings",
                    "Creating private networks"
                ],
                correct: 1,
                explanation: "Privacy by design means incorporating privacy considerations into the design and architecture of systems and processes from the beginning.",
                hint: "It's about building privacy protection into technology from the ground up, not adding it later."
            },
            {
                id: 16,
                text: "Which of these is the best practice for password privacy?",
                options: [
                    "Use the same password for all accounts",
                    "Share passwords with trusted friends",
                    "Use unique, strong passwords for each account",
                    "Write passwords down and keep them visible"
                ],
                correct: 2,
                explanation: "Each account should have a unique, strong password to prevent credential stuffing attacks and limit damage if one account is compromised.",
                hint: "Think about what happens if one of your accounts gets hacked - how can you limit the damage?"
            },
            {
                id: 17,
                text: "What information should you avoid sharing on social media?",
                options: [
                    "Your hobbies and interests",
                    "Your full address, phone number, and location details",
                    "Photos of your pets",
                    "Your favorite movies"
                ],
                correct: 1,
                explanation: "Avoid sharing sensitive personal information like full addresses, phone numbers, exact locations, and travel plans as these can be used for identity theft or physical harm.",
                hint: "Consider what information could be used by someone with malicious intent to harm you."
            },
            {
                id: 18,
                text: "What is two-factor authentication (2FA)?",
                options: [
                    "Using two different passwords",
                    "Having two user accounts",
                    "An additional security step beyond just a password",
                    "Two people sharing one account"
                ],
                correct: 2,
                explanation: "Two-factor authentication adds an extra layer of security by requiring something you know (password) plus something you have (phone, token) or are (biometric).",
                hint: "It's about adding an extra step to prove it's really you logging in."
            },
            {
                id: 19,
                text: "What should you do before disposing of an old computer or phone?",
                options: [
                    "Just delete files normally",
                    "Remove the battery",
                    "Securely wipe all data and perform factory reset",
                    "Give it away immediately"
                ],
                correct: 2,
                explanation: "Before disposing of devices, securely wipe all data using specialized software and perform factory resets to prevent data recovery by others.",
                hint: "Simply deleting files doesn't actually remove them completely from the device."
            },
            {
                id: 20,
                text: "What is the main risk of using public Wi-Fi for sensitive activities?",
                options: [
                    "Slower internet speed",
                    "Higher battery consumption",
                    "Data interception by malicious actors",
                    "Limited bandwidth"
                ],
                correct: 2,
                explanation: "Public Wi-Fi networks are often unsecured, allowing malicious actors to intercept data transmissions and potentially steal sensitive information.",
                hint: "Think about who else might be able to see your internet traffic on an open network."
            }
        ]).slice(0, this.totalQuestions);
        
        document.getElementById('totalQuestions').textContent = this.totalQuestions;
    }

    loadQuestion() {
        if (this.currentQuestion > this.questions.length) {
            this.endGame();
            return;
        }

        const question = this.questions[this.currentQuestion - 1];
        
        document.getElementById('questionText').textContent = question.text;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'quiz-option';
            optionElement.dataset.index = index;
            optionElement.textContent = option;
            
            optionElement.addEventListener('click', () => {
                this.selectOption(index, optionElement);
            });
            
            optionsContainer.appendChild(optionElement);
        });

        // Hide feedback and reset buttons
        document.getElementById('questionFeedback').style.display = 'none';
        document.getElementById('nextQuestion').style.display = 'none';
        document.getElementById('submitAnswer').disabled = true;
        this.selectedAnswer = null;
    }

    selectOption(index, element) {
        // Clear previous selections
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Select current option
        element.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }

    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.questions[this.currentQuestion - 1];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Show visual feedback on options
        document.querySelectorAll('.quiz-option').forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
        });

        // Update score and stats
        if (isCorrect) {
            this.score += 100;
            this.correctAnswers++;
            this.feedback.correctAnswer('Correct answer!');
        } else {
            this.feedback.incorrectAnswer('Not quite right. Check the explanation below.');
        }

        // Show explanation
        this.showQuestionFeedback(question, isCorrect);
        
        // Update controls
        document.getElementById('submitAnswer').disabled = true;
        document.getElementById('nextQuestion').style.display = 'inline-block';
        
        this.updateDisplay();
    }

    showQuestionFeedback(question, isCorrect) {
        const feedbackContainer = document.getElementById('questionFeedback');
        const feedbackTitle = document.getElementById('feedbackTitle');
        const feedbackText = document.getElementById('feedbackText');
        
        feedbackTitle.textContent = isCorrect ? '✅ Correct!' : '❌ Incorrect';
        feedbackText.textContent = question.explanation;
        
        feedbackContainer.style.display = 'block';
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        const question = this.questions[this.currentQuestion - 1];
        
        this.hintsLeft--;
        this.feedback.hintUsed(this.hintsLeft);
        
        setTimeout(() => {
            this.feedback.info(question.hint, {
                title: '💡 Hint',
                duration: 6000
            });
        }, 500);

        this.updateDisplay();
    }

    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
        this.updateDisplay();
    }

    skipQuestion() {
        // Mark as skipped (no points)
        this.feedback.info('Question skipped. No points awarded.');
        this.currentQuestion++;
        this.loadQuestion();
        this.updateDisplay();
    }

    endGame() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Calculate final score with bonuses
        const accuracyBonus = Math.round((this.correctAnswers / this.totalQuestions) * 200);
        const speedBonus = Math.max(0, 300 - Math.floor(finalTime / 10)); // Bonus decreases over time
        const completionBonus = 100;
        
        this.score += accuracyBonus + speedBonus + completionBonus;
        
        const stats = this.storage.updateGameScore('data-privacy-quiz', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.dataPrivacyQuiz, 'Data Privacy Quiz');
        
        setTimeout(() => {
            const accuracy = ((this.correctAnswers / this.totalQuestions) * 100).toFixed(1);
            const timeString = `${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}`;
            
            let gradeText = '';
            if (accuracy >= 90) gradeText = 'Excellent knowledge!';
            else if (accuracy >= 80) gradeText = 'Good understanding!';
            else if (accuracy >= 70) gradeText = 'Fair knowledge.';
            else gradeText = 'Keep learning!';
            
            alert(`Quiz Complete!\n\nFinal Score: ${this.score}\nAccuracy: ${accuracy}% (${this.correctAnswers}/${this.totalQuestions})\nTime: ${timeString}\n\n${gradeText}\n\nYou now understand data privacy better!`);
            window.location.href = '../index.html';
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentQuestion').textContent = this.currentQuestion;
        document.getElementById('correctAnswers').textContent = this.correctAnswers;
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
    new DataPrivacyQuizGame();
});
