# AGENTS.md

## Project overview

This repository contains a browser-based Xiaohongshu real-estate cover generator and a companion local Figma plugin. The web app has no build step: open `index.html` in a browser to run it.

## Key files

- `index.html`: editor controls, canvas dimensions, and asset cache versions.
- `styles.css`: editor layout and canvas preview ratio.
- `app.js`: canvas rendering, template defaults, image fitting, text layout, and PNG download.
- `fonts/`: bundled fonts used by the cover templates.
- `figma-plugin/`: local Figma UI-kit plugin.
- `references/`: visual references only; do not use them as runtime dependencies.

## Cover rules

- The exported canvas is `1080 × 1920` with a `9:16` aspect ratio.
- Keep `DESIGN_H` in `app.js` aligned with the canvas height in `index.html`.
- Uploaded photos must use centered `cover` fitting and fill the entire canvas without distortion.
- Preserve the visual center when changing crop or canvas height.
- Keep all title and subtitle content inside the visible text-safe area.
- The bottom information card has been removed and should not be restored unless explicitly requested.
- Template-specific changes must not alter other templates.

## Template mapping

- `estateBold`: 房源大字版
- `varietyVisit`: 房探综艺版
- `sunnyEstate`: 阳光房产标题版
- `bauhausRoomTour`: 包豪斯 Room Tour
- `dutchCube`: 荷兰建筑杂志版
- `cuteCarousel`: 中文手写小清新版

## Editing conventions

- Keep source files UTF-8 and preserve existing Chinese copy.
- Make focused changes; avoid broad formatting or unrelated rewrites.
- Reuse bundled fonts before adding new font assets.
- When changing `app.js` or `styles.css`, increment the corresponding query-string version in `index.html` so browsers do not use stale cached assets.
- Do not commit generated downloads, temporary files, editor metadata, or credentials.

## Validation

After JavaScript changes, run:

```powershell
node --check app.js
```

Then verify in a browser:

1. The preview is `9:16` and the download is `1080 × 1920`.
2. Image upload remains centered and fills the canvas.
3. Every template renders without clipped text.
4. Template switching and PNG download still work.
5. Changes intended for one template do not affect the others.

## Git workflow

- Work on the `main` branch unless instructed otherwise.
- Review `git status` before committing.
- Use a concise commit message describing the visible change.
- Push to `origin/main` only when the user explicitly requests an upload.
