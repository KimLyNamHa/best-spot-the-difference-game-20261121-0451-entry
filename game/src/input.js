// input.js — pointer and keyboard handling. A click on either picture is
// translated into scene coordinates and tested against the level's circular
// difference zones; the buttons and keys call back into the game.

export class Input {
  constructor(game) {
    this.game = game;
    this.left = document.getElementById('leftCanvas');
    this.right = document.getElementById('rightCanvas');
    this.left.addEventListener('pointerdown', (e) => this.onBoardClick(e, this.left));
    this.right.addEventListener('pointerdown', (e) => this.onBoardClick(e, this.right));
    document.addEventListener('keydown', (e) => this.onKey(e));
  }

  scenePoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
  }

  onBoardClick(event, canvas) {
    if (this.game.screen !== 'playing') return;
    const p = this.scenePoint(canvas, event);
    this.game.clickAt(p.x, p.y);
  }

  onKey(event) {
    const key = event.key.toLowerCase();
    if (this.game.screen === 'menu') {
      if (key === '1' || key === '2' || key === '3') {
        this.game.startLevel(Number(key) - 1);
      } else if (key === 'enter') {
        this.game.startLevel(0);
      }
      return;
    }
    if (this.game.screen === 'playing') {
      if (key === 'h') this.game.useHint();
      else if (key === 'r') this.game.startLevel(this.game.levelIndex);
      else if (key === 'm') this.game.toggleSound();
      else if (key === 'escape') this.game.showMenu();
    } else if (key === 'escape') {
      this.game.showMenu();
    }
  }
}
