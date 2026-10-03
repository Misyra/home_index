import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',png:'image/png',avif:'image/avif',svg:'image/svg+xml',gif:'image/gif',ico:'image/x-icon',cur:'image/x-icon',mp3:'audio/mpeg'};
http.createServer(async(req,res)=>{
 try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname),name=pathname==='/'?'index.html':pathname==='/particles'?'particles.html':pathname.slice(1),file=path.resolve(root,name);if(!file.startsWith(path.resolve(root)+path.sep))throw Error('Path');const info=await stat(file);if(!info.isFile())throw Error('File');const etag=`"${info.size}-${Math.round(info.mtimeMs)}"`;if(req.headers['if-none-match']===etag){res.writeHead(304);res.end();return;}const data=await readFile(file),headers={'Content-Type':types[path.extname(file).slice(1)]||'application/octet-stream','Cache-Control':'no-cache','ETag':etag,'Accept-Ranges':'bytes'};const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;if(start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));return;}res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404);res.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
