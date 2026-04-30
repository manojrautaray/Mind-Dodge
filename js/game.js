/**
 * MIND DODGE: ADAPTIVE AI ARENA
 * Main Game Logic
 */

// ==========================================
// AUDIO MANAGER
// ==========================================
class AudioManager {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.bgOsc = null;
        this.bgGain = null;
        this.nextBeatTime = 0;
        this.beatInterval = 1.0;
        this.isPlayingBg = false;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.3;
        this.masterGain.connect(this.ctx.destination);
    }
    
    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    vibrate(pattern) {
        if (navigator.vibrate) navigator.vibrate(pattern);
    }

    playTone(freq, type, duration, vol = 1) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playNoise(duration, filterType, filterFreq) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = filterFreq;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(1, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
        noise.connect(filter);
        filter.connect(g);
        g.connect(this.masterGain);
        noise.start();
    }

    playSound(type) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        switch(type) {
            case 'spawn':
                this.playTone(800, 'sine', 0.1, 0.1);
                break;
            case 'powerup':
                [400, 600, 800].forEach((f, i) => {
                    const osc = this.ctx.createOscillator();
                    const g = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = f;
                    g.gain.setValueAtTime(0, now + i*0.1);
                    g.gain.linearRampToValueAtTime(0.3, now + i*0.1 + 0.05);
                    g.gain.exponentialRampToValueAtTime(0.01, now + i*0.1 + 0.3);
                    osc.connect(g);
                    g.connect(this.masterGain);
                    osc.start(now + i*0.1);
                    osc.stop(now + i*0.1 + 0.3);
                });
                this.vibrate([50]);
                break;
            case 'shieldBreak':
                this.playNoise(0.4, 'highpass', 1000);
                this.vibrate([100, 50, 100]);
                break;
            case 'emp':
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(10, now + 1.0);
                g.gain.setValueAtTime(1, now);
                g.gain.exponentialRampToValueAtTime(0.01, now + 1.0);
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(100, now + 1.0);
                osc.connect(filter);
                filter.connect(g);
                g.connect(this.masterGain);
                osc.start();
                osc.stop(now + 1.0);
                this.vibrate([300, 100, 300]);
                break;
            case 'gameover':
                this.playTone(150, 'sawtooth', 1.5, 0.8);
                this.playTone(100, 'sawtooth', 1.5, 0.8);
                this.vibrate([500, 200, 500]);
                break;
        }
    }
    
    updatePulse(multiplier) {
        if (!this.ctx || !this.isPlayingBg) return;
        const now = this.ctx.currentTime;
        if (now >= this.nextBeatTime) {
            this.beatInterval = Math.max(0.3, 1.0 - (multiplier * 0.15)); 
            this.playTone(60, 'sine', 0.3, 0.2);
            this.nextBeatTime = now + this.beatInterval;
        }
    }
    
    startBg() {
        this.isPlayingBg = true;
        if(this.ctx) this.nextBeatTime = this.ctx.currentTime;
    }
    
    stopBg() {
        this.isPlayingBg = false;
    }
}

