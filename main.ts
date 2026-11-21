// main.ts — the entry program for "Make the best spot the difference game"
// (Node 22, standard library only, no network). It hands the game in: the
// static game/ files and the screenshots/ renders are copied into the
// output directory, and a dossier.json is written there with buildDossier
// from the kit's vendored library, so the judge can read the game from the
// screenshots and a short outline of its source.
//
// Run it outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const MAX_SCREENSHOT_BYTES = 262144;

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const gameDir = join(here, 'game');
const shotsDir = join(here, 'screenshots');

if (!existsSync(join(gameDir, 'index.html'))) {
  throw new Error('game/index.html is missing; the entry is not complete');
}

mkdirSync(out, { recursive: true });
cpSync(gameDir, join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(out, 'screenshots'), { recursive: true });
}

const shotNames = existsSync(shotsDir) ? readdirSync(shotsDir).sort() : [];
if (shotNames.length < 3) {
  throw new Error(`need at least 3 screenshots, found ${shotNames.length}`);
}
// The gate refuses any screenshot over 256 KiB, so catch an oversized one
// here with a clear message instead of a late refusal.
for (const name of shotNames) {
  const bytes = statSync(join(shotsDir, name)).size;
  if (bytes > MAX_SCREENSHOT_BYTES) {
    throw new Error(`screenshot ${name} is ${bytes} bytes, over the 256 KiB cap`);
  }
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);

console.log(`handed in ${shotNames.length} screenshots: ${shotNames.join(', ')}`);
