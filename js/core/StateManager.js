/**
 * StateManager - Manages game states (MENU, PLAYING, DIALOGUE, SUMMARY)
 */
class StateManager {
    constructor() {
        this.states = {
            MENU: 'MENU',
            PLAYING: 'PLAYING',
            DIALOGUE: 'DIALOGUE',
            SUMMARY: 'SUMMARY'
        };
        this.currentState = this.states.MENU;
        this.previousState = null;
    }

    setState(newState) {
        if (this.currentState === newState) return;
        
        this.previousState = this.currentState;
        this.currentState = newState;
        
        console.log(`State changed: ${this.previousState} -> ${this.currentState}`);
        
        // Trigger state change events
        this.onStateChange(this.previousState, newState);
    }

    getState() {
        return this.currentState;
    }

    isPlaying() {
        return this.currentState === this.states.PLAYING;
    }

    isDialogue() {
        return this.currentState === this.states.DIALOGUE;
    }

    isMenu() {
        return this.currentState === this.states.MENU;
    }

    isSummary() {
        return this.currentState === this.states.SUMMARY;
    }

    onStateChange(from, to) {
        // Override this method in game initialization
        // to handle UI changes based on state
    }
}

// Global instance
window.StateManager = new StateManager();
