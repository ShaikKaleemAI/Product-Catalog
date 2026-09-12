import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * React Router never resets scroll position on navigation — the new page
 * inherits wherever the old page happened to be scrolled to. That's why
 * clicking a product card near the bottom of the grid dropped users into
 * the middle of the detail page instead of the top.
 *
 * This resets scroll to the top on every path change, except when the
 * user is navigating back/forward (POP), where restoring their previous
 * scroll position is the expected behavior.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if (navigationType === 'POP') return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, navigationType])

  return null
}
