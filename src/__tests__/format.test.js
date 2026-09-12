import { describe, it, expect } from 'vitest'
import { formatPrice, formatIndex, titleCase, truncate } from '../utils/format.js'

describe('formatPrice', () => {
  it('formats a number as a two-decimal dollar amount', () => {
    expect(formatPrice(9.5)).toBe('$9.50')
  })
  it('falls back to $0.00 for non-numeric input', () => {
    expect(formatPrice('not a number')).toBe('$0.00')
  })
})

describe('formatIndex', () => {
  it('pads position and total to a shared width', () => {
    expect(formatIndex(4, 128)).toBe('No. 004 / 128')
  })
})

describe('titleCase', () => {
  it('capitalizes each word', () => {
    expect(titleCase("women's clothing")).toBe("Women's Clothing")
  })
  it('returns an empty string for falsy input', () => {
    expect(titleCase('')).toBe('')
  })
})

describe('truncate', () => {
  it('leaves short strings untouched', () => {
    expect(truncate('short', 10)).toBe('short')
  })
  it('truncates and appends an ellipsis past the max length', () => {
    expect(truncate('a much longer string than allowed', 10)).toBe('a much lon…')
  })
})
