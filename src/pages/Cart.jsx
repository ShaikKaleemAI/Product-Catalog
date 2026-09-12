import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice, titleCase } from '../utils/format.js'
import QuantityStepper from '../components/QuantityStepper.jsx'
import StateNotice from '../components/StateNotice.jsx'

export default function Cart() {
  const { items, subtotal, itemCount, setQuantity, removeItem, clearCart, MIN_QTY, MAX_QTY } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <StateNotice
          eyebrow="Your cart"
          title="No items filed yet"
          description="Add something from the catalog to start an order."
          actionLabel="Browse products"
          onAction={() => navigate('/products')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <span className="eyebrow text-ink-muted">Order Summary</span>
          <h1 className="mt-2 font-display text-4xl text-ink">Your Cart</h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="eyebrow text-ink-muted transition-colors hover:text-sale"
        >
          Clear all
        </button>
      </div>

      <div className="border-t border-rule">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4 border-b border-rule py-6 sm:flex-row sm:items-center"
            >
              <Link
                to={`/products/${item.id}`}
                className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-bg-subtle p-3"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                />
              </Link>

              <div className="flex-1">
                <span className="eyebrow text-ink-muted">{titleCase(item.category)}</span>
                <Link to={`/products/${item.id}`} className="block">
                  <h3 className="mt-1 font-display text-base text-ink hover:underline">{item.title}</h3>
                </Link>
                <span className="mt-1 block font-mono text-sm text-ink-muted">{formatPrice(item.price)} each</span>
              </div>

              <div className="flex items-center gap-6">
                <QuantityStepper
                  value={item.quantity}
                  onChange={(q) => setQuantity(item.id, q)}
                  min={MIN_QTY}
                  max={MAX_QTY}
                />
                <span className="w-20 text-right font-mono text-sm tabular-nums text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.title} from cart`}
                  className="text-ink-muted transition-colors hover:text-sale"
                >
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex flex-col items-end gap-2">
        <div className="flex w-full max-w-xs justify-between text-sm text-ink-muted sm:w-64">
          <span>
            Subtotal · {itemCount} item{itemCount === 1 ? '' : 's'}
          </span>
          <span className="font-mono text-ink">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex w-full max-w-xs justify-between text-sm text-ink-muted sm:w-64">
          <span>Shipping</span>
          <span className="text-ink">Calculated at checkout</span>
        </div>
        <div className="mt-2 flex w-full max-w-xs justify-between border-t border-rule pt-3 text-base font-medium sm:w-64">
          <span className="text-ink">Total</span>
          <span className="font-mono text-ink">{formatPrice(subtotal)}</span>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 22 }} className="mt-6 w-full max-w-xs sm:w-64">
          <Link
            to="/checkout"
            className="eyebrow flex w-full items-center justify-center rounded-full bg-ink px-8 py-3.5 text-bg"
          >
            Checkout →
          </Link>
        </motion.div>
        <Link to="/products" className="eyebrow mt-2 text-ink-muted transition-colors hover:text-ink">
          ← Continue browsing
        </Link>
      </div>
    </div>
  )
}
