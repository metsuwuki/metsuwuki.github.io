# K✦GAMI Nexus implementation notes

## Architecture retained

- React 18 + TypeScript + Vite remains the frontend architecture.
- GitHub Pages remains the static host and the existing `/gta5rp` route remains the K✦GAMI entry point.
- Framer Motion remains the only JavaScript animation runtime. CSS transforms handle pointer lighting, orbit motion, and reduced-motion fallbacks. GSAP, Lenis, Motion, Three.js, and React Three Fiber were evaluated but not added because they duplicate existing responsibilities or add cost without a required effect.
- Cloudflare Worker + D1 is isolated under `cloudflare/` and deploys independently from GitHub Pages.

## React Bits adaptation

The requested [Reflective Card](https://reactbits.dev/components/reflective-card) and [Circular Gallery](https://reactbits.dev/components/circular-gallery) patterns were implemented as local React/TypeScript rather than installed through the shadcn registry. The local versions retain pointer reflection, drag/wheel selection, keyboard arrows, buttons as non-drag alternatives, touch support, and reduced-motion behavior while matching the existing application-card data and dependency policy.

## Animation and accessibility

- Hero layers use transform-only pointer parallax and stop reacting under reduced motion.
- Section entrances use the existing Framer Motion lazy runtime.
- Application and K✦GAMI galleries work with pointer drag, wheel, touch, arrow keys, and explicit previous/next buttons.
- Navigation tracks the active section with IntersectionObserver and exposes an accessible mobile menu.
- Focus rings, semantic headings, live carousel changes, real anchors, safe text rendering, and `prefers-reduced-motion` are preserved.

## Data semantics

- A page view is an accepted path view once per session/path/30-minute bucket.
- A session is a browser-generated random identifier refreshed after 30 minutes of inactivity.
- A unique visitor is a stable browser-generated random identifier HMAC-hashed by the Worker before persistence.
- A returning visit is a known pseudonymous visitor observed in a later browser session.
- IP addresses are never stored raw; only keyed hashes are used for short rate-limit windows.
- The legacy export contains last-seen visitor snapshots but no historical page-view events. The import preserves 234 available visitor rows and does not label or synthesize them as historical page views.

## External workflow research

BuildWithClaude resources for frontend design, accessibility, dependency auditing, API security, CI, and Playwright were reviewed as untrusted third-party methodology. Their `/plugin` commands target Claude Code and are not directly installable as Codex plugins. Applicable practices were implemented natively: repository-first design decisions, WCAG input alternatives, `npm audit`, server-side validation, explicit CORS, Playwright device/reduced-motion coverage, and CI validation. No third-party Claude plugin was installed.
