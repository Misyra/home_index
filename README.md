# 雨间小屋

一个上下两屏的雨天主题导航页：第一屏顶部展示站名、介绍和主题/雨声/动效控制，下方展示Q版少女、简短雨天文案、四张散落的CG明信片；下滑后第二屏显示导航标题和六个外部链接。导航支持进入视野后依次出现，保留人物浮动、雨滴涟漪和卡片悬停动效。

打开 `dist/index.html` 即可使用，或者运行 `node preview.mjs` 后访问 `http://127.0.0.1:4173`。

在 `dist/app.js` 的 `bookmarks` 数组修改名字、说明、图标和网址，就能换成自己的博客及社交主页。站名和介绍在 `dist/index.html` 中修改。

动效包括：云朵飘动、人物浮动与点击招呼、落雨和落地涟漪、卡片入场、悬停弹跳、点击水波与小爱心。右上角雨伞按钮可以开关背景与持续动效。雨声仅在点击后播放。系统减少动态效果设置会关闭装饰动画。

## 主页人物

素材：`dist/rain-girl.png`。使用内置 image_gen，根据用户提供的两张角色图片生成透明背景Q版人物。

最终提示词：Create a cute full-body Q-version/chibi reinterpretation of the same girl in both identity references. Preserve pale blonde hair in two loose low pigtails, straight bangs, golden amber eyes, brick-red fox/wolf-ear hood with pale cream ear insides and cyan stitches, red cape, fully covering gray-blue dress, charcoal corset belt with teal buckles, dark gloves and boots. Friendly tiny fang smile and rosy cheeks. Two-and-a-half-head-tall proportions, oversized rounded head, tiny body, soft outlines and clean cel shading. Standing with a pastel sky-blue umbrella in one hand and waving with the other. Entire hood, ear tips, feet and umbrella visible. Isolated on genuine transparent background, no scenery, text, border, watermark or UI.

## 导航图标

GitHub、哔哩哔哩、豆瓣、网易云音乐与 Notion 图标来自 https://github.com/simple-icons/simple-icons 。花瓣图标来自其官网 https://huaban.com/img/touch-icon-iphone-retina.png 。图标已保存到 dist/icons，页面无外部图标请求。

## 新增人物内容

- `dist/rain-girl-happy.png`：同一人物的开心跳步姿态。点击人物在挥手与闭眼比耶之间切换，并显示问候。
- `dist/rain-cg.png`：人物坐在雨天咖啡馆窗边捧着热茶的CG。点击对应首页明信片打开；可按 Esc、关闭按钮或点击弹窗外部关闭。

两张素材均由内置 image_gen 生成，原有素材保留。

动作最终提示词：Create a second pose of exactly the same chibi girl from the input reference. Preserve pale blonde twin low pigtails, amber golden eyes, brick-red animal-eared hood with cream inner ears and cyan stitches, red cape, gray-blue fully covering dress, black corset belt with teal buckles, black gloves and dark boots. Same clean anime chibi rendering and 2.5-head proportions. Delighted playful little hop, eyes closed in a curved smile, rosy cheeks, right hand making a V sign near cheek, left hand holding the same sky-blue open umbrella tilted behind her, one leg raised slightly. Entire hood ears, umbrella and boots in frame with padding. Genuine transparent background; no text, scenery, watermark or extra characters.

CG最终提示词：Create a polished landscape anime CG of the same blonde amber-eyed girl in the two character identity references. Preserve pale blonde low twin pigtails, golden eyes, red animal-ear hood with cream ear interiors and cyan stitching, red cape, modest gray-blue dress, charcoal corset belt and black gloves. Seated at a cozy wooden cafe window on a rainy afternoon, looking at viewer with a gentle smile, both hands around a ceramic mug of hot tea. Closed sky-blue umbrella beside the window; rain beads and streaks on glass, softly blurred hydrangeas and garden outside, cream cushions and tea steam. Gentle delicate anime linework and dreamy painted background, powder blue, mint and warm red accents. Fully clothed, landscape 3:2, no lettering, logos, UI or watermark.
## 年龄感修正

用户指出人物是《明日方舟：终末地》的洛茜，要求年幼、小巧的体型。挥手、比耶和CG三个版本均使用内置 image_gen 修正：圆润脸颊、短下巴、更小的肩宽与手脚、较大的头身比例。保留金瞳、浅金双马尾、红色兽耳兜帽、蓝色缝线与斗篷。服装采用完整闭合的灰蓝高领上衣。

修正提示词：Edit the same character as 洛茜 from 明日方舟：终末地. Make her clearly young, petite and childlike: rounded cheeks, short soft chin, large golden eyes, narrow shoulders, small hands and limbs, small straight torso, larger head-to-body ratio. Preserve blonde twin pigtails, red animal-ear hood with cream interiors/cyan stitching, red cape, dark gloves and boots, and utility belt with teal buckles. Use a fully closed high-neck gray-blue blouse. Preserve each existing pose or the rainy cafe scene, lighting and composition. Wholesome fully clothed character. Chibi versions retain genuine transparency; CG retains landscape composition. No text or watermark.

最终采用的CG以修正后的Q版作为形象参考，保持相同小巧比例。最终CG提示词：Create a warm wholesome storybook anime CG of the exact chibi character in the reference, keeping her small chibi proportions, large round head, rounded cheeks, tiny hands, small straight body, blonde twin pigtails, golden eyes, red animal-ear hood with cyan stitches, red cape, fully buttoned high-neck long-sleeved gray-blue dress, utility belt, dark gloves and boots. Landscape 3:2. Sitting on a cream cushion in a cozy wooden cafe at a rain-streaked window, holding a large mug of warm tea with both little gloved hands. Body mostly behind the table, hood and face dominant. Closed sky-blue umbrella beside window, hydrangeas and rainy garden outside, steaming tea and cookies on table. Delicate anime illustration and detailed dreamy painted background; powder blue, cream wood and soft warm lighting. Chibi character right-center, beautiful rain window at left. No text, logos, border, watermark or UI.

## 昼夜与点击交互

顶部月亮/太阳按钮切换日间与夜间模式，选择保存在本地；首次跟随系统主题。点击反馈包含双层水波、飞溅水珠与小星星。人物点击切换动作，明信片打开CG；已移除原有两个文字操作按钮。动效开关和系统减少动态效果均能停用这些动画。

## 雨天相册

新增洛茜与蓝发鱼尾女孩一起踩水花、共撑雨伞、放纸船的三张CG，保存于 dist/rain-cg-splash.png、dist/rain-cg-umbrella.png、dist/rain-cg-boats.png。与原有热茶CG一起分散摆在首屏人物周围，每张明信片都可点击独立放大查看。内置 image_gen 生成；完整最终提示词见 CG-PROMPTS.md。

## 首页简化与背景互动

明信片只显示图片，标题和说明保留在点击放大的窗口。背景增加远中近三层雨线、双层落地涟漪、流动雾光与光点，并适配昼夜主题。人物问候扩展为24条，打乱后逐条展示，一轮内不重复，跨轮避免紧邻重复；阅读时间延长至3.3秒。
