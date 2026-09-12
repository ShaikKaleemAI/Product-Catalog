# Design notes — v1 → v2

## What v1 already did well

- CSS-variable theming (not hardcoded colors), a real dark mode.
- A disciplined type system (display serif + body sans + mono for data).
- Genuine micro-interactions: pointer-tilt product cards, a fly-to-cart
  animation, cart-bump feedback.
- Mature state handling: skeletons, error/retry, empty states, URL-synced
  filters, reduced-motion support, visible focus rings.

That groundwork is why v2 could focus entirely on *concept and depth*
rather than re-solving state management or accessibility basics.

## What v2 changed, and why

**1. Gave the catalog a real point of view.**
v1's "numbered index" concept was well-executed but decorative — the
numbers didn't change what you could *do*. v2 keeps the archival numbering
(it's still a real position in a real filtered list) and adds a second,
functional layer on top: FakeStoreAPI's four categories become four
color-coded "channels" (Circuit, Ember, Moss, Clay), and that color is
live navigational state (`--channel`), not a palette choice.

**2. One signature element, used everywhere consistently.**
The spectrum rail is the single boldest visual idea, and it's echoed
everywhere: page wash, card hover glow, active filter pill, focus rings,
detail-page spec sheet. Per the "spend your boldness in one place"
principle, nothing else in the UI competes with it for attention.

**3. Filled the biggest engineering gaps.**
v1 had a fully working cart but no checkout, and no tests. v2 adds:
- A three-step checkout (shipping → review → confirmation) with real
  client-side validation and honest copy about what it does and doesn't do.
- Unit tests for the cart reducer and formatting utilities, with the
  reducer extracted into a pure module specifically so it's testable.

**4. Small but real accessibility upgrades.**
A skip-to-content link, a `main` landmark, and dark mode that now respects
`prefers-color-scheme` on first visit instead of hardcoding light — small
changes, but the kind reviewers actually check.

## What's still a known gap (see README > Honest limitations)

Product photography and copy are still FakeStoreAPI's originals. Making
those match the "channel" concept end-to-end (fully custom product data,
photography treated consistently) is the highest-leverage next step if this
project keeps evolving — everything else here is in service of that once
it exists.

## Verification note

This redesign was built and reviewed by reading and writing the source
directly; it was **not** run through a live browser or `npm run build` in
this environment (no network access to install dependencies here). Every
file was checked for syntax and brace/paren balance, and the logic was
traced by hand, but please run `npm install && npm run dev` (and
`npm test`) locally before treating it as verified.
