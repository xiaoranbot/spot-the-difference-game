// Whale Cottage — game logic: state, clicks, keyboard, hints, timer,
// staging for screenshots, and the win screen. No randomness anywhere:
// the same URL always shows the same frame.
'use strict';

const PANEL_W = 600;
const PANEL_H = 400;
const STAGED_FOUND = [0, 2, 4]; // moon, teapot knob, clock — for ?shot=play
const STAGED_PLAY_SECONDS = 83; // 01:23
const STAGED_END_SECONDS = 247; // 04:07
const STAGED_END_WRONG = 2;

const state = {
  phase: 'title', // 'title' | 'playing' | 'won'
  found: new Set(),
  wrong: 0,
  clicks: 0,
  hintsLeft: 3,
  seconds: 0,
  timerId: null,
  staged: null, // null | 'start' | 'play' | 'end'
  crosshair: { x: 300, y: 200 },
};

const $ = (id) => document.getElementById(id);

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function renderHud() {
  $('foundCount').textContent = 'Found ' + state.found.size + ' / ' + TOTAL_DIFFERENCES;
  $('timer').textContent = formatTime(state.seconds);
  $('hintBtn').textContent = 'Hint (' + state.hintsLeft + ')';
  $('hintBtn').disabled = state.hintsLeft <= 0 || state.phase !== 'playing';
  $('soundBtn').textContent = SoundFX.muted ? 'Sound: Off' : 'Sound: On';
}

function startTimer() {
  stopTimer();
  if (state.staged) return; // staged frames keep a fixed clock
  state.timerId = setInterval(() => {
    state.seconds += 1;
    $('timer').textContent = formatTime(state.seconds);
  }, 1000);
}

function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function svgEl(tag, attrs) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// Draw a numbered circle marker at a difference, on both panels.
function markFound(diff, index) {
  for (const layerId of ['leftMarkerLayer', 'rightMarkerLayer']) {
    const layer = $(layerId);
    const circle = svgEl('circle', {
      cx: diff.x, cy: diff.y, r: diff.r,
      fill: 'none', stroke: '#ffd23f', 'stroke-width': 4,
    });
    const badge = svgEl('circle', {
      cx: diff.x + diff.r * 0.7, cy: diff.y - diff.r * 0.7, r: 13,
      fill: '#ffd23f', stroke: '#7a4a21', 'stroke-width': 2,
    });
    const label = svgEl('text', {
      x: diff.x + diff.r * 0.7, y: diff.y - diff.r * 0.7 + 4.5,
      'text-anchor': 'middle', 'font-size': 15, 'font-weight': 'bold',
      fill: '#5a3410', 'font-family': 'system-ui, sans-serif',
    });
    label.textContent = String(index + 1);
    layer.appendChild(circle);
    layer.appendChild(badge);
    layer.appendChild(label);
  }
}

// A short-lived red X where a wrong click landed.
function markWrong(x, y) {
  const layer = $('fxLayer');
  const g = svgEl('g', { stroke: '#e33f2e', 'stroke-width': 5, 'stroke-linecap': 'round' });
  g.appendChild(svgEl('line', { x1: x - 11, y1: y - 11, x2: x + 11, y2: y + 11 }));
  g.appendChild(svgEl('line', { x1: x + 11, y1: y - 11, x2: x - 11, y2: y + 11 }));
  layer.appendChild(g);
  setTimeout(() => g.remove(), 650);
}

// A pulsing ring around one unfound difference for a moment.
function flashHint(diff) {
  const layer = $('fxLayer');
  const ring = svgEl('circle', {
    cx: diff.x, cy: diff.y, r: diff.r + 4,
    fill: 'none', stroke: '#ffd23f', 'stroke-width': 5, class: 'hint-ring',
  });
  layer.appendChild(ring);
  setTimeout(() => ring.remove(), 1800);
}

function nearestUnfound(x, y) {
  for (const diff of DIFFERENCES) {
    if (state.found.has(diff.id)) continue;
    const dx = x - diff.x;
    const dy = y - diff.y;
    if (dx * dx + dy * dy <= diff.r * diff.r) return diff;
  }
  return null;
}

function tryPoint(x, y) {
  if (state.phase !== 'playing') return;
  state.clicks += 1;
  const diff = nearestUnfound(x, y);
  if (diff) {
    state.found.add(diff.id);
    markFound(diff, state.found.size - 1);
    SoundFX.found();
    renderHud();
    if (state.found.size === TOTAL_DIFFERENCES) winGame();
  } else {
    state.wrong += 1;
    markWrong(x, y);
    SoundFX.wrong();
    renderHud();
  }
}

function useHint() {
  if (state.phase !== 'playing' || state.hintsLeft <= 0) return;
  const remaining = DIFFERENCES.filter((d) => !state.found.has(d.id));
  if (remaining.length === 0) return;
  state.hintsLeft -= 1;
  flashHint(remaining[0]);
  SoundFX.hint();
  renderHud();
}

function winGame() {
  state.phase = 'won';
  stopTimer();
  SoundFX.win();
  const accuracy = state.clicks === 0 ? 100 : Math.round((state.found.size / state.clicks) * 100);
  $('endTime').textContent = formatTime(state.seconds);
  $('endWrong').textContent = String(state.wrong);
  $('endAccuracy').textContent = accuracy + '%';
  $('endScreen').classList.remove('hidden');
}

