# Icons (Template Placeholders)

This folder contains SVG source placeholders for favicon/app icons:

- `favicon.svg` (browser favicon)
- `icon.svg` (source for PWA app icons)
- `mask-icon.svg` (Safari pinned tab source)

## Generate PNGs (recommended before production)

The template manifest references these PNG files:

- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

### Option A: ImageMagick (`magick`)

```bash
magick icons/icon.svg -resize 192x192 icons/icon-192.png
magick icons/icon.svg -resize 512x512 icons/icon-512.png
magick icons/icon.svg -resize 180x180 icons/apple-touch-icon.png
```

### Option B: macOS Preview (manual)

1. Open `icons/icon.svg` in Preview.
2. Export as PNG three times at `192x192`, `512x512`, and `180x180`.
3. Save as `icons/icon-192.png`, `icons/icon-512.png`, and `icons/apple-touch-icon.png`.

## Replace for each project

- Update colors/shapes in the SVG sources to match your new app.
- Update `/manifest.webmanifest` `name`, `short_name`, and `theme_color`.
- Keep icon paths the same if you want the template HTML/manifest links to keep working.
