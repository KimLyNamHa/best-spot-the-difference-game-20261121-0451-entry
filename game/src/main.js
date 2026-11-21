// main.js — the game's state machine: menu, playing, level complete and
// results. It owns the timer, the counter, hints, accuracy and the screens,
// and wires the buttons, the screenshot states (?shot=) and the self-test.

import { LEVELS } from './scenes.js';
import { SoundFX } from './audio.js';
import { Renderer } from './render.js';
import { Input } from './input.js';

const PENALTY_SECONDS = 5;
const HINTS_PER_LEVEL = 3;

export class Game {
  constructor() {
    this.screen = 'menu';
    this.levelIndex = 0;
    this.level = LEVELS[0];
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.correctClicks = 0;
    this.wrongClicks = 0;
    this.elapsed = 0;
    this.penalty = 0;
    this.startedAt = 0;
    this.levelTimes = [null, null, null];
    this.levelAccuracy = [null, null, null];
    this.sound = new SoundFX();
    this.renderer = new Renderer();
    this.input = new Input(this);
    this.timerId = null;
    this.wireButtons();
    this.showMenu();
    this.loop();
  }

  get totalClicks() {
    return this.correctClicks + this.wrongClicks;
  }

  get accuracy() {
    return this.totalClicks === 0 ? 100 : Math.round((this.correctClicks / this.totalClicks) * 100);
  }

  wireButtons() {
    document.getElementById('hintBtn').addEventListener('click', () => this.useHint());
    document.getElementById('restartBtn').addEventListener('click', () => this.startLevel(this.levelIndex));
    document.getElementById('menuBtn').addEventListener('click', () => this.showMenu());
    document.getElementById('soundBtn').addEventListener('click', () => this.toggleSound());
    document.querySelectorAll('.level-card').forEach((card) => {
      card.addEventListener('click', () => this.startLevel(Number(card.dataset.level)));
    });
    document.getElementById('nextBtn').addEventListener('click', () => {
      this.startLevel(Math.min(this.levelIndex + 1, LEVELS.length - 1));
    });
    document.getElementById('replayBtn').addEventListener('click', () => this.startLevel(this.levelIndex));
    document.getElementById('levelsBtn2').addEventListener('click', () => this.showMenu());
    document.getElementById('againBtn').addEventListener('click', () => this.startLevel(0));
    document.getElementById('levelsBtn3').addEventListener('click', () => this.showMenu());
  }

  hideOverlays() {
    for (const id of ['menuOverlay', 'levelOverlay', 'resultsOverlay']) {
      document.getElementById(id).classList.add('hidden');
    }
  }

  showMenu() {
    this.screen = 'menu';
    this.stopTimer();
    this.hideOverlays();
    document.getElementById('menuOverlay').classList.remove('hidden');
    document.getElementById('levelName').textContent = 'Pick a level to begin';
    this.setMessage('Three scenes, seven differences each. Choose a level to start the hunt.');
    this.level = LEVELS[0];
    this.found = new Set();
    this.renderer.draw(this);
    this.updateHud();
  }

  startLevel(index) {
    this.levelIndex = index;
    this.level = LEVELS[index];
    this.found = new Set();
    this.hintsLeft = HINTS_PER_LEVEL;
    this.correctClicks = 0;
    this.wrongClicks = 0;
    this.elapsed = 0;
    this.penalty = 0;
    this.screen = 'playing';
    this.hideOverlays();
    document.getElementById('levelName').textContent = `${this.level.name} — ${this.level.tag}`;
    this.setMessage(`Find all 7 differences in ${this.level.name}.`);
    this.startedAt = performance.now();
    this.stopTimer();
    this.timerId = window.setInterval(() => this.tick(), 250);
    this.renderer.draw(this);
    this.updateHud();
  }

  tick() {
    if (this.screen !== 'playing') return;
    this.elapsed = (performance.now() - this.startedAt) / 1000 + this.penalty;
    this.updateHud();
  }

  stopTimer() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  clickAt(x, y) {
    if (this.screen !== 'playing') return;
    const level = this.level;
    for (let i = 0; i < level.diffs.length; i++) {
      if (this.found.has(i)) continue;
      const d = level.diffs[i];
      const dist = Math.hypot(x - d.x, y - d.y);
      if (dist <= d.r + 6) {
        this.found.add(i);
        this.correctClicks++;
        this.sound.found();
        this.setMessage(`Found it! ${d.label}`);
        this.renderer.draw(this);
        this.updateHud();
        if (this.found.size === level.diffs.length) this.finishLevel();
        return;
      }
    }
    // No difference there: a gentle shake, a red mark and +5 seconds.
    this.wrongClicks++;
    this.penalty += PENALTY_SECONDS;
    this.sound.wrong();
    this.renderer.wrongClick(x, y);
    this.setMessage(`Not quite — that costs ${PENALTY_SECONDS} seconds. Look closer.`);
    this.renderer.draw(this);
    this.updateHud();
  }

