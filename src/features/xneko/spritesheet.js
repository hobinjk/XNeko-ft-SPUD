import { createCanvas, loadImage } from 'canvas';
import { createWriteStream, readdirSync } from 'node:fs';
import { join } from 'path';

const dir = '/home/hobinjk/Downloads/neko/2023-icon-library/'
const dirs = readdirSync(dir, { withFileTypes: true });

// match xkit (oneko?) format
const frames = [
  `wash`,
  `alert`,
  `sleep1`, `sleep2`,
  `itch1`, `itch2`,
  `still`,
  `yawn`,

  `wscratch1`, `wscratch2`,
  `sscratch1`, `sscratch2`,
  `escratch1`, `escratch2`,
  `nscratch1`, `nscratch2`,

  `nwrun1`, `nwrun2`,
  `wrun1`, `wrun2`,
  `swrun1`, `swrun2`,
  `srun1`, `srun2`,
  `serun1`, `serun2`,
  `erun1`, `erun2`,
  `nerun1`, `nerun2`,
  `nrun1`, `nrun2`,
];

async function createSheet(dir) {
  const w = 32;
  const h = 32;

  const canvas = createCanvas(w * 2, h * 16);
  const gfx = canvas.getContext('2d');
  let sheet = {};
  console.log(frames.length);
  for (let i = 0; i < frames.length; i++) {
    let x = (i % 2) * w;
    let y = Math.floor(i / 2) * h;
    let image = await loadImage(join(dir, frames[i] + '.png'));
    gfx.drawImage(image, x, y, w, h);
    sheet[frames[i]] = { x, y };
  }
  console.log(sheet);
  await writePNG(dir, canvas);
}

function writePNG(dir, canvas) {
  return new Promise(resolve => {
    const out = createWriteStream(join('spritesheets', dir.split('/').at(-1) + '.png'));
    canvas.createPNGStream().pipe(out);
    out.on('finish', resolve);
  });
}

for (let cat of dirs) {
  if (!cat.isDirectory()) {
    continue;
  }
  await createSheet(join(dir, cat.name));
}