// ==========================================
// UTILS & INPUT
// ==========================================
class Input {
    constructor() {
        this.keys = {};
        this.lastTouchX = null;
        this.lastTouchY = null;
        this.touchDeltaX = 0;
        this.touchDeltaY = 0;
        this.isDragging = false;
        
        window.addEventListener('keydown', (e) => this.keys[e.key] = true);
        window.addEventListener('keyup', (e) => this.keys[e.key] = false);
        
        const trackpad = document.getElementById('trackpad');
        
        if (trackpad) {
            trackpad.addEventListener('pointerdown', (e) => {
                this.isDragging = true;
                trackpad.setPointerCapture(e.pointerId);
                this.lastTouchX = e.clientX;
                this.lastTouchY = e.clientY;
                this.touchDeltaX = 0;
                this.touchDeltaY = 0;
            });
            
            trackpad.addEventListener('pointermove', (e) => {
                if(this.isDragging) {
                    e.preventDefault();
                    if (this.lastTouchX !== null) {
                        this.touchDeltaX += (e.clientX - this.lastTouchX) * 1.5;
                        this.touchDeltaY += (e.clientY - this.lastTouchY) * 1.5;
                    }
                    this.lastTouchX = e.clientX;
                    this.lastTouchY = e.clientY;
                }
            });
            
            const endTouch = (e) => {
                this.isDragging = false;
                try { trackpad.releasePointerCapture(e.pointerId); } catch(err){}
                this.lastTouchX = null;
                this.lastTouchY = null;
            };
            
            trackpad.addEventListener('pointerup', endTouch);
            trackpad.addEventListener('pointercancel', endTouch);
        }
    }

    getMovement(player) {
        let dx = 0;
        let dy = 0;

        if (this.keys['ArrowUp'] || this.keys['w'] || this.keys['W']) dy -= 1;
        if (this.keys['ArrowDown'] || this.keys['s'] || this.keys['S']) dy += 1;
        if (this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A']) dx -= 1;
        if (this.keys['ArrowRight'] || this.keys['d'] || this.keys['D']) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const dist = Math.hypot(dx, dy);
            dx /= dist;
            dy /= dist;
        }

        const deltaX = this.touchDeltaX;
        const deltaY = this.touchDeltaY;
        
        this.touchDeltaX = 0;
        this.touchDeltaY = 0;

        return { dx, dy, deltaX, deltaY };
    }
}

// ==========================================
// PLAYER & POWERUPS
// ==========================================
class Player {
    constructor(canvasWidth, canvasHeight) {
        this.radius = 12;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;
        this.vx = 0;
        this.vy = 0;
        this.baseSpeed = 350; // Increased to help early game evasion
        this.speed = this.baseSpeed;
        this.color = '#00ffff';
        this.history = []; 
        this.timeSinceLastRecord = 0;
        
        // Advantages
        this.hasShield = false;
        this.speedBoostTimer = 0;
    }

    update(dt, input, canvasWidth, canvasHeight) {
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= dt;
            this.speed = this.baseSpeed * 1.5;
        } else {
            this.speed = this.baseSpeed;
        }

        const move = input.getMovement(this);
        
        this.vx = move.dx * this.speed;
        this.vy = move.dy * this.speed;

        this.x += this.vx * dt;
        this.y += this.vy * dt;

        // Instant 1:1 trackpad delta movement
        const sensitivity = this.speedBoostTimer > 0 ? 1.5 : 1.0;
        this.x += move.deltaX * sensitivity;
        this.y += move.deltaY * sensitivity;

        if (move.deltaX !== 0 || move.deltaY !== 0) {
            this.vx = move.deltaX / dt;
            this.vy = move.deltaY / dt;
        }

        const playableHeight = window.innerWidth <= 768 ? canvasHeight * 0.65 : canvasHeight;

        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(playableHeight - this.radius, this.y));

        this.timeSinceLastRecord += dt;
        if (this.timeSinceLastRecord >= 0.1) {
            this.timeSinceLastRecord = 0;
            
            let normDx = 0;
            let normDy = 0;
            const dist = Math.hypot(this.vx, this.vy);
            if (dist > 0) {
                normDx = this.vx / dist;
                normDy = this.vy / dist;
            }
            
            this.history.push({ x: this.x, y: this.y, dx: normDx, dy: normDy });
            if (this.history.length > 50) this.history.shift();
        }
    }
}

class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type; // 'shield', 'emp', 'speed'
        this.radius = 14;
        this.life = 12; // disappears after 12 seconds
        
        if (type === 'shield') this.color = '#ffffff';
        else if (type === 'emp') this.color = '#ffff00';
        else if (type === 'speed') this.color = '#00ff00';
    }

    update(dt) {
        this.life -= dt;
    }
}