function startGame() {
  state.phase = 'playing';
  state.found = new Set();
  state.wrong = 0;
  state.clicks = 0;
  state.hintsLeft = 3;
  state.seconds = 0;
  for (const layerId of ['leftMarkerLayer', 'rightMarkerLayer', 'fxLayer']) {
    $(layerId).innerHTML = '';
  }
  $('titleScreen').classList.add('hidden');
  $('endScreen').classList.add('hidden');
  renderHud();
  startTimer();
  SoundFX.start();
}

function restartGame() {
  startGame();
}

// ---- crosshair (keyboard play) -------------------------------------------
function moveCrosshair(dx, dy) {
  state.crosshair.x = Math.max(10, Math.min(PANEL_W - 10, state.crosshair.x + dx));
  state.crosshair.y = Math.max(10, Math.min(PANEL_H - 10, state.crosshair.y + dy));
  positionCrosshair();
}

function positionCrosshair() {
  const ring = $('crosshair');
  ring.style.left = state.crosshair.x + 'px';
  ring.style.top = state.crosshair.y + 'px';
  ring.style.transform = 'translate(-50%, -50%)';
}

function panelPointFromEvent(event) {
  const rect = $('rightSvg').getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_W,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_H,
  };
}

// ---- staging for screenshots (?shot=start|play|end) -----------------------
function applyShot(shot) {
  state.staged = shot;
  if (shot === 'start') {
    state.phase = 'title';
    $('titleScreen').classList.remove('hidden');
  } else if (shot === 'play') {
    state.phase = 'playing';
    state.seconds = STAGED_PLAY_SECONDS;
    $('titleScreen').classList.add('hidden');
    for (const i of STAGED_FOUND) {
      const diff = DIFFERENCES[i];
      state.found.add(diff.id);
      markFound(diff, state.found.size - 1);
    }
    state.clicks = STAGED_FOUND.length;
  } else if (shot === 'end') {
    state.phase = 'won';
    state.seconds = STAGED_END_SECONDS;
    state.wrong = STAGED_END_WRONG;
    state.clicks = TOTAL_DIFFERENCES + STAGED_END_WRONG;
    $('titleScreen').classList.add('hidden');
    for (const diff of DIFFERENCES) {
      state.found.add(diff.id);
      markFound(diff, state.found.size - 1);
    }
    const accuracy = Math.round((TOTAL_DIFFERENCES / state.clicks) * 100);
    $('endTime').textContent = formatTime(state.seconds);
    $('endWrong').textContent = String(state.wrong);
    $('endAccuracy').textContent = accuracy + '%';
    $('endScreen').classList.remove('hidden');
  }
  renderHud();
}

// ---- boot ------------------------------------------------------------------
function boot() {
  $('leftSvg').innerHTML = buildScene(0);
  $('rightSvg').innerHTML = buildScene(1);
  // marker and fx layers sit on top of each scene
  for (const [svgId, layerId] of [['leftSvg', 'leftMarkerLayer'], ['rightSvg', 'rightMarkerLayer'], ['rightSvg', 'fxLayer']]) {
    const g = svgEl('g', { id: layerId });
    $(svgId).appendChild(g);
  }
  positionCrosshair();

  $('rightSvg').addEventListener('click', (event) => {
    const p = panelPointFromEvent(event);
    state.crosshair = { x: p.x, y: p.y };
    positionCrosshair();
    tryPoint(p.x, p.y);
  });

  $('startBtn').addEventListener('click', startGame);
  $('againBtn').addEventListener('click', restartGame);
  $('restartBtn').addEventListener('click', restartGame);
  $('hintBtn').addEventListener('click', useHint);
  $('soundBtn').addEventListener('click', () => {
    SoundFX.muted = !SoundFX.muted;
    renderHud();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'm' || event.key === 'M') {
      SoundFX.muted = !SoundFX.muted;
      renderHud();
      return;
    }
    if (event.key === 'r' || event.key === 'R') {
      if (state.phase !== 'title') restartGame();
      return;
    }
    if (state.phase !== 'playing') return;
    const step = event.shiftKey ? 4 : 14;
    if (event.key === 'ArrowLeft') { moveCrosshair(-step, 0); event.preventDefault(); }
    else if (event.key === 'ArrowRight') { moveCrosshair(step, 0); event.preventDefault(); }
    else if (event.key === 'ArrowUp') { moveCrosshair(0, -step); event.preventDefault(); }
    else if (event.key === 'ArrowDown') { moveCrosshair(0, step); event.preventDefault(); }
    else if (event.key === 'Enter' || event.key === ' ') {
      tryPoint(state.crosshair.x, state.crosshair.y);
      event.preventDefault();
    } else if (event.key === 'h' || event.key === 'H') {
      useHint();
    }
  });

  const params = new URLSearchParams(window.location.search);
  const shot = params.get('shot');
  if (shot === 'start' || shot === 'play' || shot === 'end') {
    applyShot(shot);
  } else {
    renderHud();
  }
}

document.addEventListener('DOMContentLoaded', boot);
