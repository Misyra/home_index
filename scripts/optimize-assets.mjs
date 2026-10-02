import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const root=process.cwd(),from=path.join(root,'assets/originals'),to=path.join(root,'public/assets');
await fs.mkdir(to,{recursive:true});
for(const name of ['rain-girl','rain-girl-happy']){await sharp(path.join(from,name+'.png')).resize({width:720,withoutEnlargement:true}).webp({quality:86,alphaQuality:90}).toFile(path.join(to,name+'.webp'));}
await sharp(path.join(from,'rain-girl.png')).resize({width:112}).webp({quality:80}).toFile(path.join(to,'rain-girl-avatar.webp'));
for(const name of ['rain-cg','rain-cg-splash','rain-cg-umbrella','rain-cg-boats']){await sharp(path.join(from,name+'.png')).resize({width:1280,withoutEnlargement:true}).webp({quality:83}).toFile(path.join(to,name+'.webp'));await sharp(path.join(from,name+'.png')).resize({width:360,withoutEnlargement:true}).webp({quality:78}).toFile(path.join(to,name+'-thumb.webp'));}
await sharp(path.join(from,'rossi-particle-portrait.png')).resize({width:720,withoutEnlargement:true}).webp({quality:85,alphaQuality:90}).toFile(path.join(to,'rossi-particle-portrait.webp'));
for(const size of [16,32,64,180,192,512])await sharp(path.join(from,'site-icon.png')).resize(size,size).png().toFile(path.join(to,`favicon-${size}.png`));
await fs.copyFile(path.join(to,'favicon-180.png'),path.join(to,'apple-touch-icon.png'));
console.log('Optimized image assets');