// ==========================================
// ENEMIES
// ==========================================
class Enemy {
    constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.vx = 0;
        this.vy = 0;
    }

    update(dt, player, canvasWidth, canvasHeight) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        if (this.x <= this.radius && this.vx < 0) this.vx *= -1;
        if (this.x >= canvasWidth - this.radius && this.vx > 0) this.vx *= -1;
        if (this.y <= this.radius && this.vy < 0) this.vy *= -1;
        if (this.y >= canvasHeight - this.radius && this.vy > 0) this.vy *= -1;
    }
    
    checkCollision(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const dist = Math.hypot(dx, dy);
        return dist < (this.radius + player.radius) * 0.8;
    }
}

class Chaser extends Enemy {
    constructor(x, y, speedMult) {
        super(x, y, 10, '#ff0055', 140 * speedMult); // Base speed reduced for early game
        this.type = 'chaser';
    }

    update(dt, player, canvasWidth, canvasHeight) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }

        super.update(dt, player, canvasWidth, canvasHeight);
    }
}

class Predictor extends Enemy {
    constructor(x, y, speedMult) {
        super(x, y, 8, '#ffaa00', 160 * speedMult); // Base speed reduced
        this.type = 'predictor';
    }

    update(dt, player, canvasWidth, canvasHeight) {
        const predictX = player.x + player.vx * 1.5;
        const predictY = player.y + player.vy * 1.5;

        const targetX = Math.max(0, Math.min(canvasWidth, predictX));
        const targetY = Math.max(0, Math.min(canvasHeight, predictY));

        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const dist = Math.hypot(dx, dy);

        if (dist > 0) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        }

        super.update(dt, player, canvasWidth, canvasHeight);
    }
}

class Blocker extends Enemy {
    constructor(x, y, speedMult, targetX, targetY) {
        super(x, y, 16, '#aa00ff', 100 * speedMult);
        this.type = 'blocker';
        this.targetZone = { x: targetX, y: targetY }; 
    }

    update(dt, player, canvasWidth, canvasHeight) {
        const dx = this.targetZone.x - this.x;
        const dy = this.targetZone.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist > 20) {
            this.vx = (dx / dist) * this.speed;
            this.vy = (dy / dist) * this.speed;
        } else {
            const pdx = player.x - this.x;
            const pdy = player.y - this.y;
            const pdist = Math.hypot(pdx, pdy);
            if (pdist > 0) {
                this.vx = (pdx / pdist) * (this.speed * 0.4);
                this.vy = (pdy / pdist) * (this.speed * 0.4);
            }
        }

        super.update(dt, player, canvasWidth, canvasHeight);
    }
}

// ==========================================
// AI ANALYZER
// ==========================================
class AIAnalyzer {
    constructor() {
        this.leftBias = false;
        this.rightBias = false;
        this.topBias = false;
        this.bottomBias = false;
        
        this.edgePreference = false;
        this.centerPreference = false;
        this.avgSpeed = 0;
        
        this.analysisText = "AI noticed: Analyzing patterns...";
        this.adaptationStats = [];
    }

    analyze(player, canvasWidth, canvasHeight) {
        if (player.history.length < 20) return;

        let totalDx = 0;
        let totalDy = 0;
        let movingCount = 0;
        let edgeCount = 0;

        player.history.forEach(p => {
            if (Math.abs(p.dx) > 0 || Math.abs(p.dy) > 0) {
                totalDx += p.dx;
                totalDy += p.dy;
                movingCount++;
            }

            const marginX = canvasWidth * 0.15;
            const marginY = canvasHeight * 0.15;
            if (p.x < marginX || p.x > canvasWidth - marginX || 
                p.y < marginY || p.y > canvasHeight - marginY) {
                edgeCount++;
            }
        });

        if (movingCount > 0) {
            const avgDx = totalDx / movingCount;
            const avgDy = totalDy / movingCount;
            
            this.leftBias = avgDx < -0.3;
            this.rightBias = avgDx > 0.3;
            this.topBias = avgDy < -0.3;
            this.bottomBias = avgDy > 0.3;
            
            this.avgSpeed = movingCount / player.history.length;
        }

        const edgeRatio = edgeCount / player.history.length;
        this.edgePreference = edgeRatio > 0.6;
        this.centerPreference = edgeRatio < 0.2;

        this.generateStatusText();
    }

