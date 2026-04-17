/**
 * NPC - Non-Player Character entity
 */
class NPC {
    constructor(config = {}) {
        // Identity
        this.id = config.id || this.generateId();
        this.name = config.name || 'Unknown';
        this.race = config.race || 'human';
        this.personalityType = config.personalityType || 'neutral';
        
        // Relationship
        this.relationLevel = config.relationLevel || 0; // 0-100
        
        // Position
        this.x = config.x || 0;
        this.y = config.y || 0;
        
        // AI State
        this.moveTimer = 0;
        this.moveInterval = config.moveInterval || 3; // seconds between moves
        this.isMoving = false;
        
        // Genetic traits (for offspring)
        this.genetics = config.genetics || {
            sympathy: 50,
            intelligence: 50,
            charisma: 50
        };
        
        // Met flags
        this.hasBeenMet = false;
        this.isOffspring = config.isOffspring || false;
    }

    generateId() {
        return 'npc_' + Math.random().toString(36).substr(2, 9);
    }

    update(deltaTime, mapData, allNPCs) {
        // Brownian motion AI
        this.moveTimer += deltaTime;
        
        if (this.moveTimer >= this.moveInterval && !this.isMoving) {
            this.moveTimer = 0;
            this.tryMove(mapData, allNPCs);
        }
    }

    tryMove(mapData, allNPCs) {
        const directions = [
            { dx: 0, dy: -1 }, // Up
            { dx: 0, dy: 1 },  // Down
            { dx: -1, dy: 0 }, // Left
            { dx: 1, dy: 0 }   // Right
        ];
        
        const randomDir = directions[Math.floor(Math.random() * directions.length)];
        const newX = this.x + randomDir.dx;
        const newY = this.y + randomDir.dy;
        
        // Check bounds
        if (newX < 0 || newX >= mapData.width || newY < 0 || newY >= mapData.height) {
            return;
        }
        
        // Check for walls (assuming 1 is walkable, 0 is wall)
        if (mapData.data[newY][newX] === 0) {
            return;
        }
        
        // Check collision with other NPCs
        const collision = allNPCs.some(npc => 
            npc !== this && npc.x === newX && npc.y === newY
        );
        
        if (!collision) {
            this.x = newX;
            this.y = newY;
        }
    }

    changeRelation(amount) {
        this.relationLevel = Math.max(0, Math.min(100, this.relationLevel + amount));
    }

    getSpritePath() {
        return `/assets/sprites/${this.race}/${this.personalityType}/chibi.png`;
    }

    getFullSpritePath() {
        return `/assets/sprites/${this.race}/${this.personalityType}/full.png`;
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            race: this.race,
            personalityType: this.personalityType,
            relationLevel: this.relationLevel,
            x: this.x,
            y: this.y,
            genetics: this.genetics,
            hasBeenMet: this.hasBeenMet,
            isOffspring: this.isOffspring
        };
    }

    static deserialize(data) {
        return new NPC(data);
    }
}

window.NPC = NPC;
