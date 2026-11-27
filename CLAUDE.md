## The Flowers Project — project guardrails

- `DESIGN-DIRECTION.md` is the authoritative design and implementation direction for The Flowers Project v4. Read it before any UI, interaction, visual, or content change.
- Preserve the existing v4 identity and implementation. Do not redesign, replace the palette or typography, alter artwork or animation character, or add decorative features without a concrete project requirement.
- Keep Vanilla JavaScript and the existing renderer boundaries. Prefer a small, local change over broad refactoring; do not modify unrelated files.
- `DESIGN.md` is a legacy Antislop installation-interface reference, not the botanical project's design specification. It must not override `DESIGN-DIRECTION.md`.
- Separate visual, accessibility, and performance changes. Capture a baseline first, verify affected behaviour afterwards, and document checks that could not be run.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.claude/skills/antislop/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->
