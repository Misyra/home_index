// Regression: clicking Next while audio.play() is pending must start the new
// song and ignore the previous promise, rather than leaving Play disabled.
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
class Node extends EventTarget {
  constructor(){super();this.attrs=new Map();this.dataset={};this.style={setProperty(){}};this.classList={add(){},remove(){},toggle(){}};this.paused=true;this.ended=false;}
  setAttribute(k,v){this.attrs.set(k,String(v));}getAttribute(k){return this.attrs.get(k)??null;}hasAttribute(k){return this.attrs.has(k);}removeAttribute(k){this.attrs.delete(k);}
  get src(){return this.getAttribute('src')||'';}set src(v){this.setAttribute('src',v);}contains(){return false;}focus(){}load(){}pause(){this.paused=true;}
}
const nodes=new Map();const query=s=>nodes.get(s)??null;
for(const id of ['music-panel','music-audio','music-launcher','music-launcher-cover','music-title','music-artist','music-cover','music-play','music-prev','music-next','music-source','music-progress','music-volume','music-status','music-current','music-duration','music-close','music-volume-value'])nodes.set('#'+id,new Node());
const audio=query('#music-audio'),play=query('#music-play'),next=query('#music-next'),requests=[];
query('#music-panel').dataset.config=JSON.stringify({volume:.55,apis:[],local:[{name:'First',artist:'One',url:'first.mp3',pic:'first.webp'},{name:'Second',artist:'Two',url:'second.mp3',pic:'second.webp'}]});
audio.play=()=>new Promise((resolve,reject)=>requests.push({resolve:()=>{audio.paused=false;resolve();},reject}));
const document=new Node();document.querySelector=query;document.querySelectorAll=()=>[query('#music-launcher')];document.body=new Node();
vm.runInNewContext(readFileSync('public/scripts/music.js','utf8'),{document,localStorage:{getItem:()=>null,setItem(){}},Rainy:{reducedMotion:{matches:true},effectsOn:true},performance,Event,AbortController,setTimeout,clearTimeout,addEventListener(){}});
play.dispatchEvent(new Event('click'));
assert.equal(requests.length,1);assert.equal(play.disabled,true);
next.dispatchEvent(new Event('click'));
assert.equal(requests.length,2,'Next must start a fresh request while the first is pending');
assert.equal(audio.src,'second.mp3');assert.equal(query('#music-title').textContent,'Second');
requests[0].reject(Object.assign(new Error('Old playback cancelled'),{name:'AbortError'}));
await new Promise(resolve=>setImmediate(resolve));
assert.equal(play.disabled,true,'Old request must not unlock the current request');
requests[1].resolve();await new Promise(resolve=>setImmediate(resolve));
assert.equal(play.disabled,false);assert.equal(play.getAttribute('aria-label'),'暂停音乐');
assert.match(query('#music-status').textContent,/正在播放/);
query('#music-cover').src='https://unavailable.example/cover.webp';query('#music-cover').dispatchEvent(new Event('error'));
assert.equal(query('#music-cover').src,'assets/music-cover.avif');
query('#music-cover').dispatchEvent(new Event('error'));
assert.equal(query('#music-cover').src,'assets/music-cover.png');
console.log('PASS: rapid track change, stale promise isolation, and cover fallback');
