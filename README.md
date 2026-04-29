<div align="center">
  <h1 align="center">🧠 Mind Dodge: Adaptive AI Arena</h1>
  <p align="center">
    <i>A lightweight, browser-based neon survival dodger where the enemies learn from your every move.</i>
  </p>
  
  <p align="center">
    <a href="https://manojrautaray.github.io/Mind-Dodge/"><strong>🎮 Play the Game Live</strong></a>
  </p>
</div>

---

## ⚡ The Adaptive AI Mechanic

Mind Dodge isn't a traditional survival game. It actively observes your habits, logs your behavior, and alters enemy spawn patterns to directly counter you in real-time.

| If you... | The AI will... |
| :--- | :--- |
| **Always dodge left** | Spawn *Blockers* specifically on the left to trap you. |
| **Hug the walls** | Spawn enemies directly on the edges to force you into the center. |
| **Panic and move erratically** | Deploy *Predictors* to anticipate your high-speed movements. |

---

## 👾 Enemy Archetypes

The AI utilizes a specialized swarm to execute its strategies:

* 🔴 **Chasers**: The grunts. They relentlessly pursue your current position.
* 🟠 **Predictors**: The snipers. They calculate your trajectory and aim for where you *will* be.
* 🟣 **Blockers**: The trappers. They occupy your preferred escape routes to lock you in before slowly creeping closer.

---

## 💎 The Power-Up System

As the game progresses, glowing diamond drops will appear on the map. You have 12 seconds to collect them before they destabilize.

* ⚪ **Shield**: Grants a glowing white aura. Survives one fatal hit and destroys the enemy that struck you.
* 🟡 **EMP Pulse**: Releases a massive shockwave that instantly annihilates every active enemy in the arena.
* 🟢 **Overdrive Boost**: Surges your character with green energy, boosting your movement speed by 50% for 6 seconds to escape deadly traps.

---

## 🕹️ Controls

Mind Dodge natively supports both Desktop and Mobile devices.

* **Desktop**: Use `W` `A` `S` `D` or the **Arrow Keys** to navigate.
* **Mobile**: Simply **Touch and Drag** anywhere on the screen to control your player dynamically.
* **Pause**: Use the Pause button in the top right corner if the AI pressure becomes too intense.

---

## 🛠️ Tech Stack & Architecture

Built with a philosophy of zero-dependency purity, Mind Dodge requires **no external frameworks, bundlers, or engines**. 

* 🎨 **Vanilla CSS3**: Drives the beautiful glassmorphism UI, glowing neon particles, and smooth animations.
* ⚡ **Vanilla JavaScript (ES6)**: Powers the custom 2D physics engine, collision detection, and the Adaptive AI Analyzer.
* 🖼️ **HTML5 Canvas**: Handles all rendering logic at a blistering 60FPS.

### File Structure
```text
mind-dodge/
│
├── index.html        # Main HTML layout, UI screens, and HUD
├── style.css         # Styling for the neon arcade aesthetics
└── js/
    └── game.js       # The Brain: Player, AI, Enemies, Physics, and Game Loop
```

---

## 🚀 How to Play Locally

Because the game relies purely on standard web technologies without strict ES Modules, running it locally is incredibly simple:

1. Clone or download the repository.
2. Double-click `index.html` to open it in your favorite web browser.
3. Survive.

---

## 🗺️ Roadmap & Future Features

We are actively expanding the arena. Upcoming features include:
* [ ] **Dynamic Arenas**: Moving obstacles and shrinking borders.
* [ ] **New Enemies**: "Orbiters" that circle the player, and "Dashers" that move in hyper-fast straight lines.
* [ ] **Global Leaderboards**: Integration with Firebase to track the smartest dodgers in the world.

---

<div align="center">
  <p>Good luck. The AI is waiting.</p>
</div>
