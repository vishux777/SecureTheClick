// Wi-Fi Security Simulator Game
class WiFiSecurityGame {
    constructor() {
        this.storage = new GameStorage();
        this.feedback = new FeedbackSystem();
        this.currentScenario = 1;
        this.maxScenarios = 5;
        this.score = 0;
        this.hintsLeft = 3;
        this.startTime = Date.now();
        this.safeChoices = 0;
        this.selectedNetwork = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadScenario();
        this.updateDisplay();
        this.feedback.gameStarted('Wi-Fi Security Simulator');
    }

    setupEventListeners() {
        // Hint button
        document.getElementById('hintBtn').addEventListener('click', () => {
            this.showHint();
        });

        // Submit choice button
        document.getElementById('submitChoice').addEventListener('click', () => {
            this.submitChoice();
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
        const scenario = this.getScenarioData(this.currentScenario);
        
        document.getElementById('scenarioTitle').textContent = scenario.title;
        document.getElementById('scenarioDescription').textContent = scenario.description;
        
        this.renderNetworks(scenario.networks);
        this.renderSecurityTips(scenario.tips);
        this.resetSelection();
    }

    getScenarioData(scenario) {
        const scenarios = {
            1: {
                title: "🏠 At Home",
                description: "You've just moved to a new apartment and need to set up internet. Which network should you connect to?",
                networks: [
                    {
                        id: "home-secure",
                        name: "HomeWiFi_5G",
                        security: "WPA3",
                        signal: 5,
                        type: "secure",
                        description: "Your landlord's secured network",
                        isCorrect: true,
                        reasoning: "This is a properly secured network with strong encryption."
                    },
                    {
                        id: "neighbor-open",
                        name: "FreeInternet",
                        security: "Open",
                        signal: 3,
                        type: "dangerous",
                        description: "Neighbor's open network",
                        isCorrect: false,
                        reasoning: "Open networks have no encryption and can be monitored by anyone."
                    },
                    {
                        id: "old-router",
                        name: "Linksys_Default",
                        security: "WEP",
                        signal: 2,
                        type: "vulnerable",
                        description: "Old router with default settings",
                        isCorrect: false,
                        reasoning: "WEP encryption is easily broken and default settings are insecure."
                    },
                    {
                        id: "suspicious",
                        name: "FREE_WIFI_CLICK_HERE",
                        security: "Open",
                        signal: 4,
                        type: "malicious",
                        description: "Suspicious free network",
                        isCorrect: false,
                        reasoning: "This looks like a honeypot designed to steal your data."
                    }
                ],
                tips: [
                    "Always use networks with WPA2 or WPA3 encryption",
                    "Avoid open networks when possible",
                    "Be suspicious of networks with generic or enticing names",
                    "Check with your ISP or landlord for official network names"
                ]
            },
            2: {
                title: "☕ Coffee Shop",
                description: "You're at a coffee shop and need internet for work. Which network is safest?",
                networks: [
                    {
                        id: "coffee-guest",
                        name: "CafeGuest_Secure",
                        security: "WPA2",
                        signal: 5,
                        type: "secure",
                        description: "Official cafe guest network",
                        isCorrect: true,
                        reasoning: "Official business networks with proper security are safest in public."
                    },
                    {
                        id: "coffee-free",
                        name: "Free_Coffee_WiFi",
                        security: "Open",
                        signal: 5,
                        type: "risky",
                        description: "Open network (ask staff for password)",
                        isCorrect: false,
                        reasoning: "Even if legitimate, open networks can be monitored by other users."
                    },
                    {
                        id: "hotspot",
                        name: "Your Mobile Hotspot",
                        security: "WPA3",
                        signal: 4,
                        type: "secure",
                        description: "Your own mobile hotspot",
                        isCorrect: true,
                        reasoning: "Your own hotspot is the most secure option in public places."
                    },
                    {
                        id: "fake-cafe",
                        name: "Cafe_Free_Internet",
                        security: "Open",
                        signal: 3,
                        type: "dangerous",
                        description: "Unofficial network with similar name",
                        isCorrect: false,
                        reasoning: "This could be a fake network set up to steal your information."
                    }
                ],
                tips: [
                    "Ask staff for official network credentials",
                    "Use your mobile hotspot when available",
                    "Avoid banking or sensitive activities on public WiFi",
                    "Consider using a VPN for extra protection"
                ]
            },
            3: {
                title: "✈️ Airport",
                description: "You're waiting for your flight and need to check emails. Which connection method is most secure?",
                networks: [
                    {
                        id: "airport-paid",
                        name: "Airport_Premium_WiFi",
                        security: "WPA2",
                        signal: 5,
                        type: "secure",
                        description: "Paid airport WiFi service",
                        isCorrect: true,
                        reasoning: "Paid services typically have better security and monitoring."
                    },
                    {
                        id: "airport-free",
                        name: "Free_Airport_WiFi",
                        security: "Open",
                        signal: 4,
                        type: "risky",
                        description: "Free airport WiFi",
                        isCorrect: false,
                        reasoning: "Free public WiFi at airports is monitored by many users and potential attackers."
                    },
                    {
                        id: "cellular",
                        name: "4G/5G Cellular Data",
                        security: "Encrypted",
                        signal: 4,
                        type: "secure",
                        description: "Your cellular data connection",
                        isCorrect: true,
                        reasoning: "Cellular data is encrypted and more secure than public WiFi."
                    },
                    {
                        id: "evil-twin",
                        name: "Airport_Free_Internet",
                        security: "Open",
                        signal: 5,
                        type: "malicious",
                        description: "Another free network",
                        isCorrect: false,
                        reasoning: "This could be an 'evil twin' network mimicking legitimate airport WiFi."
                    }
                ],
                tips: [
                    "Use cellular data when possible at airports",
                    "Be wary of multiple similar network names",
                    "Paid WiFi services are generally more secure",
                    "Always verify network names with airport staff"
                ]
            },
            4: {
                title: "🏨 Hotel",
                description: "You're staying at a hotel for business. You need secure internet for confidential work. What's your best option?",
                networks: [
                    {
                        id: "hotel-guest",
                        name: "Hotel_Guest_WiFi",
                        security: "WPA2",
                        signal: 5,
                        type: "acceptable",
                        description: "Official hotel guest network",
                        isCorrect: false,
                        reasoning: "While legitimate, hotel WiFi is shared and not ideal for confidential work."
                    },
                    {
                        id: "business-center",
                        name: "Hotel_Business_Center",
                        security: "WPA2-Enterprise",
                        signal: 4,
                        type: "secure",
                        description: "Hotel business center network",
                        isCorrect: true,
                        reasoning: "Business center networks typically have enterprise-grade security."
                    },
                    {
                        id: "vpn-cellular",
                        name: "VPN + Cellular Data",
                        security: "Encrypted",
                        signal: 4,
                        type: "secure",
                        description: "Your cellular connection with VPN",
                        isCorrect: true,
                        reasoning: "VPN over cellular provides the highest security for confidential work."
                    },
                    {
                        id: "room-ethernet",
                        name: "Hotel Room Ethernet",
                        security: "Wired",
                        signal: 5,
                        type: "secure",
                        description: "Wired connection in your room",
                        isCorrect: true,
                        reasoning: "Wired connections are more secure than WiFi and less susceptible to interception."
                    }
                ],
                tips: [
                    "Use wired connections when available for sensitive work",
                    "VPN over any connection adds security",
                    "Business center networks often have better security",
                    "Avoid confidential work on shared hotel WiFi"
                ]
            },
            5: {
                title: "🎓 University Campus",
                description: "You're a student on campus and notice several network options. Which practices are most secure?",
                networks: [
                    {
                        id: "university-secure",
                        name: "University_Secure",
                        security: "WPA2-Enterprise",
                        signal: 5,
                        type: "secure",
                        description: "Official university network (requires login)",
                        isCorrect: true,
                        reasoning: "Enterprise-grade security with individual authentication is most secure."
                    },
                    {
                        id: "university-guest",
                        name: "University_Guest",
                        security: "Open",
                        signal: 4,
                        type: "risky",
                        description: "University guest network",
                        isCorrect: false,
                        reasoning: "Guest networks are open and shared by many users including visitors."
                    },
                    {
                        id: "eduroam",
                        name: "eduroam",
                        security: "WPA2-Enterprise",
                        signal: 5,
                        type: "secure",
                        description: "International education roaming network",
                        isCorrect: true,
                        reasoning: "Eduroam uses enterprise security and is trusted worldwide."
                    },
                    {
                        id: "student-hotspot",
                        name: "StudentLife_Free",
                        security: "Open",
                        signal: 3,
                        type: "suspicious",
                        description: "Unofficial student network",
                        isCorrect: false,
                        reasoning: "Unofficial networks could be set up by students or attackers to monitor traffic."
                    }
                ],
                tips: [
                    "Use official university networks with your credentials",
                    "Eduroam provides secure access at participating institutions worldwide",
                    "Be cautious of unofficial student-run networks",
                    "Always authenticate with your official university account"
                ]
            }
        };

        return scenarios[scenario] || scenarios[1];
    }

    renderNetworks(networks) {
        const container = document.getElementById('wifiNetworks');
        container.innerHTML = '';

        networks.forEach(network => {
            const networkElement = document.createElement('div');
            networkElement.className = 'wifi-network';
            networkElement.dataset.id = network.id;
            
            const signalBars = '█'.repeat(network.signal) + '░'.repeat(5 - network.signal);
            const securityIcon = this.getSecurityIcon(network.security, network.type);
            
            networkElement.innerHTML = `
                <div class="wifi-info">
                    <div class="wifi-icon">
                        <i class="fas fa-wifi"></i>
                    </div>
                    <div class="wifi-details">
                        <h4>${network.name}</h4>
                        <p>${network.description}</p>
                    </div>
                </div>
                <div class="wifi-security">
                    <div class="security-info">
                        ${securityIcon}
                        <span>${network.security}</span>
                    </div>
                    <div class="signal-strength" title="Signal: ${network.signal}/5">
                        ${signalBars}
                    </div>
                </div>
            `;

            networkElement.addEventListener('click', () => {
                this.selectNetwork(network, networkElement);
            });

            container.appendChild(networkElement);
        });
    }

    getSecurityIcon(security, type) {
        if (type === 'malicious' || type === 'dangerous') {
            return '<i class="fas fa-exclamation-triangle" style="color: #dc3545;"></i>';
        }
        
        switch (security) {
            case 'WPA3':
            case 'WPA2-Enterprise':
                return '<i class="fas fa-shield-alt" style="color: #28a745;"></i>';
            case 'WPA2':
                return '<i class="fas fa-shield" style="color: #17a2b8;"></i>';
            case 'WEP':
                return '<i class="fas fa-shield" style="color: #ffc107;"></i>';
            case 'Open':
                return '<i class="fas fa-unlock" style="color: #dc3545;"></i>';
            case 'Encrypted':
                return '<i class="fas fa-lock" style="color: #28a745;"></i>';
            default:
                return '<i class="fas fa-question" style="color: #6c757d;"></i>';
        }
    }

    renderSecurityTips(tips) {
        const tipsList = document.getElementById('tipsList');
        tipsList.innerHTML = '';

        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });
    }

