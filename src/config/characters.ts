export const cgScenes = [
  {src:'assets/rain-cg-splash.webp',thumb:'assets/rain-cg-splash-thumb.webp',title:'一起踩水花',alt:'Q版洛茜和蓝色鱼尾女孩在雨中开心地踩水花',dialogues:['啪嗒！把小水洼踩成快乐的形状。','大肥鱼的尾巴，又把我的靴子弄湿啦！','再来一下，这次的水花要比刚才更大！']},
  {src:'assets/rain-cg-umbrella.webp',thumb:'assets/rain-cg-umbrella-thumb.webp',title:'共撑一把伞',alt:'Q版洛茜和蓝色鱼尾女孩共撑一把蓝色雨伞，在绣球花小路上散步',dialogues:['伞下的位置，刚好够我们两个。','靠近一点，别让小雨滴偷偷跑进来。','慢慢走吧，回家的路还很长呢。']},
  {src:'assets/rain-cg-boats.webp',thumb:'assets/rain-cg-boats-thumb.webp',title:'纸船漂呀漂',alt:'Q版洛茜和蓝色鱼尾女孩蹲在浅浅的雨水边，一起放纸船',dialogues:['把小小的愿望，交给雨水和纸船。','我的小船，要去找一个晴天回来！','嘘，别急着捞起来，它还在旅行呢。']},
  {src:'assets/rain-cg.webp',thumb:'assets/rain-cg-thumb.webp',title:'窗边的热茶',alt:'Q版洛茜坐在雨天窗边捧着一杯热茶',dialogues:['窗外滴答滴答，杯里是暖暖的茶。','小心烫哦，先吹一吹再喝。','饼干给你一半，今天也辛苦啦。']},
  {src:'assets/rossi-cg-rainbow.webp',thumb:'assets/rossi-cg-rainbow-thumb.webp',title:'雨后的小彩虹',alt:'小巧Q版洛茜撑着蓝色雨伞，在湿润的绣球花小路上指向雨后彩虹',dialogues:['快看！雨把彩虹偷偷留给我们啦。','刚才的雨滴，原来是在给天空上颜色呀。','等雨停了，我们一起找找彩虹的另一边吧。']},
  {src:'assets/rossi-cg-lantern.webp',thumb:'assets/rossi-cg-lantern-thumb.webp',title:'晚灯等你',alt:'Q版洛茜在雨夜木屋檐下捧着温暖的星星小灯',dialogues:['这盏小灯，替我说一句：欢迎回家。','外面有点凉，把手伸过来，暖一暖吧。','等你慢慢走来，我会把灯一直亮着。']},
  {src:'assets/rossi-cg-letter.webp',thumb:'assets/rossi-cg-letter-thumb.webp',title:'寄一封晴天',alt:'Q版洛茜在雨天窗边画太阳明信片，桌上放着蓝色雨滴封蜡信封',dialogues:['把今天的小晴天装进信封，寄给你。','这张画上没有下雨，因为想让你开心呀。','收到这封信的人，要记得好好休息哦。']}
];

const originalGreetings=[
'今天也要开心呀 ♡',
'送你一朵不会淋湿的云 ☁',
'滴答！很高兴遇见你 ♡',
'雨声这么好听，再待一会儿吧。',
'嘿！这把伞也有你的位置。',
'今天的快乐，偷偷装进口袋啦。',
'大肥鱼说，这个水洼归她啦！',
'要不要和我们一起放纸船？',
'啪嗒！刚才的水花像小星星。',
'雨停之前，先收下一个好心情。',
'别急，慢慢来就好。',
'今天也辛苦啦，来躲一会儿雨。',
'云朵正在帮我们把天空洗干净。',
'这次踩水花，我一定不会输！',
'暖暖的茶已经准备好啦。',
'嘘，听见雨滴打招呼了吗？',
'我的兜帽很暖，雨伞也很大。',
'这只纸船，载着一个小愿望。',
'再点一下？还有话想和你说。',
'星星躲在云后，也在偷偷看你。',
'能遇见你，今天的雨都变甜了。',
'跟着滴答滴答，给心情放个假。',
'大肥鱼的尾巴，又溅起水花啦！',
'把烦恼放进纸船，送它漂远一点。'];
export const characterPoses=[
{src:'assets/rain-girl.webp',alt:'Q版洛茜撑着蓝色小雨伞，微笑挥手',dialogues:originalGreetings.slice(0,12)},
{src:'assets/rain-girl-happy.webp',alt:'Q版洛茜撑着蓝色小雨伞，闭眼笑着比耶，轻轻抬起一条腿',dialogues:originalGreetings.slice(12)},
{src:'assets/rossi-pose-rainbow.webp',alt:'Q版洛茜撑伞开心地指向小彩虹',dialogues:cgScenes[4].dialogues},
{src:'assets/rossi-pose-lantern.webp',alt:'Q版洛茜微笑捧着一盏星星小灯',dialogues:cgScenes[5].dialogues},
{src:'assets/rossi-pose-letter.webp',alt:'Q版洛茜抱着蓝色雨滴封蜡信封',dialogues:cgScenes[6].dialogues}
];