    generateStatusText() {
        const notices = [];
        if (this.leftBias) notices.push("You favor leftward escapes");
        if (this.rightBias) notices.push("You favor rightward escapes");
        if (this.topBias) notices.push("You retreat upwards often");
        if (this.bottomBias) notices.push("You dive downwards constantly");
        if (this.edgePreference) notices.push("You hug the walls for safety");
        if (this.centerPreference) notices.push("You stick to the arena center");
        if (this.avgSpeed > 0.8) notices.push("High panic erratic movement detected");

        if (notices.length > 0) {
            const notice = notices[Math.floor(Math.random() * notices.length)];
            this.analysisText = "AI noticed: " + notice;
            
            if (!this.adaptationStats.includes(notice)) {
                this.adaptationStats.push(notice);
            }
        } else {
            this.analysisText = "AI noticed: Still gathering data...";
        }
    }

    getSpawnRecommendation(canvasWidth, canvasHeight, player) {
        const r = Math.random();
        let type = 'chaser';
        let x, y;
        let targetX = player.x;
        let targetY = player.y;

        const spawnEdge = Math.floor(Math.random() * 4);
        const margin = 50;
        
        if (spawnEdge === 0) { x = Math.random() * canvasWidth; y = -margin; }
        else if (spawnEdge === 1) { x = Math.random() * canvasWidth; y = canvasHeight + margin; }
        else if (spawnEdge === 2) { x = -margin; y = Math.random() * canvasHeight; }
        else { x = canvasWidth + margin; y = Math.random() * canvasHeight; }

        if (this.avgSpeed > 0.8 && r < 0.5) {
            type = 'predictor';
        } else if ((this.leftBias || this.rightBias || this.topBias || this.bottomBias) && r < 0.6) {
            type = 'blocker';
            if (this.leftBias) targetX -= 200;
            if (this.rightBias) targetX += 200;
            if (this.topBias) targetY -= 200;
            if (this.bottomBias) targetY += 200;
            
            targetX = Math.max(margin, Math.min(canvasWidth - margin, targetX));
            targetY = Math.max(margin, Math.min(canvasHeight - margin, targetY));
            
            if (this.leftBias) { x = -margin; y = targetY; }
            else if (this.rightBias) { x = canvasWidth + margin; y = targetY; }
            else if (this.topBias) { x = targetX; y = -margin; }
            else if (this.bottomBias) { x = targetX; y = canvasHeight + margin; }
        } else if (this.edgePreference && r < 0.5) {
            type = 'blocker';
            targetX = spawnEdge < 2 ? player.x : (spawnEdge === 2 ? margin : canvasWidth - margin);
            targetY = spawnEdge > 1 ? player.y : (spawnEdge === 0 ? margin : canvasHeight - margin);
        } else {
            type = Math.random() > 0.7 ? 'predictor' : 'chaser';
        }

        return { type, x, y, targetX, targetY };
    }
}

