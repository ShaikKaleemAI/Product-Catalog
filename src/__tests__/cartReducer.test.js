import { describe, it, expect } from 'vitest'
import { cartReducer, clampQty, MAX_QTY, MIN_QTY } from '../context/cartReducer.js'

const product = (overrides = {}) => ({
  id: 1,
  title: 'Test Product',
  price: 10,
  image: '/test.png',
  category: 'electronics',
  ...overrides
})

describe('clampQty', () => {
  it('clamps below the minimum up to MIN_QTY', () => {
    expect(clampQty(0)).toBe(MIN_QTY)
    expect(clampQty(-5)).toBe(MIN_QTY)
  })
  it('clamps above the maximum down to MAX_QTY', () => {
    expect(clampQty(500)).toBe(MAX_QTY)
  })
  it('falls back to MIN_QTY for non-numeric input', () => {
    expect(clampQty('abc')).toBe(MIN_QTY)
  })
  it('truncates fractional quantities', () => {
    expect(clampQty(3.9)).toBe(3)
  })
})

describe('cartReducer', () => {
  it('adds a new item with the given quantity', () => {
    const state = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: { product: product(), quantity: 2 } })
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({ id: 1, quantity: 2 })
  })

  it('increments quantity when the same item is added again', () => {
    let state = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: { product: product(), quantity: 2 } })
    state = cartReducer(state, { type: 'ADD_ITEM', payload: { product: product(), quantity: 3 } })
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(5)
  })

  it('ignores ADD_ITEM with no product', () => {
    const initial = { items: [] }
    const state = cartReducer(initial, { type: 'ADD_ITEM', payload: {} })
    expect(state).toBe(initial)
  })

  it('sets an explicit quantity, clamped to the valid range', () => {
    let state = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: { product: product(), quantity: 1 } })
    state = cartReducer(state, { type: 'SET_QUANTITY', payload: { id: 1, quantity: 500 } })
    expect(state.items[0].quantity).toBe(MAX_QTY)
  })

  it('removes an item by id', () => {
    let state = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: { product: product(), quantity: 1 } })
    state = cartReducer(state, { type: 'REMOVE_ITEM', payload: { id: 1 } })
    expect(state.items).toHaveLength(0)
  })

  it('clears the cart', () => {
    let state = cartReducer({ items: [] }, { type: 'ADD_ITEM', payload: { product: product(), quantity: 1 } })
    state = cartReducer(state, { type: 'CLEAR_CART' })
    expect(state.items).toEqual([])
  })
})
