# Test Summary

Date: 27 November 2026
Project: The Flowers Project v4
Canonical baseline: Baseline B, Audit004 working-tree snapshot plus Audit008 Study Rail integration

## Summary

| Area | Result | Evidence / scope |
|---|---|---|
| Canonical source hash | PASS | SHA-256 matched `2327a36ace0c9ff57944be5580c516bd7c3cef2af7290d8a5988b94c742da3da` |
| JavaScript syntax | PASS | 23/23 files passed `node --check` |
| CSS parsing | PASS | 3/3 project stylesheets parsed without errors |
| Local resource inventory | PASS | 26/26 local resources present |
| HTTP resource requests | PASS | 28/28 requests returned successfully from the extracted final ZIP |
| Post-extraction smoke | PASS | Extracted archive served 28/28 resources; Playwright `page.set_content` smoke passed on desktop, 320 px coarse-pointer mobile, and reduced-motion desktop |
| Chromium context suite | PASS | 5 contexts; zero page errors, console errors, or failed requests in the recorded suite |
| Study Grid | PASS | 15/15 study targets valid |
| Study controls | PASS | 15/15 studies passed Pause, Resume, Replay, and Palette interaction checks |
| Study search and filters | PASS | Common/scientific name partial matching, family filtering, empty state, reset, keyboard shortcut isolation |
| Experiment dialog | PASS | Labels, focus return, Escape close, 44 px controls, viewport containment at 1440, 1024, 390, and 320 px |
| Experiments across studies | PASS | 15/15 studies accepted a temporary palette/rate adjustment and restored defaults on close |
| Reduced motion | PASS | All renderers paused; no pending RAF chain; experiment changes did not wake animation |
| Scheduler lifecycle | PASS | 12 rapid pause/resume/replay cycles; hidden-document freeze and resume verified |
| Failure isolation | PASS | Engine/custom context failures, draw failure, and missing IntersectionObserver fallback tested |
| Canvas artwork fidelity | PASS | 16/16 canvases were pixel-identical between Baseline B and final at the captured reduced-motion state |
| Explicit audio consent | PASS | Audio source remains unloaded until explicit user activation; no autoplay |
| Browser navigation via local HTTP | BLOCKED | Playwright `page.goto` returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`; not treated as PASS |
| Firefox | NOT TESTED | Browser unavailable in this execution environment |
| NVDA on Windows | NOT TESTED | Screen-reader/device test not performed |
| TalkBack on Android | NOT TESTED | Physical-device test not performed |
| Physical audio playback | OWNER-REPORTED PASS / NOT INDEPENDENTLY VERIFIED | Owner reported physical playback during Audit006; automated test used a stub for `play()` |

## Browser contexts

Chromium 144.0.7559.96 via Playwright `page.set_content`:

- Desktop fine pointer: 1440 × 900
- Tablet coarse pointer: 1024 × 768
- Mobile coarse pointer: 390 × 844
- Narrow mobile coarse pointer: 320 × 740
- Desktop with reduced motion: 1440 × 900

All five recorded contexts had 15 study targets, 16 accessible canvas labels, no horizontal overflow, no page errors, no console errors, and no failed resource requests. Coarse pointer hides the Study Rail; the fine-pointer baseline remains unchanged.

## Scheduler interpretation

The project uses the shared FlowerEngine scheduler and a separate Lily scheduler. Tests observed at most two pending RAF callbacks together, one per scheduler; they do not support a claim of one global RAF callback across the entire project. Pausing both schedulers reduced pending callbacks to zero.

## Contrast measurements

Measured added/modified interface elements: search/select text 16.61:1; filter reset 6.96:1; experiment title 18.31:1; experiment reset 6.61:1; primary close button white on the existing blue-hover token 4.70:1; pace output 18.31:1. These are measurements of the listed elements, not a claim that every text pixel in every state was automatically audited.