    selectNetwork(network, element) {
        // Clear previous selections
        document.querySelectorAll('.wifi-network').forEach(el => {
            el.classList.remove('selected');
        });

        // Select current network
        element.classList.add('selected');
        this.selectedNetwork = network;
        
        document.getElementById('submitChoice').disabled = false;
    }

    submitChoice() {
        if (!this.selectedNetwork) return;

        const isCorrect = this.selectedNetwork.isCorrect;
        
        // Clear previous feedback classes
        document.querySelectorAll('.wifi-network').forEach(el => {
            el.classList.remove('correct', 'incorrect');
        });

        if (isCorrect) {
            document.querySelector(`[data-id="${this.selectedNetwork.id}"]`).classList.add('correct');
            this.score += 100;
            this.safeChoices++;
            this.feedback.correctAnswer(`Good choice! ${this.selectedNetwork.reasoning}`);
        } else {
            document.querySelector(`[data-id="${this.selectedNetwork.id}"]`).classList.add('incorrect');
            this.feedback.incorrectAnswer(`Not the safest option. ${this.selectedNetwork.reasoning}`);
            
            // Show correct answers
            const scenario = this.getScenarioData(this.currentScenario);
            scenario.networks.forEach(network => {
                if (network.isCorrect) {
                    document.querySelector(`[data-id="${network.id}"]`).classList.add('correct');
                }
            });
        }

        document.getElementById('submitChoice').disabled = true;
        document.getElementById('nextScenario').style.display = 'inline-block';
        this.updateDisplay();
    }

