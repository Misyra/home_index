// Regression: 打开面板读取歌单后，快速切歌（播放存在悬置的 play()）必须启动新曲目、
// 忽略旧 promise；歌单回退、列表渲染与封面回退链（avif→png）同样保持。
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Node extends EventTarget {
  constructor(){
    super();this.attrs=new Map();this.dataset={};this.style={setProperty(){}};this.children=[];this.className='';this.textContent='';this.paused=true;this.ended=false;
    const set=new Set();
    this.classList={add:c=>set.add(c),remove:c=>set.delete(c),toggle:(c,force)=>{const on=force===undefined?!set.has(c):!!force;on?set.add(c):set.delete(c);return on;},contains:c=>set.has(c)};
  }
  setAttribute(k,v){this.attrs.set(k,String(v));}getAttribute(k){return this.attrs.get(k)??null;}hasAttribute(k){return this.attrs.has(k);}removeAttribute(k){this.attrs.delete(k);}
  get src(){return this.getAttribute('src')||'';}set src(v){this.setAttribute('src',v);}
  contains(){return false;}focus(){}load(){}pause(){this.paused=true;}
  append(...nodes){this.children.push(...nodes);}
  replaceChildren(){this.children=[];}
  scrollIntoView(){}
  querySelectorAll(selector){
    const out=[];const want=selector.startsWith('.')?selector.slice(1):null;
    const walk=n=>{for(const child of n.children){if(want&&String(child.className).split(/\s+/).includes(want))out.push(child);walk(child);}};
    walk(this);return out;
  }
}
const nodes=new Map();const query=s=>nodes.get(s)??null;
for(const id of ['music-panel','music-audio','music-launcher','music-launcher-cover','music-title','music-artist','music-cover','music-play','music-prev','music-next','music-progress','music-volume','music-status','music-current','music-duration','music-close','music-volume-value','music-list','music-list-title','music-list-count'])nodes.set('#'+id,new Node());
const audio=query('#music-audio'),play=query('#music-play'),next=query('#music-next'),requests=[];
query('#music-panel').dataset.config=JSON.stringify({volume:.55,apis:[],local:[{name:'First',artist:'One',url:'first.mp3',pic:'first.webp'},{name:'Second',artist:'Two',url:'second.mp3',pic:'second.webp'}]});
audio.play=()=>new Promise((resolve,reject)=>requests.push({resolve:()=>{audio.paused=false;resolve();},reject}));
const document=new Node();document.querySelector=query;document.querySelectorAll=()=>[query('#music-launcher')];document.body=new Node();document.createElement=()=>new Node();
vm.runInNewContext(readFileSync('public/scripts/music.js','utf8'),{document,localStorage:{getItem:()=>null,setItem(){}},Rainy:{reducedMotion:{matches:true},effectsOn:true},performance,Event,AbortController,setTimeout,clearTimeout,addEventListener(){}});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
play.dispatchEvent(new Event('click'));
await tick();
assert.equal(requests.length,1,'First play starts after playlist fallback');
assert.equal(play.disabled,true);
assert.equal(query('#music-list-title').textContent,'小屋单曲');
assert.equal(query('#music-list-count').textContent,'2 首');
assert.equal(query('#music-list').querySelectorAll('.music-item').length,2,'List renders both tracks');
next.dispatchEvent(new Event('click'));
assert.equal(requests.length,2,'Next must start a fresh request while the first is pending');
assert.equal(audio.src,'second.mp3');assert.equal(query('#music-title').textContent,'Second');
requests[0].reject(Object.assign(new Error('Old playback cancelled'),{name:'AbortError'}));
await tick();
assert.equal(play.disabled,true,'Old request must not unlock the current request');
requests[1].resolve();await tick();
assert.equal(play.disabled,false);assert.equal(play.getAttribute('aria-label'),'暂停音乐');
assert.match(query('#music-status').textContent,/正在播放/);
const items=query('#music-list').querySelectorAll('.music-item');
assert.equal(items[1].getAttribute('aria-current'),'true','Current track is highlighted in the list');
query('#music-cover').src='https://unavailable.example/cover.webp';query('#music-cover').dispatchEvent(new Event('error'));
assert.equal(query('#music-cover').src,'assets/music-cover.avif');
query('#music-cover').dispatchEvent(new Event('error'));
assert.equal(query('#music-cover').src,'assets/music-cover.png');
console.log('PASS: playlist fallback, list render, rapid track change, stale promise isolation, cover fallback');
