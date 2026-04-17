/**
 * SaveLoad - Handles game save/load functionality
 */
class SaveLoad {
    constructor() {
        this.saveKey = 'timeLoopRPG_save';
        this.autoSaveEnabled = true;
    }

    /**
     * Save game to localStorage
     */
    save() {
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            player: Player.serialize(),
            timeLoop: TimeLoop.serialize(),
            encyclopedia: this.serializeEncyclopedia()
        };

        try {
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('Game saved successfully');
            return true;
        } catch (e) {
            console.error('Failed to save game:', e);
            return false;
        }
    }

    /**
     * Load game from localStorage
     */
    load() {
        try {
            const saveData = localStorage.getItem(this.saveKey);
            if (!saveData) {
                console.log('No save data found');
                return false;
            }

            const data = JSON.parse(saveData);
            
            // Deserialize player
            Player.deserialize(data.player);
            
            // Deserialize time loop
            TimeLoop.deserialize(data.timeLoop);
            
            // Deserialize encyclopedia
            this.deserializeEncyclopedia(data.encyclopedia);
            
            console.log('Game loaded successfully');
            return true;
        } catch (e) {
            console.error('Failed to load game:', e);
            return false;
        }
    }

    /**
     * Export save to JSON file
     */
    exportToFile() {
        const saveData = {
            version: '1.0',
            timestamp: Date.now(),
            player: Player.serialize(),
            timeLoop: TimeLoop.serialize(),
            encyclopedia: this.serializeEncyclopedia()
        };

        const jsonString = JSON.stringify(saveData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `timeLoopRPG_save_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Save exported to file');
    }

    /**
     * Import save from JSON file
     */
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const saveData = JSON.parse(event.target.result);
                    
                    // Validate save data
                    if (!saveData.version || !saveData.player) {
                        throw new Error('Invalid save file format');
                    }
                    
                    // Deserialize player
                    Player.deserialize(saveData.player);
                    
                    // Deserialize time loop
                    TimeLoop.deserialize(saveData.timeLoop);
                    
                    // Deserialize encyclopedia
                    this.deserializeEncyclopedia(saveData.encyclopedia);
                    
                    // Save to localStorage as well
                    this.save();
                    
                    console.log('Save imported successfully');
                    resolve(true);
                } catch (e) {
                    console.error('Failed to import save:', e);
                    reject(e);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Auto-save at end of day
     */
    autoSave() {
        if (this.autoSaveEnabled) {
            this.save();
        }
    }

    /**
     * Serialize encyclopedia (met NPCs)
     */
    serializeEncyclopedia() {
        if (!window.MapSystem) return [];
        return MapSystem.getMetNPCs().map(npc => npc.serialize());
    }

    /**
     * Deserialize encyclopedia
     */
    deserializeEncyclopedia(data) {
        if (!data || !Array.isArray(data)) return;
        // Encyclopedia data is stored but NPCs will be respawned each day
        // This is mainly for tracking purposes
        console.log(`Loaded encyclopedia with ${data.length} met NPCs`);
    }

    /**
     * Clear save data
     */
    clearSave() {
        localStorage.removeItem(this.saveKey);
        console.log('Save data cleared');
    }
}

// Global instance
window.SaveLoad = new SaveLoad();
