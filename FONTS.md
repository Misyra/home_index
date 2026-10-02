# 字体

参考站 https://upxuu.com/ 的 CSS 使用 Fredoka + Noto Sans SC。
本站同样使用该组合，数字/英文为圆润的 Fredoka，中文为清晰的 Noto Sans SC。

字体在本站托管，font-display: swap 保持文字立即可读；缺少的字符由系统中文字体补充。
中文字体保留可变字重，在本地提取页面、配置及交互脚本内使用的字符后生成 WOFF2。
页面内容与提取后的字集均不会发送给字体服务。修改文案后可重新运行
scripts/subset-fonts.py（需要 fonttools[woff]；本次使用 4.66.1）。

## 来源及许可证

- Fredoka 拉丁字集来自参考站公开字体文件 https://img.upxuu.lcrworld.xyz/font/woff2/fredoka-003.woff2。
- Fredoka 上游 https://github.com/google/fonts/tree/main/ofl/fredoka。
- Noto Sans SC 原版可变字体 https://github.com/google/fonts/blob/main/ofl/notosanssc/NotoSansSC%5Bwght%5D.ttf。
- 两款字体均使用 SIL Open Font License 1.1；版权及完整许可证随 public/fonts 内对应 OFL.txt 一并发布。
