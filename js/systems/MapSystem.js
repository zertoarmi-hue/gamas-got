/**
 * MapSystem - Handles map generation, rendering, and NPC management
 */
class MapSystem {
    constructor() {
        this.tileSize = 32;
        this.mapWidth = 200;
        this.mapHeight = 200;
        this.mapData = null;
        this.npcs = [];
        this.camera = { x: 0, y: 0 };
        
        // Tile types
        this.tiles = {
            WALL: 0,
            FLOOR: 1,
            GRASS: 2,
            WATER: 3
        };
        
        this.generateMap();
    }

    generateMap() {
        // Create 2D array
        this.mapData = {
            width: this.mapWidth,
            height: this.mapHeight,
            data: []
        };

        // Generate simple map with rooms and corridors
        for (let y = 0; y < this.mapHeight; y++) {
            const row = [];
            for (let x = 0; x < this.mapWidth; x++) {
                // Borders are walls
                if (x === 0 || x === this.mapWidth - 1 || y === 0 || y === this.mapHeight - 1) {
                    row.push(this.tiles.WALL);
                } else {
                    // Random terrain
                    const rand = Math.random();
                    if (rand < 0.7) {
                        row.push(this.tiles.FLOOR);
                    } else if (rand < 0.85) {
                        row.push(this.tiles.GRASS);
                    } else if (rand < 0.95) {
                        row.push(this.tiles.WALL);
                    } else {
                        row.push(this.tiles.WATER);
                    }
                }
            }
            this.mapData.data.push(row);
        }

        // Spawn initial NPCs
        this.spawnNPCs(50);
    }

    spawnNPCs(count) {
        const races = ['human', 'elf', 'orc'];
        const personalities = ['neutral', 'friendly', 'shy', 'bold'];
        
        for (let i = 0; i < count; i++) {
            let x, y;
            let attempts = 0;
            
            // Find empty spot
            do {
                x = Math.floor(Math.random() * (this.mapWidth - 2)) + 1;
                y = Math.floor(Math.random() * (this.mapHeight - 2)) + 1;
                attempts++;
            } while (
                this.mapData.data[y][x] === this.tiles.WALL ||
                this.mapData.data[y][x] === this.tiles.WATER ||
                this.getNPCAt(x, y) !== null ||
                attempts < 100
            );

            if (attempts >= 100) continue;

            const npc = new NPC({
                name: this.generateNPCName(),
                race: races[Math.floor(Math.random() * races.length)],
                personalityType: personalities[Math.floor(Math.random() * personalities.length)],
                relationLevel: Math.floor(Math.random() * 30),
                x: x,
                y: y
            });

            this.npcs.push(npc);
        }

        console.log(`Spawned ${this.npcs.length} NPCs`);
    }

