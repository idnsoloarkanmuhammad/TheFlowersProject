# DESIGN.md — Antislop Install UI Reference

> **Scope:** This document describes the visual language and presentation style of the Antislop installation pages, especially the Agents catalogue and the Claude Code guide. It covers appearance, hierarchy, spacing, surfaces, typography, and responsive presentation only. It is not a product specification and does not define installation logic or application behaviour.

## 1. Visual direction

The interface should feel like a **compact, editorial developer-documentation site**: calm, direct, technical, and intentionally understated. It should help a reader scan a page, understand where they are, and follow a structured guide without competing with the content.

The visual identity comes from hierarchy and disciplined spacing rather than decorative effects. Treat the interface as documentation with a clear navigation system, not as a marketing landing page or a data-heavy dashboard.

Core qualities:

- **Content first.** Headings, short descriptions, step labels, and code-oriented content carry the visual hierarchy.
- **Quiet surfaces.** Use restrained page surfaces and fine separators. Avoid unnecessary depth, large shadows, and ornamental containers.
- **Compact navigation.** Navigation labels should be easy to scan and should not dominate the page.
- **Purposeful emphasis.** Use accent colour and stronger weight only to identify selected, current, or important elements.
- **Technical character.** Monospaced typography belongs to commands and code. The rest of the interface should remain highly readable.
- **Low visual noise.** Avoid decorative elements that do not improve orientation or comprehension.

## 2. Page composition

### 2.1 Shared page frame

Use one consistent page frame for both the catalogue and detail-guide views.

- Keep the content inside a centered, readable container with stable horizontal gutters.
- Align the back link, breadcrumb, page heading, navigation, and main content to the same principal left edge.
- Keep the main reading column narrower than the full available viewport when presenting long-form instructions.
- Let catalogue content use more of the container width than paragraph-heavy guide content.
- Use vertical spacing to separate sections; avoid enclosing every section in an individual card.

The overall composition should feel orderly and document-like, with a clear top-to-bottom reading path.

### 2.2 Installation catalogue

The catalogue view is organised around a small category navigation followed by a page title and a collection of supported tools.

Visual hierarchy:

1. A modest back/navigation affordance.
2. A horizontal category switcher for **Agents**, **Plugins**, **Installers**, and **Single File**.
3. A prominent page heading.
4. One concise supporting line beneath the heading.
5. A catalogue/listing area containing the available agents.

The category switcher should read as navigation, not as a row of large promotional buttons. Give the selected category a clear but restrained active treatment. Keep inactive categories legible and visually quieter.

For the agent collection:

- Present entries in a consistent grid or compact list, depending on available width.
- Give each entry a clear name and a recognisable visual identifier where one exists.
- Keep card content brief and aligned consistently across the collection.
- Prefer a fine border or subtle surface shift over heavy shadows to distinguish an entry from the page.
- Keep card dimensions and internal padding consistent so the collection feels like one system.
- Do not add ratings, decorative statistics, or promotional badges unless they are part of the reference content.

### 2.3 Agent detail / installation guide

The detail view should feel like a focused documentation article, not a separate product landing page.

Recommended visual order:

1. Back link.
2. Breadcrumb showing the parent category and selected agent.
3. A compact identity row with the agent mark, small metadata labels, and the agent name.
4. A short explanatory description.
5. A horizontal section navigator for **Installation**, **Update**, **Remove**, and **Notes & Details**.
6. The guide content, organised into numbered steps and supporting notes.

Keep the identity row visually compact. The agent mark should identify the selected tool without becoming a large hero illustration. The page title should be the strongest typographic element in the opening area; metadata should remain secondary.

The section navigator should be visually distinct from the article body, but not oversized. It should communicate the current section using a restrained active state such as a stronger text colour, a thin underline, or a subtle filled background. Do not combine several active-state treatments at once.

### 2.4 Guide content hierarchy

Use a predictable document hierarchy:

- Page title: strongest heading on the page.
- Section title: clear and prominent, but subordinate to the page title.
- Step title: numbered and easy to locate while scanning.
- Supporting text: concise, comfortable to read, and left aligned.
- Notes: visually secondary, separated through spacing or a subtle surface/border treatment.
- Commands: visually isolated from prose and set in a monospace face.

Numbering should be functional and consistent. Use simple numerals or compact number markers rather than oversized decorative circles. A reader should be able to understand the order of the guide at a glance.

## 3. Colour system

The reference content confirms the presence of a distinct Claude identity graphic using a **muted blue-green field and warm coral mark**. Treat those hues as part of the tool identity asset, not as permission to turn the entire interface into a bright two-colour theme.

