# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to our custom decimal versioning system (`vX.YZZ`).

---

## [v0.200] - 2026-04-30
### Added
- **The Synesthesia Layer (Audio & Haptics)**:
  - Built a custom `AudioManager` using the native Web Audio API (zero external assets).
  - Added procedurally generated sound effects for PowerUps (ascending arpeggio), EMP blasts (low-pass filter bass drop), Shield breaks, Enemy Spawns, and Game Over.
  - Added a dynamic background pulse heartbeat that speeds up mathematically as your score multiplier increases.
  - Implemented the `navigator.vibrate()` API to deliver haptic feedback on mobile devices during crucial game events (e.g., massive rumble on EMP, light tap on powerup).

---

## [v0.101] - 2026-04-30
### Fixed
- Fixed the CSS flexbox logic on the Game Over screen. The Reboot button and headers no longer squash or get cut off; instead, the AI analysis list perfectly dynamically absorbs the remaining screen height and scrolls internally!

---

## [v0.100] - 2026-04-30
### Added
- **PWA Support**: Transformed the game into a full Progressive Web App. Added `manifest.json`, an offline-capable Service Worker (`sw.js`), and a scalable vector app icon. The game can now be installed directly to your phone's home screen and played completely offline!

---

## [v0.011] - 2026-04-30
### Fixed
- Fixed a massive visual bug where activating the Shield PowerUp caused the background grid to suddenly become bright white. (Canvas API does not natively support CSS variables, which caused `strokeStyle` state bleeding across frames).

---

## [v0.010] - 2026-04-30
### Changed
- Made the Game Over screen fully responsive on mobile by adding a max-height to the glass panel and introducing a stylized custom scrollbar for the AI Analysis list.

---

## [v0.009] - 2026-04-30
### Changed
- Fixed the version text overlapping the game title on the start screen by adjusting its margin.

---

## [v0.008] - 2026-04-30
### Changed
- Fixed the canvas stretching bug on mobile by moving boundary restrictions directly into the physics engine instead of CSS. Enemies, drops, and the player correctly bounce off the top 65% logic line, leaving the bottom 35% completely empty.
- Upgraded Trackpad input to use Pointer Events with `setPointerCapture` for high-performance, non-laggy continuous dragging even if your finger slips off the div.
- Made the homescreen version indicator more subtle.

---

## [v0.007] - 2026-04-30
### Changed
- Displayed the game version `v0.007` directly on the start screen.
- Restricted the physics engine and rendering canvas to the top 65% of the screen on mobile devices. The trackpad now occupies a dedicated, unplayable zone at the bottom so enemies and players stay fully visible above your fingers.

---

## [v0.006] - 2026-04-30
### Changed
- Re-engineered the trackpad controls to use an instant 1:1 delta motion mapping. The player dot now translates directly with your finger movement instead of moving at a constant speed, eliminating input lag.

---

## [v0.005] - 2026-04-30
### Added
- Created `CHANGELOG.md` to cleanly document the game's version history.

---

## [v0.004] - 2026-04-30
### Added
- Dedicated **Trackpad** at the bottom of the screen for mobile devices to prevent fingers from obstructing the game view.

### Removed
- Reverted the experimental "Virtual Joystick" control scheme.
- Reverted the temporary game start screen description update to restore the UI's visual balance.

---

## [v0.003] - 2026-04-30
### Added
- Quick game description to the start screen.
- Experimental "Virtual Joystick" relative-touch controls for mobile devices.

---

## [v0.002] - 2026-04-30
### Changed
- Massively updated `README.md` with rich formatting, emojis, layout tables, and a polished structure.

---

## [v0.001] - 2026-04-29
### Added
- Initial release of **Mind Dodge: Adaptive AI Arena**.
- Fully functional custom physics engine, rendering engine, and HTML5 canvas setup.
- **Adaptive AI System**: Analyzes player escape routes, panic speeds, and edge preferences.
- **Enemy Archetypes**: Chasers, Predictors, and Blockers.
- **Power-Up System**: Shield (White), EMP Pulse (Yellow), and Speed Boost (Green).
- Gradual difficulty scaling to help new players adapt.
- Start Screen, HUD, Pause Screen, and Game Over logic complete with an AI Post-Match Analysis.
