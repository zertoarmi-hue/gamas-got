/**
 * Player - Singleton player entity with stats
 */
class Player {
    constructor() {
        // Position
        this.x = 100;
        this.y = 100;
        
        // Core Stats
        this.stamina = 10;      // Стойкость
        this.empathy = 10;      // Эмпатия
        this.charisma = 10;     // Харизма
        this.intelligence = 10; // Интеллект
        
        // Progression
        this.level = 1;
        this.experience = 0;
        this.experienceToNextLevel = 100;
        
        // Day tracking
        this.energy = 100;
        this.maxEnergy = 100;
        
        // Meta progression (persists through loops)
        this.totalDays = 0;
        this.npcsDried = 0;
        this.offspringCreated = 0;
    }

    addExperience(amount) {
        this.experience += amount;
        
        while (this.experience >= this.experienceToNextLevel) {
            this.levelUp();
        }
    }

    levelUp() {
        this.experience -= this.experienceToNextLevel;
        this.level++;
        this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.5);
        
        // Stat increase on level up
        const statBoost = 2;
        this.stamina += statBoost;
        this.empathy += statBoost;
        this.charisma += statBoost;
        this.intelligence += statBoost;
        
        console.log(`Level up! Now level ${this.level}`);
    }

    useEnergy(amount) {
        this.energy = Math.max(0, this.energy - amount);
        return this.energy > 0;
    }

    resetForNewDay() {
        // Reset daily resources but keep stats
        this.energy = this.maxEnergy;
        this.totalDays++;
    }

    getStats() {
        return {
            stamina: this.stamina,
            empathy: this.empathy,
            charisma: this.charisma,
            intelligence: this.intelligence,
            level: this.level,
            experience: this.experience,
            energy: this.energy
        };
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            stamina: this.stamina,
            empathy: this.empathy,
            charisma: this.charisma,
            intelligence: this.intelligence,
            level: this.level,
            experience: this.experience,
            experienceToNextLevel: this.experienceToNextLevel,
            energy: this.energy,
            maxEnergy: this.maxEnergy,
            totalDays: this.totalDays,
            npcsDried: this.npcsDried,
            offspringCreated: this.offspringCreated
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.stamina = data.stamina;
        this.empathy = data.empathy;
        this.charisma = data.charisma;
        this.intelligence = data.intelligence;
        this.level = data.level;
        this.experience = data.experience;
        this.experienceToNextLevel = data.experienceToNextLevel;
        this.energy = data.energy;
        this.maxEnergy = data.maxEnergy;
        this.totalDays = data.totalDays;
        this.npcsDried = data.npcsDried;
        this.offspringCreated = data.offspringCreated;
    }
}

// Global singleton instance
window.Player = new Player();
