import { Link, useSearchParams, useLocation } from 'react-router-dom'
import { CHANNEL_ORDER, CHANNELS } from '../data/channels.js'
import { setChannel, clearChannel } from '../hooks/useChannel.js'

/**
 * The signature wayfinding element. A thin, four-segment strip — one
 * segment per catalog channel — that sits under the header on every page.
 * Each segment is a real link to that category's filtered view, not
 * decoration: hovering previews the channel color across the page (the
 * ambient wash, focus rings, card glows all read the same variable), and
 * the segment for the currently active category grows slightly so the
 * rail always shows "where you are."
 */
export default function SpectrumRail() {
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const activeCategory = location.pathname === '/products' ? searchParams.get('category') : null

  return (
    <nav aria-label="Browse by channel" className="spectrum-rail" onMouseLeave={clearChannel}>
      {CHANNEL_ORDER.map((key) => {
        const ch = CHANNELS[key]
        const isActive = activeCategory === key
        return (
          <Link
            key={key}
            to={`/products?category=${encodeURIComponent(key)}`}
            onMouseEnter={() => setChannel(key)}
            onFocus={() => setChannel(key)}
            onBlur={clearChannel}
            title={`${ch.label} — ${ch.blurb}`}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`Browse ${ch.label}`}
            className={`bg-${ch.color} block`}
            style={{ flexGrow: isActive ? 1.6 : 1, opacity: isActive ? 1 : 0.82 }}
          />
        )
      })}
    </nav>
  )
}
