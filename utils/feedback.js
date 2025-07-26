// User feedback and notification system
class FeedbackSystem {
    constructor() {
        this.container = null;
        this.messageQueue = [];
        this.isProcessingQueue = false;
        this.defaultDuration = 4000; // 4 seconds
        this.maxMessages = 5;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        // Remove existing container if it exists
        const existing = document.getElementById('feedback-container');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'feedback-container';
        this.container.className = 'feedback-container';
        document.body.appendChild(this.container);
    }

    setupStyles() {
        // Add CSS if not already present
        if (!document.getElementById('feedback-styles')) {
            const style = document.createElement('style');
            style.id = 'feedback-styles';
            style.textContent = `
                .feedback-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    pointer-events: none;
                }
                
                .feedback-message {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 10px;
                    padding: 15px 20px;
                    margin-bottom: 10px;
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    min-width: 300px;
                    max-width: 400px;
                    pointer-events: auto;
                    transition: all 0.3s ease;
                    transform: translateX(100%);
                    opacity: 0;
                }
                
                .feedback-message.show {
                    transform: translateX(0);
                    opacity: 1;
                }
                
                .feedback-message.success {
                    border-left: 4px solid #28a745;
                }
                
                .feedback-message.error {
                    border-left: 4px solid #dc3545;
                }
                
                .feedback-message.info {
                    border-left: 4px solid #17a2b8;
                }
                
                .feedback-message.warning {
                    border-left: 4px solid #ffc107;
                }
                
                .feedback-icon {
                    font-size: 1.2rem;
                    flex-shrink: 0;
                }
                
                .feedback-content {
                    flex: 1;
                }
                
                .feedback-title {
                    font-weight: 600;
                    margin-bottom: 2px;
                    color: #2c3e50;
                }
                
                .feedback-text {
                    color: #666;
                    font-size: 0.9rem;
                    line-height: 1.4;
                }
                
                .feedback-close {
                    background: none;
                    border: none;
                    color: #999;
                    cursor: pointer;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .feedback-close:hover {
                    background: rgba(0, 0, 0, 0.1);
                    color: #333;
                }
                
                @media (max-width: 768px) {
                    .feedback-container {
                        left: 20px;
                        right: 20px;
                        top: 20px;
                    }
                    
                    .feedback-message {
                        min-width: auto;
                        max-width: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Main method to show feedback
    show(message, type = 'info', options = {}) {
        const messageObj = {
            id: this.generateId(),
            message: message,
            type: type,
            duration: options.duration || this.defaultDuration,
            title: options.title || null,
            persistent: options.persistent || false,
            callback: options.callback || null
        };

        this.messageQueue.push(messageObj);
        this.processQueue();
    }

    // Convenience methods
    success(message, options = {}) {
        this.show(message, 'success', { 
            title: options.title || 'Success!',
            ...options 
        });
    }

    error(message, options = {}) {
        this.show(message, 'error', { 
            title: options.title || 'Error!',
            duration: options.duration || 6000,
            ...options 
        });
    }

    warning(message, options = {}) {
        this.show(message, 'warning', { 
            title: options.title || 'Warning!',
            duration: options.duration || 5000,
            ...options 
        });
    }

    info(message, options = {}) {
        this.show(message, 'info', { 
            title: options.title || 'Info',
            ...options 
        });
    }

    // Process the message queue
    processQueue() {
        if (this.isProcessingQueue || this.messageQueue.length === 0) {
            return;
        }

        this.isProcessingQueue = true;

        // Remove excess messages if queue is too long
        if (this.messageQueue.length > this.maxMessages) {
            this.messageQueue = this.messageQueue.slice(-this.maxMessages);
        }

        const messageObj = this.messageQueue.shift();
        this.displayMessage(messageObj);

        // Process next message after a short delay
        setTimeout(() => {
            this.isProcessingQueue = false;
            this.processQueue();
        }, 300);
    }

    // Display individual message
    displayMessage(messageObj) {
        const element = this.createElement(messageObj);
        this.container.appendChild(element);

        // Trigger show animation
        requestAnimationFrame(() => {
            element.classList.add('show');
        });

        // Auto-remove message if not persistent
        if (!messageObj.persistent) {
            setTimeout(() => {
                this.removeMessage(element, messageObj);
            }, messageObj.duration);
        }

        // Limit number of visible messages
        this.limitVisibleMessages();
    }

    // Create message element
    createElement(messageObj) {
        const element = document.createElement('div');
        element.className = `feedback-message ${messageObj.type}`;
        element.dataset.id = messageObj.id;

        const icon = this.getIcon(messageObj.type);
        const title = messageObj.title ? `<div class="feedback-title">${this.escapeHtml(messageObj.title)}</div>` : '';
        
        element.innerHTML = `
            <i class="feedback-icon ${icon}"></i>
            <div class="feedback-content">
                ${title}
                <div class="feedback-text">${this.escapeHtml(messageObj.message)}</div>
            </div>
            <button class="feedback-close" title="Close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add close functionality
        const closeBtn = element.querySelector('.feedback-close');
        closeBtn.addEventListener('click', () => {
            this.removeMessage(element, messageObj);
        });

        // Add click callback if provided
        if (messageObj.callback) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', (e) => {
                if (e.target !== closeBtn && !closeBtn.contains(e.target)) {
                    messageObj.callback();
                }
            });
        }

        return element;
    }

    // Get icon for message type
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Remove message with animation
    removeMessage(element, messageObj) {
        if (!element || !element.parentNode) {
            return;
        }

        element.classList.remove('show');
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }

    // Limit number of visible messages
    limitVisibleMessages() {
        const messages = this.container.querySelectorAll('.feedback-message');
        if (messages.length > this.maxMessages) {
            for (let i = 0; i < messages.length - this.maxMessages; i++) {
                const messageId = messages[i].dataset.id;
                this.removeMessage(messages[i], { id: messageId });
            }
        }
    }

    // Clear all messages
    clearAll() {
        const messages = this.container.querySelectorAll('.feedback-message');
        messages.forEach(message => {
            this.removeMessage(message, { id: message.dataset.id });
        });
        this.messageQueue = [];
    }

    // Generate unique ID
    generateId() {
        return 'feedback_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Game-specific feedback methods
    gameComplete(score, bestScore, gameName) {
        if (score > bestScore) {
            this.success(`New high score in ${gameName}!`, {
                title: '🎉 Congratulations!',
                duration: 5000
            });
        } else {
            this.success(`Game completed! Score: ${score}`, {
                title: '✅ Well Done!',
                duration: 4000
            });
        }
    }

    hintUsed(hintsRemaining) {
        this.info(`Hint used. ${hintsRemaining} hints remaining.`, {
            title: '💡 Hint',
            duration: 3000
        });
    }

    correctAnswer(message = 'Correct!') {
        this.success(message, {
            title: '✅ Great job!',
            duration: 2000
        });
    }

    incorrectAnswer(message = 'Try again!') {
        this.warning(message, {
            title: '❌ Not quite right',
            duration: 3000
        });
    }

    gameStarted(gameName) {
        this.info(`Starting ${gameName}`, {
            title: '🎮 Game Started',
            duration: 2000
        });
    }

    saveProgress() {
        this.info('Progress saved automatically', {
            title: '💾 Auto-saved',
            duration: 2000
        });
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.FeedbackSystem = FeedbackSystem;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeedbackSystem;
}
