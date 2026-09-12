import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchProductById } from '../api/products.js'
import { useProducts } from '../hooks/useProducts.js'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useFlyToCart } from '../context/FlyCartContext.jsx'
import { formatPrice, titleCase, formatIndex } from '../utils/format.js'
import { channelFor } from '../data/channels.js'
import { useChannelForCategory } from '../hooks/useChannel.js'
import Rating from '../components/Rating.jsx'
import QuantityStepper from '../components/QuantityStepper.jsx'
import ProductCard from '../components/ProductCard.jsx'
import StateNotice from '../components/StateNotice.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { push } = useToast()
  const { fly } = useFlyToCart()
  const { products: allProducts } = useProducts()
  const heroImgRef = useRef(null)

  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const isValidId = /^\d+$/.test(String(id))
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!isValidId) {
      setStatus('invalid')
      return
    }
    let cancelled = false
    setStatus('loading')
    setError(null)
    setQuantity(1)
    fetchProductById(id)
      .then((data) => {
        if (cancelled) return
        if (!data || typeof data.id === 'undefined') {
          setStatus('not-found')
          return
        }
        setProduct(data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [id, isValidId, reloadToken])

  const channel = product ? channelFor(product.category) : null
  useChannelForCategory(product?.category || null)

  if (status === 'invalid' || status === 'not-found') {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <StateNotice
          eyebrow="Not filed"
          title="This item isn't in the index"
          description="It may have been removed, or the reference number is incorrect."
          actionLabel="Back to products"
          onAction={() => navigate('/products')}
        />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <StateNotice
          eyebrow="Connection issue"
          title="This item couldn't be loaded"
          description={error?.message}
          actionLabel="Try again"
          onAction={() => setReloadToken((t) => t + 1)}
        />
      </div>
    )
  }

  if (status === 'loading' || !product) {
    return (
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-lg bg-bg-subtle" />
        <div className="space-y-4">
          <div className="h-3 w-24 animate-pulse rounded bg-bg-subtle" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-bg-subtle" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-bg-subtle" />
          <div className="h-24 w-full animate-pulse rounded bg-bg-subtle" />
        </div>
      </div>
    )
  }

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  const positionInAll = allProducts.findIndex((p) => p.id === product.id)

  const handleAdd = () => {
    addItem(product, quantity)
    if (heroImgRef.current) fly(heroImgRef.current, product.image)
    push(`Added ${quantity} × "${product.title.slice(0, 30)}" to cart`)
  }

  return (
    <div className="channel-wash mx-auto max-w-6xl px-5 py-10 sm:px-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="eyebrow mb-8 inline-flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
      >
        ← Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-12 lg:grid-cols-2"
      >
        <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-bg-subtle p-14">
          <motion.img
            ref={heroImgRef}
            initial={{ scale: 1.06, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            src={product.image}
            alt={product.title}
            className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
          />
          <span className="pointer-events-none absolute right-4 top-4 font-mono text-[11px] tabular-nums text-ink-muted/70 mix-blend-difference">
            {formatIndex(positionInAll >= 0 ? positionInAll + 1 : 1, allProducts.length || 1)}
          </span>
        </div>

        <div>
          {channel && (
            <div className="mb-3 inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full bg-${channel.color}`} aria-hidden="true" />
              <span className={`eyebrow text-${channel.color}`}>{channel.name} channel</span>
            </div>
          )}
          <span className="eyebrow block text-ink-muted">{titleCase(product.category)}</span>
          <h1 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">{product.title}</h1>

          <div className="mt-4">
            <Rating rate={product.rating?.rate} count={product.rating?.count} size="lg" />
          </div>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-muted">{product.description}</p>

          <div className="mt-8 flex items-baseline gap-3">
            <span className="font-mono text-3xl tabular-nums text-ink">{formatPrice(product.price)}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <QuantityStepper value={quantity} onChange={setQuantity} size="lg" />
            <motion.button
              type="button"
              onClick={handleAdd}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="eyebrow flex-1 rounded-full bg-ink px-8 py-3.5 text-bg sm:flex-none"
            >
              Add to cart — {formatPrice(product.price * quantity)}
            </motion.button>
          </div>

          <dl className="mt-10 space-y-2 border-t border-rule pt-6 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Channel</dt>
              <dd className="text-ink">{channel ? `${channel.name} — ${channel.blurb}` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Category</dt>
              <dd className="text-ink">{titleCase(product.category)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Reference</dt>
              <dd className="font-mono text-ink">#{String(product.id).padStart(4, '0')}</dd>
            </div>
          </dl>
        </div>
      </motion.div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-rule pt-10">
          <h2 className="mb-8 text-sm font-semibold uppercase tracking-wide text-ink">
            More from {channel ? channel.name : titleCase(product.category)}
          </h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {related.map((p) => {
              const pos = allProducts.findIndex((ap) => ap.id === p.id) + 1
              return <ProductCard key={p.id} product={p} position={pos} total={allProducts.length} />
            })}
          </div>
        </section>
      )}

      <Link
        to="/products"
        className="eyebrow mt-16 inline-block text-ink-muted transition-colors hover:text-ink"
      >
        ← Back to full catalog
      </Link>
    </div>
  )
}
