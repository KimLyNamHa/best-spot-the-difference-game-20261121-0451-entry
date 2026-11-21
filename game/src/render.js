// render.js — paints the two pictures and everything that marks them:
// the green rings on found differences, the pulsing hint ring, and the red
// flash plus shake of a wrong click.

export class Renderer {
  constructor() {
    this.left = document.getElementById('leftCanvas');
    this.right = document.getElementById('rightCanvas');
    this.lctx = this.left.getContext('2d');
    this.rctx = this.right.getContext('2d');
    this.shakeUntil = 0;
    this.flash = null; // {x, y, until}
    this.hint = null; // {index, until}
  }

  draw(game) {
    const level = game.level;
    const now = performance.now();
    const shaking = now < this.shakeUntil;
    const dx = shaking ? (Math.random() - 0.5) * 8 : 0;
    const dy = shaking ? (Math.random() - 0.5) * 8 : 0;

    this.lctx.save();
    this.lctx.clearRect(0, 0, 560, 560);
    this.lctx.translate(dx, dy);
    level.draw(this.lctx, 560, 0);
    this.rctx.save();
    this.rctx.clearRect(0, 0, 560, 560);
    this.rctx.translate(dx, dy);
    level.draw(this.rctx, 560, 1);

    // Rings on every difference already found, on both pictures.
    for (const index of game.found) {
      const d = level.diffs[index];
      this.ring(this.lctx, d);
      this.ring(this.rctx, d);
    }

    // Pulsing hint ring on one still-unfound difference.
    if (this.hint && now < this.hint.until) {
      const d = level.diffs[this.hint.index];
      const pulse = 1 + 0.18 * Math.sin(now / 130);
      const r = d.r * pulse;
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      this.hint = null;
    }

    // Red X where the last wrong click landed, fading fast.
    if (this.flash && now < this.flash.until) {
      const a = (this.flash.until - now) / 400;
      for (const ctx of [this.lctx, this.rctx]) {
        ctx.strokeStyle = `rgba(214, 69, 69, ${a})`;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        const s = 12;
        ctx.beginPath();
        ctx.moveTo(this.flash.x - s, this.flash.y - s);
        ctx.lineTo(this.flash.x + s, this.flash.y + s);
        ctx.moveTo(this.flash.x + s, this.flash.y - s);
        ctx.lineTo(this.flash.x - s, this.flash.y + s);
        ctx.stroke();
      }
    } else {
      this.flash = null;
    }

    this.lctx.restore();
    this.rctx.restore();
  }

  ring(ctx, d) {
    ctx.strokeStyle = '#37b24d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  wrongClick(x, y) {
    this.flash = { x, y, until: performance.now() + 400 };
    this.shakeUntil = performance.now() + 220;
  }

  showHint(index) {
    this.hint = { index, until: performance.now() + 2500 };
  }
}