  useHint() {
    if (this.screen !== 'playing') return;
    if (this.hintsLeft <= 0) {
      this.setMessage('No hints left on this level — trust your eyes!');
      return;
    }
    const remaining = this.level.diffs.map((d, i) => i).filter((i) => !this.found.has(i));
    if (remaining.length === 0) return;
    const pick = remaining[Math.floor(Math.random() * remaining.length)];
    this.hintsLeft--;
    this.sound.hint();
    this.renderer.showHint(pick);
    this.setMessage('A hint is circling one difference you have not found yet.');
    this.updateHud();
  }

  finishLevel() {
    this.stopTimer();
    this.elapsed = (performance.now() - this.startedAt) / 1000 + this.penalty;
    this.levelTimes[this.levelIndex] = this.elapsed;
    this.levelAccuracy[this.levelIndex] = this.accuracy;
    this.sound.win();
    const stars = this.starsFor(this.accuracy, this.elapsed);
    if (this.levelIndex === LEVELS.length - 1) {
      this.screen = 'results';
      const total = this.levelTimes.reduce((a, b) => a + (b || 0), 0);
      const acc = Math.round(
        this.levelAccuracy.reduce((a, b) => a + (b || 0), 0) / LEVELS.length,
      );
      document.getElementById('resultsText').textContent =
        `You cleared all three scenes in ${formatTime(total)} with ${acc}% accuracy. ` +
        `Harbour ${formatTime(this.levelTimes[0])} · Bookshop ${formatTime(this.levelTimes[1])} · Market ${formatTime(this.levelTimes[2])}.`;
      this.hideOverlays();
      document.getElementById('resultsOverlay').classList.remove('hidden');
    } else {
      this.screen = 'levelComplete';
      document.getElementById('levelDoneTitle').textContent = `${this.level.name} complete!`;
      document.getElementById('levelDoneStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      document.getElementById('levelDoneText').textContent =
        `All 7 differences found in ${formatTime(this.elapsed)} with ${this.accuracy}% accuracy ` +
        `(${this.correctClicks} right, ${this.wrongClicks} wrong).`;
      document.getElementById('nextBtn').textContent =
        `Next level: ${LEVELS[this.levelIndex + 1].name}`;
      this.hideOverlays();
      document.getElementById('levelOverlay').classList.remove('hidden');
    }
    this.updateHud();
  }

  starsFor(accuracy, seconds) {
    if (accuracy >= 90 && seconds <= 150) return 3;
    if (accuracy >= 75 && seconds <= 300) return 2;
    return 1;
  }

  toggleSound() {
    const on = this.sound.toggle();
    document.getElementById('soundBtn').textContent = `Sound: ${on ? 'on' : 'off'}`;
  }

  setMessage(text) {
    document.getElementById('message').textContent = text;
  }

  updateHud() {
    document.getElementById('counter').textContent = `${this.found.size} of ${this.level.diffs.length}`;
    document.getElementById('timer').textContent = formatTime(this.elapsed);
    document.getElementById('accuracy').textContent = `${this.accuracy}%`;
    document.getElementById('hintsLeft').textContent = String(this.hintsLeft);
    document.getElementById('hintBtn').disabled = this.screen !== 'playing' || this.hintsLeft <= 0;
    document.getElementById('restartBtn').disabled = this.screen !== 'playing';
  }

  loop() {
    const step = () => {
      if (this.screen === 'playing') this.renderer.draw(this);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // Deterministic states for the entry's screenshots: ?shot=start|play|level2|complete
  applyShot(shot) {
    if (shot === 'start') {
      this.showMenu();
    } else if (shot === 'play') {
      this.startLevel(0);
      this.found = new Set([0, 4]);
      this.correctClicks = 2;
      this.elapsed = 47;
      this.setMessage('Found it! The lighthouse beam went out.');
      this.renderer.draw(this);
      this.updateHud();
    } else if (shot === 'level2') {
      this.startLevel(1);
      this.found = new Set([1, 2, 5]);
      this.correctClicks = 3;
      this.wrongClicks = 1;
      this.elapsed = 83;
      this.setMessage('Found it! The poster vanished from the wall.');
      this.renderer.draw(this);
      this.updateHud();
    } else if (shot === 'complete') {
      this.startLevel(0);
      this.found = new Set([0, 1, 2, 3, 4, 5, 6]);
      this.correctClicks = 7;
      this.elapsed = 118;
      this.updateHud();
      this.finishLevel();
      // Keep the staged time on screen instead of the real split second.
      this.elapsed = 118;
      document.getElementById('levelDoneText').textContent =
        'All 7 differences found in 1:58 with 100% accuracy (7 right, 0 wrong).';
      this.updateHud();
    }
  }
}

export function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const game = new Game();
window.__game = game;

const params = new URLSearchParams(window.location.search);
if (params.get('shot')) game.applyShot(params.get('shot'));

// Headless self-test: ?selftest=1 clicks one real difference, one empty
// spot, uses a hint, and reports the result in the document title.
if (params.get('selftest') === '1') {
  game.startLevel(0);
  const d0 = game.level.diffs[0];
  game.clickAt(d0.x, d0.y);
  game.clickAt(20, 540);
  game.useHint();
  document.title = `SELFTEST found=${game.found.size} correct=${game.correctClicks} wrong=${game.wrongClicks} hints=${game.hintsLeft} counter=${document.getElementById('counter').textContent}`;
}
