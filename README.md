# 雨间小屋

一个上下两屏的雨天主题导航页：第一屏只有Q版少女与下滑提示；下滑后第二屏显示站名和六个外部链接。导航支持进入视野后依次出现，保留人物浮动、雨滴涟漪和卡片悬停动效。

打开 `dist/index.html` 即可使用，或者运行 `node preview.mjs` 后访问 `http://127.0.0.1:4173`。

在 `dist/app.js` 的 `bookmarks` 数组修改名字、说明、图标和网址，就能换成自己的博客及社交主页。站名和介绍在 `dist/index.html` 中修改。

动效包括：云朵飘动、人物浮动与点击招呼、落雨和落地涟漪、卡片入场、悬停弹跳、点击水波与小爱心。右上角雨伞按钮可以开关背景与持续动效。雨声仅在点击后播放。系统减少动态效果设置会关闭装饰动画。

## 主页人物

素材：`dist/rain-girl.png`。使用内置 image_gen，根据用户提供的两张角色图片生成透明背景Q版人物。

最终提示词：Create a cute full-body Q-version/chibi reinterpretation of the same girl in both identity references. Preserve pale blonde hair in two loose low pigtails, straight bangs, golden amber eyes, brick-red fox/wolf-ear hood with pale cream ear insides and cyan stitches, red cape, fully covering gray-blue dress, charcoal corset belt with teal buckles, dark gloves and boots. Friendly tiny fang smile and rosy cheeks. Two-and-a-half-head-tall proportions, oversized rounded head, tiny body, soft outlines and clean cel shading. Standing with a pastel sky-blue umbrella in one hand and waving with the other. Entire hood, ear tips, feet and umbrella visible. Isolated on genuine transparent background, no scenery, text, border, watermark or UI.

## 导航图标

GitHub、哔哩哔哩、豆瓣、网易云音乐与 Notion 图标来自 https://github.com/simple-icons/simple-icons 。花瓣图标来自其官网 https://huaban.com/img/touch-icon-iphone-retina.png 。图标已保存到 dist/icons，页面无外部图标请求。
