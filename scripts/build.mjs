import fs from 'node:fs/promises';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {transform} from 'esbuild';
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs','build'],{stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
for(const entry of await fs.readdir('dist/scripts'))if(entry.endsWith('.js')){const file=path.join('dist/scripts',entry),source=await fs.readFile(file,'utf8');const out=await transform(source,{loader:'js',minify:true,target:'es2020',legalComments:'none'});await fs.writeFile(file,out.code);}
for(const name of ['style.css','particles.css','typography.css','cursors.css']){const file=path.join('dist',name),source=await fs.readFile(file,'utf8');const out=await transform(source,{loader:'css',minify:true,legalComments:'none'});await fs.writeFile(file,out.code);}
console.log('Production scripts and styles minified');
