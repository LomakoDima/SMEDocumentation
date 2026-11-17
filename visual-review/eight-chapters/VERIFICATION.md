# Eight-chapter homepage

The homepage now contains exactly eight semantic sections marked `data-home-slide="1"` through `"8"`. At a 1440×1000 desktop viewport, each scene is 1000px high and the whole document is about 8512px including the shared footer. The initial three scenes retain their connected sticky sequence; the next five use natural scrolling and independent ScrollTriggers.

| Chapter | Content | Animation |
| --- | --- | --- |
| 1 | StoryModEngine overview | WebGL flow and staggered typography entrance |
| 2 | Actual VFX Editor capture | Field-to-screenshot dissolve, scale and clipped reveal |
| 3 | Actual in-game particle capture | Full-viewport image expansion and parallax |
| 4 | Level Editor | Opposing text directions inside clipped word windows |
| 5 | NPC Editor | Circular background iris and perspective word settlement |
| 6 | SME Scripting | Scroll-drawn SVG paths connecting editor content; returning WebGL field |
| 7 | Documentation | Perspective page-row reveals, heading wipe and working search |
| 8 | Setup | Rising warm background, title entrance, compatibility number and actions |

Level/NPC scenes use documented descriptions and typography, not invented product imagery. The scripting diagram communicates the documented relationship between editor content and SME Scripting; it does not pretend to be an engine interface or show unverified syntax. The two original engine captures remain unchanged.

`MoreChapters.tsx` contains chapters 4–8, reusing the real DocsSearch component and existing docs/download routes. Animation lifecycle remains inside the existing scoped `gsap.matchMedia` context. Reduced-motion and short-height fallbacks leave all content in normal flow, with no clipped or transparent text. The second WebGL instance pauses offscreen; browser inspection confirmed that the original instance is paused while the scripting instance runs. Both manual pause buttons share the same state.

## Verification

- Production build, TypeScript, formatting and all ten existing tests pass.
- Browser review at 1440×1000, 390×844 and 320×740. Exactly eight sections confirmed and no horizontal page overflow found.
- All five new desktop chapters and their mobile compositions inspected. Mobile sections can grow beyond a viewport when needed, preserving content rather than clipping it.
- Script path dash offsets reach zero after reveal. Setup wash reaches full scale and the compatibility value reaches full opacity.
- Documentation search was opened on the homepage, queried for `requirements`, and returned the expected real documentation results. Escape closes the dialog.
- Actual browser screenshots in this directory cover Level Editor, NPC Editor, SME Scripting, documentation and setup on desktop/mobile. These are website review captures; original product asset provenance remains in `../modern/VERIFICATION.md`.
