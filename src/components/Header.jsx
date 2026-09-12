import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useAnimation } from 'framer-motion'
import { useCart } from '../context/CartContext.jsx'
import { useFlyToCart } from '../context/FlyCartContext.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import CartDrawer from './CartDrawer.jsx'
import SearchOverlay from './SearchOverlay.jsx'
import SpectrumRail from './SpectrumRail.jsx'

const navLinkClass = ({ isActive }) =>
  `relative py-2 text-sm transition-colors ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`

export default function Header() {
  const { itemCount } = useCart()
  const { registerCartTarget } = useFlyToCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const cartBtnRef = useRef(null)
  const controls = useAnimation()
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    registerCartTarget(cartBtnRef.current)
  }, [registerCartTarget])

  useEffect(() => {
    const el = cartBtnRef.current
    if (!el) return
    const onBump = () => {
      controls.start({
        scale: [1, 1.22, 0.94, 1.04, 1],
        transition: { duration: 0.55, times: [0, 0.3, 0.55, 0.8, 1], ease: 'easeOut' }
      })
    }
    el.addEventListener('cart-bump', onBump)
    return () => el.removeEventListener('cart-bump', onBump)
  }, [controls])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-rule bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
          <NavLink to="/" className="flex items-baseline gap-2">
            <span className="font-display text-2xl italic tracking-tight text-ink">Index&nbsp;Four</span>
          </NavLink>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="flex h-9 items-center gap-2 rounded-full border border-rule px-3.5 text-ink-muted transition-colors hover:border-ink hover:text-ink"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <span className="eyebrow hidden text-[10px] text-ink-muted md:inline">⌘K</span>
            </button>
            <ThemeToggle />
            <motion.button
              ref={cartBtnRef}
              type="button"
              animate={controls}
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
              className="relative flex h-9 items-center gap-2 rounded-full border border-rule px-3.5 text-ink transition-colors hover:border-ink"
            >
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={itemCount}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="font-mono text-xs tabular-nums"
                >
                  {itemCount}
                </motion.span>
              </AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  layoutId="cart-dot"
                  className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-channel"
                  aria-hidden="true"
                />
              )}
            </motion.button>
          </div>
        </div>

        <nav className="flex items-center gap-6 border-t border-rule px-5 py-2.5 md:hidden" aria-label="Primary">
          <NavLink to="/" end className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
        </nav>

        <SpectrumRail />
      </header>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSubmit={(q) => {
          setSearchOpen(false)
          navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products')
        }}
      />
    </>
  )
}