    generateNPCName() {
        const prefixes = ['Ael', 'Mor', 'Tha', 'Gor', 'Lyn', 'Fen', 'Dra', 'Sil'];
        const suffixes = ['wen', 'dor', 'ia', 'ak', 'ara', 'on', 'is', 'ea'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        return prefix + suffix;
    }

    getNPCAt(x, y) {
        return this.npcs.find(npc => npc.x === x && npc.y === y);
    }

    addNPC(npc) {
        this.npcs.push(npc);
    }

    removeNPC(id) {
        this.npcs = this.npcs.filter(npc => npc.id !== id);
    }

    getMetNPCs() {
        return this.npcs.filter(npc => npc.hasBeenMet);
    }

    resetWorld() {
        // Remove all NPCs
        this.npcs = [];
        
        // Regenerate map
        this.generateMap();
        
        // Reset player position
        Player.x = 100;
        Player.y = 100;
        
        console.log('World reset');
    }

    update(deltaTime) {
        // Update NPCs
        this.npcs.forEach(npc => {
            npc.update(deltaTime, this.mapData, this.npcs);
        });

        // Update camera to follow player
        this.updateCamera();
    }

    updateCamera() {
        const canvas = GameLoop.getCanvas();
        const viewportWidth = canvas.width;
        const viewportHeight = canvas.height;

        // Center camera on player
        this.camera.x = Player.x * this.tileSize - viewportWidth / 2 + this.tileSize / 2;
        this.camera.y = Player.y * this.tileSize - viewportHeight / 2 + this.tileSize / 2;

        // Clamp camera to map bounds
        const maxCamX = (this.mapWidth - 1) * this.tileSize - viewportWidth;
        const maxCamY = (this.mapHeight - 1) * this.tileSize - viewportHeight;

        this.camera.x = Math.max(0, Math.min(this.camera.x, maxCamX));
        this.camera.y = Math.max(0, Math.min(this.camera.y, maxCamY));
    }

    draw(ctx) {
        const canvas = GameLoop.getCanvas();
        const viewportWidth = canvas.width;
        const viewportHeight = canvas.height;

        // Calculate visible tile range (culling)
        const startCol = Math.floor(this.camera.x / this.tileSize);
        const endCol = startCol + Math.ceil(viewportWidth / this.tileSize) + 1;
        const startRow = Math.floor(this.camera.y / this.tileSize);
        const endRow = startRow + Math.ceil(viewportHeight / this.tileSize) + 1;

        // Clamp to map bounds
        const clampedStartCol = Math.max(0, startCol);
        const clampedEndCol = Math.min(this.mapWidth, endCol);
        const clampedStartRow = Math.max(0, startRow);
        const clampedEndRow = Math.min(this.mapHeight, endRow);

        // Draw visible tiles
        for (let y = clampedStartRow; y < clampedEndRow; y++) {
            for (let x = clampedStartCol; x < clampedEndCol; x++) {
                const tile = this.mapData.data[y][x];
                const screenX = Math.floor(x * this.tileSize - this.camera.x);
                const screenY = Math.floor(y * this.tileSize - this.camera.y);

                // Draw tile based on type
                switch (tile) {
                    case this.tiles.WALL:
                        ctx.fillStyle = '#4a4a4a';
                        break;
                    case this.tiles.FLOOR:
                        ctx.fillStyle = '#2a2a3a';
                        break;
                    case this.tiles.GRASS:
                        ctx.fillStyle = '#3a5a3a';
                        break;
                    case this.tiles.WATER:
                        ctx.fillStyle = '#3a3a6a';
                        break;
                    default:
                        ctx.fillStyle = '#000000';
                }

                ctx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
                
                // Draw grid lines
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                ctx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
            }
        }

        // Draw NPCs
        this.npcs.forEach(npc => {
            const screenX = Math.floor(npc.x * this.tileSize - this.camera.x);
            const screenY = Math.floor(npc.y * this.tileSize - this.camera.y);

            // Only draw if visible
            if (screenX >= -this.tileSize && screenX <= viewportWidth &&
                screenY >= -this.tileSize && screenY <= viewportHeight) {
                
                // Draw NPC as colored circle (placeholder for sprite)
                ctx.fillStyle = this.getNPCColor(npc.race);
                ctx.beginPath();
                ctx.arc(
                    screenX + this.tileSize / 2,
                    screenY + this.tileSize / 2,
                    this.tileSize / 2 - 2,
                    0,
                    Math.PI * 2
                );
                ctx.fill();

                // Draw relation indicator
                if (npc.relationLevel >= 100) {
                    ctx.fillStyle = '#e94560';
                    ctx.beginPath();
                    ctx.arc(
                        screenX + this.tileSize / 2,
                        screenY + this.tileSize / 2,
                        this.tileSize / 4,
                        0,
                        Math.PI * 2
                    );
                    ctx.fill();
                }
            }
        });

        // Draw player
        const playerScreenX = Math.floor(Player.x * this.tileSize - this.camera.x);
        const playerScreenY = Math.floor(Player.y * this.tileSize - this.camera.y);

        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(
            playerScreenX + 4,
            playerScreenY + 4,
            this.tileSize - 8,
            this.tileSize - 8
        );

        // Draw interaction prompt
        const nearbyNPC = this.getNearbyNPC();
        if (nearbyNPC) {
            ctx.fillStyle = 'white';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(
                'Press [E] to talk',
                playerScreenX + this.tileSize / 2,
                playerScreenY - 10
            );
        }
    }

    getNPCColor(race) {
        switch (race) {
            case 'human': return '#ffccaa';
            case 'elf': return '#aaffaa';
            case 'orc': return '#aaffcc';
            default: return '#ffffff';
        }
    }

    getNearbyNPC() {
        return this.npcs.find(npc => {
            const dx = Math.abs(npc.x - Player.x);
            const dy = Math.abs(npc.y - Player.y);
            return dx <= 1 && dy <= 1;
        });
    }

    handleInteraction() {
        const nearbyNPC = this.getNearbyNPC();
        if (nearbyNPC) {
            Dialogue.start(nearbyNPC);
            return true;
        }
        return false;
    }
}

// Global instance (will be created in main.js)
window.MapSystem = null;
