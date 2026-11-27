# Browser and Accessibility Matrix

| Browser / assistive technology | Status | Notes |
|---|---|---|
| Chromium 144.0.7559.96, Playwright `page.set_content` | PASS | Five desktop/tablet/mobile/coarse/fine/reduced-motion contexts recorded |
| Chromium direct local HTTP navigation | BLOCKED | `page.goto` returned `ERR_BLOCKED_BY_ADMINISTRATOR`; static HTTP resource requests separately passed 28/28 |
| Brave | OWNER-REPORTED PASS | Owner-reported during Audit006; not independently repeated in this finalization environment |
| Safari macOS / iOS | OWNER-REPORTED PASS | Owner-reported during Audit006; not independently repeated here |
| Firefox | NOT TESTED | No claim of compatibility verification |
| VoiceOver | OWNER-REPORTED PASS | Owner-reported during Audit006 |
| NVDA on Windows | NOT TESTED | No screen-reader test performed |
| TalkBack on Android | NOT TESTED | No physical Android screen-reader test performed |
| Physical touch hardware | OWNER-REPORTED PASS | Owner-reported in Audit006; Playwright coarse pointer checks are emulation, not a physical-device substitute |
| Physical audio playback | OWNER-REPORTED PASS | Owner-reported in Audit006; automated `play()` test used a stub and only verified user activation behavior |

## Viewport matrix in Chromium harness

| Context | Viewport | Pointer / motion | Result |
|---|---:|---|---|
| Desktop | 1440 × 900 | Fine pointer, normal motion | PASS |
| Tablet | 1024 × 768 | Coarse pointer, normal motion | PASS |
| Mobile | 390 × 844 | Coarse pointer, normal motion | PASS |
| Narrow mobile | 320 × 740 | Coarse pointer, normal motion | PASS |
| Desktop reduced motion | 1440 × 900 | Fine pointer, reduced motion | PASS |

The browser harness uses `page.set_content` with the project CSS and scripts. It verifies browser DOM/canvas/runtime behavior but does not certify real device rendering, assistive-technology output, or physical touch hardware.
