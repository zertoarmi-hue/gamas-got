/**
 * GameLoop - Main game loop using requestAnimationFrame
 */
class GameLoop {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.deltaTime = 0;
        this.isRunning = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    stop() {
        this.isRunning = false;
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Update and Draw
        this.update(this.deltaTime);
        this.draw();

        requestAnimationFrame((time) => this.loop(time));
    }

    update(deltaTime) {
        // Override in game initialization
        // Called every frame
    }

    draw() {
        // Override in game initialization
        // Called every frame
    }

    getCanvas() {
        return this.canvas;
    }

    getContext() {
        return this.ctx;
    }
}

// Global instance
window.GameLoop = new GameLoop();