// ==========================================
// RENDERER
// ==========================================
class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    addParticles(x, y, color, count = 10, speed = 1) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                vx: (Math.random() - 0.5) * speed * 150,
                vy: (Math.random() - 0.5) * speed * 150,
                life: 1.0,
                color,
                size: Math.random() * 3 + 1
            });
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= dt * 1.5;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(gameState) {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 60;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.canvas.height); ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.canvas.width, y); ctx.stroke();
        }

        ctx.globalCompositeOperation = 'lighter';

        // Particles
        this.particles.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // PowerUps
        gameState.powerUps.forEach(p => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = p.color;
            ctx.fillStyle = p.color;
            
            const pulse = Math.abs(Math.sin(Date.now() / 200)) * 4;
            const r = p.radius + pulse;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - r);
            ctx.lineTo(p.x + r, p.y);
            ctx.lineTo(p.x, p.y + r);
            ctx.lineTo(p.x - r, p.y);
            ctx.closePath();
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Enemies
        gameState.enemies.forEach(e => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = e.color;
            ctx.fillStyle = e.color;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Player
        if (!gameState.isGameOver) {
            const p = gameState.player;
            
            // Shield aura
            if (p.hasShield) {
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 3;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#ffffff';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius + 8, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Body
            ctx.shadowBlur = 20;
            const playerRenderColor = p.speedBoostTimer > 0 ? '#00ff00' : p.color;
            ctx.shadowColor = playerRenderColor;
            ctx.fillStyle = playerRenderColor;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#fff';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.globalCompositeOperation = 'source-over';
        ctx.shadowBlur = 0;
    }
}

// ==========================================
// GAME STATE
// ==========================================
class GameState {
    constructor(renderer, audio) {
        this.renderer = renderer;
        this.audio = audio;
        this.input = new Input();
        this.ai = new AIAnalyzer();
        
        this.highScore = localStorage.getItem('mindDodgeHighScore') || 0;
        document.getElementById('start-high-score').textContent = Math.floor(this.highScore);
        
        this.reset();
    }

    reset() {
        this.player = new Player(this.renderer.canvas.width, this.renderer.canvas.height);
        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.time = 0;
        this.multiplier = 1.0;
        
        this.isGameOver = false;
        this.isPaused = false;
        this.lastTime = 0;
        
        this.spawnTimer = 0;
        this.spawnInterval = 3.5; // Starts much slower, gradual difficulty
        
        this.powerUpTimer = 0;
        this.powerUpInterval = 10; // First drop is fast
        
        this.aiTimer = 0;
        this.ai = new AIAnalyzer();
        
        this.renderer.particles = [];
        this.updateHUD();
    }

    updateHUD() {
        document.getElementById('score').textContent = Math.floor(this.score);
        
        const minutes = Math.floor(this.time / 60);
        const seconds = Math.floor(this.time % 60).toString().padStart(2, '0');
        document.getElementById('time').textContent = `${minutes}:${seconds}`;
        
        document.getElementById('multiplier').textContent = this.multiplier.toFixed(1);
        document.getElementById('ai-status-text').textContent = this.ai.analysisText;
    }

    spawnPowerUp() {
        const types = ['shield', 'emp', 'speed'];
        const type = types[Math.floor(Math.random() * types.length)];
        const margin = 80;
        const cw = this.renderer.canvas.width;
        const ch = this.renderer.canvas.height;
        const playableHeight = window.innerWidth <= 768 ? ch * 0.65 : ch;
        const x = margin + Math.random() * (cw - margin * 2);
        const y = margin + Math.random() * (playableHeight - margin * 2);
        
        this.powerUps.push(new PowerUp(x, y, type));
    }

    spawnEnemy() {
        const cw = this.renderer.canvas.width;
        const ch = this.renderer.canvas.height;
        const playableHeight = window.innerWidth <= 768 ? ch * 0.65 : ch;
        
        const rec = this.ai.getSpawnRecommendation(cw, playableHeight, this.player);
        // Extremely gradual speed scaling to help players adapt
        const speedMult = 0.7 + (this.time / 150) * 0.6; 
        
        let enemy;
        if (rec.type === 'chaser') {
            enemy = new Chaser(rec.x, rec.y, speedMult);
        } else if (rec.type === 'predictor') {
            enemy = new Predictor(rec.x, rec.y, speedMult);
        } else {
            enemy = new Blocker(rec.x, rec.y, speedMult, rec.targetX, rec.targetY);
        }
        
        this.enemies.push(enemy);
        this.audio.playSound('spawn');
        
        // Decreases spawn interval much more slowly
        this.spawnInterval = Math.max(0.6, 3.5 - (this.time / 45));
    }

    activatePowerUp(type) {
        this.audio.playSound('powerup');
        if (type === 'shield') {
            this.player.hasShield = true;
        } else if (type === 'emp') {
            this.audio.playSound('emp');
            this.enemies.forEach(e => {
                this.renderer.addParticles(e.x, e.y, e.color, 20, 2);
            });
            this.enemies = [];
            
            this.renderer.addParticles(this.player.x, this.player.y, '#ffff00', 150, 6);
            
            const container = document.getElementById('game-container');
            container.classList.remove('shake');
            void container.offsetWidth;
            container.classList.add('shake');
        } else if (type === 'speed') {
            this.player.speedBoostTimer = 6;
        }
    }

    update(currentTime) {
        if (this.lastTime === 0) this.lastTime = currentTime;
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        if (this.isGameOver || this.isPaused) return;
        if (dt > 0.1) return; 

        this.time += dt;
        this.multiplier = 1.0 + Math.floor(this.time / 10) * 0.5;
        this.audio.updatePulse(this.multiplier);
        this.score += 10 * this.multiplier * dt;

        this.player.update(dt, this.input, this.renderer.canvas.width, this.renderer.canvas.height);
        
        if (Math.abs(this.player.vx) > 0 || Math.abs(this.player.vy) > 0) {
            if (Math.random() < 0.4) {
                const trailColor = this.player.speedBoostTimer > 0 ? '#00ff00' : this.player.color;
                this.renderer.addParticles(this.player.x, this.player.y, trailColor, 1, 0.5);
            }
        }

        // PowerUps logic
        this.powerUpTimer += dt;
        if (this.powerUpTimer >= this.powerUpInterval) {
            this.powerUpTimer = 0;
            this.spawnPowerUp();
            this.powerUpInterval = 15 + Math.random() * 10; // 15 to 25 seconds
        }

        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            let p = this.powerUps[i];
            p.update(dt);
            
            const dx = p.x - this.player.x;
            const dy = p.y - this.player.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < p.radius + this.player.radius) {
                this.activatePowerUp(p.type);
                this.renderer.addParticles(p.x, p.y, p.color, 40, 3);
                this.powerUps.splice(i, 1);
                continue;
            }
            
            if (p.life <= 0) {
                this.powerUps.splice(i, 1);
            }
        }

        const playableHeight = window.innerWidth <= 768 ? this.renderer.canvas.height * 0.65 : this.renderer.canvas.height;
        this.enemies.forEach(e => e.update(dt, this.player, this.renderer.canvas.width, playableHeight));

        // Check Collisions (iterate backwards for splicing safely)
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            let e = this.enemies[i];
            if (e.checkCollision(this.player)) {
                if (this.player.hasShield) {
                    this.player.hasShield = false;
                    this.audio.playSound('shieldBreak');
                    this.renderer.addParticles(e.x, e.y, '#ffffff', 50, 4);
                    this.renderer.addParticles(e.x, e.y, e.color, 30, 2);
                    this.enemies.splice(i, 1);
                    
                    const container = document.getElementById('game-container');
                    container.classList.remove('shake');
                    void container.offsetWidth;
                    container.classList.add('shake');
                } else {
                    this.gameOver();
                    break;
                }
            }
        }

        this.spawnTimer += dt;
        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }

        this.aiTimer += dt;
        if (this.aiTimer >= 1.0) {
            this.aiTimer = 0;
            const playableHeight = window.innerWidth <= 768 ? this.renderer.canvas.height * 0.65 : this.renderer.canvas.height;
            this.ai.analyze(this.player, this.renderer.canvas.width, playableHeight);
            this.updateHUD();
        }

        if (Math.floor(this.time * 10) % 2 === 0) {
             document.getElementById('score').textContent = Math.floor(this.score);
             const minutes = Math.floor(this.time / 60);
             const seconds = Math.floor(this.time % 60).toString().padStart(2, '0');
             document.getElementById('time').textContent = `${minutes}:${seconds}`;
             document.getElementById('multiplier').textContent = this.multiplier.toFixed(1);
        }

        this.renderer.updateParticles(dt);
        this.renderer.draw(this);
    }

    gameOver() {
        this.isGameOver = true;
        this.audio.stopBg();
        this.audio.playSound('gameover');
        
        this.renderer.addParticles(this.player.x, this.player.y, this.player.color, 80, 4);
        
        const container = document.getElementById('game-container');
        container.classList.remove('shake'); 
        void container.offsetWidth; 
        container.classList.add('shake');

        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('mindDodgeHighScore', this.highScore);
            document.getElementById('start-high-score').textContent = Math.floor(this.highScore);
        }

        setTimeout(() => {
            document.getElementById('hud').classList.add('hidden');
            const trackpad = document.getElementById('trackpad');
            if (trackpad) trackpad.classList.add('hidden');
            document.getElementById('game-over-screen').classList.remove('hidden');
            
            document.getElementById('final-score').textContent = Math.floor(this.score);
            const minutes = Math.floor(this.time / 60);
            const seconds = Math.floor(this.time % 60).toString().padStart(2, '0');
            document.getElementById('final-time').textContent = `${minutes}:${seconds}`;
            
            const list = document.getElementById('analysis-list');
            list.innerHTML = '';
            
            if (this.ai.adaptationStats.length === 0) {
                list.innerHTML = '<li>Insufficient data. You died too quickly.</li>';
            } else {
                this.ai.adaptationStats.forEach(stat => {
                    const li = document.createElement('li');
                    li.textContent = stat;
                    list.appendChild(li);
                });
                const li = document.createElement('li');
                li.textContent = "AI adapted successfully. Spawns were adjusted to counter your habits.";
                li.style.color = "var(--enemy-chaser)";
                li.style.marginTop = "1rem";
                li.style.fontWeight = "bold";
                list.appendChild(li);
            }
        }, 1200);
    }
}

