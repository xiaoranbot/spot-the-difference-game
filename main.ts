// Whale Cottage — spot the difference game, hand-in program.
//
// Node 22, standard library only. It copies this repository's game/ and
// screenshots/ into the output directory (MAKEFUN_OUTPUT_DIR outside the
// grader, /output inside it) and writes /output/dossier.json with the
// vendored make.fun library, so the scorer can rebuild the same dossier
// byte for byte from the same files.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's own caps, from the bounty's gate: text_max_bytes is the only
// one that shapes the dossier's bytes; the rest refuse an entry the scorer
// would refuse (more than 4 screenshots, one over 256 KiB, more than 993
// files in game/, 48 MiB of game files, or a game path over 1000 bytes).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
