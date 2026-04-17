/**
 * TimeLoop - Manages the day timer and reset mechanics
 */
class TimeLoop {
    constructor() {
        this.dayDuration = 300; // 5 minutes per day (in seconds)
        this.timeRemaining = this.dayDuration;
        this.currentDay = 1;
        this.isDayEnding = false;
        
        // Day statistics
        this.dayStats = {
            energyCollected: 0,
            npcsDried: 0,
            offspringCreated: 0
        };
    }

    update(deltaTime) {
        if (this.isDayEnding) return;
        
        this.timeRemaining -= deltaTime;
        
        if (this.timeRemaining <= 0) {
            this.timeRemaining = 0;
            this.endDay();
        }
    }

    endDay() {
        if (this.isDayEnding) return;
        this.isDayEnding = true;
        
        console.log('Day ended! Showing summary...');
        
        // Show summary screen
        this.showSummary();
    }

    showSummary() {
        const uiLayer = document.getElementById('ui-layer');
        uiLayer.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 40px;
                border-radius: 10px;
                text-align: center;
                font-family: Arial, sans-serif;
            ">
                <h2 style="margin-bottom: 20px;">Day ${this.currentDay} Complete</h2>
                <div style="text-align: left; margin-bottom: 30px;">
                    <p>Energy Collected: ${this.dayStats.energyCollected}</p>
                    <p>NPCs Dried: ${this.dayStats.npcsDried}</p>
                    <p>Offspring Created: ${this.dayStats.offspringCreated}</p>
                </div>
                <button onclick="TimeLoop.startNewDay()" style="
                    padding: 10px 30px;
                    font-size: 18px;
                    cursor: pointer;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                ">Start New Day</button>
            </div>
        `;
        
        StateManager.setState(StateManager.states.SUMMARY);
    }

    startNewDay() {
        // Reset day timer
        this.timeRemaining = this.dayDuration;
        this.currentDay++;
        this.isDayEnding = false;
        
        // Reset daily stats
        this.dayStats = {
            energyCollected: 0,
            npcsDried: 0,
            offspringCreated: 0
        };
        
        // Reset player energy
        Player.resetForNewDay();
        
        // Clear UI
        document.getElementById('ui-layer').innerHTML = '';
        
        // Reset world (NPCs will be respawned by MapSystem)
        if (window.MapSystem) {
            MapSystem.resetWorld();
        }
        
        StateManager.setState(StateManager.states.PLAYING);
        
        console.log(`Day ${this.currentDay} started!`);
    }

    getProgress() {
        return 1 - (this.timeRemaining / this.dayDuration);
    }

    getFormattedTime() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = Math.floor(this.timeRemaining % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    addEnergy(amount) {
        this.dayStats.energyCollected += amount;
    }

    addNpcDried() {
        this.dayStats.npcsDried++;
        Player.npcsDried++;
    }

    addOffspring() {
        this.dayStats.offspringCreated++;
        Player.offspringCreated++;
    }

    serialize() {
        return {
            currentDay: this.currentDay,
            dayStats: this.dayStats
        };
    }

    deserialize(data) {
        this.currentDay = data.currentDay;
        this.dayStats = data.dayStats || {
            energyCollected: 0,
            npcsDried: 0,
            offspringCreated: 0
        };
    }
}

// Global instance
window.TimeLoop = new TimeLoop();
