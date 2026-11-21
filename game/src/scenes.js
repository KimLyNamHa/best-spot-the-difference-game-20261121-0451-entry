// scenes.js — every picture in the game is drawn here, in code, as original
// vector art. Each level's draw(ctx, size, variant) paints the scene twice:
// variant 0 is the "Original" panel, variant 1 the "Changed" panel. The two
// differ only in the seven places listed in the level's diffs array.

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function poly(ctx, points) {
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

function line(ctx, x1, y1, x2, y2, width, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function gull(ctx, x, y, size, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.quadraticCurveTo(x - size * 0.4, y - size * 0.7, x, y);
  ctx.quadraticCurveTo(x + size * 0.4, y - size * 0.7, x + size, y);
  ctx.stroke();
}

function sittingCat(ctx, x, y, scale, colour) {
  ctx.fillStyle = colour;
  ellipse(ctx, x, y - 6 * scale, 13 * scale, 16 * scale); // body
  circle(ctx, x + 2 * scale, y - 26 * scale, 9 * scale); // head
  poly(ctx, [[x - 4 * scale, y - 32 * scale], [x - 7 * scale, y - 42 * scale], [x + 1 * scale, y - 34 * scale]]);
  poly(ctx, [[x + 6 * scale, y - 33 * scale], [x + 10 * scale, y - 42 * scale], [x + 11 * scale, y - 32 * scale]]);
  ctx.strokeStyle = colour;
  ctx.lineWidth = 4 * scale;
  ctx.beginPath();
  ctx.arc(x + 12 * scale, y - 2 * scale, 9 * scale, -0.4, 1.6);
  ctx.stroke();
}

// ---------------------------------------------------------------- Level 1
function drawHarbour(ctx, S, v) {
  // Sunset sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 310);
  sky.addColorStop(0, '#ff9d5c');
  sky.addColorStop(0.55, '#ff7e6b');
  sky.addColorStop(1, '#c86a9e');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, S, 310);

  // Sun with a soft glow.
  const glow = ctx.createRadialGradient(430, 165, 8, 430, 165, 120);
  glow.addColorStop(0, 'rgba(255, 236, 170, 0.9)');
  glow.addColorStop(1, 'rgba(255, 236, 170, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(300, 40, 260, 250);
  ctx.fillStyle = '#ffedb0';
  circle(ctx, 430, 165, 40);

  // Clouds.
  ctx.fillStyle = 'rgba(255, 214, 196, 0.85)';
  ellipse(ctx, 150, 70, 62, 14);
  ellipse(ctx, 190, 62, 46, 12);
  ellipse(ctx, 340, 105, 52, 11);
  ellipse(ctx, 90, 150, 40, 10);

  // Gulls — one vanishes in the changed picture.
  gull(ctx, 250, 95, 12, '#5c3a4a');
  gull(ctx, 300, 130, 10, '#5c3a4a');
  if (v === 0) gull(ctx, 150, 92, 11, '#5c3a4a');

  // Sea.
  const sea = ctx.createLinearGradient(0, 310, 0, S);
  sea.addColorStop(0, '#5d8fb5');
  sea.addColorStop(1, '#22486b');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 310, S, S - 310);
  // Sun's shimmer on the water.
  ctx.fillStyle = 'rgba(255, 214, 150, 0.35)';
  for (let i = 0; i < 7; i++) {
    const w = 60 - i * 6;
    rr(ctx, 430 - w / 2 + (i % 2 ? 8 : -8), 320 + i * 32, w, 5, 2);
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  rr(ctx, 80, 345, 90, 4, 2);
  rr(ctx, 200, 380, 70, 4, 2);
  rr(ctx, 480, 360, 60, 4, 2);

  // Distant headland.
  ctx.fillStyle = '#4a3a63';
  poly(ctx, [[470, 310], [560, 310], [560, 285], [520, 272], [495, 292]]);

  // Lighthouse on the left.
  ctx.fillStyle = '#f4ede0';
  poly(ctx, [[72, 440], [82, 180], [118, 180], [128, 440]]);
  ctx.fillStyle = '#d64545';
  poly(ctx, [[76, 360], [124, 360], [126, 330], [74, 330]]);
  poly(ctx, [[79, 250], [121, 250], [123, 222], [77, 222]]);
  ctx.fillStyle = '#333a4a';
  ctx.fillRect(76, 168, 48, 14);
  ctx.fillStyle = '#ffd98a';
  ctx.fillRect(86, 146, 28, 22);
  ctx.fillStyle = '#333a4a';
  poly(ctx, [[82, 146], [118, 146], [100, 128]]);
  // Flag on the lighthouse pole — red in the original, teal in the changed.
  line(ctx, 100, 128, 100, 96, 3, '#333a4a');
  ctx.fillStyle = v === 0 ? '#d64545' : '#2a9d8f';
  poly(ctx, [[100, 96], [132, 104], [100, 114]]);
  // The beam — shining in the original, dark in the changed picture.
  if (v === 0) {
    ctx.fillStyle = 'rgba(255, 232, 150, 0.28)';
    poly(ctx, [[118, 152], [330, 120], [330, 210], [118, 168]]);
    ctx.fillStyle = 'rgba(255, 232, 150, 0.5)';
    circle(ctx, 100, 157, 12);
  }

  // Wooden pier across the lower scene.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(0, 440, S, 34);
  ctx.fillStyle = '#8d6339';
  for (let x = 0; x < S; x += 28) ctx.fillRect(x, 440, 2, 34);
  ctx.fillStyle = '#5d3c1e';
  for (let x = 20; x < S; x += 90) ctx.fillRect(x, 474, 12, 40);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(0, 440, S, 5);

  // Sailboat 1 — its sail is plain in the original, striped in the changed.
  ctx.fillStyle = '#2e3a52';
  poly(ctx, [[255, 400], [345, 400], [330, 420], [270, 420]]);
  line(ctx, 300, 400, 300, 310, 4, '#2e3a52');
  ctx.fillStyle = '#fdf6e3';
  poly(ctx, [[300, 312], [300, 396], [342, 396]]);
  if (v === 1) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(300, 312);
    ctx.lineTo(300, 396);
    ctx.lineTo(342, 396);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#d64545';
    ctx.fillRect(296, 330, 60, 10);
    ctx.fillRect(296, 360, 60, 10);
    ctx.restore();
  }
  // Sailboat 2, smaller, on the right.
  ctx.fillStyle = '#3a2f4d';
  poly(ctx, [[455, 415], [520, 415], [508, 432], [468, 432]]);
  line(ctx, 488, 415, 488, 350, 3, '#3a2f4d');
  ctx.fillStyle = '#fbeecb';
  poly(ctx, [[488, 352], [488, 412], [518, 412]]);

  // Cottage on the right with one window — lit, then dark.
  ctx.fillStyle = '#f2d8a7';
  ctx.fillRect(430, 392, 84, 52);
  ctx.fillStyle = '#a34a3a';
  poly(ctx, [[422, 394], [522, 394], [476, 362]]);
  ctx.fillStyle = v === 0 ? '#ffd166' : '#3a4660';
  ctx.fillRect(446, 408, 20, 20);
  ctx.fillStyle = '#3a4660';
  ctx.fillRect(484, 408, 20, 20);
  line(ctx, 456, 408, 456, 428, 2, '#3a4660');

  // Crates on the pier — one extra appears in the changed picture.
  ctx.fillStyle = '#b98a4e';
  ctx.fillRect(318, 414, 30, 26);
  ctx.fillRect(330, 390, 26, 24);
  ctx.fillStyle = '#8a6334';
  line(ctx, 318, 427, 348, 427, 2, '#8a6334');
  line(ctx, 330, 402, 356, 402, 2, '#8a6334');
  if (v === 1) {
    ctx.fillStyle = '#b98a4e';
    ctx.fillRect(384, 416, 28, 24);
    ctx.fillStyle = '#8a6334';
    line(ctx, 384, 428, 412, 428, 2, '#8a6334');
  }

  // The cat — on the pier in the original, up on a crate in the changed.
  if (v === 0) sittingCat(ctx, 210, 440, 1, '#2b2b33');
  else sittingCat(ctx, 343, 392, 0.9, '#2b2b33');
}

// ---------------------------------------------------------------- Level 2
function drawBookshop(ctx, S, v) {
  // Warm wall and wooden floor.
  const wall = ctx.createLinearGradient(0, 0, 0, S);
  wall.addColorStop(0, '#f3e6c8');
  wall.addColorStop(1, '#e8d3a8');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(0, 480, S, 80);
  ctx.fillStyle = '#7a4e2b';
  for (let x = 0; x < S; x += 70) ctx.fillRect(x, 480, 3, 80);

  // Window with daylight and curtains.
  ctx.fillStyle = '#7fb2d9';
  ctx.fillRect(440, 60, 90, 120);
  ctx.fillStyle = '#fff';
  ctx.fillRect(448, 68, 74, 104);
  ctx.fillStyle = '#a8d0ea';
  ctx.fillRect(448, 68, 74, 104);
  ctx.fillStyle = '#f7e9c9';
  circle(ctx, 500, 100, 18);
  ctx.fillStyle = '#5d8fb5';
  poly(ctx, [[448, 68], [530, 68], [530, 92], [448, 92]]);
  ctx.fillStyle = '#c96f5a';
  poly(ctx, [[436, 52], [458, 52], [452, 190], [432, 190]]);
  poly(ctx, [[516, 52], [538, 52], [542, 190], [522, 190]]);
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(440, 180, 90, 8);

  // Wall clock — 3:00 in the original, 4:30 in the changed picture.
  ctx.fillStyle = '#fdf6e3';
  circle(ctx, 420, 90, 34);
  ctx.strokeStyle = '#333a4a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(420, 90, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#333a4a';
  circle(ctx, 420, 90, 3);
  if (v === 0) {
    line(ctx, 420, 90, 420, 66, 3, '#333a4a');
    line(ctx, 420, 90, 442, 90, 3, '#333a4a');
  } else {
    line(ctx, 420, 90, 432, 110, 3, '#333a4a');
    line(ctx, 420, 90, 420, 112, 3, '#333a4a');
  }

  // Framed poster — there in the original, gone in the changed picture.
  if (v === 0) {
    ctx.fillStyle = '#2e5d8a';
    ctx.fillRect(252, 108, 66, 88);
    ctx.strokeStyle = '#6b4423';
    ctx.lineWidth = 5;
    ctx.strokeRect(252, 108, 66, 88);
    ctx.fillStyle = '#ffd98a';
    ctx.font = 'bold 15px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('READ', 285, 142);
    ctx.fillText('MORE', 285, 162);
    ctx.fillStyle = '#fff';
    ellipse(ctx, 285, 180, 14, 5);
  }

  // Bookshelves with colourful spines.
  const shelfCols = ['#c94f4f', '#4f7ec9', '#4fae6b', '#e0a83c', '#8a5fc9', '#c97b2d'];
  const shelves = [150, 250, 350];
  for (let s = 0; s < 3; s++) {
    const y = shelves[s];
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(40, y + 74, 300, 10);
    let x = 48;
    let i = 0;
    while (x < 320) {
      const w = 16 + ((i * 7 + s * 5) % 12);
      const h = 58 + ((i * 11 + s * 3) % 18);
      // One spine changes from red to blue between the pictures.
      let col = shelfCols[(i + s) % shelfCols.length];
      if (s === 0 && i === 9) col = v === 0 ? '#c94f4f' : '#4f7ec9';
      ctx.fillStyle = col;
      ctx.fillRect(x, y + 74 - h, w, h);
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(x, y + 74 - h, w, 4);
      x += w + 3;
      i++;
    }
  }

  // Potted plant on the top shelf — gone in the changed picture.
  if (v === 0) {
    ctx.fillStyle = '#c96f5a';
    poly(ctx, [[104, 210], [136, 210], [131, 232], [109, 232]]);
    ctx.strokeStyle = '#4fae6b';
    ctx.lineWidth = 3;
    for (const [dx, dy] of [[-10, -26], [0, -32], [10, -26], [-4, -18], [6, -18]]) {
      ctx.beginPath();
      ctx.moveTo(120, 210);
      ctx.quadraticCurveTo(120 + dx, 210 + dy * 0.6, 120 + dx, 210 + dy);
      ctx.stroke();
    }
  }

  // Armchair with a ginger cat — the cat leaves in the changed picture.
  ctx.fillStyle = '#7a4a6b';
  rr(ctx, 140, 400, 110, 70, 12);
  rr(ctx, 140, 360, 110, 48, 12);
  rr(ctx, 132, 396, 18, 40, 8);
  rr(ctx, 240, 396, 18, 40, 8);
  if (v === 0) {
    ctx.fillStyle = '#c97b2d';
    ellipse(ctx, 195, 392, 34, 16);
    circle(ctx, 222, 372, 13);
    poly(ctx, [[214, 362], [211, 348], [219, 359]]);
    poly(ctx, [[228, 360], [231, 347], [234, 359]]);
    ctx.strokeStyle = '#c97b2d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(168, 396, 12, 0.6, 2.6);
    ctx.stroke();
  }

  // Standing lamp — lit in the original, dark in the changed picture.
  line(ctx, 505, 470, 505, 300, 4, '#333a4a');
  ctx.fillStyle = '#333a4a';
  ellipse(ctx, 505, 472, 26, 6);
  ctx.fillStyle = '#e8b45a';
  poly(ctx, [[478, 300], [532, 300], [520, 258], [490, 258]]);
  if (v === 0) {
    ctx.fillStyle = 'rgba(255, 220, 130, 0.35)';
    circle(ctx, 505, 300, 46);
    ctx.fillStyle = '#ffe9a8';
    ellipse(ctx, 505, 305, 20, 8);
  }

  // Counter with a mug — the mug is gone in the changed picture.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(380, 470, 150, 12);
  ctx.fillStyle = '#5d3c1e';
  ctx.fillRect(388, 482, 134, 60);
  if (v === 0) {
    ctx.fillStyle = '#4f7ec9';
    rr(ctx, 420, 442, 26, 28, 4);
    ctx.strokeStyle = '#4f7ec9';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(450, 456, 8, -1.2, 1.2);
    ctx.stroke();
  }
}

// ---------------------------------------------------------------- Level 3
function drawMarket(ctx, S, v) {
  // Night sky.
  const sky = ctx.createLinearGradient(0, 0, 0, 360);
  sky.addColorStop(0, '#1b2a4a');
  sky.addColorStop(1, '#0d1526');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, S, 360);
  // Stars.
  ctx.fillStyle = '#fff';
  const stars = [[40, 40], [120, 30], [200, 55], [280, 25], [360, 48], [470, 35], [520, 70], [60, 110], [180, 120], [330, 110], [440, 130], [500, 160]];
  for (const [x, y] of stars) circle(ctx, x, y, 1.8);
  // The moon — there in the original, gone in the changed picture.
  if (v === 0) {
    ctx.fillStyle = '#f5e9c8';
    circle(ctx, 90, 80, 28);
    ctx.fillStyle = '#e0d0a8';
    circle(ctx, 80, 72, 7);
    circle(ctx, 98, 90, 5);
  }

  // String lights across the top — one bulb is out in the changed picture.
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 30);
  ctx.quadraticCurveTo(280, 95, 560, 30);
  ctx.stroke();
  const bulbs = [40, 110, 180, 250, 320, 390, 460, 520];
  bulbs.forEach((x, i) => {
    const y = 30 + Math.sin((x / 560) * Math.PI) * 52;
    const lit = !(v === 1 && i === 4);
    ctx.fillStyle = lit ? '#ffd166' : '#4a4a55';
    circle(ctx, x, y + 10, 7);
    if (lit) {
      ctx.fillStyle = 'rgba(255, 209, 102, 0.3)';
      circle(ctx, x, y + 10, 14);
    }
  });

  // Cobble ground.
  ctx.fillStyle = '#2c3247';
  ctx.fillRect(0, 380, S, 180);
  ctx.fillStyle = '#38405c';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 8; col++) {
      ellipse(ctx, 40 + col * 70 + (row % 2 ? 35 : 0), 405 + row * 42, 28, 14);
    }
  }

  // Left stall — striped awning in the original, plain teal in the changed.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(70, 300, 14, 90);
  ctx.fillRect(240, 300, 14, 90);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(60, 330, 200, 14);
  ctx.fillStyle = '#d9a05b';
  ctx.fillRect(60, 344, 200, 46);
  if (v === 0) {
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = i % 2 ? '#f2ede3' : '#d64545';
      poly(ctx, [[60 + i * 25, 290], [85 + i * 25, 290], [82 + i * 25, 332], [63 + i * 25, 332]]);
    }
  } else {
    ctx.fillStyle = '#2a9d8f';
    poly(ctx, [[60, 290], [260, 290], [260, 332], [60, 332]]);
  }
  // Goods on the left stall: jars and bread.
  ctx.fillStyle = '#c9a86a';
  for (let i = 0; i < 4; i++) {
    rr(ctx, 76 + i * 34, 306, 24, 24, 6);
    ctx.fillStyle = ['#e0a83c', '#c94f4f', '#4fae6b', '#e0a83c'][i];
    rr(ctx, 78 + i * 34, 300, 20, 8, 3);
    ctx.fillStyle = '#c9a86a';
  }
  // The cat on the stall roof — there, then gone.
  if (v === 0) sittingCat(ctx, 160, 292, 0.85, '#1d1d26');

  // Right stall.
  ctx.fillStyle = '#6b4423';
  ctx.fillRect(330, 300, 14, 90);
  ctx.fillRect(500, 300, 14, 90);
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(320, 330, 200, 14);
  ctx.fillStyle = '#d9a05b';
  ctx.fillRect(320, 344, 200, 46);
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? '#f2ede3' : '#2a6db0';
    poly(ctx, [[320 + i * 25, 290], [345 + i * 25, 290], [342 + i * 25, 332], [323 + i * 25, 332]]);
  }
  // Fruit crate — oranges in the original, lemons in the changed picture.
  ctx.fillStyle = '#8a5a33';
  ctx.fillRect(360, 400, 70, 34);
  const fruitCol = v === 0 ? '#f2821f' : '#f2d13c';
  for (let i = 0; i < 6; i++) {
    ctx.fillStyle = fruitCol;
    circle(ctx, 372 + (i % 3) * 22, 408 + Math.floor(i / 3) * 16, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    circle(ctx, 369 + (i % 3) * 22, 405 + Math.floor(i / 3) * 16, 3);
  }

  // An extra basket of apples appears in the changed picture.
  if (v === 1) {
    ctx.fillStyle = '#8a5a33';
    ellipse(ctx, 250, 462, 30, 12);
    ctx.fillStyle = '#d64545';
    circle(ctx, 238, 452, 9);
    circle(ctx, 252, 448, 9);
    circle(ctx, 264, 454, 9);
    ctx.fillStyle = '#4fae6b';
    ellipse(ctx, 252, 442, 5, 3);
  }

  // Hanging paper lanterns — one changes from red to yellow.
  const lanterns = [[300, 180, '#d64545'], [400, 150, '#e0a83c'], [480, 180, '#d64545']];
  lanterns.forEach(([x, y, col], i) => {
    line(ctx, x, 120, x, y - 18, 2, '#333');
    const c = i === 2 && v === 1 ? '#f2d13c' : col;
    ctx.fillStyle = c;
    ellipse(ctx, x, y, 18, 24);
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ellipse(ctx, x - 6, y - 6, 5, 8);
    ctx.fillStyle = '#6b4423';
    ctx.fillRect(x - 5, y - 28, 10, 6);
    ctx.fillRect(x - 5, y + 22, 10, 6);
  });
  // Warm glow under the lanterns.
  ctx.fillStyle = 'rgba(255, 209, 102, 0.12)';
  ellipse(ctx, 400, 420, 160, 60);
}

