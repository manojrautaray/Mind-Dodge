# Changelog

All notable changes to this project will be documented in this file.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to our custom decimal versioning system (`vX.YZZ`).

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
