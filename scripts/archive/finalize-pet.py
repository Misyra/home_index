from pathlib import Path
p=Path('public/scripts/pet.js');s=p.read_text(encoding='utf-8')
a=s.index('function clamp(');b=s.index("pet.addEventListener('pointerdown'",a)
s=s[:a]+'''function clamp(x,y){const px=Math.max(8,Math.min(document.documentElement.clientWidth-pet.offsetWidth-8,x)),py=Math.max(8,Math.min(innerHeight-pet.offsetHeight-8,y));pet.style.left=`${px}px`;pet.style.top=`${py}px`;pet.style.right='auto';pet.style.bottom='auto';pet.classList.toggle('left-edge',px<210);pet.classList.toggle('top-edge',py<150);placed=true;}
'''+s[b:]
s=s.replace("pet.addEventListener('click',()=>{if(moved)","pet.addEventListener('click',event=>{if(moved&&event.detail!==0)")
p.write_text(s,encoding='utf-8')
p=Path('README.md');s=p.read_text(encoding='utf-8');s+='\n## 角落洛茜与新版雨滴\n\n角落洛茜使用内置 image_gen 生成八帧，透明 GIF 位于 public/assets/rossi-corner.gif。网页使用同一组 WebP 帧在 192×208 canvas 上播放，显示为96×104px（手机76×83px），支持点击问候和拖动；后台、关闭动效、减少动态效果时暂停，打开播放器时避让。提示词见 PET-PROMPT.md。\n\n雨滴改为三层速度和透明度的细雨线，带轻微变动风向；水花与涟漪在雨滴实际落点出现，短时消退。数量上限110，涟漪上限18，保留30 FPS节奏限制和后台暂停。\n';p.write_text(s,encoding='utf-8')
p=Path('PERFORMANCE.md');s=p.read_text(encoding='utf-8').replace('雨滴数量设上限','雨滴数量上限 110、涟漪数量上限 18').replace('备用动作，以及','备用动作、角落小人 WebP 帧图（约129 KB），以及');s+='\n角落小人只在换帧时重绘，使用定时器代替持续全速绘制，动画帧图约129 KB；导出 GIF 约162 KB，页面不加载 GIF。GIF 共8帧、透明背景、192×208、循环播放，已核对文件结构。\n';p.write_text(s,encoding='utf-8')
