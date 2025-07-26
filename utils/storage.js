// Local storage management utility
class GameStorage {
    constructor() {
        this.storageKey = 'cyberAwarenessGame';
        this.defaultStats = {
            totalScore: 0,
            gamesCompleted: 0,
            bestScores: {
                phishing: 0,
                matching: 0,
                spotDanger: 0,
                passwordStrength: 0,
                wifiSecurity: 0,
                malwareIdentification: 0,
                dataPrivacyQuiz: 0
            },
            gameHistory: [],
            settings: {
                soundEnabled: true,
                animationsEnabled: true,
                difficulty: 'normal'
            },
            achievements: [],
            lastPlayed: null
        };
    }

    // Get all statistics
    getStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with defaults to ensure all properties exist
                return this.mergeWithDefaults(parsed);
            }
        } catch (error) {
            console.error('Error loading stats from localStorage:', error);
        }
        return { ...this.defaultStats };
    }

    // Save statistics
    saveStats(stats) {
        try {
            const toSave = {
                ...stats,
                lastPlayed: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(toSave));
            return true;
        } catch (error) {
            console.error('Error saving stats to localStorage:', error);
            return false;
        }
    }

    // Update score for specific game
    updateGameScore(gameType, score, timeSpent = 0) {
        const stats = this.getStats();
        const gameKey = this.getGameKey(gameType);
        
        if (gameKey && score > stats.bestScores[gameKey]) {
            stats.bestScores[gameKey] = score;
            stats.totalScore += (score - (stats.bestScores[gameKey] || 0));
        }

        // Add to game history
        stats.gameHistory.push({
            game: gameType,
            score: score,
            timestamp: new Date().toISOString(),
            timeSpent: timeSpent
        });

        // Keep only last 50 game records
        if (stats.gameHistory.length > 50) {
            stats.gameHistory = stats.gameHistory.slice(-50);
        }

        // Update games completed count
        stats.gamesCompleted = stats.gameHistory.length;

        this.saveStats(stats);
        return stats;
    }

    // Get game key mapping
    getGameKey(gameType) {
        const keyMap = {
            'phishing': 'phishing',
            'phishing-drag-drop': 'phishing',
            'matching': 'matching',
            'social-engineering-match': 'matching',
            'spot-danger': 'spotDanger',
            'spot-the-danger': 'spotDanger',
            'password-strength': 'passwordStrength',
            'wifi-security': 'wifiSecurity',
            'malware-identification': 'malwareIdentification',
            'data-privacy-quiz': 'dataPrivacyQuiz'
        };
        return keyMap[gameType];
    }

    // Merge stored data with defaults
    mergeWithDefaults(stored) {
        const merged = { ...this.defaultStats };
        
        // Merge top-level properties
        Object.keys(stored).forEach(key => {
            if (typeof stored[key] === 'object' && stored[key] !== null && !Array.isArray(stored[key])) {
                merged[key] = { ...merged[key], ...stored[key] };
            } else {
                merged[key] = stored[key];
            }
        });

        return merged;
    }

    // Get settings
    getSettings() {
        const stats = this.getStats();
        return stats.settings;
    }

    // Update settings
    updateSettings(newSettings) {
        const stats = this.getStats();
        stats.settings = { ...stats.settings, ...newSettings };
        this.saveStats(stats);
        return stats.settings;
    }

    // Get game history
    getGameHistory(gameType = null, limit = 10) {
        const stats = this.getStats();
        let history = stats.gameHistory;

        if (gameType) {
            history = history.filter(record => record.game === gameType);
        }

        return history
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    // Get achievements
    getAchievements() {
        const stats = this.getStats();
        return stats.achievements;
    }

    // Add achievement
    addAchievement(achievementId, name, description) {
        const stats = this.getStats();
        
        // Check if achievement already exists
        if (!stats.achievements.find(a => a.id === achievementId)) {
            stats.achievements.push({
                id: achievementId,
                name: name,
                description: description,
                unlockedAt: new Date().toISOString()
            });
            
            this.saveStats(stats);
            return true;
        }
        return false;
    }

    // Clear all data
    clearData() {
        try {
            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error('Error clearing localStorage:', error);
            return false;
        }
    }

    // Export data
    exportData() {
        const stats = this.getStats();
        return {
            data: stats,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }

    // Import data
    importData(importData) {
        try {
            if (importData.data && typeof importData.data === 'object') {
                const mergedData = this.mergeWithDefaults(importData.data);
                this.saveStats(mergedData);
                return true;
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
        return false;
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            const used = JSON.stringify(this.getStats()).length;
            const available = this.getStorageQuota();
            
            return {
                used: used,
                available: available,
                usedFormatted: this.formatBytes(used),
                availableFormatted: this.formatBytes(available),
                percentUsed: available > 0 ? (used / available) * 100 : 0
            };
        } catch (error) {
            console.error('Error getting storage info:', error);
            return null;
        }
    }

    // Get approximate storage quota
    getStorageQuota() {
        try {
            // Test storage limit (rough estimate)
            let test = 'x';
            while (test.length < 10000000) { // 10MB test
                try {
                    localStorage.setItem('test', test);
                    localStorage.removeItem('test');
                    test += test;
                } catch (e) {
                    break;
                }
            }
            return test.length;
        } catch (error) {
            return 5000000; // Default 5MB estimate
        }
    }

    // Format bytes to human readable
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Check if localStorage is available
    isStorageAvailable() {
        try {
            const test = 'localStorage-test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.GameStorage = GameStorage;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameStorage;
}
