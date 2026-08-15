(function () {
  'use strict';

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const scoreVal = document.getElementById('scoreVal');
  const hiScoreVal = document.getElementById('hiScoreVal');
  const speedVal = document.getElementById('speedVal');
  const startScreen = document.getElementById('startScreen');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const finalScore = document.getElementById('finalScore');
  const finalBest = document.getElementById('finalBest');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const toast = document.getElementById('toast');

  const LANES = 4;

  let W = 0;
  let H = 0;
  let dpr = 1;

  let roadLeft = 0;
  let roadRight = 0;
  let laneWidth = 0;
  let laneXs = [];

  const player = {
    x: 0,
    y: 0,
    w: 44,
    h: 78
  };

  const enemies = [];
  let enemyCount = 0;

  let state = 'idle'; // idle | playing | paused | over
  let score = 0;
  let hiScore = parseInt(localStorage.getItem('turboRoadHiScore')) || 0;
  let speed = 0;
  let baseSpeed = 260;
  let maxSpeed = 820;
  let distance = 0;
  let lastTime = 0;
  let spawnTimer = 0;
  let shakeTimer = 0;
  let shakeX = 0;

  const keys = { left: false, right: false };
  let touchX = null;
  let lastTouchX = 0;

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    roadLeft = Math.round(W * 0.08);
    roadRight = W - Math.round(W * 0.08);
    laneWidth = (roadRight - roadLeft) / LANES;
    laneXs = [];
    for (let i = 0; i < LANES; i++) laneXs.push(roadLeft + laneWidth * i + laneWidth / 2);

    player.w = Math.min(46, laneWidth * 0.42);
    player.h = player.w * 1.8;
    player.y = H - player.h - Math.max(60, H * 0.09);
    player.x = laneXs[1];

    const hud = document.querySelector('.hud');
    hud.style.display = state === 'playing' ? 'flex' : 'none';
  }

  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawCar(x, y, w, h, body, dark, light, isPlayer) {
    const x1 = x - w / 2;
    const y1 = y - h / 2;

    ctx.save();

    ctx.fillStyle = '#0d0d12';
    roundRect(x1 - 3, y1 + h * 0.12, w + 6, h * 0.14, 4);
    ctx.fill();
    roundRect(x1 - 3, y1 + h * 0.7, w + 6, h * 0.14, 4);
    ctx.fill();

    ctx.fillStyle = body;
    roundRect(x1, y1, w, h, 10);
    ctx.fill();

    ctx.fillStyle = dark;
    roundRect(x1 + w * 0.14, y1 + h * 0.22, w * 0.72, h * 0.2, 5);
    ctx.fill();

    if (isPlayer) {
      ctx.fillStyle = light;
      roundRect(x1 + w * 0.2, y1 + h * 0.24, w * 0.6, h * 0.16, 3);
      ctx.fill();
    } else {
      ctx.fillStyle = light;
      roundRect(x1 + w * 0.18, y1 + h * 0.24, w * 0.64, h * 0.15, 3);
      ctx.fill();
    }

    ctx.fillStyle = '#1b1b26';
    roundRect(x1 + w * 0.16, y1 + h * 0.46, w * 0.68, h * 0.22, 4);
    ctx.fill();

    ctx.fillStyle = dark;
    roundRect(x1 + w * 0.14, y1 + h * 0.72, w * 0.72, h * 0.16, 4);
    ctx.fill();

    if (isPlayer) {
      ctx.fillStyle = '#ffe08a';
      ctx.fillRect(x1 + w * 0.18, y1 + h * 0.06, w * 0.2, h * 0.06);
      ctx.fillRect(x1 + w * 0.62, y1 + h * 0.06, w * 0.2, h * 0.06);
    } else {
      ctx.fillStyle = '#ff5a5a';
      ctx.fillRect(x1 + w * 0.18, y1 + h * 0.06, w * 0.2, h * 0.06);
      ctx.fillRect(x1 + w * 0.62, y1 + h * 0.06, w * 0.2, h * 0.06);
    }

    ctx.restore();
  }

  let scroll = 0;

  function drawRoad() {
    ctx.fillStyle = '#1e2b16';
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#181a24';
    ctx.fillRect(roadLeft, 0, roadRight - roadLeft, H);

    ctx.fillStyle = '#ff8c00';
    ctx.fillRect(roadLeft, 0, 4, H);
    ctx.fillRect(roadRight - 4, 0, 4, H);

    const dashH = 44;
    const gap = 30;
    const total = dashH + gap;
    scroll += speed * 0.03 * 0.016;
    let offset = scroll % total;

    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    for (let i = 0; i < LANES - 1; i++) {
      const lx = roadLeft + laneWidth * (i + 1);
      for (let y = -total + offset; y < H; y += total) {
        ctx.fillRect(lx - 2, y, 4, dashH);
      }
    }
  }

  function drawPlayer() {
    if (state === 'over') return;
    drawCar(player.x + shakeX, player.y, player.w, player.h, '#ff3d3d', '#b01e1e', '#ffd0d0', true);
  }

  function spawnEnemy() {
    let tries = 0;
    let lane;
    do {
      lane = Math.floor(Math.random() * LANES);
      tries++;
    } while (tries < 12 && enemies.some(e => e.lane === lane && e.y < e.h + 60));

    const w = Math.min(46, laneWidth * 0.4);
    const colors = [
      ['#3f8cff', '#2451b0', '#cfe2ff'],
      ['#ffd23f', '#b8931a', '#fff3c4'],
      ['#37d67a', '#1f8f4d', '#d0ffe6'],
      ['#b066ff', '#6d33b8', '#ecd9ff']
    ];
    const c = colors[Math.floor(Math.random() * colors.length)];

    enemies.push({
      lane: lane,
      x: laneXs[lane],
      y: -80,
      w: w,
      h: w * 1.8,
      id: ++enemyCount,
      colors: c,
      speedFactor: 0.55 + Math.random() * 0.35
    });
  }

  function crashParticles(x, y) {
    for (let i = 0; i < 22; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 380,
        vy: (Math.random() - 0.5) * 380,
        life: 1,
        color: Math.random() > 0.4 ? '#ff8c00' : '#ff3d3d',
        size: 3 + Math.random() * 4
      });
    }
  }

  const particles = [];

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 700 * dt;
      p.life -= dt * 1.6;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    });
    ctx.globalAlpha = 1;
  }

  function update(dt) {
    if (state !== 'playing') return;

    speed = Math.min(maxSpeed, baseSpeed + distance / 120);
    distance += speed * dt;

    const points = Math.floor(distance / 10);
    if (points !== score) {
      score = points;
      scoreVal.textContent = score;
    }
    speedVal.textContent = Math.round(speed / 9);

    const moveSpeed = 420;
    if (keys.left) player.x -= moveSpeed * dt;
    if (keys.right) player.x += moveSpeed * dt;
    player.x = clamp(player.x, roadLeft + player.w / 2 + 4, roadRight - player.w / 2 - 4);

    enemies.forEach(e => {
      e.y += speed * e.speedFactor * dt;
    });

    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      if (e.y - e.h / 2 > H + 40) {
        enemies.splice(i, 1);
        continue;
      }

      const px1 = player.x - player.w / 2 + 6;
      const py1 = player.y - player.h / 2 + 6;
      const px2 = player.x + player.w / 2 - 6;
      const py2 = player.y + player.h / 2 - 6;
      const ex1 = e.x - e.w / 2 + 4;
      const ey1 = e.y - e.h / 2 + 4;
      const ex2 = e.x + e.w / 2 - 4;
      const ey2 = e.y + e.h / 2 - 4;

      if (px1 < ex2 && px2 > ex1 && py1 < ey2 && py2 > ey1) {
        crashParticles(player.x, player.y);
        shakeTimer = 0.4;
        gameOver();
        return;
      }
    }

    spawnTimer -= dt;
    if (spawnTimer <= 0) {
      spawnEnemy();
      const spawnRate = clamp(1.5 - distance / 9000, 0.42, 1.5);
      spawnTimer = spawnRate + Math.random() * 0.5;
    }

    updateParticles(dt);

    if (shakeTimer > 0) {
      shakeTimer -= dt;
      shakeX = (Math.random() - 0.5) * 12;
    } else {
      shakeX = 0;
    }
  }

  function draw() {
    drawRoad();

    const sorted = enemies.slice().sort((a, b) => a.y - b.y);
    const playerY = player.y;
    let playerDrawn = false;

    sorted.forEach(e => {
      if (!playerDrawn && playerY < e.y) {
        drawPlayer();
        playerDrawn = true;
      }
      drawCar(e.x, e.y, e.w, e.h, e.colors[0], e.colors[1], e.colors[2], false);
    });

    if (!playerDrawn) drawPlayer();

    drawParticles();
  }

  function gameOver() {
    state = 'over';
    if (score > hiScore) {
      hiScore = score;
      localStorage.setItem('turboRoadHiScore', hiScore);
    }
    finalScore.textContent = score;
    finalBest.textContent = hiScore;
    gameOverScreen.style.display = 'flex';
    document.querySelector('.hud').style.display = 'flex';
  }

  function reset() {
    enemies.length = 0;
    particles.length = 0;
    distance = 0;
    score = 0;
    baseSpeed = 260;
    speed = 0;
    spawnTimer = 1;
    shakeTimer = 0;
    shakeX = 0;
    scoreVal.textContent = '0';
    speedVal.textContent = '0';
    player.x = laneXs[1];
    if (hiScoreVal) hiScoreVal.textContent = hiScore;
  }

  function startGame() {
    reset();
    state = 'playing';
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    document.querySelector('.hud').style.display = 'flex';
    lastTime = performance.now();
  }

  function togglePause() {
    if (state === 'playing') {
      state = 'paused';
      showToast('PAUSA');
    } else if (state === 'paused') {
      state = 'playing';
      lastTime = performance.now();
    }
  }

  let toastTimer = null;
  function showToast(text) {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 900);
  }

  let rafId = null;
  function loop(t) {
    const dt = Math.min(0.05, (t - lastTime) / 1000);
    lastTime = t;
    update(dt);
    draw();
    rafId = requestAnimationFrame(loop);
  }

  document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'KeyP' || e.code === 'Escape') togglePause();
    if (e.code === 'Space') {
      if (state === 'idle' || state === 'over') startGame();
      else if (state === 'paused') togglePause();
    }
    if (e.code === 'Space') e.preventDefault();
  });

  document.addEventListener('keyup', e => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  });

  canvas.addEventListener('touchstart', e => {
    if (state === 'idle' || state === 'over') return;
    const t = e.touches[0];
    touchX = t.clientX;
    lastTouchX = t.clientX;
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (state !== 'playing' || touchX === null) return;
    const t = e.touches[0];
    const dx = t.clientX - lastTouchX;
    lastTouchX = t.clientX;
    player.x += dx * 1.6;
    player.x = clamp(player.x, roadLeft + player.w / 2 + 4, roadRight - player.w / 2 - 4);
  }, { passive: false });

  canvas.addEventListener('touchend', () => {
    touchX = null;
  });

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);

  window.addEventListener('resize', resize);

  resize();
  if (hiScoreVal) hiScoreVal.textContent = hiScore;
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
})();