For the surrounding interface, preserve a restrained, role-based palette:

| Role | Direction |
| --- | --- |
| Page background | Neutral, visually quiet; use the actual page surface as the source of truth |
| Main text | High-contrast near-black or the darkest neutral in the reference |
| Secondary text | Mid-neutral with enough contrast to remain comfortably readable |
| Borders and dividers | Fine, low-contrast neutral lines |
| Card surface | Close to the page surface; distinguish mainly through border or a slight tonal shift |
| Active navigation | One clear accent treatment, used consistently |
| Focus state | Clearly visible and accessible; do not rely on colour alone |
| Tool identity | Preserve the original logo or agent artwork and its own colours |

**Do not invent a new brand palette.** The text-only page capture does not expose the exact CSS colour values, background treatment, or active-state colours. When reproducing the site closely, sample those values from the live rendered page rather than treating approximate colours as exact specifications.

Avoid:

- Multiple unrelated accent colours competing in the same viewport.
- Large decorative gradients behind headings or cards.
- Neon glows, blurred colour clouds, and glow-heavy focus effects.
- Using the Claude icon colours as universal colours for every agent.
- Low-contrast grey text for important instructions.

## 4. Typography

Use a restrained, highly legible sans-serif for interface text and a separate monospace treatment for commands and code.

### Interface typography

- Prefer a neutral modern sans-serif with clear letterforms.
- Use weight and size to establish hierarchy; do not rely on a different font family for every level.
- Keep page titles confident but not oversized like a marketing hero.
- Supporting descriptions should be quieter than headings while remaining easy to read.
- Navigation labels and metadata should be compact, with consistent casing and weight.
- Use normal sentence case for most labels. Reserve uppercase styling for short metadata only when the reference uses it.
- Keep line lengths comfortable. Long descriptions should not span the entire desktop viewport.

### Code typography

- Use a clear monospace typeface for terminal commands and code snippets.
- Preserve whitespace and line breaks inside code surfaces.
- Make code visually distinct from prose through typography and a restrained surface treatment.
- Avoid oversized terminal chrome, fake window controls, or decorative syntax elements unless they are visibly present in the reference.

Do not select a typeface solely because it is fashionable or commonly associated with AI-generated interfaces. Typography should support clarity and the site's developer-oriented character.

## 5. Spacing and layout rhythm

Use a consistent spacing scale and repeat it across catalogue cards, navigation, and guide sections.

- Keep tight spacing within related elements, such as a heading and its supporting line.
- Use a larger gap between separate sections than between elements inside one section.
- Give numbered steps enough separation to remain distinct when the page is scanned quickly.
- Keep card padding consistent across all catalogue entries.
- Use generous enough page gutters to prevent content from touching the viewport edge, especially on mobile.
- Avoid arbitrary one-off gaps. Reuse a small spacing scale so the page feels composed rather than assembled from unrelated blocks.

The intended rhythm is **compact within groups, spacious between groups**. Do not make every element equally distant from its neighbours.

## 6. Borders, surfaces, and shape language

The interface should rely on subtle structure rather than pronounced depth.

- Use thin, consistent dividers to separate navigation and content regions.
- Use borders sparingly to define catalogue entries, command surfaces, or grouped information.
- Keep corner radii consistent and restrained. Small-to-medium rounding is preferable to exaggerated pill shapes.
- Reserve fully rounded pills for compact metadata or labels where that shape is visibly appropriate.
- Avoid stacking multiple nested cards around a single piece of content.
- Avoid heavy drop shadows. If elevation is needed, it should be subtle and secondary to the border/surface distinction.

A component should look like part of the same interface even when it appears on a different page.

## 7. Component styling

### Back links and breadcrumbs

- Keep the back link small and unobtrusive, but make its interactive area comfortable.
- Render breadcrumbs as a quiet orientation aid above the main title.
- Use a subtle separator between breadcrumb levels.
- Give the current page the strongest breadcrumb emphasis; parent levels should remain secondary.

### Category tabs

- Keep the category tabs on one clear horizontal line at desktop widths.
- Use a consistent height, text style, and horizontal padding for each tab.
- Give the active tab a single obvious indicator.
- Keep inactive tabs quiet, but not faint or disabled-looking.
- On narrow screens, allow horizontal scrolling or a clean wrap rather than compressing labels until they become difficult to read.

### Agent entries / cards

- Treat the collection as a catalogue, not as a dashboard of metrics.
- Keep the icon or logo, title, and any short descriptor aligned consistently.
- Use the same visual structure for every agent entry.
- Hover feedback should be subtle: a slight border or surface change is enough.
- Avoid large illustrations, oversized logos, ornamental badges, or excessive card decoration.