// ==========================================
// APP INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const renderer = new Renderer(canvas);
    const audio = new AudioManager();
    let gameState = new GameState(renderer, audio);

    const startScreen = document.getElementById('start-screen');
    const hud = document.getElementById('hud');
    const gameOverScreen = document.getElementById('game-over-screen');
    const pauseScreen = document.getElementById('pause-screen');
    const trackpad = document.getElementById('trackpad');

    let animationFrameId;

    function gameLoop(time) {
        gameState.update(time);
        animationFrameId = requestAnimationFrame(gameLoop);
    }

    document.getElementById('start-btn').addEventListener('click', () => {
        audio.init();
        audio.resume();
        audio.startBg();
        startScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        if (trackpad) trackpad.classList.remove('hidden');
        gameState.reset();
        gameState.lastTime = performance.now();
        gameLoop(gameState.lastTime);
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        audio.resume();
        audio.startBg();
        gameOverScreen.classList.add('hidden');
        hud.classList.remove('hidden');
        if (trackpad) trackpad.classList.remove('hidden');
        gameState.reset();
        gameState.lastTime = performance.now();
    });

    document.getElementById('pause-btn').addEventListener('click', () => {
        if (gameState.isGameOver) return;
        gameState.isPaused = true;
        pauseScreen.classList.remove('hidden');
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
        gameState.isPaused = false;
        pauseScreen.classList.add('hidden');
        gameState.lastTime = performance.now();
    });

    renderer.draw(gameState);
});
