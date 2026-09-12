import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX }}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-[2px] w-full origin-left bg-channel"
      aria-hidden="true"
    />
  )
}
