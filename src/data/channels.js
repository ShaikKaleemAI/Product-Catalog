/**
 * The spectrum: fixed metadata for each FakeStoreAPI category, treated as a
 * "channel" in the catalog's index/broadcast concept. Colors are read from
 * CSS variables set in index.css so light/dark themes stay in sync with
 * Tailwind's generated classes (bg-circuit, text-ember, etc).
 *
 * `blurb` is real UI copy — it appears on category tiles and the product
 * detail spec sheet, so it stays short, plain, and specific rather than
 * marketing filler.
 */
export const CHANNELS = {
  electronics: {
    key: 'electronics',
    label: 'Electronics',
    name: 'Circuit',
    color: 'circuit',
    blurb: 'Powered goods, tested to spec.'
  },
  jewelery: {
    key: 'jewelery',
    label: 'Jewelery',
    name: 'Ember',
    color: 'ember',
    blurb: 'Precious weight, small dimensions.'
  },
  "men's clothing": {
    key: "men's clothing",
    label: "Men's Clothing",
    name: 'Moss',
    color: 'moss',
    blurb: 'Cut for daily wear.'
  },
  "women's clothing": {
    key: "women's clothing",
    label: "Women's Clothing",
    name: 'Clay',
    color: 'clay',
    blurb: 'Structured softness.'
  }
}

export function channelFor(category) {
  return CHANNELS[category] || null
}

// Ordered list, used anywhere the four channels render in a fixed sequence
// (the spectrum rail, the hero tiles).
export const CHANNEL_ORDER = ['electronics', 'jewelery', "men's clothing", "women's clothing"]

// Reads back the --c-<color> CSS variable for a channel so JS can set
// --channel inline (e.g. on hover) without hardcoding hex values twice.
export function channelCssVar(category) {
  const ch = channelFor(category)
  return ch ? `var(--c-${ch.color})` : 'var(--ink)'
}
