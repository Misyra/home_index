# 雨间小屋

雨天主题的个人导航站，使用 Astro 静态生成与轻量原生 JavaScript。首页保留洛茜、散落的雨天 CG 和互动问候；下滑查看导航。星雨洛茜是独立页面，主页不加载粒子数据或粒子绘制脚本。

## 启动与构建

```powershell
npm install
npm run dev
npm run build
npm run preview
```

开发地址：http://127.0.0.1:4321；构建预览：http://127.0.0.1:4173。生产文件在 dist，可直接打开 dist/index.html；粒子入口指向相对路径 particles.html。网易云联网功能需要可访问的网络与接口。

## 修改内容

- src/pages/index.astro：首页人物、CG、顶部内容与星雨洛茜入口。
- src/pages/particles.astro：独立粒子页。
- src/config/site.ts：导航名称、说明与地址。
- src/config/music.ts：音乐、网易云歌单接口、默认音量。
- src/components：导航、播放器、首次欢迎、页脚和背景。
- public/scripts/home.js：24 条人物问候、姿势切换与 CG 弹窗；信封姿势的问候对话即星雨洛茜入口。
- public/style.css、public/particles.css：公共页面与独立粒子页样式。

导航为 GitHub 与博客两张卡片，桌面并排、极窄屏单列；增改在 src/config/site.ts 维护。顶部按钮控制主题、音乐和动效。主题与音量保存在浏览器本地，首次欢迎按会话展示。

## 音乐

移除原有合成雨声，使用原生 audio 播放器，支持播放/暂停、切歌、进度、音量与歌单列表。歌单默认收起，点面板右上角的列表图标展开。默认使用网易云歌单（主、备 Meting 接口依次尝试）：打开播放器时按需读取，列表内点选即播；接口失败时回退到本地单曲。没有自动播放。

## 素材与性能

原始插画保留在 assets/originals；public/assets 同时输出 AVIF 与 PNG（页面优先 AVIF，PNG 作为回退），含缩略图、雨云 favicon 与 mon3tr 光标。scripts/optimize-assets.mjs 与 scripts/optimize-new-characters.mjs 生成双格式素材，scripts/image-formats.mjs 为共用画质口径，scripts/create-icons.py 导出 favicon/ICO，scripts/import-mon3tr-cursors.py 从原稿生成静态光标。CG 大图点击后加载，音乐按需加载，粒子只在独立页面运行。动画在后台暂停，并响应减少动态效果设置。

npm run build 生成静态 HTML 并压缩 CSS/JS。scripts/audit.py 检查本地链接、AVIF/PNG 配对、主页粒子资源隔离与文件体积；详细口径见 docs/PERFORMANCE.md。

插画使用内置 image_gen 生成。历史人物提示词见 docs/CHARACTER-PROMPTS.md；CG、粒子和新图标提示词分别见 docs/CG-PROMPTS.md、docs/PARTICLE-PROMPT.md、docs/ICON-PROMPT.md。导航品牌图标保留 Simple Icons 及花瓣官方图标。

## 发布

.openai/hosting.json 绑定现有 Sites 项目，保持 static.directory 为 dist。先构建并推送对应源码，再打包 dist 与 .openai/hosting.json 发布。不要直接编辑 dist：下次构建会覆盖它。

## 角落洛茜与新版雨滴

角落洛茜使用内置 image_gen 生成八帧，透明 GIF 位于 public/assets/rossi-corner.gif。网页使用同一组 AVIF/PNG 帧在 192×208 canvas 上播放，显示为96×104px（手机76×83px），支持点击问候和拖动；后台、关闭动效、减少动态效果时暂停，打开播放器时避让。提示词见 docs/PET-PROMPT.md。

雨滴改为三层速度和透明度的细雨线，带轻微变动风向；水花与涟漪在雨滴实际落点出现，短时消退。数量上限110，涟漪上限18，保留30 FPS节奏限制和后台暂停。

## 唱片播放器

左下角默认显示圆形唱片，点击向上展开控制面板。播放时唱片旋转，暂停或关闭动效时停止；收起面板不暂停音乐。唱片封面随当前曲目更新，展开状态与所有音乐入口的 aria-expanded 同步，支持 Esc 收起与恢复键盘焦点。面板支持手机窄屏、日夜主题和减少动态效果设置。

## 人物动作与七张雨天CG

src/config/characters.ts 集中管理人物图片、场景和台词。主页人物按顺序循环五种动作，保留原24条问候，新动作使用场景专属台词。主页四张明信片打开相册；在相册点击大图、左右按钮、缩略图或按左右方向键切换七张CG，每张有三句不同台词，重复查看时轮换。图片载入成功后才一起更新图片、标题、台词，避免画面与内容错配。新大图与动作按需载入，原有CG均保留。

新增插画与最终提示词见 docs/NEW-CHARACTER-PROMPTS.md；scripts/optimize-new-characters.mjs 将新增原稿导出为 AVIF/PNG 立绘、大图与缩略图。

## 可爱字体

全站使用与 UPXUU 参考站相同的 Fredoka + Noto Sans SC 组合；英文和数字圆润，中文保持清晰，标题700字重、导航600字重。字体本站托管，中文子集在本地生成，合计约165KB。字体来源、许可证及重新生成方法见 docs/FONTS.md。

粒子计算、快速切歌、弹窗背景锁定和手机触摸范围的后续迭代见 docs/PERFORMANCE.md。可用 Node 运行 scripts/music-race.test.mjs 验证播放状态冲突；scripts/particle-cost.mjs 使用Git内保存的原版渲染脚本对照运算计数。

## 目录

- src/、public/：站点源码与静态素材（AVIF 优先，PNG 回退）。
- assets/originals/：插画原稿；assets/fonts/：字体源文件。
- scripts/：构建、素材与审计脚本；scripts/archive/：已完成的历史一次性脚本。
- docs/：提示词、性能、字体与参考文档。