    showHint() {
        if (this.hintsLeft <= 0) {
            this.feedback.warning('No hints remaining!');
            return;
        }

        const scenario = this.getScenarioData(this.currentScenario);
        const hints = {
            1: "Look for networks with strong encryption (WPA2/WPA3) and avoid open networks or those with suspicious names.",
            2: "In public places, your mobile hotspot or official business networks are safest. Verify network names with staff.",
            3: "Cellular data is generally more secure than public WiFi. If using WiFi, prefer paid services over free ones.",
            4: "For confidential work, use wired connections, VPN, or business-grade networks rather than general guest WiFi.",
            5: "University networks with authentication (like eduroam) are more secure than open guest networks."
        };

        this.hintsLeft--;
        this.feedback.hintUsed(this.hintsLeft);
        
        setTimeout(() => {
            this.feedback.info(hints[this.currentScenario] || "Choose networks with strong encryption and avoid suspicious names.", {
                title: '💡 Hint',
                duration: 8000
            });
        }, 500);

        this.updateDisplay();
    }

    nextScenario() {
        if (this.currentScenario < this.maxScenarios) {
            this.currentScenario++;
            this.loadScenario();
            document.getElementById('nextScenario').style.display = 'none';
            this.updateDisplay();
        } else {
            this.endGame();
        }
    }

