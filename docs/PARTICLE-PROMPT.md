# 洛茜星雨粒子像

- 生成方式：内置 imagegen。
- 插画：assets/originals/rossi-particle-portrait.png，1086 × 1448，透明 PNG。
- 参考：既有 rain-girl.png 的人物设计与用户提供的粒子画面；后者仅参考粒子表现。
- scripts/prepare-particles.py 从透明插画读取颜色并产生离线数字采样；不改变原始 PNG。
- public/scripts/particle-data.js 存储 13,744 个彩色点，public/scripts/particles.js 绘制实时互动。可直接打开 dist/index.html。

## 最终生成提示词

Use case: stylized-concept. Asset type: one standalone transparent raster character portrait asset for a cute rain-themed website canvas. Create ONLY the character illustration, never a website mockup.
Input images: Image 1 (rain-girl.png) is the exact character identity and clothing reference for Rossi / 洛茜. Image 2 (clipboard screenshot) is ONLY a reference for a character constructed from colored particles; ignore all text, UI, layout, background and mature proportions from Image 2.
Primary request: Render Rossi as a detailed, adorable full-body chibi character made entirely from thousands of VERY FINE luminous colored dots and particles, true colored pointillism with readable anime facial features and outfit, on a genuinely transparent alpha background.
Subject and invariant design: blonde hair in TWO LOW pigtails with curly ends; large golden amber eyes; petite childlike round face with cheerful small open smile and rosy cheeks; approximately THREE HEADS TALL chibi proportions, a small straight childlike body, never mature. Brick-red animal-ear hood with tall pointed ears, cream inner ears and bright cyan stitches; red cape flowing gently; fully buttoned HIGH-NECK LONG-SLEEVED gray-blue dress; dark gloves and dark boots; charcoal utility belt with teal buckles and small detailed pouches. Preserve the exact recognizable design of Image 1. Wholesome and fully clothed.
Pose: slight playful standing pose, one gloved hand waving close to the face, the other hand comfortably at her side. No umbrella and no companion. The silhouette must stay clear. Include both complete ears and both complete boots.
Style/medium: polished cute anime rendering combined with luminous pointillism. More detailed than a minimal mascot. Use dense tiny discrete colored points to describe eye highlights, eyelashes, smile, fabric folds, hood stitches, pigtail curls, belt straps and buckles. The whole character is formed by fine particles, not a solid-painted character merely sprinkled with dots. Points are dense enough that the face and clothes remain easy to read; a small amount of softer drifting particles near the edges. Warm red and gold particles mixed with cool pale blue and teal particles. Subtle controlled luminous shimmer.
Composition/framing: portrait composition approximately 3:4, centered single full body alone, generous genuinely transparent padding on all four sides, character occupies about 78 percent of image height. No clipping.
Scene/backdrop: completely transparent alpha background, including the spaces between drifting particles. No opaque background or black backing.
Constraints and avoid: no scenery, text, lettering, logo, watermark, border, UI, starscape, props, umbrella, companion, mature physique, exposed cleavage, solid black backing or fake checkerboard transparency.
