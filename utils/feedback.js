// Feedback system for displaying messages to users
class FeedbackSystem {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isShowing = false;
        this.init();
    }

    init() {
        this.createContainer();
        // Make the feedback system globally available
        window.feedbackSystem = this;
    }

    createContainer() {
        // Remove existing container if it exists
        const existing = document.getElementById('feedbackContainer');
        if (existing) {
            existing.remove();
        }

        this.container = document.createElement('div');
        this.container.id = 'feedbackContainer';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }

    show(message, type = 'info', duration = 3000) {
        // Add to queue if currently showing a message
        if (this.isShowing) {
            this.queue.push({ message, type, duration });
            return;
        }

        this.displayMessage(message, type, duration);
    }

    displayMessage(message, type, duration) {
        this.isShowing = true;

        const feedbackElement = document.createElement('div');
        feedbackElement.className = `feedback ${type}`;
        feedbackElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                ${this.getIcon(type)}
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none; 
                    border: none; 
                    color: white; 
                    font-size: 18px; 
                    cursor: pointer;
                    pointer-events: all;
                    padding: 0;
                    margin-left: 10px;
                ">&times;</button>
            </div>
        `;

        // Apply base styles
        feedbackElement.style.cssText = `
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
            word-wrap: break-word;
            pointer-events: all;
        `;

        // Apply type-specific styles
        const typeStyles = {
            success: 'background: linear-gradient(45deg, #28a745, #20c997);',
            error: 'background: linear-gradient(45deg, #dc3545, #fd7e14);',
            info: 'background: linear-gradient(45deg, #007bff, #6f42c1);',
            warning: 'background: linear-gradient(45deg, #ffc107, #fd7e14);'
        };

        feedbackElement.style.cssText += typeStyles[type] || typeStyles.info;

        this.container.appendChild(feedbackElement);

        // Animate in
        setTimeout(() => {
            feedbackElement.style.transform = 'translateX(0)';
        }, 10);

        // Auto-remove after duration
        const timeoutId = setTimeout(() => {
            this.removeMessage(feedbackElement);
        }, duration);

        // Store timeout ID for potential cancellation
        feedbackElement.timeoutId = timeoutId;

        // Add click to dismiss
        feedbackElement.addEventListener('click', () => {
            clearTimeout(timeoutId);
            this.removeMessage(feedbackElement);
        });
    }

    removeMessage(element) {
        element.style.transform = 'translateX(100%)';
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            
            this.isShowing = false;
            
            // Process queue
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                setTimeout(() => {
                    this.displayMessage(next.message, next.type, next.duration);
                }, 100);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            warning: '<i class="fas fa-exclamation-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    // Convenience methods
    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    // Clear all messages
    clearAll() {
        this.queue = [];
        const messages = this.container.querySelectorAll('.feedback');
        messages.forEach(message => {
            clearTimeout(message.timeoutId);
            this.removeMessage(message);
        });
    }

    // Show achievement notification with special styling
    achievement(title, description) {
        const achievementElement = document.createElement('div');
        achievementElement.className = 'feedback achievement';
        achievementElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="
                    background: linear-gradient(45deg, #ffd700, #ffed4e);
                    color: #333;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                ">🏆</div>
                <div>
                    <div style="font-weight: bold; margin-bottom: 2px;">${title}</div>
                    <div style="font-size: 12px; opacity: 0.9;">${description}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none; 
                    border: none; 
                    color: white; 
                    font-size: 18px; 
                    cursor: pointer;
                    pointer-events: all;
                    padding: 0;
                ">&times;</button>
            </div>
        `;

        achievementElement.style.cssText = `
            padding: 20px;
            border-radius: 12px;
            background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: all 0.5s ease;
            box-shadow: 0 8px 25px rgba(0,0,0,0.4);
            max-width: 350px;
            pointer-events: all;
            border: 2px solid rgba(255,215,0,0.3);
        `;

        this.container.appendChild(achievementElement);

        // Animate in with bounce effect
        setTimeout(() => {
            achievementElement.style.transform = 'translateX(0) scale(1.05)';
        }, 10);

        setTimeout(() => {
            achievementElement.style.transform = 'translateX(0) scale(1)';
        }, 200);

        // Auto-remove after longer duration
        setTimeout(() => {
            this.removeMessage(achievementElement);
        }, 5000);

        // Add click to dismiss
        achievementElement.addEventListener('click', () => {
            this.removeMessage(achievementElement);
        });
    }

    // Progressive loading indicator
    showLoading(message = 'Loading...') {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'feedback loading';
        loadingElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top: 2px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                <span>${message}</span>
            </div>
        `;

        loadingElement.style.cssText = `
            padding: 15px 20px;
            border-radius: 8px;
            background: linear-gradient(45deg, #6c757d, #495057);
            color: white;
            font-weight: 600;
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            max-width: 300px;
            pointer-events: all;
        `;

        // Add spinner animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        this.container.appendChild(loadingElement);

        setTimeout(() => {
            loadingElement.style.transform = 'translateX(0)';
        }, 10);

        return {
            dismiss: () => this.removeMessage(loadingElement),
            updateMessage: (newMessage) => {
                const span = loadingElement.querySelector('span');
                if (span) span.textContent = newMessage;
            }
        };
    }
}
