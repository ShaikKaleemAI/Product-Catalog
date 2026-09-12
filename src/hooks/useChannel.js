import { useEffect } from 'react'
import { channelCssVar } from '../data/channels.js'

/**
 * Sets the document-level --channel CSS variable, which every "spectrum"
 * element (rail, ambient wash, focus rings, card glows) reads from. Kept
 * as small standalone helpers so both imperative hover handlers (rail
 * segments, product cards) and declarative page-level state (the active
 * category filter on /products) can drive the same variable without
 * threading it through props.
 */
export function setChannel(categoryKey) {
  const root = document.documentElement
  if (categoryKey) {
    root.style.setProperty('--channel', channelCssVar(categoryKey))
  } else {
    root.style.removeProperty('--channel')
  }
}

export function clearChannel() {
  document.documentElement.style.removeProperty('--channel')
}

// Ties --channel to a value for the lifetime of the calling component,
// e.g. the currently filtered category on the Products page. Clears on
// unmount so the next route doesn't inherit a stale tint.
export function useChannelForCategory(categoryKey) {
  useEffect(() => {
    setChannel(categoryKey)
    return () => clearChannel()
  }, [categoryKey])
}
