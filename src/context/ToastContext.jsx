import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const ToastContext = createContext(null)
let idSeed = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id))
    clearTimeout(timers.current[id])
    delete timers.current[id]
  }, [])

  const push = useCallback(
    (message) => {
      const id = ++idSeed
      setToasts((t) => [...t, { id, message }])
      timers.current[id] = setTimeout(() => dismiss(id), 2600)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="pointer-events-auto flex items-center gap-2 rounded-full border border-rule bg-ink px-4 py-2.5 text-bg shadow-lg"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span className="text-sm font-medium">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
