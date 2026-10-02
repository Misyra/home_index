import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=new URL('./dist/',import.meta.url);
const types={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'application/javascript; charset=utf-8',png:'image/png',svg:'image/svg+xml'};
http.createServer(async(request,response)=>{
  try{
    const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
    const name=pathname==='/'?'index.html':pathname.slice(1);
    if(!['index.html','style.css','app.js','rain-cat.png','rain-girl.png','rain-girl-happy.png','rain-cg.png','icons/github.svg','icons/bilibili.svg','icons/douban.svg','icons/neteasecloudmusic.svg','icons/notion.svg','icons/huaban.png'].includes(name)){response.writeHead(404);response.end('Not found');return;}
    const data=await readFile(new URL(name,root));
    response.writeHead(200,{'Content-Type':types[name.split('.').pop()],'Cache-Control':'no-store'});response.end(data);
  }catch{response.writeHead(404);response.end('Not found');}
}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
