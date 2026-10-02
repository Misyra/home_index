// 欢迎仅在当前浏览会话首次显示；手写实现，参考 rainzt.cn 的交互方式。
(()=>{
  const toast=document.querySelector('#welcome-toast'),key='rainy-home-welcome-v1';
  let seen=false,timer,opening;
  try{seen=sessionStorage.getItem(key)==='seen';}catch{}
  if(seen)return;
  const close=()=>{clearTimeout(timer);toast.classList.remove('visible');setTimeout(()=>{toast.hidden=true;},250);};
  const show=()=>{
    if(seen||document.hidden)return;
    seen=true;try{sessionStorage.setItem(key,'seen');}catch{}
    const hour=new Date().getHours();
    const greeting=hour<6?'夜深啦':hour<11?'早上好':hour<14?'中午好':hour<18?'下午好':'晚上好';
    document.querySelector('#welcome-title').textContent=greeting+'，欢迎来到雨间小屋';
    document.querySelector('#welcome-message').textContent=hour<6?'收起今天的忙碌，听一会儿雨吧。':hour<11?'愿今天的第一场小雨，带来好心情。':hour<18?'给自己留一点空闲，来这里躲躲雨。':'小屋的灯亮着，雨声也在等你。';
    toast.hidden=false;requestAnimationFrame(()=>toast.classList.add('visible'));
    timer=setTimeout(close,6500);
  };
  const schedule=()=>{if(!seen&&!document.hidden){clearTimeout(opening);opening=setTimeout(show,850);}};
  document.querySelector('#welcome-close').addEventListener('click',close);
  document.addEventListener('visibilitychange',schedule);
  addEventListener('pagehide',()=>{clearTimeout(opening);clearTimeout(timer);});
  schedule();
})();
