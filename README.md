# Spot the Difference — Harbour Lights

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/KimLyNamHa/best-spot-the-difference-game-20261121-0451-entry/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/KimLyNamHa/best-spot-the-difference-game-20261121-0451-entry/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Built for the [make.fun](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) bounty
"Make the best spot the difference game".

An original spot-the-difference game that plays offline in a desktop
browser from static files — no network requests, no libraries, mouse and
keyboard. Three hand-drawn scenes (a harbour at sunset, an old bookshop,
a night market), each with 7 differences to find. Both pictures are
drawn as original vector art in code, so every difference is exact.

## How it plays

- Two near-identical pictures side by side. Click a difference on either
  picture to circle it in green.
- A wrong click shakes the board, marks a red X and adds 5 seconds.
- Hints (3 per level) circle one difference you have not found yet.
- The timer counts up; finishing a level shows your time and accuracy,
  and clearing all three levels shows your totals.

Keyboard: H hint · R restart · M sound · Esc levels · 1 / 2 / 3 pick a level.
Sounds are small WebAudio tones made on the spot — no audio files.

## Layout

- `main.ts` (Node 22) — the hand-in program: copies `game/` and
  `screenshots/` to the output directory and writes `dossier.json`.
- `game/index.html`, `game/style.css` — the page and its styling.
- `game/src/main.js` — state machine, timer, HUD, screens, screenshots.
- `game/src/scenes.js` — the three scenes and their 7 differences each.
- `game/src/render.js` — paints the panels, rings, hints and flashes.
- `game/src/input.js` — pointer and keyboard handling.
- `game/src/audio.js` — WebAudio sound effects.
- `vendor/makefun-game.ts` — the kit's dossier library, unchanged.
- `screenshots/` — 4 real renders of the game running in headless Chrome.

## Run it

Serve `game/` with any static server and open `index.html` in desktop
Chrome. To reproduce the hand-in: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.
