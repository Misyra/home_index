// 数字采样预先生成，直接打开 index.html 也能使用，不依赖网络或跨域读图。
(()=>{
  const section=document.querySelector('#particles'),stage=section.querySelector('.particle-stage');
  const canvas=section.querySelector('canvas'),ctx=canvas.getContext('2d'),data=window.ROSSI_PARTICLE_DATA;
  const scatterButton=document.querySelector('#particle-scatter'),gatherButton=document.querySelector('#particle-gather'),status=document.querySelector('#particle-status');
  if(!ctx||!data?.points?.length){canvas.hidden=true;scatterButton.disabled=gatherButton.disabled=true;status.textContent='星雨画像';return;}
  stage.classList.add('canvas-ready');
  const motion=matchMedia('(prefers-reduced-motion: reduce)'),pointer={x:-999,y:-999};
  let dots=[],stars=[],w=0,h=0,raf=0,last=0,visible=false,scatterUntil=0,settleAt=0,pixelRatio=0,resizeFrame=0;
  // The shimmer reuses a sine table rather than 13,744 trigonometric calls/frame.
  const shimmerWaves=Float32Array.from({length:1024},(_,i)=>Math.sin(i*Math.PI*2/1024));
  const enabled=()=>!motion.matches&&!document.body.classList.contains('effects-paused');
  function resize(){
    const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    if(Math.abs(rect.width-w)<.5&&Math.abs(rect.height-h)<.5&&pixelRatio===dpr)return;
    w=rect.width;h=rect.height;pixelRatio=dpr;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    const scale=Math.min(w*.91/data.width,h*.92/data.height),ox=(w-data.width*scale)/2,oy=(h-data.height*scale)/2;
    const step=w<450?2:1;
    dots=[];
    for(let i=0;i<data.points.length;i+=step){const [x,y,r,g,b,a]=data.points[i];const jitterX=Math.sin(i*12.9898)*.65,jitterY=Math.cos(i*7.233)*.65;const hx=ox+(x+jitterX)*scale,hy=oy+(y+jitterY)*scale;
      dots.push({hx,hy,x:hx,y:hy,vx:0,vy:0,color:`rgba(${Math.max(40,r)},${Math.max(35,g)},${Math.max(48,b)},${(.68+a/255*.32).toFixed(2)})`,lightColor:`rgba(${Math.round(r*.65+4)},${Math.round(g*.62+4)},${Math.round(b*.60+4)},${(.78+a/255*.22).toFixed(2)})`,size:Math.max(.8,scale*(step===2?2.2:1.85)),phase:Math.floor(Math.random()*1024)});}
    stars=Array.from({length:w<450?28:50},()=>({x:Math.random()*w,y:Math.random()*h,r:.5+Math.random()*1.2,phase:Math.random()*6.28}));
    scatterUntil=0;section.dataset.particleState='gathered';draw(performance.now(),false);sync();
  }
  function draw(time,animate){
    ctx.clearRect(0,0,w,h);const t=time/1000,dark=document.documentElement.dataset.theme==='dark';
    for(const star of stars){ctx.fillStyle=`rgba(${dark?'191,209,242':'106,135,164'},${animate?.17+(.5+.5*Math.sin(t*.6+star.phase))*.28:.3})`;ctx.beginPath();ctx.arc(star.x,star.y,star.r,0,6.283);ctx.fill();}
    const scattered=time<scatterUntil,pointerActive=pointer.x>=0&&pointer.y>=0,waveOffset=Math.floor(t*1.1*1024/(Math.PI*2))&1023;
    for(const p of dots){
      if(animate){
        const spring=scattered?.0015:.038;
        p.vx+=(p.hx-p.x)*spring;p.vy+=(p.hy-p.y)*spring;
        if(!scattered&&pointerActive){const dx=p.x-pointer.x,dy=p.y-pointer.y,d2=dx*dx+dy*dy;if(d2<7225&&d2>0){const d=Math.sqrt(d2),f=(1-d/85)*1.9;p.vx+=dx/d*f;p.vy+=dy/d*f;}}
        p.vx*=.86;p.vy*=.86;p.x+=p.vx;p.y+=p.vy;
      }else{p.x=p.hx;p.y=p.hy;p.vx=p.vy=0;}
      ctx.fillStyle=dark?p.color:p.lightColor;
      const shimmer=animate?1+shimmerWaves[(waveOffset+p.phase)&1023]*.12:1;
      const dotSize=p.size*shimmer*(dark?1:1.12);ctx.fillRect(p.x,p.y,dotSize,dotSize);
    }
    if(animate&&scatterUntil&&time>=scatterUntil){scatterUntil=0;section.dataset.particleState='gathering';status.textContent='星星正在回到她身边。';settleAt=time+2200;}
    if(animate&&settleAt&&time>settleAt){settleAt=0;section.dataset.particleState='gathered';status.textContent='靠近她，看看星星的回应。';}
  }
  function loop(time){if(time-last>=30){last=time;draw(time,true);}raf=requestAnimationFrame(loop);}
  function sync(){
    cancelAnimationFrame(raf);raf=0;
    const active=enabled();scatterButton.disabled=gatherButton.disabled=!active;
    canvas.setAttribute('aria-disabled',String(!active));
    canvas.tabIndex=active?0:-1;
    if(!active){scatterUntil=settleAt=0;section.dataset.particleState='still';status.textContent='星雨静静停在这里，动效已暂停。';draw(performance.now(),false);}
    else{if(section.dataset.particleState==='still'){section.dataset.particleState='gathered';status.textContent='靠近她，看看星星的回应。';}if(visible&&!document.hidden){last=0;raf=requestAnimationFrame(loop);}}
  }
  function scatter(){
    if(!enabled())return;
    const now=performance.now();scatterUntil=now+850;settleAt=0;
    for(const p of dots){const a=Math.atan2(p.hy-h*.48,p.hx-w*.5)+(Math.random()-.5)*.8,speed=7+Math.random()*17;p.vx=Math.cos(a)*speed;p.vy=Math.sin(a)*speed;}
    section.dataset.particleState='scattered';status.textContent='一片星光散开，随后会自动聚拢。';
  }
  function gather(){if(!enabled())return;scatterUntil=0;settleAt=performance.now()+2200;section.dataset.particleState='gathering';status.textContent='把每一颗小星星，收回到身边。';}
  canvas.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const rect=canvas.getBoundingClientRect();pointer.x=event.clientX-rect.left;pointer.y=event.clientY-rect.top;});
  canvas.addEventListener('pointerleave',()=>{pointer.x=pointer.y=-999;});
  canvas.addEventListener('click',scatter);
  canvas.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();scatter();}});
  scatterButton.addEventListener('click',scatter);gatherButton.addEventListener('click',gather);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)pointer.x=pointer.y=-999;sync();},{threshold:.08}).observe(section);
  new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(resize);}).observe(stage);
  document.addEventListener('rainy-theme-change',()=>draw(performance.now(),enabled()&&visible&&!document.hidden));
  document.addEventListener('visibilitychange',sync);document.addEventListener('rainy-effects-change',sync);motion.addEventListener('change',sync);
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);});addEventListener('pageshow',sync);resize();
})();


