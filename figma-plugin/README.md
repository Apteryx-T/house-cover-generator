# House Cover UI Kit Figma Plugin

This local Figma plugin generates a video UI component library for the house cover generator project.

## Components

Estate Bold:
- InfoCard
- SpaceTag
- FeatureText
- CTAButton
- SummaryCard

Variety Visit:
- InfoSticker
- SpaceBubble
- FeatureCaption
- CTASticker
- SummarySticker

## Install

1. Open Figma.
2. Open any design file.
3. Go to `Plugins` -> `Development` -> `Import plugin from manifest...`.
4. Select `figma-plugin/manifest.json`.
5. Run `House Cover UI Kit` from `Plugins` -> `Development`.

## Use

1. Choose a scope: all styles, Estate Bold, or Variety Visit.
2. Click `Generate UI Kit`.
3. The plugin creates component boards on the current Figma page.

## Export

1. Click `Generate UI Kit` first.
2. Click `Export SVG Zip`.
3. Click the `Download Zip` link shown in the plugin UI.

The zip contains:
- SVG files for generated components.
- `design-system.json` with color and sample text tokens.

Figma plugins cannot silently write files to your computer, so the plugin creates a downloadable zip link inside the plugin UI.
