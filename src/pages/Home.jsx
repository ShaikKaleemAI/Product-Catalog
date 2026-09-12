import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProducts } from '../hooks/useProducts.js'
import ProductCard from '../components/ProductCard.jsx'
import LoadingGrid from '../components/LoadingGrid.jsx'
import { channelFor, CHANNEL_ORDER, CHANNELS } from '../data/channels.js'
import { setChannel, clearChannel } from '../hooks/useChannel.js'
import { titleCase } from '../utils/format.js'

const FLOAT_STYLES = [
  { top: '2%', left: '4%', size: 'w-28 sm:w-36', rot: '-8deg', delay: 0 },
  { top: '18%', left: '52%', size: 'w-24 sm:w-32', rot: '6deg', delay: 0.6 },
  { top: '52%', left: '10%', size: 'w-32 sm:w-40', rot: '4deg', delay: 1.1 },
  { top: '58%', left: '58%', size: 'w-24 sm:w-28', rot: '-5deg', delay: 1.6 }
]

export default function Home() {
  const { products, status } = useProducts()

  const categories = [...new Set(products.map((p) => p.category))]
  const featured = products.slice(0, 4)

  return (
    <div className="channel-wash">
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-8 pt-14 sm:px-8 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-6">
          <div className="relative z-10">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="eyebrow inline-block rounded-full border border-rule px-3 py-1.5 text-ink-muted"
            >
              Four channels — one catalog
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="hero-heading mt-5 max-w-xl font-display font-normal tracking-tight text-ink"
            >
              Tune into what's
              <br />
              <span className="italic">worth owning.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-md text-base leading-relaxed text-ink-muted"
            >
              Every item is filed under one of four channels, color-coded so
              you always know where you are — Circuit, Ember, Moss, or Clay.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-5"
            >
              <MagneticLink to="/products">Browse the index →</MagneticLink>
              <span className="eyebrow text-ink-muted">
                {status === 'success' ? `${products.length} items indexed` : 'Loading index…'}
              </span>
            </motion.div>
          </div>

          <div className="relative lg:h-[420px]">
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              {status === 'success' &&
                featured.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="aspect-square rounded-2xl bg-bg-subtle p-4"
                  >
                    <Link to={`/products/${p.id}`} className="block h-full w-full">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </Link>
                  </motion.div>
                ))}
              {status === 'loading' &&
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-square animate-shimmer rounded-2xl" />
                ))}
            </div>

            <div className="relative hidden h-full lg:block">
              {status === 'success' &&
                featured.map((p, i) => {
                  const f = FLOAT_STYLES[i % FLOAT_STYLES.length]
                  const ch = channelFor(p.category)
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 + f.delay * 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className={`absolute ${f.size} animate-floatSlow rounded-2xl bg-bg-subtle p-5 shadow-lg`}
                      style={{ top: f.top, left: f.left, '--rot': f.rot, animationDelay: `${f.delay}s` }}
                    >
                      {ch && (
                        <span
                          aria-hidden="true"
                          className={`absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-${ch.color}`}
                        />
                      )}
                      <img
                        src={p.image}
                        alt={p.title}
                        className="aspect-square w-full object-contain mix-blend-multiply dark:mix-blend-normal"
                      />
                    </motion.div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Shop by channel — the signature moment ---------------- */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="mb-6 flex items-baseline justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Shop by channel</h2>
            <Link to="/products" className="eyebrow text-ink-muted transition-colors hover:text-ink">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CHANNEL_ORDER.filter((key) => categories.includes(key)).map((key, i) => {
              const ch = CHANNELS[key]
              const sample = products.find((p) => p.category === key)
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <Link
                    to={`/products?category=${encodeURIComponent(key)}`}
                    onMouseEnter={() => setChannel(key)}
                    onMouseLeave={clearChannel}
                    onFocus={() => setChannel(key)}
                    onBlur={clearChannel}
                    className={`group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-2xl bg-${ch.color}/10 p-5 ring-1 ring-inset ring-${ch.color}/25 transition-all duration-300 hover:ring-${ch.color}/60`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`h-2.5 w-2.5 rounded-full bg-${ch.color}`} aria-hidden="true" />
                      <span className="font-mono text-[10px] uppercase tracking-widest2 text-ink-muted">
                        0{CHANNEL_ORDER.indexOf(key) + 1}
                      </span>
                    </div>

                    {sample && (
                      <img
                        src={sample.image}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 h-full w-full object-contain px-8 pb-24 pt-12 opacity-90 mix-blend-multiply transition-transform duration-500 group-hover:scale-110 dark:mix-blend-normal"
                      />
                    )}

                    {/* Legibility scrim — guarantees the label reads over any product
                        photo regardless of viewport width or image shape. */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-${ch.color}/10 via-bg/70 to-transparent`}
                    />

                    <div className="relative z-10">
                      <p className="font-display text-2xl italic text-ink">{ch.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">{titleCase(key)} · {ch.blurb}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </section>
      )}

      {/* ---------------- Recently indexed ---------------- */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <div className="mb-8 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink">Recently indexed</h2>
          <Link to="/products" className="eyebrow text-ink-muted transition-colors hover:text-ink">
            Full catalog →
          </Link>
        </div>
        {status === 'loading' && <LoadingGrid count={4} />}
        {status === 'success' && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {featured.map((p, i) => (
              <ProductCard key={p.id} product={p} position={i + 1} total={products.length} priority={i < 2} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function MagneticLink({ to, children }) {
  return (
    <motion.div whileHover="hover" className="relative inline-block">
      <motion.div
        variants={{ hover: { scale: 1.04 } }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Link
          to={to}
          className="eyebrow inline-flex items-center rounded-full bg-ink px-6 py-3.5 text-bg ring-2 ring-channel/0 transition-shadow duration-300 hover:ring-channel/40"
        >
          {children}
        </Link>
      </motion.div>
    </motion.div>
  )
}
