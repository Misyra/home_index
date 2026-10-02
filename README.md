# 雨间小屋

可爱的雨天主题博客导航页，使用 HTML、CSS 和 JavaScript，无需安装依赖。

## 查看

双击 `dist/index.html` 即可打开。或者在此目录运行 `node preview.mjs`，访问 `http://127.0.0.1:4173`。

## 换成自己的内容

- 名字、介绍和入口：`dist/index.html`。
- 常用链接及示例手记：`dist/app.js`，`bookmarks` 数组维护导航链接，`pages` 对象维护弹窗内容。
- 颜色、字体和排版：`dist/style.css`。
- 如需直接跳转个人博客，将 `data-open="journal"` 的按钮替换成 `<a href="你的博客网址">`，保留样式类名。

小雨动效可以开关，偏好保存在当前浏览器。雨声由 Web Audio 合成，只在点击后播放。示例手记和介绍已标明为示例。

## 插画

`dist/rain-cat.png` 使用内置 image_gen 生成。

提示词：Cute Japanese picture-book illustration of a small white fluffy round cat holding a mint-green umbrella while standing in a little puddle. Pale clouds and tiny raindrops, a small sprout and cream rain boots. Clean pale powder-blue #e8f2fa background, soft pencil outlines and lightly textured pastel watercolor. Wide 3:2 landscape, main subject at center right, generous quiet space on the left. Desaturated blue, mint and cream; peach cheeks. No text, interface, lettering or watermark.
