# StoryModEngine design rethink

## Structure and identity

The homepage is a product handbook: an introduction to StoryModEngine, a selectable index of its actual tools, and practical entry points into the existing documentation and downloads. The toolkit explorer is website navigation, not a mock engine interface. It supports click, arrow keys, Home and End, linked tab/panel semantics, and visible focus.

The header keeps the existing S mark, introduces a readable mixed-case wordmark, groups reference navigation separately from GitHub and the download action, and provides a mobile navigation menu. Tools and changelog pages now provide useful links rather than only a placeholder heading.

Routing, the Markdown documentation loader, version switching, search and GitHub release/download logic are retained.

## Design system

- Foundation: near-black `#111315` and charcoal `#191C1F`.
- Orange `#FF8850`: actions, links, selected controls, previews and error states.
- Green `#A4C7A5`: confirmed compatibility and stable release status.
- Off-white `#F2F1ED` and neutral gray `#ADB1B5`: text and secondary information.
- Space Grotesk variable: headings and identity. Manrope variable: body text. Both are hosted locally with licenses.
- Desktop body copy is generally 16–18px; mobile body copy is 16px. Smaller text is reserved for navigation, secondary context and legal information.
- Sentence-case headings, no display condensation, no decorative metadata, no fabricated code samples, no glow or background grid.

## Product asset audit

Searched `src`, `public`, documentation, project text and `visual-review` for screenshots, image references and recordings.

- The former, unverified hero concept image has been removed from the project. Current product captures live in `public/product/` and `src/assets/docs/screenshots/`.
- The four existing `visual-review/redesign-*.png` images are screenshots of the previous website, not engine captures. They are not product assets.
- No authentic engine recordings or independently verifiable engine screenshots were found.
- Earlier user-supplied visual references are not present in this checkout. The implementation follows the color relationships and quality requirements in the current brief.

No replacement imagery, invented editor UI or guessed SME syntax has been created. The site uses a complete text-first layout without empty screenshot frames or production-facing asset requests.

## Captures needed for a future product showcase

1. A direct, unretouched capture of the actual Level Editor running in Minecraft Java Edition 1.20.1, with its real controls visible and a project being edited. Prefer 1920×1080 or higher.
2. Matching real NPC Editor and VFX Editor captures, each showing the tool in use. Record the engine build/version and capture source for each file.
3. Optional: a short recording (roughly 20–40 seconds) of a real editing workflow, with permission to publish any world/content shown. Supply an unaltered source video and a representative frame.
4. Any scripting example must be verified against the actual engine before being published; the existing specification is marked pending.

Use genuine captures as content on their own terms. Do not overlay invented controls or replace game/editor contents with generated imagery.

## Verification

- Production build: `npm run build` passed.
- TypeScript: `npx tsc --noEmit` passed.
- Existing tests: `npm test` passed (6 tests across routing and release handling).
- Browser review: desktop at 1440px, mobile at 390px and a 320px narrow-screen width check. No horizontal overflow was found on the homepage.
- Checked toolkit selection with pointer and keyboard (including Home/End), mobile navigation and Escape dismissal, documentation search and Enter navigation, the tools index, and the live download page’s unavailable-repository state.
- Existing release tests cover empty/private repositories, API failures, stable versus preview selection and ambiguous download assets. No release information or downloads were fabricated for the review.
- New website review screenshots: `rethink-home-desktop.jpg` and `rethink-home-mobile.jpg`. These are captures of the redesigned website, not product footage.
