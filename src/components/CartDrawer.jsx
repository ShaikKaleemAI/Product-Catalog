import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { formatPrice } from '../utils/format.js'
import QuantityStepper from './QuantityStepper.jsx'

export default function CartDrawer({ open, onClose }) {
  const { items, subtotal, itemCount, setQuantity, removeItem, isInCart, addItem, MIN_QTY, MAX_QTY } = useCart()
  const { products } = useProducts()

  const itemCategories = new Set(items.map((i) => i.category))
  const recommendations = products
    .filter((p) => itemCategories.has(p.category) && !isInCart(p.id))
    .slice(0, 3)

  // Free-shipping-style progress nudge -- replaces dead space with a reason
  // to add one more thing, purely presentational.
  const THRESHOLD = 75
  const progress = Math.min(1, subtotal / THRESHOLD)
  const remaining = Math.max(0, THRESHOLD - subtotal)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-ink/30 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-label="Cart"
            className="fixed right-0 top-0 z-[95] flex h-full w-full max-w-sm flex-col bg-bg shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-rule px-6 py-5">
              <h2 className="font-display text-xl text-ink">
                Cart <span className="font-mono text-sm text-ink-muted">({itemCount})</span>
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-bg-subtle hover:text-ink"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <EmptyCartIllustration />
                <p className="font-display text-lg text-ink">Your cart is empty</p>
                <p className="text-sm text-ink-muted">Add something from the catalog to get started.</p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="eyebrow mt-2 rounded-full bg-ink px-5 py-2.5 text-bg transition-transform hover:-translate-y-0.5"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  <div className="pt-5">
                    {remaining > 0 ? (
                      <p className="eyebrow text-ink-muted">
                        {formatPrice(remaining)} away from free shipping
                      </p>
                    ) : (
                      <p className="eyebrow text-channel">Free shipping unlocked</p>
                    )}
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle">
                      <motion.div
                        className="h-full rounded-full bg-ink dark:bg-channel"
                        initial={false}
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                      />
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-5 flex gap-4 border-b border-rule pb-5"
                      >
                        <Link
                          to={`/products/${item.id}`}
                          onClick={onClose}
                          className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg bg-bg-subtle p-2.5"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate font-display text-sm text-ink">{item.title}</h3>
                          <span className="mt-0.5 block font-mono text-xs text-ink-muted">
                            {formatPrice(item.price)}
                          </span>
                          <div className="mt-2 flex items-center justify-between">
                            <QuantityStepper
                              value={item.quantity}
                              onChange={(q) => setQuantity(item.id, q)}
                              min={MIN_QTY}
                              max={MAX_QTY}
                            />
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              aria-label={`Remove ${item.title}`}
                              className="text-xs text-ink-muted transition-colors hover:text-sale"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {recommendations.length > 0 && (
                    <div className="mt-8 border-t border-rule pt-5">
                      <p className="eyebrow mb-3 text-ink-muted">Pairs well with your cart</p>
                      <div className="space-y-3">
                        {recommendations.map((p) => (
                          <div key={p.id} className="flex items-center gap-3">
                            <Link
                              to={`/products/${p.id}`}
                              onClick={onClose}
                              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-bg-subtle p-2"
                            >
                              <img
                                src={p.image}
                                alt={p.title}
                                className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                              />
                            </Link>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs text-ink">{p.title}</p>
                              <p className="font-mono text-xs text-ink-muted">{formatPrice(p.price)}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem(p, 1)}
                              className="eyebrow flex-shrink-0 rounded-full border border-rule px-3 py-1.5 text-ink transition-colors hover:border-ink"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="h-5" />
                </div>

                <div className="border-t border-rule px-6 py-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-ink-muted">Subtotal</span>
                    <span className="font-mono text-base text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="eyebrow flex w-full items-center justify-center rounded-full bg-ink px-6 py-3.5 text-bg transition-transform hover:-translate-y-0.5"
                  >
                    View cart →
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

function EmptyCartIllustration() {
  return (
    <motion.svg
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="44" cy="44" r="43" className="stroke-rule" strokeWidth="1" strokeDasharray="3 4" />
      <path
        d="M28 34h32l-3 24a4 4 0 0 1-4 3.5H35a4 4 0 0 1-4-3.5l-3-24Z"
        className="stroke-ink-muted"
        strokeWidth="1.6"
        fill="none"
      />
      <path d="M34 34v-4a10 10 0 0 1 20 0v4" className="stroke-ink-muted" strokeWidth="1.6" fill="none" />
      <motion.circle
        cx="44"
        cy="47"
        r="1.6"
        className="fill-ink-muted"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  )
}