    resetScenario() {
        this.resetSelection();
        
        document.querySelectorAll('.wifi-network').forEach(el => {
            el.classList.remove('selected', 'correct', 'incorrect');
        });
        
        document.getElementById('nextScenario').style.display = 'none';
        this.feedback.info('Selection reset. Choose the safest network option.');
    }

    resetSelection() {
        this.selectedNetwork = null;
        document.getElementById('submitChoice').disabled = true;
        
        document.querySelectorAll('.wifi-network').forEach(el => {
            el.classList.remove('selected');
        });
    }

    endGame() {
        const finalTime = Math.floor((Date.now() - this.startTime) / 1000);
        
        // Bonus for making safe choices
        const safeChoiceBonus = this.safeChoices * 50;
        this.score += safeChoiceBonus;
        
        const stats = this.storage.updateGameScore('wifi-security', this.score, finalTime);
        
        this.feedback.gameComplete(this.score, stats.bestScores.wifiSecurity, 'Wi-Fi Security Simulator');
        
        setTimeout(() => {
            const timeString = `${Math.floor(finalTime/60)}:${(finalTime%60).toString().padStart(2,'0')}`;
            alert(`Congratulations!\n\nYou've completed Wi-Fi Security training!\nFinal Score: ${this.score}\nTime: ${timeString}\nSafe Choices: ${this.safeChoices}/${this.maxScenarios}\n\nYou now know how to choose secure networks!`);
            window.location.href = '../index.html';
        }, 2000);
    }

    updateDisplay() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('currentScenario').textContent = this.currentScenario;
        document.getElementById('safeChoices').textContent = this.safeChoices;
        document.getElementById('hintsLeft').textContent = this.hintsLeft;
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('timeDisplay').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new WiFiSecurityGame();
});
