# SimpleKit Starter (Local-First Web App Template)

A copy-and-customize starter for building polished static web apps with the same look/feel patterns as your current app:

- bold gradient hero
- support / Buy Me a Coffee links
- global save button with dirty state
- tabs + card UI
- local-first storage (`localStorage`)
- JSON export/import backups
- `sitemap.xml` + `robots.txt` SEO starters
- `manifest.webmanifest` PWA/app install starter
- Open Graph + Twitter social meta tags in `index.html`
- `/icons` SVG icon sources + PNG generation instructions

No framework, no build step, no login.

## What This Template Includes

- `index.html`: Reusable layout shell (hero, snapshot, dashboard, workspace, settings, export/import, modal)
- `styles.css`: Design system + reusable component styles (buttons, cards, tabs, forms, pills, progress bars)
- `app.js`: Generic item list logic, branding/theme settings, local save/export/import, modal + toast interactions
- `sitemap.xml`: XML sitemap starter (replace `https://example.com/` with your real domain)
- `robots.txt`: Robots rules + sitemap reference (replace `https://example.com/sitemap.xml`)
- `manifest.webmanifest`: PWA/app metadata starter (replace app text/colors and add real icon files)
- `icons/README.md`: How to generate `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png`

## Quick Start

1. Copy this folder for a new project.
2. Open `index.html` in a browser.
3. Go to the `Settings` tab and customize app name, support URL, and colors.
4. Replace the starter list/item model in `app.js` with your own domain data.
5. Update `https://example.com` in `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/sitemap.xml` and `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/robots.txt`.
6. Update Open Graph/Twitter placeholders in `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/index.html` (`og:url`, `og:image`, `twitter:image`).
7. Add actual icon files for `/icons/icon-192.png` and `/icons/icon-512.png` (or change the paths) for `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/manifest.webmanifest`.
8. Generate `icons/apple-touch-icon.png` (the HTML includes the tag already).

## Where To Customize First

- Branding defaults: `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/app.js` (`TEMPLATE.brand`)
- Theme colors: `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/app.js` (`TEMPLATE.theme`)
- Demo state: `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/app.js` (`DEMO_STATE`)
- Layout sections: `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/index.html`
- Component styles: `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/styles.css`

## Template Patterns You Can Reuse In Other Apps

- `markDirty()` + global save button badge for explicit save UX
- `exportJson()` / import file flow for local backups
- tab navigation (`data-tab-target` / `data-tab-panel`)
- modal open/close pattern
- toast notifications for user feedback
- CSS variables (`--brand`, `--brand-2`) for runtime theming
- live `<head>` meta updates from the `Settings` tab (useful for branding preview while building)

## Adapting The Data Model

The starter currently tracks generic `items` with:

- `title`
- `status`
- `priority`
- `tag`
- `notes`

To adapt it:

1. Change `DEMO_STATE.items` shape in `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/app.js`.
2. Update `normalizeItem()`.
3. Update `renderWorkspaceList()` + `renderStarterList()`.
4. Update `getSummary()` metrics to match your app.

## Notes

- Data is stored locally in the browser under `simplekitStarter.template.v1`.
- Export/import uses plain JSON for portability.
- This is intentionally framework-free so it is easy to copy into new projects.
- Social/SEO tags are starter placeholders and should be changed before production deploy.
- Favicon/PWA icon PNG files are not auto-generated; use `/Users/AshleySkinner/Documents/00_Engineering/04_Code/00_Simplekit Template/icons/README.md`.
