# House Cover UI Kit Figma Plugin

这个插件用于把房源封面项目里的视频内 UI 组件库生成到 Figma。

## 当前包含

- 房源大字版
  - InfoCard
  - SpaceTag
  - FeatureText
  - CTAButton
  - SummaryCard
- 探家综艺版
  - InfoSticker
  - SpaceBubble
  - FeatureCaption
  - CTASticker
  - SummarySticker

## 安装方式

1. 打开 Figma Desktop 或网页版。
2. 进入任意设计文件。
3. 菜单选择 `Plugins` -> `Development` -> `Import plugin from manifest...`
4. 选择本目录里的 `manifest.json`。
5. 在 `Plugins` -> `Development` 中运行 `House Cover UI Kit`。

## 使用方式

1. 选择生成范围：全部风格 / 房源大字版 / 探家综艺版。
2. 点击 `生成组件库`。
3. 插件会在当前 Figma 页面生成组件预览画板。

## 后续计划

- 从 `design-system.json` 读取组件配置。
- 与封面生成器共用同一套主题 token。
- 增加视频时间轴组件和动效标注。