### Metadata labels

- Use compact labels for agent type or installation category.
- Keep labels secondary to the page title.
- Use one consistent shape and typographic treatment for labels with the same meaning.
- Do not turn every small piece of metadata into a colourful badge.

### Numbered steps

- Place the step number close to its heading.
- Keep numbering and heading alignment consistent from one step to the next.
- Use spacing and typography to distinguish steps instead of enclosing every step in a large panel.

### Command and code surfaces

- Use a distinct, contained surface for terminal commands.
- Give code enough padding to remain readable without making the block visually dominant.
- Keep monospace text clearly legible and preserve command formatting.
- Use a restrained border or tonal contrast to distinguish the command area from explanatory prose.
- Any copy affordance should be compact and visually secondary to the command itself.

### Notes and callouts

- Present notes as part of the document, not as promotional alerts.
- Use a subtle border, background shift, or label to separate a note from the main instructions.
- Keep the treatment consistent for notes of the same importance.
- Reserve strong warning colours for genuinely important warnings; do not use them decoratively.

## 8. Interaction appearance

This section specifies only the visual states of controls.

- **Default:** calm and readable; no unnecessary ornament.
- **Hover:** small, immediate change in text, border, or surface tone.
- **Active/selected:** clearly distinguish the current tab or section with one consistent visual cue.
- **Focus-visible:** provide a high-contrast focus indicator that is easy to see on both light and dark surfaces.
- **Disabled:** reduce emphasis without making the label unreadable.

Transitions should be short and understated. Avoid bouncing, elastic motion, dramatic scaling, cursor trails, or decorative animations. Motion should never be required to understand the page hierarchy.

## 9. Responsive presentation

The design should retain its documentation-first character at every viewport width.

### Wide screens

- Use the available width for the catalogue grid, while keeping long-form guide text at a readable measure.
- Keep the category navigation and guide section navigation easy to scan.
- Preserve alignment between the page heading and the guide content.

### Tablet widths

- Reduce catalogue columns naturally as space becomes constrained.
- Keep tabs readable; do not force every label into a narrow fixed-width segment.
- Reduce outer gutters gradually rather than abruptly.

### Mobile widths

- Use comfortable side gutters and avoid horizontal page overflow.
- Collapse the agent catalogue into fewer columns or a single column.
- Allow navigation tabs to scroll horizontally or wrap cleanly.
- Keep headings readable without letting them occupy the entire first screen.
- Stack identity information when necessary while preserving its hierarchy.
- Ensure command surfaces fit the viewport; long commands may scroll within their own container rather than widening the page.
- Keep controls and links comfortably sized for touch.

## 10. Visual consistency rules

- A heading level must look the same wherever it appears.
- Navigation in the catalogue and detail view must feel related.
- Cards, labels, dividers, and code surfaces must use one shared shape and spacing language.
- Do not introduce a new colour or component style for an isolated section without a clear reason.
- Prefer one well-defined emphasis treatment over several simultaneous highlights.
- Maintain readable contrast in all text sizes and states.

## 11. Avoid these visual directions

Do not drift into generic AI-generated dashboard or SaaS styling. In particular, avoid:

- Oversized gradient hero sections.
- Random bento grids used only to fill space.
- Glassmorphism, blur panels, and translucent floating layers without a clear need.
- Neon accents, glowing outlines, and ambient colour orbs.
- Large rounded cards nested inside other rounded cards.
- Thick shadows and exaggerated elevation.
- Decorative emojis used as icons.
- Fake terminal windows with unnecessary browser or desktop chrome.
- Excessive badges, chips, counters, and status pills.
- Large display typography that overwhelms the documentation.
- Animations that distract from reading or navigation.

## 12. Reference fidelity note

The reviewed public pages expose the core visual hierarchy and page structure: category navigation, supported-agent catalogue, agent identity area, breadcrumb, guide-section navigation, numbered instructions, and code-oriented content. The Claude identity asset also provides a visible brand mark.

The available text-rendered page view does **not** expose the complete CSS or exact rendered measurements, font names, colour tokens, shadows, or responsive breakpoints. Therefore, this document records the observed design structure and a conservative styling direction without pretending those hidden values were measured. For pixel-level replication, use the live rendered pages as the final authority for exact tokens and dimensions.

## Reference pages

- [Claude Code installation guide](https://antislop.ai.id/install/claude-code?via=agent)
- [Install catalogue — Agents](https://antislop.ai.id/install?tab=agents)
