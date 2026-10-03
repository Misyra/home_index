import path from 'node:path';
import sharp from 'sharp';
import { emitPair } from './image-formats.mjs';
const originals = path.join(process.cwd(), 'assets/originals'), out = path.join(process.cwd(), 'public/assets');

for (const name of ['rossi-pose-rainbow', 'rossi-pose-lantern', 'rossi-pose-letter']) {
  await emitPair({
    to: out, name,
    make: () => sharp(path.join(originals, name + '.png')).resize(680, 680, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).extend({ top: 20, bottom: 20, left: 20, right: 20, background: { r: 0, g: 0, b: 0, alpha: 0 } }),
    avifQuality: 65
  });
}
for (const name of ['rossi-cg-rainbow', 'rossi-cg-lantern', 'rossi-cg-letter']) {
  await emitPair({ to: out, name: name, make: () => sharp(path.join(originals, name + '.png')).resize({ width: 1280, withoutEnlargement: true }), avifQuality: 66 });
  await emitPair({ to: out, name: name + '-thumb', make: () => sharp(path.join(originals, name + '.png')).resize({ width: 360, withoutEnlargement: true }), avifQuality: 62, avifEffort: 4 });
}
console.log('Optimized new character assets: AVIF + PNG pairs written');