export const LEVELS = [
  {
    id: 'harbour',
    name: 'Harbour at Sunset',
    tag: 'Level 1 · Gentle',
    draw: drawHarbour,
    diffs: [
      { x: 150, y: 92, r: 24, label: 'A gull vanished from the sky.' },
      { x: 112, y: 104, r: 22, label: 'The lighthouse flag changed colour.' },
      { x: 398, y: 428, r: 26, label: 'An extra crate appeared on the pier.' },
      { x: 312, y: 352, r: 30, label: 'The sail gained red stripes.' },
      { x: 220, y: 165, r: 30, label: 'The lighthouse beam went out.' },
      { x: 210, y: 425, r: 26, label: 'The cat moved from the pier to a crate.' },
      { x: 456, y: 418, r: 22, label: 'The cottage window went dark.' },
    ],
  },
  {
    id: 'bookshop',
    name: 'The Old Bookshop',
    tag: 'Level 2 · Trickier',
    draw: drawBookshop,
    diffs: [
      { x: 420, y: 90, r: 30, label: "The clock's hands moved." },
      { x: 120, y: 210, r: 26, label: 'The potted plant disappeared.' },
      { x: 205, y: 152, r: 22, label: 'A book spine changed from red to blue.' },
      { x: 195, y: 385, r: 28, label: 'The cat left the armchair.' },
      { x: 505, y: 290, r: 28, label: 'The lamp went out.' },
      { x: 285, y: 152, r: 30, label: 'The poster vanished from the wall.' },
      { x: 433, y: 456, r: 22, label: 'The mug disappeared from the counter.' },
    ],
  },
  {
    id: 'market',
    name: 'Night Market',
    tag: 'Level 3 · Hardest',
    draw: drawMarket,
    diffs: [
      { x: 90, y: 80, r: 26, label: 'The moon disappeared.' },
      { x: 480, y: 180, r: 24, label: 'A lantern changed from red to yellow.' },
      { x: 160, y: 308, r: 30, label: 'The stall awning lost its stripes.' },
      { x: 395, y: 416, r: 26, label: 'The oranges turned into lemons.' },
      { x: 250, y: 455, r: 26, label: 'A basket of apples appeared.' },
      { x: 320, y: 68, r: 20, label: 'A string-light bulb went out.' },
      { x: 160, y: 285, r: 24, label: 'The cat left the stall roof.' },
    ],
  },
];
