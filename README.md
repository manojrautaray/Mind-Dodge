# Mind Dodge: Adaptive AI Arena

Welcome to **Mind Dodge**, a lightweight, browser-based neon survival dodger where the enemies learn from your movements in real time! This project is built without external game engines, ensuring seamless gameplay right in your browser.

## 🧠 The Adaptive AI Mechanic

Mind Dodge isn't just about outrunning enemies; it's about outsmarting an AI that actively observes and counters your behavior. As you play, the AI analyzes your movement patterns and adjusts enemy spawns accordingly:

- **Escape Route Bias**: If you consistently dodge to the left, the AI will predict this and spawn **Blockers** to intercept you on the left side of the arena.
- **Panic Movement**: Moving erratically at high speeds? The AI will deploy **Predictors** to cut off your path.
- **Edge Hugging**: If you stick too close to the borders of the arena, the AI will recognize your comfort zone and spawn enemies directly along the edges to push you out.
- **Center Preference**: If you camp in the middle, enemies will swarm from all directions.

### Enemy Types:
1. **Chaser (Red)**: Relentlessly pursues your current position.
2. **Predictor (Orange)**: Anticipates your trajectory and aims for where you will be.
3. **Blocker (Purple)**: Sits on your preferred escape routes to trap you, then slowly creeps in.

---

## 🎮 Controls

Mind Dodge supports both desktop and mobile play:

### Desktop:
- **Movement**: `W` `A` `S` `D` or `Arrow Keys`
- **Pause/Resume**: Click the Pause button in the top right corner.

### Mobile:
- **Movement**: Touch and drag anywhere on the screen to control the player dynamically.

---

## 🛠️ Tech Stack

- **HTML5 Canvas**: Handles rendering the entire game, including particles and UI elements.
- **Vanilla JavaScript (ES6)**: Game loop, physics, collisions, and the Adaptive AI engine.
- **Vanilla CSS3**: Handles the beautiful neon aesthetics, screen shakes, and glassmorphism UI.
- No external frameworks or dependencies are used, making this perfect for direct execution or GitHub Pages deployment.

---

## 📂 File Structure

```text
mind-dodge/
│
├── index.html        # Main HTML structure and UI overlay
├── style.css         # Styling for neon UI and HUD
└── js/
    └── game.js       # Complete game logic (Player, AI, Enemies, Engine)
```

---

## 🚀 How to Play

### Local Execution:
Because the game uses completely standard Vanilla JS without strict ES Modules, you can simply open `index.html` in your favorite web browser! No local server is required.

### Deployment:
To deploy on GitHub Pages, simply push the repository to a `gh-pages` branch or enable GitHub Pages tracking the `main` branch.

---

## 🗺️ Roadmap

Here are a few exciting features planned for future updates:
1. **Power-ups**: Collectibles that grant temporary shields, speed boosts, or EMP blasts.
2. **More Enemy Archetypes**: "Snipers" that dash in straight lines and "Orbiters" that circle the player.
3. **Dynamic Arenas**: Moving obstacles or shrinking borders as time progresses.
4. **Global Leaderboards**: Integration with Firebase to track high scores across the world.

Good luck, and see how long you can survive the swarm!
