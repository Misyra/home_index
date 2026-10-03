import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { emitPair } from './image-formats.mjs';
const root = process.cwd(), from = path.join(root, 'assets/originals'), to = path.join(root, 'public/assets');
await fs.mkdir(to, { recursive: true });

// 人物立绘：AVIF + PNG
for (const name of ['rain-girl', 'rain-girl-happy']) {
  await emitPair({ to, name, make: () => sharp(path.join(from, name + '.png')).resize({ width: 720, withoutEnlargement: true }), avifQuality: 65 });
}
await emitPair({ to, name: 'rain-girl-avatar', make: () => sharp(path.join(from, 'rain-girl.png')).resize({ width: 112 }), avifQuality: 70, avifEffort: 4 });

// 雨天 CG：1280 大图 + 360 缩略图
for (const name of ['rain-cg', 'rain-cg-splash', 'rain-cg-umbrella', 'rain-cg-boats']) {
  await emitPair({ to, name, make: () => sharp(path.join(from, name + '.png')).resize({ width: 1280, withoutEnlargement: true }), avifQuality: 66 });
  await emitPair({ to, name: name + '-thumb', make: () => sharp(path.join(from, name + '.png')).resize({ width: 360, withoutEnlargement: true }), avifQuality: 62, avifEffort: 4 });
}

// 粒子像
await emitPair({ to, name: 'rossi-particle-portrait', make: () => sharp(path.join(from, 'rossi-particle-portrait.png')).resize({ width: 720, withoutEnlargement: true }), avifQuality: 65 });

// 角落洛茜帧图与静态帧（PNG 源由 scripts/export-pet.py 与既有素材导出，存在时生成 AVIF）
for (const name of ['rossi-pet-sheet', 'rossi-pet-still']) {
  const file = path.join(to, name + '.png');
  if (await fs.access(file).then(() => true, () => false)) {
    await sharp(file).avif({ quality: 65, effort: 5 }).toFile(path.join(to, name + '.avif'));
  }
}

// 音乐封面（源：assets/originals/music-cover.webp → 320 双格式）
const cover = path.join(from, 'music-cover.webp');
if (await fs.access(cover).then(() => true, () => false)) {
  await emitPair({ to, name: 'music-cover', make: () => sharp(cover).resize({ width: 320, withoutEnlargement: true }), avifQuality: 65 });
}
// 花瓣导航图标
const huaban = path.join(root, 'public/icons/huaban.png');
if (await fs.access(huaban).then(() => true, () => false)) {
  await sharp(huaban).avif({ quality: 70, effort: 4 }).toFile(path.join(root, 'public/icons/huaban.avif'));
}

// favicon 保持 PNG/ICO（浏览器平台兼容，不做 AVIF）
for (const size of [16, 32, 64, 180, 192, 512]) await sharp(path.join(from, 'rossi-site-icon.png')).resize(size, size).png().toFile(path.join(to, `rossi-icon-${size}.png`));
await fs.copyFile(path.join(to, 'rossi-icon-180.png'), path.join(to, 'rossi-apple-touch-icon.png'));
console.log('Optimized image assets: AVIF + PNG pairs written');
