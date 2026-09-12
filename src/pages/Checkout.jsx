import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { formatPrice } from '../utils/format.js'
import StateNotice from '../components/StateNotice.jsx'

const STEPS = ['Shipping', 'Review', 'Confirmation']
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EMPTY_FORM = {
  name: '',
  email: '',
  address: '',
  city: '',
  postal: '',
  country: ''
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Enter your full name.'
  if (!form.email.trim()) errors.email = 'Enter an email address.'
  else if (!EMAIL_RE.test(form.email)) errors.email = 'That email address looks incomplete.'
  if (!form.address.trim()) errors.address = 'Enter a shipping address.'
  if (!form.city.trim()) errors.city = 'Enter a city.'
  if (!form.postal.trim()) errors.postal = 'Enter a postal code.'
  if (!form.country.trim()) errors.country = 'Enter a country.'
  return errors
}

export default function Checkout() {
  const { items, subtotal, itemCount, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [orderId, setOrderId] = useState(null)

  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 6.5
  const total = subtotal + shipping

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }))

  const goToReview = (e) => {
    e.preventDefault()
    const allErrors = validate(form)
    setErrors(allErrors)
    setTouched({ name: true, email: true, address: true, city: true, postal: true, country: true })
    if (Object.keys(allErrors).length === 0) setStep(1)
  }

  const placeOrder = () => {
    // Demo checkout only — no real payment is processed and nothing is
    // sent to a server. This exists to demonstrate a full order flow.
    const id = `IX4-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    setOrderId(id)
    setStep(2)
    clearCart()
  }

  if (items.length === 0 && step !== 2) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <StateNotice
          eyebrow="Checkout"
          title="Your cart is empty"
          description="Add something from the catalog before checking out."
          actionLabel="Browse products"
          onAction={() => navigate('/products')}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
      <span className="eyebrow text-ink-muted">Checkout</span>
      <h1 className="mt-2 font-display text-4xl text-ink">
        {step === 2 ? 'Order placed' : 'Complete your order'}
      </h1>

      {/* Step indicator */}
      <ol className="mt-6 flex items-center gap-3" aria-label="Checkout progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`eyebrow flex h-7 items-center gap-2 rounded-full px-3 ${
                i === step
                  ? 'bg-ink text-bg'
                  : i < step
                    ? 'bg-channel/15 text-channel'
                    : 'bg-bg-subtle text-ink-muted'
              }`}
            >
              {i < step ? '✓' : i + 1} {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-rule" aria-hidden="true" />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.form
            key="shipping"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            onSubmit={goToReview}
            noValidate
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2"
          >
            <Field label="Full name" error={touched.name && errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                onBlur={blur('name')}
                autoComplete="name"
                className={inputClass(touched.name && errors.name)}
              />
            </Field>
            <Field label="Email" error={touched.email && errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                onBlur={blur('email')}
                autoComplete="email"
                className={inputClass(touched.email && errors.email)}
              />
            </Field>
            <Field label="Address" error={touched.address && errors.address} full>
              <input
                type="text"
                value={form.address}
                onChange={update('address')}
                onBlur={blur('address')}
                autoComplete="street-address"
                className={inputClass(touched.address && errors.address)}
              />
            </Field>
            <Field label="City" error={touched.city && errors.city}>
              <input
                type="text"
                value={form.city}
                onChange={update('city')}
                onBlur={blur('city')}
                autoComplete="address-level2"
                className={inputClass(touched.city && errors.city)}
              />
            </Field>
            <Field label="Postal code" error={touched.postal && errors.postal}>
              <input
                type="text"
                value={form.postal}
                onChange={update('postal')}
                onBlur={blur('postal')}
                autoComplete="postal-code"
                className={inputClass(touched.postal && errors.postal)}
              />
            </Field>
            <Field label="Country" error={touched.country && errors.country} full>
              <input
                type="text"
                value={form.country}
                onChange={update('country')}
                onBlur={blur('country')}
                autoComplete="country-name"
                className={inputClass(touched.country && errors.country)}
              />
            </Field>

            <div className="mt-2 flex items-center justify-between sm:col-span-2">
              <Link to="/cart" className="eyebrow text-ink-muted transition-colors hover:text-ink">
                ← Back to cart
              </Link>
              <button
                type="submit"
                className="eyebrow rounded-full bg-ink px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5"
              >
                Review order →
              </button>
            </div>
          </motion.form>
        )}

        {step === 1 && (
          <motion.div
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="mt-10"
          >
            <div className="rounded-2xl border border-rule p-5">
              <p className="eyebrow text-ink-muted">Ship to</p>
              <p className="mt-1 text-sm text-ink">
                {form.name} · {form.address}, {form.city} {form.postal}, {form.country}
              </p>
              <p className="mt-1 text-sm text-ink-muted">{form.email}</p>
            </div>

            <div className="mt-6 border-t border-rule">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-rule py-3 text-sm">
                  <span className="text-ink">
                    {item.quantity} × {item.title}
                  </span>
                  <span className="font-mono text-ink">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex justify-between text-ink-muted">
                <span>Subtotal · {itemCount} item{itemCount === 1 ? '' : 's'}</span>
                <span className="font-mono text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-muted">
                <span>Shipping</span>
                <span className="font-mono text-ink">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-rule pt-3 text-base font-medium text-ink">
                <span>Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-ink-muted">
              This is a demo checkout — no payment is processed and no order is sent anywhere.
            </p>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="eyebrow text-ink-muted transition-colors hover:text-ink"
              >
                ← Edit shipping
              </button>
              <button
                type="button"
                onClick={placeOrder}
                className="eyebrow rounded-full bg-channel px-7 py-3.5 text-bg transition-transform hover:-translate-y-0.5"
              >
                Place order
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-rule py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-channel text-bg"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </motion.div>
            <p className="eyebrow text-ink-muted">Order {orderId}</p>
            <h2 className="font-display text-2xl italic text-ink">Filed and confirmed.</h2>
            <p className="max-w-sm text-sm text-ink-muted">
              A confirmation would normally be sent to {form.email}. This demo doesn't send real email or process
              payment.
            </p>
            <Link
              to="/products"
              className="eyebrow mt-4 rounded-full bg-ink px-6 py-3 text-bg transition-transform hover:-translate-y-0.5"
            >
              Continue browsing
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function inputClass(hasError) {
  return `w-full rounded-lg border bg-bg px-3.5 py-2.5 text-sm text-ink outline-none transition-colors ${
    hasError ? 'border-sale' : 'border-rule focus:border-channel'
  }`
}

function Field({ label, error, full, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="mb-1.5 block text-xs font-medium text-ink-muted">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-sale">{error}</span>}
    </label>
  )
}
