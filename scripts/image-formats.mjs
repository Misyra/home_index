// 图片交付约定：每个素材同时输出 AVIF（页面优先）与 PNG（回退）。
// 画质沿用发布口径：大图 66 / 立绘 65 / 缩略图 62 / 小图标 70。
import sharp from 'sharp';

export const PNG_OPTIONS = { compressionLevel: 9, effort: 10 };

export async function emitPair({ to, name, make, avifQuality, avifEffort = 5 }) {
  await make().avif({ quality: avifQuality, effort: avifEffort }).toFile(`${to}/${name}.avif`);
  await make().png(PNG_OPTIONS).toFile(`${to}/${name}.png`);
}

export async function emitAvif({ input, output, quality = 65, effort = 5 }) {
  await sharp(input).avif({ quality, effort }).toFile(output);
}
