# The Flowers Project v4 — Project Final Report

Date: 27 November 2026
Delivery: `THE_FLOWERS_PROJECT_FINAL.zip`

## 1. Canonical baseline and provenance

This delivery was built from **Baseline B**, the working-tree snapshot used for Audit004 and subsequently integrated with the Study Rail CSS changes validated in Audit008. The source archive SHA-256 matched the required value exactly:

`2327a36ace0c9ff57944be5580c516bd7c3cef2af7290d8a5988b94c742da3da`

Git metadata in the isolated source workspace: branch `main`, HEAD `44444abbb4be315ada1ba13cd2e4091f9f3851d3`, commit subject `Revisi penambahan audio`. The canonical archive carries working-tree changes not present in the commit itself. The final package is derived from that archived working tree, not from the clean owner ZIP at the same HEAD. The owner’s old local project directory was not modified. `.git` is excluded from the final delivery.

## 2. Design authority and Antislop

`DESIGN-DIRECTION.md` is the design authority and is included unchanged. Its SHA-256 is `e21ed74cfd5b16c18cff16720b5fdd1797b9913ba4f69005ca7a7df9fcce298f`.

Design Read: a botanical generative-art field guide for visitors exploring 15 flower studies, with a calm editorial language; ENERGY 2 / RHYTHM 2 / MOTION 3.

Antislop mode was DURING: design guardrails were applied during planning, implementation, and testing. An Antislop AFTER review was also completed. No new font, framework, UI kit, decorative image, gradient, glow, glassmorphism, dashboard, or ornamental panel was introduced. Existing layout, typography, flower palettes, ASCII algorithms, and standard animation character were preserved.

The canvas fidelity comparison captured under reduced motion compared 16 canvases (cover plus 15 studies): all 16 pixel hashes were identical between Baseline B and the final build. The flower source files under `flowers/` were not changed. The modifications to the interface were limited to the functional search/filter controls, a small experiment entry point, the experiment dialog, and a measured contrast correction using an existing project color token.

## 3. Completed roadmap

### Priority A — Quality Foundation

- Preserved Audit002–004 documentation, graceful-failure, and animation-lifecycle work.
- Preserved Audit008 coarse-pointer behavior: Study Rail hidden on coarse pointer; Studies link and Study Grid remain available; fine-pointer behavior remains as baseline.
- Verified shared FlowerEngine scheduler behavior, independent Lily scheduler, pause/resume/replay, hidden-document freeze, reduced-motion behavior, and rapid repeated controls. Tests observed at most two pending RAF callbacks together because there are two schedulers, not one global scheduler.
- Verified failure isolation for context-null scenarios, a renderer draw failure, and unavailable IntersectionObserver fallback.
- Verified accessible names for canvas, disabled controls on failed studies, status behavior, keyboard access, focus visibility, empty-state behavior, and responsive layout through 320 px.
- Updated README structure, script loading order, static-server run instructions, and feature documentation.
- Kept `LICENSE-DECISION.md`; did not choose a license or create a final license file.
- Kept the audio file and playback code unchanged.

### Priority B — Flower Exploration

- Added client-side search against the existing Study Grid. Search supports case-insensitive partial matching of common and scientific names.
- Added a family filter based on 11 botanical families and a clear/reset path.
- Added a concise empty state and live result count. Search runs locally; it sends no query to an external service and requires no backend or database.
- Added `botanical-data.js` and `BOTANICAL-SOURCES.md` to document family mappings and references.
- Reused the existing 15-item grid and navigation. No duplicate catalog or set of 15 new detail pages was introduced.

### Priority C — Generative Experiments

- Added a small experiment dialog reachable from the existing introductory area.
- The user can select one of the 15 existing studies and temporarily change its available palette and playback rate.
- Changes affect only the selected study, and closing, Escape, or reset restores its standard palette and playback rate.
- Reduced-motion users remain paused; changing the rate does not wake animation when reduced motion is active.
- Experiment controls are keyboard accessible and tested at desktop, mobile, and 320 px widths.

## 4. Runtime changes and safeguards

- `engine.js`, `peony.js`, and `violet.js` received narrow changes required to make the playback-rate experiment API consistent and safe when used through the registry. Peony and Violet now declare the playback-rate state used by their APIs. `engine.js` returns the API result directly from the palette setter instead of relying on detached `this` binding.
- `apple.css` uses the existing blue-hover token for the primary dialog close control to meet the measured normal-text contrast threshold. The measured white-on-`#0071E3` ratio was 4.70:1.
- Experiment slider/control hit areas are at least 44 CSS px high.
- The 12 original flower modules in `flowers/` and `audio/avril-14th.mp3` are unchanged.
- No runtime third-party dependency or framework was added.

