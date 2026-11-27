# Verification evidence

This directory contains the before/after screenshots and machine-readable test outputs generated during finalization.

- `screenshots/before/` contains the canonical Baseline B captures.
- `screenshots/after/` contains the final-build captures.
- `screenshots/experiments/` contains selected desktop and 320 px dialog states.
- `logs/browser-contexts/` contains per-context baseline/final observations.
- `logs/raw-results/` contains interaction, lifecycle, accessibility, artwork, and feature test outputs.
- `logs/failure-tests/` contains deliberate fault-injection results.
- `logs/http/` contains static-resource HTTP checks and the blocked Chromium navigation result.
- `logs/raw-results/post-extraction-smoke.json` records the smoke test run against the project after extracting the final ZIP into a clean directory.

Chromium was run through Playwright `page.set_content` for the main browser suites. Direct navigation to local HTTP was attempted and returned `ERR_BLOCKED_BY_ADMINISTRATOR`; it is explicitly recorded as BLOCKED. The static HTTP server itself responded successfully to 28/28 requested resources. Firefox, NVDA, and TalkBack were not tested.
