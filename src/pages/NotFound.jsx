import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="static-noise flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="eyebrow text-ink-muted"
      >
        No signal on this channel
      </motion.span>
      <h1 className="font-display text-5xl italic text-ink">404</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        This page isn't filed in the index. Check the address, or head back
        to the catalog.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="eyebrow mt-2 rounded-full bg-ink px-5 py-2.5 text-bg transition-transform hover:-translate-y-0.5"
      >
        Back to Index Four
      </button>
    </div>
  )
}
