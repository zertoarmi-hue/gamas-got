/**
 * Dialogue - Manages dialogue UI and interactions
 */
class Dialogue {
    constructor() {
        this.currentNPC = null;
        this.dialogueData = null;
        this.uiLayer = document.getElementById('ui-layer');
    }

    start(npc) {
        this.currentNPC = npc;
        npc.hasBeenMet = true;
        
        StateManager.setState(StateManager.states.DIALOGUE);
        this.render();
    }

    end() {
        this.currentNPC = null;
        this.dialogueData = null;
        this.uiLayer.innerHTML = '';
        StateManager.setState(StateManager.states.PLAYING);
    }

    render() {
        if (!this.currentNPC) return;

        const npc = this.currentNPC;
        const playerStats = Player.getStats();

        this.uiLayer.innerHTML = `
            <div style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
            ">
                <div style="
                    width: 90%;
                    max-width: 1200px;
                    height: 80%;
                    background: #1a1a2e;
                    border-radius: 10px;
                    display: flex;
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                ">
                    <!-- Left Panel - Character Art -->
                    <div style="
                        width: 30%;
                        background: linear-gradient(180deg, #16213e 0%, #1a1a2e 100%);
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    ">
                        <div style="
                            width: 200px;
                            height: 300px;
                            background: #0f3460;
                            border-radius: 10px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 14px;
                            text-align: center;
                        ">
                            [Character Art]<br>
                            ${npc.race}<br>
                            ${npc.personalityType}
                        </div>
                    </div>
                    
                    <!-- Right Panel - Dialogue -->
                    <div style="
                        width: 70%;
                        display: flex;
                        flex-direction: column;
                        padding: 30px;
                    ">
                        <!-- Header -->
                        <div style="
                            margin-bottom: 20px;
                            padding-bottom: 15px;
                            border-bottom: 2px solid #e94560;
                        ">
                            <h2 style="color: white; margin-bottom: 10px;">${npc.name}</h2>
                            <div style="color: #a0a0a0; margin-bottom: 10px;">
                                Race: ${npc.race} | Personality: ${npc.personalityType}
                            </div>
                            <div style="
                                width: 100%;
                                height: 20px;
                                background: #0f3460;
                                border-radius: 10px;
                                overflow: hidden;
                            ">
                                <div style="
                                    width: ${npc.relationLevel}%;
                                    height: 100%;
                                    background: linear-gradient(90deg, #e94560, #ff6b6b);
                                    transition: width 0.3s;
                                "></div>
                            </div>
                            <div style="color: white; margin-top: 5px; font-size: 14px;">
                                Relationship: ${npc.relationLevel}%
                            </div>
                        </div>
                        
                        <!-- Dialogue Content -->
                        <div style="
                            flex: 1;
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 10px;
                            padding: 20px;
                            margin-bottom: 20px;
                            overflow-y: auto;
                        ">
                            <p style="color: #e0e0e0; line-height: 1.6;">
                                [Dialogue content will be loaded from JSON]<br><br>
                                Current relationship level: ${npc.relationLevel}%
                                ${npc.relationLevel >= 100 ? '<br><strong style="color: #e94560;">★ Option to create offspring available!</strong>' : ''}
                            </p>
                        </div>
                        
                        <!-- Response Options -->
                        <div style="
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            margin-bottom: 20px;
                        ">
                            <button onclick="Dialogue.respond(0)" style="
                                padding: 15px;
                                background: #0f3460;
                                color: white;
                                border: 2px solid #e94560;
                                border-radius: 5px;
                                cursor: pointer;
                                text-align: left;
                                font-size: 16px;
                                transition: all 0.2s;
                            ">
                                [Neutral response] <span style="color: #a0a0a0; font-size: 12px;">(No requirement)</span>
                            </button>
                            <button onclick="Dialogue.respond(1)" style="
                                padding: 15px;
                                background: #0f3460;
                                color: white;
                                border: 2px solid #4CAF50;
                                border-radius: 5px;
                                cursor: pointer;
                                text-align: left;
                                font-size: 16px;
                                transition: all 0.2s;
                            ">
                                [Empathetic response] <span style="color: #a0a0a0; font-size: 12px;">(Requires Empathy: ${Math.min(20, playerStats.empathy)})</span>
                            </button>
                            ${npc.relationLevel >= 100 ? `
                            <button onclick="Dialogue.createOffspring()" style="
                                padding: 15px;
                                background: linear-gradient(90deg, #e94560, #ff6b6b);
                                color: white;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                text-align: left;
                                font-size: 16px;
                                font-weight: bold;
                            ">
                                ★ Absorb and Create Offspring
                            </button>
                            ` : ''}
                        </div>
                        
                        <!-- Footer - Player Stats -->
                        <div style="
                            padding-top: 15px;
                            border-top: 2px solid #0f3460;
                            display: grid;
                            grid-template-columns: repeat(4, 1fr);
                            gap: 10px;
                        ">
                            <div style="text-align: center; color: #a0a0a0;">
                                <div style="font-size: 12px;">STAMINA</div>
                                <div style="font-size: 18px; color: white;">${playerStats.stamina}</div>
                            </div>
                            <div style="text-align: center; color: #a0a0a0;">
                                <div style="font-size: 12px;">EMPATHY</div>
                                <div style="font-size: 18px; color: white;">${playerStats.empathy}</div>
                            </div>
                            <div style="text-align: center; color: #a0a0a0;">
                                <div style="font-size: 12px;">CHARISMA</div>
                                <div style="font-size: 18px; color: white;">${playerStats.charisma}</div>
                            </div>
                            <div style="text-align: center; color: #a0a0a0;">
                                <div style="font-size: 12px;">INTELLIGENCE</div>
                                <div style="font-size: 18px; color: white;">${playerStats.intelligence}</div>
                            </div>
                        </div>
                        
                        <!-- Leave Button -->
                        <button onclick="Dialogue.end()" style="
                            margin-top: 15px;
                            padding: 10px 30px;
                            background: transparent;
                            color: #a0a0a0;
                            border: 2px solid #a0a0a0;
                            border-radius: 5px;
                            cursor: pointer;
                            font-size: 16px;
                            align-self: flex-end;
                            transition: all 0.2s;
                        " onmouseover="this.style.color='white'; this.style.borderColor='white'" 
                           onmouseout="this.style.color='#a0a0a0'; this.style.borderColor='#a0a0a0'">
                            Leave
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    respond(optionIndex) {
        if (!this.currentNPC) return;
        
        // Simple mechanics for now
        const relationGain = 5 + Math.floor(Player.empathy * 0.5);
        this.currentNPC.changeRelation(relationGain);
        
        // Use energy
        Player.useEnergy(5);
        
        console.log(`Responded with option ${optionIndex}, relation +${relationGain}`);
        this.render(); // Re-render to show updated stats
    }

    createOffspring() {
        if (!this.currentNPC || this.currentNPC.relationLevel < 100) return;
        
        // Genetics calculation
        const newNPC = new NPC({
            name: 'Offspring_' + Math.floor(Math.random() * 1000),
            race: this.currentNPC.race,
            personalityType: this.currentNPC.personalityType,
            relationLevel: 50,
            x: Player.x + 1,
            y: Player.y,
            genetics: {
                sympathy: Player.empathy * 0.5 + Math.random() * 20,
                intelligence: Player.intelligence * 0.5 + Math.random() * 20,
                charisma: Player.charisma * 0.5 + Math.random() * 20
            },
            isOffspring: true
        });
        
        // Add to world
        if (window.MapSystem) {
            MapSystem.addNPC(newNPC);
        }
        
        // Consume the original NPC
        if (window.MapSystem) {
            MapSystem.removeNPC(this.currentNPC.id);
        }
        
        TimeLoop.addOffspring();
        
        console.log('Offspring created!');
        this.end();
    }
}

// Global instance
window.Dialogue = new Dialogue();
