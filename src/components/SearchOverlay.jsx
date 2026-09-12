import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts.js'
import { formatPrice, titleCase, truncate } from '../utils/format.js'

export default function SearchOverlay({ open, onClose, onSubmit }) {
  const { products } = useProducts()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      // wait for the mount animation frame before focusing
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products
      .filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, products])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink/40 backdrop-blur-sm px-4 pt-[10vh] sm:pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Search products"
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-rule bg-bg shadow-2xl"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSubmit(query.trim())
              }}
              className="flex items-center gap-3 border-b border-rule px-5 py-4"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 text-ink-muted">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search the catalog…"
                className="w-full bg-transparent font-display text-lg text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="eyebrow flex-shrink-0 rounded-full border border-rule px-2.5 py-1 text-ink-muted hover:text-ink"
              >
                Esc
              </button>
            </form>

            <div className="max-h-[55vh] overflow-y-auto">
              {query.trim() === '' && (
                <p className="px-5 py-8 text-center text-sm text-ink-muted">
                  Search by product name or category — try "jacket" or "electronics".
                </p>
              )}

              {query.trim() !== '' && results.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-ink-muted">
                  Nothing matches "{truncate(query, 30)}". Try a different term.
                </p>
              )}

              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-bg-subtle"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-bg-subtle p-1.5">
                    <img src={p.image} alt="" className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{p.title}</p>
                    <p className="text-[11px] uppercase tracking-wide text-ink-muted">{titleCase(p.category)}</p>
                  </div>
                  <span className="flex-shrink-0 font-mono text-sm tabular-nums text-ink">{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>

            {results.length > 0 && (
              <button
                type="button"
                onClick={() => onSubmit(query.trim())}
                className="eyebrow w-full border-t border-rule px-5 py-3.5 text-center text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
              >
                See all results for "{truncate(query, 24)}" →
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
