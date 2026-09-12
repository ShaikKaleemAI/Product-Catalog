import { CHANNEL_ORDER, CHANNELS } from '../data/channels.js'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <p className="font-display text-lg italic text-ink">Index Four</p>
          <p className="eyebrow mt-1 text-ink-muted">A catalog in four channels</p>
        </div>
        <div className="flex items-center gap-4">
          {CHANNEL_ORDER.map((key) => (
            <span key={key} className="flex items-center gap-1.5 text-xs text-ink-muted">
              <span className={`h-1.5 w-1.5 rounded-full bg-${CHANNELS[key].color}`} aria-hidden="true" />
              {CHANNELS[key].name}
            </span>
          ))}
        </div>
        <p className="text-sm text-ink-muted">
          Product data courtesy of FakeStoreAPI. Built for demonstration purposes.
        </p>
      </div>
    </footer>
  )
}
