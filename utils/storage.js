// Local storage utility for managing game data
class GameStorage {
    constructor() {
        this.storageKey = 'cyberAwarenessGame';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.storageKey)) {
            const defaultData = {
                totalScore: 0,
                gamesCompleted: 0,
                bestScores: {
                    phishing: 0,
                    matching: 0,
                    spotDanger: 0
                },
                gameHistory: [],
                achievements: [],
                settings: {
                    soundEnabled: true,
                    difficultyLevel: 'normal',
                    hintsEnabled: true
                }
            };
            this.saveData(defaultData);
        }
    }

    getData() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey)) || {};
        } catch (error) {
            console.error('Error parsing storage data:', error);
            this.initializeStorage();
            return JSON.parse(localStorage.getItem(this.storageKey));
        }
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            // Trigger storage event for other windows/tabs
            window.dispatchEvent(new Event('storage'));
        } catch (error) {
            console.error('Error saving data to storage:', error);
        }
    }

    getStats() {
        const data = this.getData();
        return {
            totalScore: data.totalScore || 0,
            gamesCompleted: data.gamesCompleted || 0,
            bestScores: data.bestScores || {
                phishing: 0,
                matching: 0,
                spotDanger: 0
            }
        };
    }

    updateScore(gameType, score, isBestScore = false) {
        const data = this.getData();
        
        // Update total score
        data.totalScore = (data.totalScore || 0) + score;
        
        // Update best score if this is a new best
        if (isBestScore || score > (data.bestScores[gameType] || 0)) {
            data.bestScores[gameType] = score;
        }
        
        // Increment games completed
        data.gamesCompleted = (data.gamesCompleted || 0) + 1;
        
        // Add to game history
        if (!data.gameHistory) data.gameHistory = [];
        data.gameHistory.push({
            gameType: gameType,
            score: score,
            timestamp: Date.now(),
            date: new Date().toISOString()
        });
        
        // Keep only last 50 games in history
        if (data.gameHistory.length > 50) {
            data.gameHistory = data.gameHistory.slice(-50);
        }
        
        this.saveData(data);
        this.checkAchievements(data);
    }

    checkAchievements(data) {
        const achievements = data.achievements || [];
        const newAchievements = [];
        
        // First Win Achievement
        if (data.gamesCompleted >= 1 && !achievements.includes('first_win')) {
            newAchievements.push('first_win');
            achievements.push('first_win');
        }
        
        // Score Milestones
        if (data.totalScore >= 1000 && !achievements.includes('score_1000')) {
            newAchievements.push('score_1000');
            achievements.push('score_1000');
        }
        
        if (data.totalScore >= 5000 && !achievements.includes('score_5000')) {
            newAchievements.push('score_5000');
            achievements.push('score_5000');
        }
        
        // Game Completion Milestones
        if (data.gamesCompleted >= 10 && !achievements.includes('games_10')) {
            newAchievements.push('games_10');
            achievements.push('games_10');
        }
        
        // Perfect Scores
        if (data.bestScores.phishing >= 200 && !achievements.includes('phishing_master')) {
            newAchievements.push('phishing_master');
            achievements.push('phishing_master');
        }
        
        if (data.bestScores.matching >= 300 && !achievements.includes('matching_master')) {
            newAchievements.push('matching_master');
            achievements.push('matching_master');
        }
        
        if (data.bestScores.spotDanger >= 400 && !achievements.includes('danger_spotter')) {
            newAchievements.push('danger_spotter');
            achievements.push('danger_spotter');
        }
        
        // All Games Mastery
        if (data.bestScores.phishing >= 150 && 
            data.bestScores.matching >= 250 && 
            data.bestScores.spotDanger >= 300 && 
            !achievements.includes('cyber_expert')) {
            newAchievements.push('cyber_expert');
            achievements.push('cyber_expert');
        }
        
        data.achievements = achievements;
        
        if (newAchievements.length > 0) {
            this.saveData(data);
            this.notifyAchievements(newAchievements);
        }
    }

    notifyAchievements(achievements) {
        const achievementNames = {
            'first_win': '🎉 First Victory!',
            'score_1000': '⭐ Score Master - 1,000 points!',
            'score_5000': '🌟 Score Legend - 5,000 points!',
            'games_10': '🎮 Dedicated Player - 10 games completed!',
            'phishing_master': '🕵️ Phishing Detective Master!',
            'matching_master': '🧠 Social Engineering Expert!',
            'danger_spotter': '🔍 Danger Spotter Supreme!',
            'cyber_expert': '🛡️ Cyber Security Expert!'
        };
        
        achievements.forEach(achievement => {
            if (window.feedbackSystem) {
                setTimeout(() => {
                    window.feedbackSystem.show(`Achievement Unlocked: ${achievementNames[achievement]}`, 'success');
                }, 1000);
            }
        });
    }

    getGameHistory() {
        const data = this.getData();
        return data.gameHistory || [];
    }

    getAchievements() {
        const data = this.getData();
        return data.achievements || [];
    }

    updateSettings(newSettings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...newSettings };
        this.saveData(data);
    }

    getSettings() {
        const data = this.getData();
        return data.settings || {
            soundEnabled: true,
            difficultyLevel: 'normal',
            hintsEnabled: true
        };
    }

    exportData() {
        return this.getData();
    }

    importData(importedData) {
        try {
            // Validate imported data structure
            if (importedData && typeof importedData === 'object') {
                this.saveData(importedData);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }

    // Utility method to format scores for display
    formatScore(score) {
        return score.toLocaleString();
    }

    // Utility method to calculate rank based on total score
    getPlayerRank(totalScore) {
        if (totalScore < 500) return 'Novice';
        if (totalScore < 1500) return 'Apprentice';
        if (totalScore < 3000) return 'Professional';
        if (totalScore < 5000) return 'Expert';
        if (totalScore < 10000) return 'Master';
        return 'Grandmaster';
    }

    // Method to get performance analytics
    getAnalytics() {
        const data = this.getData();
        const history = data.gameHistory || [];
        
        if (history.length === 0) {
            return {
                averageScore: 0,
                favoriteGame: null,
                improvementTrend: 'No data',
                totalPlayTime: 0
            };
        }
        
        const gameTypes = ['phishing', 'matching', 'spotDanger'];
        const gameStats = {};
        
        gameTypes.forEach(type => {
            const games = history.filter(game => game.gameType === type);
            gameStats[type] = {
                count: games.length,
                averageScore: games.length > 0 ? games.reduce((sum, game) => sum + game.score, 0) / games.length : 0,
                bestScore: Math.max(...games.map(game => game.score), 0)
            };
        });
        
        const totalScore = history.reduce((sum, game) => sum + game.score, 0);
        const averageScore = totalScore / history.length;
        
        // Find favorite game (most played)
        const gameCounts = gameTypes.map(type => ({
            type,
            count: gameStats[type].count
        })).sort((a, b) => b.count - a.count);
        
        const favoriteGame = gameCounts[0].count > 0 ? gameCounts[0].type : null;
        
        // Calculate improvement trend (last 5 games vs previous 5 games)
        let improvementTrend = 'Stable';
        if (history.length >= 10) {
            const recent5 = history.slice(-5).reduce((sum, game) => sum + game.score, 0) / 5;
            const previous5 = history.slice(-10, -5).reduce((sum, game) => sum + game.score, 0) / 5;
            
            if (recent5 > previous5 * 1.1) improvementTrend = 'Improving';
            else if (recent5 < previous5 * 0.9) improvementTrend = 'Declining';
        }
        
        return {
            averageScore: Math.round(averageScore),
            favoriteGame,
            improvementTrend,
            gamesPlayed: history.length,
            gameStats
        };
    }
}
