import { motion } from 'framer-motion'
import { titleCase } from '../utils/format.js'
import { channelFor } from '../data/channels.js'
import { setChannel, clearChannel } from '../hooks/useChannel.js'

export default function CategoryFilter({ categories, active, onChange, counts = {} }) {
  const all = ['all', ...categories]

  return (
    <div
      className="no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full bg-bg-subtle p-1"
      role="group"
      aria-label="Filter by category"
      onMouseLeave={clearChannel}
    >
      {all.map((cat) => {
        const isActive = active === cat
        const ch = channelFor(cat)
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            onMouseEnter={() => (ch ? setChannel(cat) : undefined)}
            aria-pressed={isActive}
            className="relative flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors"
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className={`absolute inset-0 rounded-full ${ch ? `bg-${ch.color}` : 'bg-ink'}`}
              />
            )}
            <span className={`relative z-10 inline-flex items-center gap-1.5 whitespace-nowrap ${isActive ? 'text-bg' : 'text-ink-muted hover:text-ink'}`}>
              {cat === 'all' ? 'All' : titleCase(cat)}
              {typeof counts[cat] === 'number' && (
                <span className={`font-mono text-[10px] tabular-nums ${isActive ? 'text-bg/60' : 'text-ink-muted/60'}`}>
                  {counts[cat]}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