## 5. Verification summary

See `verification/test-summary.md`, `verification/browser-matrix.md`, screenshots, and raw logs. Highlights:

- JavaScript syntax: 23/23 PASS.
- CSS parsing: 3/3 PASS.
- Local resources inventoried: 26/26 present.
- HTTP resource requests: 28/28 PASS, repeated from the final ZIP after extraction into a clean directory.
- Post-extraction browser smoke: PASS on desktop, 320 px coarse-pointer mobile, and reduced-motion desktop. Each context retained 15 studies, 16 accessible canvas elements, 11 family options, working search/reset, and experiment reset with no page or console errors.
- Five Chromium contexts: no page errors, console errors, failed requests, or horizontal overflow in the recorded runs.
- Study Grid anchors: 15/15 valid.
- Study Pause/Resume/Replay/Palette controls: 15/15 PASS.
- Temporary experiment state and reset: 15/15 PASS.
- Failure isolation scenarios: PASS.
- Reduced-motion scheduler: paused with no pending RAF chain.
- Canvas comparison: 16/16 pixel-identical in the captured reduced-motion state.

Limitations: direct Playwright navigation to local HTTP returned `ERR_BLOCKED_BY_ADMINISTRATOR`, recorded as BLOCKED. The HTTP server itself served 28/28 resources successfully. Firefox, NVDA on Windows, and TalkBack on Android were not tested. Brave/Safari/VoiceOver/touch/physical audio remain owner-reported results from Audit006, not independent test results in this environment. The automated explicit-audio test stubs the `play()` method; it verifies user activation behavior, not physical audio output.

## 6. Antislop AFTER audit

| Guardrail | Result | Evidence / qualification |
|---|---|---|
| Design authority | PASS | `DESIGN-DIRECTION.md` preserved unchanged and treated as authority |
| R-02, authored UI copy | PASS | Newly authored UI copy contains no em dash; existing technical/design source documents were left intact rather than normalized |
| R-03 responsive | PASS | Five contexts including 320 px; no horizontal overflow |
| R-17 factual integrity | PASS | No fabricated performance metrics; botanical family information is documented with sources |
| R-18 testimonials | PASS | No fabricated testimonials or customer claims added |
| R-23 visual assets | PASS | No new image/illustration assets were generated or added |
| R-24 link integrity | PASS | No broken internal anchor targets in the final DOM check |
| R-25 contrast | PASS for measured changed/new controls | The measured primary close control is 4.70:1; listed added controls were measured and exceed 4.5:1. This is not a full automated audit of every existing text pixel in all states |
| R-26 functional controls | PASS | Search/reset, 15 study controls, experiment modal controls, and explicit audio activation tested |
| R-27 empty/error state | PASS | Search empty state and renderer failure/disabled state verified |
| R-32 keyboard/focus | PASS | Tab focus-visible, keyboard operation, Escape close, and focus restoration tested |
| R-35 interaction testing | PASS with limitation | Interactions run in Playwright; local HTTP browser navigation BLOCKED and reported separately |
| R-39 accessibility behavior | PASS for tested controls | Labels, focus, reduced motion, and 44 px experiment controls verified; screen-reader tests remain not tested |
| R-40 performance integrity | PASS | Scheduler callbacks and hidden/reduced-motion states instrumented; no unsupported FPS or CPU claim made |

Purpose Gate: all new controls have a functional purpose tied to exploring the 15 studies or safely adjusting a selected generative study. No generic dashboard, promotional panel, or unrelated decoration was added.

Liveliness: ENERGY 2 / RHYTHM 2 / MOTION 3; botanical artwork remains the visual focal point; interface hierarchy remains quiet; the ASCII flower motif and existing typography/palette remain intact.

Craftsmanship and Quality Locks: static checks, edge cases, responsive viewports, keyboard interactions, reduced motion, renderer-failure scenarios, artwork pixel comparison, and post-build verification are included in the evidence.

## 7. License and publication status

This ZIP is a private owner delivery, not a public-release clearance. No source license was chosen. The MP3 remains unchanged. Public redistribution rights for the MP3 are not confirmed; see `PUBLICATION-STATUS.md` and `LICENSE-DECISION.md`.

## 8. Running the project

This is a static Vanilla HTML/CSS/JavaScript project. From the extracted project directory, start a local HTTP server (for example, `python3 -m http.server 8000`) and open `http://localhost:8000/`. See `README.md` for file structure and script order. Opening through a local HTTP server is preferred to avoid browser restrictions on local file URLs.
