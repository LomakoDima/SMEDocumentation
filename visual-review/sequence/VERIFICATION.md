# Homepage: one continuous creation sequence

## Scope and composition

Only the homepage is restructured. Existing header, footer, routes, Markdown docs, release logic and other pages are retained. The homepage’s scoped stylesheet is linked from the home route. GSAP and Motion are installed through npm and recorded in package-lock.json.

The initial WebGL field, editor capture and in-game capture share one native sticky stage. One GSAP ScrollTrigger timeline binds their transitions to ordinary page scroll: the introduction recedes, the actual editor capture resolves from the moving field, and the real game capture expands into the viewport. Scroll works in both directions, without wheel interception, snapping or forced smooth scrolling. Persistent links let keyboard and pointer users jump to the overview, editor or game state.

The previous gallery, feature tabs, repeated setup links and closing strip are removed from the homepage. A large linked paragraph introduces the other documented tools and provides practical downloads/docs access. No card grid, counters, invented engine UI or filler sections were introduced.

## Implementation

- `src/components/home/HomeExperience.tsx`: real content, semantic scenes, navigation, Motion control interactions and pause state.
- `src/components/home/useHomeSequence.ts`: client-loaded GSAP/ScrollTrigger, scoped matchMedia lifecycle, continuous transitions and entrance reveals. Context cleanup reverts inline styles and removes this page’s triggers on navigation.
- `src/components/home/home.css`: homepage-only composition, mobile layout and baseline document flow.
- The existing `HalftoneFlow.tsx` remains the background renderer derived from the supplied `prompt.txt`. The engine PNG files remain unchanged and keep their original capture links.
- The shader’s portrait sampling offset brings the moving field into the narrow-screen composition. Pointer coordinates receive the same offset, preserving the bloom’s alignment. Its GPU limits, pause, fallback and lifecycle behavior are retained.
- Motion uses LazyMotion and the smaller animation feature set. GSAP/ScrollTrigger load on the client, and no scroll-trigger code executes during SSR.

Reduced motion disables the sticky sequence and its large transforms. Short viewports under 700px also get the complete ordinary page. With no JS or unavailable animation chunks, all scenes are present in normal flow. WebGL keeps its static fallback and manual pause, and automatically stops when the final game scene covers it.

## Visual verification

Reviewed the live site in the browser at 1440×1000, 390×844 and 320×740. Also checked the ordinary-flow fallback at 1440×650. All three scenes remain visible in that fallback, and the stage returns to relative positioning.

The editor state was verified at desktop scroll 1012px (46% of the 2200px scene range) and mobile scroll 738px (46% of the mobile range). The editor opacity is 1, its screenshot is undistorted, and original-size/reference links remain available. The game state reaches full opacity, its copy is readable and WebGL changes to paused. Returning to the overview restores the animated field. Width checks found no horizontal overflow; at 320px the actions end before the persistent scene controls.

The stage uses `overflow: clip` rather than a hidden-overflow scroll container, preventing focus on the persistent navigation from internally scrolling the stage and pushing the editor heading under the header. Repeated scene switching was checked after this correction. Navigating to Download removes the home scene and returns the route to normal document scroll.

Screenshots in this directory capture separate scroll states; a conventional full-page screenshot would misrepresent the sticky timeline. Original product capture provenance is documented in `../modern/VERIFICATION.md`.

## Validation

Production build, TypeScript and the existing ten routing/release/WebGL lifecycle tests pass. Browser checks cover scene links, reverse scroll, release into the remaining content, viewport changes and the short-height fallback.

API references used: [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [Motion accessibility](https://motion.dev/docs/react-accessibility).
