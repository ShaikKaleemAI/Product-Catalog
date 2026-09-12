import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { useFlyToCart } from '../context/FlyCartContext.jsx'
import { formatPrice, titleCase, truncate } from '../utils/format.js'
import { channelFor } from '../data/channels.js'
import Rating from './Rating.jsx'

export default function ProductCard({ product, position, total, priority = false }) {
  const { addItem, isInCart } = useCart()
  const { push } = useToast()
  const { fly } = useFlyToCart()
  const [justAdded, setJustAdded] = useState(false)
  const imgRef = useRef(null)
  const channel = channelFor(product.category)

  const rotX = useMotionValue(0)
  const rotY = useMotionValue(0)
  const springX = useSpring(rotX, { stiffness: 260, damping: 22 })
  const springY = useSpring(rotY, { stiffness: 260, damping: 22 })
  const glareX = useTransform(springY, [-8, 8], [0, 100])
  const glareY = useTransform(springX, [8, -8], [0, 100])
  // The hover glare tints toward the product's own channel color rather than
  // plain white — a small consistency detail that ties the card grid back
  // to the spectrum system used everywhere else.
  const glareBackground = useTransform(
    [glareX, glareY],
    ([gx, gy]) => `radial-gradient(circle at ${gx}% ${gy}%, rgb(var(--channel) / 0.28), transparent 60%)`
  )

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotY.set((px - 0.5) * 10)
    rotX.set((py - 0.5) * -10)
  }

  const handlePointerLeave = () => {
    rotX.set(0)
    rotY.set(0)
  }

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    if (imgRef.current) fly(imgRef.current, product.image)
    push(`Added "${truncate(product.title, 40)}" to cart`)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 900)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: priority ? 0 : (position % 4) * 0.04 }}
      className="group relative flex flex-col"
      style={channel ? { '--channel': `var(--c-${channel.color})` } : undefined}
    >
      <Link to={`/products/${product.id}`} className="flex flex-1 flex-col" aria-label={product.title}>
        <motion.div
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{ rotateX: springX, rotateY: springY, transformPerspective: 700 }}
          className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-bg-subtle"
        >
          <span className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1.5">
            {channel && (
              <span className={`h-1.5 w-1.5 rounded-full bg-${channel.color}`} aria-hidden="true" />
            )}
            <span className="font-mono text-[10px] tabular-nums text-ink-muted/70 mix-blend-difference">
              {String(position).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          </span>

          <motion.img
            ref={imgRef}
            src={product.image}
            alt={product.title}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 h-full w-full object-contain p-9 mix-blend-multiply transition-transform duration-700 ease-out group-hover:scale-[1.12] dark:mix-blend-normal"
            style={{ willChange: 'transform' }}
          />

          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBackground }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-black/40" />

          <button
            type="button"
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
            className={`absolute bottom-3 right-3 z-10 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full opacity-0 shadow-lg backdrop-blur transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 ${
              isInCart(product.id) ? 'bg-channel text-bg' : 'bg-ink text-bg hover:scale-110'
            }`}
          >
            {justAdded ? (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.4" className="animate-pop">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            )}
          </button>
        </motion.div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] uppercase tracking-wide text-ink-muted">{titleCase(product.category)}</span>
            <h3 className="mt-1 line-clamp-2 min-h-[2.6em] font-display text-[15px] leading-snug text-ink sm:text-base">
              {truncate(product.title, 70)}
            </h3>
          </div>
          <span className="mt-0.5 flex-shrink-0 font-mono text-sm tabular-nums text-ink">
            {formatPrice(product.price)}
          </span>
        </div>
        <div className="mt-1.5">
          <Rating rate={product.rating?.rate} count={product.rating?.count} />
        </div>
      </Link>
    </motion.article>
  )
}
