/**
 * Main Game Entry Point
 * Initializes all systems and starts the game loop
 */

// Input handling
const keys = {};
let interactionPressed = false;

window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    
    // Handle interaction key (E)
    if (e.code === 'KeyE' && !interactionPressed) {
        interactionPressed = true;
        handleInteraction();
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    
    if (e.code === 'KeyE') {
        interactionPressed = false;
    }
});

function handleInteraction() {
    if (StateManager.isDialogue()) {
        return; // Already in dialogue
    }
    
    if (StateManager.isPlaying() && MapSystem) {
        MapSystem.handleInteraction();
    }
}

function handleMovement(deltaTime) {
    if (!StateManager.isPlaying() || !MapSystem) return;
    
    const moveSpeed = 10; // tiles per second
    const moveDistance = moveSpeed * deltaTime;
    
    let newX = Player.x;
    let newY = Player.y;
    
    if (keys['KeyW'] || keys['ArrowUp']) {
        newY -= moveDistance;
    }
    if (keys['KeyS'] || keys['ArrowDown']) {
        newY += moveDistance;
    }
    if (keys['KeyA'] || keys['ArrowLeft']) {
        newX -= moveDistance;
    }
    if (keys['KeyD'] || keys['ArrowRight']) {
        newX += moveDistance;
    }
    
    // Convert to tile coordinates and check collision
    const tileX = Math.floor(newX);
    const tileY = Math.floor(newY);
    
    // Check bounds and walls
    if (tileX >= 0 && tileX < MapSystem.mapWidth &&
        tileY >= 0 && tileY < MapSystem.mapHeight) {
        
        const tile = MapSystem.mapData.data[tileY][tileX];
        
        // Walkable tiles: FLOOR, GRASS
        if (tile === MapSystem.tiles.FLOOR || tile === MapSystem.tiles.GRASS) {
            Player.x = newX;
            Player.y = newY;
        }
    }
}

function renderHUD() {
    if (!StateManager.isPlaying()) return;
    
    const ctx = GameLoop.getContext();
    
    // Draw time display
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 60);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Day ${TimeLoop.currentDay}`, 20, 35);
    
    ctx.font = '18px Arial';
    ctx.fillText(TimeLoop.getFormattedTime(), 20, 58);
    
    // Draw time progress bar
    const progressBarWidth = 180;
    const progress = TimeLoop.getProgress();
    
    ctx.fillStyle = '#333';
    ctx.fillRect(20, 70, progressBarWidth, 8);
    
    ctx.fillStyle = progress > 0.8 ? '#e94560' : '#4CAF50';
    ctx.fillRect(20, 70, progressBarWidth * progress, 8);
    
    // Draw player energy
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 90, 150, 30);
    
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText(`Energy: ${Player.energy}/${Player.maxEnergy}`, 20, 110);
}

function showMenu() {
    const uiLayer = document.getElementById('ui-layer');
    uiLayer.innerHTML = `
        <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 60px;
            border-radius: 15px;
            text-align: center;
            font-family: Arial, sans-serif;
        ">
            <h1 style="margin-bottom: 30px; font-size: 48px; color: #e94560;">Time Loop RPG</h1>
            <p style="margin-bottom: 40px; color: #a0a0a0; max-width: 500px;">
                Relive the same day over and over. Build relationships, create offspring, and grow stronger with each loop.
            </p>
            <button onclick="startGame()" style="
                padding: 15px 50px;
                font-size: 24px;
                cursor: pointer;
                background: #e94560;
                color: white;
                border: none;
                border-radius: 8px;
                margin-bottom: 20px;
                transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                Start Game
            </button>
            <br>
            <button onclick="loadGame()" style="
                padding: 10px 30px;
                font-size: 18px;
                cursor: pointer;
                background: transparent;
                color: #a0a0a0;
                border: 2px solid #a0a0a0;
                border-radius: 5px;
                transition: all 0.2s;
            " onmouseover="this.style.color='white'; this.style.borderColor='white'" onmouseout="this.style.color='#a0a0a0'; this.style.borderColor='#a0a0a0'">
                Load Game
            </button>
            <div style="margin-top: 40px; color: #666; font-size: 14px;">
                Controls: WASD/Arrows to move, E to interact
            </div>
        </div>
    `;
}

function startGame() {
    // Initialize map system
    window.MapSystem = new MapSystem();
    
    // Clear menu
    document.getElementById('ui-layer').innerHTML = '';
    
    // Start game loop
    StateManager.setState(StateManager.states.PLAYING);
    GameLoop.start();
    
    console.log('Game started!');
}

function loadGame() {
    const loaded = SaveLoad.load();
    if (loaded) {
        window.MapSystem = new MapSystem();
        document.getElementById('ui-layer').innerHTML = '';
        StateManager.setState(StateManager.states.PLAYING);
        GameLoop.start();
        console.log('Game loaded!');
    } else {
        alert('No save file found!');
    }
}

// Override GameLoop methods
GameLoop.update = function(deltaTime) {
    if (StateManager.isPlaying()) {
        handleMovement(deltaTime);
        TimeLoop.update(deltaTime);
        MapSystem.update(deltaTime);
    }
};

GameLoop.draw = function() {
    const ctx = this.getContext();
    
    // Clear screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (StateManager.isPlaying() && MapSystem) {
        MapSystem.draw(ctx);
        renderHUD();
    }
};

// Override StateManager state change handler
StateManager.onStateChange = function(from, to) {
    console.log(`State changed from ${from} to ${to}`);
    
    // Auto-save at end of day
    if (to === StateManager.states.SUMMARY) {
        SaveLoad.autoSave();
    }
};

// Show menu on load
showMenu();

console.log('Time Loop RPG initialized');
