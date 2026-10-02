import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const originals=path.join(process.cwd(),'assets/originals'),out=path.join(process.cwd(),'public/assets');
for(const name of ['rossi-pose-rainbow','rossi-pose-lantern','rossi-pose-letter']){
 await sharp(path.join(originals,name+'.png')).resize(680,680,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).extend({top:20,bottom:20,left:20,right:20,background:{r:0,g:0,b:0,alpha:0}}).webp({quality:86,alphaQuality:90}).toFile(path.join(out,name+'.webp'));
}
for(const name of ['rossi-cg-rainbow','rossi-cg-lantern','rossi-cg-letter']){
 await sharp(path.join(originals,name+'.png')).resize({width:1280,withoutEnlargement:true}).webp({quality:83}).toFile(path.join(out,name+'.webp'));
 await sharp(path.join(originals,name+'.png')).resize({width:360,withoutEnlargement:true}).webp({quality:78}).toFile(path.join(out,name+'-thumb.webp'));
}
