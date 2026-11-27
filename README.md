# The Flowers Project v4

An editorial botanical-art experience. Fifteen flower studies are drawn in the browser and converted into coloured ASCII characters. The visual work and its existing animation character are the centre of the project.

## Run locally

This is a static Vanilla JavaScript project. It has no package manager, build step, framework, database, or runtime dependency to install.

From the project root, start a small local HTTP server:

```bash
# macOS / Linux
python3 -m http.server 8000

# Windows (if the Python launcher is installed)
py -m http.server 8000
```

Then open <http://localhost:8000> in a modern browser. Stop the server with `Ctrl+C` in the terminal. Python is used only to serve the local files during development; it is not part of the website runtime.

The site can also be served by any static web server. Keep the project files in their existing relative paths so the scripts, stylesheets, flower modules, and audio asset resolve correctly.

## Project structure

| File / directory | Responsibility |
| --- | --- |
| `index.html` | Static entry point, shared navigation, first three studies, controls, and script loading order. |
| `styles.css` | Base layout and component styles. |
| `studies.css` | Botanical study layout, generated-study presentation, index, and side rail. |
| `apple.css` | Existing v4 visual overrides. Preserve them as part of the current baseline. |
| `engine.js` | Shared renderer for registry-based studies: canvas sizing, ASCII conversion, palettes, controls, visibility, and animation frame loop. |
| `flowers/*.js` | Individual flower definitions registered with `FlowerEngine`. Each module supplies its own geometry and drawing logic. |
| `botanical-data.js` | Static family metadata and the corresponding Kew Plants of the World Online references for all 15 studies. |
| `cover.js` | Registers and inserts the cover study and the 15-study flower index, including family metadata used by the local filters. |
| `flower-explorer.js` | Client-side search by common or scientific name and filtering by botanical family. Queries remain in the browser. |
| `experiments.js` | Temporary palette and animation-pace controls for one selected flower. Closing the dialog restores its starting palette and pace. |
| `BOTANICAL-SOURCES.md` | References for the family data shown in the study index. |
| `bouquet.js` | Dedicated lily renderer. |
| `peony.js` | Dedicated peony renderer. |
| `violet.js` | Dedicated violet renderer. |
| `studies.js` | Builds the remaining study chapters and colophon, mounts registry renderers, and connects their controls. |
| `site.js` | Connects controls for lilies, peonies, and violets. |
| `audio.js`, `audio/` | User-initiated audio control and its local asset. Audio must never autoplay. |
| `perbaikan.md` | Existing project notes and specifications. |
| `anti-slop/` | Audit findings and implementation records. |
| `.claude/skills/antislop/` | Project-installed Antislop workflow and rules. |
| `CLAUDE.md` | Instructions and project guardrails for Claude-assisted work. |
| `DESIGN-DIRECTION.md` | **Authoritative visual and implementation direction for this project.** |

`DESIGN.md` is retained as a legacy Antislop installation-interface reference. It is not the design specification for The Flowers Project and must not override `DESIGN-DIRECTION.md`.

## How the renderers fit together

The project uses plain browser scripts loaded with `defer`; the order in `index.html` is intentional:

1. The dedicated lily, peony, and violet renderers are loaded.
2. `engine.js` creates the shared `window.FlowerEngine` registry and renderer API.
3. Files in `flowers/` register their independent flower definitions.
4. `cover.js` registers/inserts the cover and index markup.
5. `studies.js` builds the remaining chapters, mounts registered definitions, and wires their controls.
6. `site.js` and `audio.js` connect the top-level controls.

Do not reorder these scripts or merge dedicated renderers into `engine.js` without a separate, tested engineering decision. Keep each flower module independent and keep changes local to the affected renderer.

## Project guardrails

- Read `DESIGN-DIRECTION.md` before changing UI, interaction, copy, or artwork.
- Preserve the existing v4 layout, palette, typography, spacing, ASCII artwork, and flower-specific animation character unless a documented requirement explicitly authorizes a change.
- Keep Vanilla JavaScript. Do not introduce a framework, dependency, database, or build pipeline for a static-site requirement.
- Keep visual, accessibility, and performance changes separate where practical. Do not use a performance fix as an opportunity to alter rendering output.
- Respect `prefers-reduced-motion`, keyboard access, readable status messages, and explicit user action for audio.
- Verify desktop and mobile layouts, controls, console output, and affected flower renderers after relevant changes. Record any browser or device checks that could not be performed; do not claim unrun tests passed.

## Notes before publication

The audio directory includes `avril-14th.mp3`. It is retained unchanged for this private owner-delivery package. Its purchase does not establish public redistribution permission. Confirm the relevant written rights and attribution before publishing a public copy with this asset. No final source-code license has been selected.
