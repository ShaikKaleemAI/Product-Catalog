import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'

const FlyCartContext = createContext(null)

/**
 * Provides a single imperative method — fly(imageEl, src) — that clones a
 * product image where it currently sits on screen and animates it along an
 * arced path into the cart icon. Purely visual, decoupled from cart state,
 * so it works from any product card or the detail page without prop drilling.
 */
export function FlyCartProvider({ children }) {
  const [flights, setFlights] = useState([])
  const cartTargetRef = useRef(null)
  const idRef = useRef(0)

  const registerCartTarget = useCallback((el) => {
    cartTargetRef.current = el
  }, [])

  const fly = useCallback((imageEl, src) => {
    if (!imageEl || !cartTargetRef.current) return
    const from = imageEl.getBoundingClientRect()
    const to = cartTargetRef.current.getBoundingClientRect()
    const id = idRef.current++

    setFlights((prev) => [
      ...prev,
      {
        id,
        src,
        from: { x: from.left, y: from.top, w: from.width, h: from.height },
        to: {
          x: to.left + to.width / 2 - 10,
          y: to.top + to.height / 2 - 10
        }
      }
    ])

    // pulse the cart target
    cartTargetRef.current.dispatchEvent(new CustomEvent('cart-bump', { bubbles: true }))
  }, [])

  const remove = useCallback((id) => {
    setFlights((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return (
    <FlyCartContext.Provider value={{ fly, registerCartTarget }}>
      {children}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {flights.map((f) => (
              <motion.img
                key={f.id}
                src={f.src}
                alt=""
                aria-hidden="true"
                initial={{
                  position: 'fixed',
                  left: f.from.x,
                  top: f.from.y,
                  width: f.from.w,
                  height: f.from.h,
                  opacity: 1,
                  scale: 1,
                  borderRadius: 16,
                  zIndex: 200,
                  pointerEvents: 'none',
                  mixBlendMode: 'multiply'
                }}
                animate={{
                  left: f.to.x,
                  top: f.to.y,
                  width: 20,
                  height: 20,
                  opacity: 0.15,
                  scale: 0.8,
                  rotate: 12
                }}
                transition={{ duration: 0.65, ease: [0.32, 0.72, 0.35, 1] }}
                onAnimationComplete={() => remove(f.id)}
                className="fixed rounded-2xl shadow-xl"
              />
            ))}
          </AnimatePresence>,
          document.body
        )}
    </FlyCartContext.Provider>
  )
}

export function useFlyToCart() {
  const ctx = useContext(FlyCartContext)
  if (!ctx) throw new Error('useFlyToCart must be used within a FlyCartProvider')
  return ctx
}
