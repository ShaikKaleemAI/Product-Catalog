import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { cartReducer, MAX_QTY, MIN_QTY } from './cartReducer.js'

const CartContext = createContext(null)
const STORAGE_KEY = 'catalog-cart'

function loadInitialState() {
  if (typeof window === 'undefined') return { items: [] }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.items)) return { items: [] }
    return { items: parsed.items }
  } catch {
    return { items: [] }
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadInitialState)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const api = useMemo(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const subtotal = state.items.reduce((sum, i) => sum + i.quantity * i.price, 0)

    return {
      items: state.items,
      itemCount,
      subtotal,
      addItem: (product, quantity = 1) => dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
      setQuantity: (id, quantity) => dispatch({ type: 'SET_QUANTITY', payload: { id, quantity } }),
      removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } }),
      clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      isInCart: (id) => state.items.some((i) => i.id === id),
      MAX_QTY,
      MIN_QTY
    }
  }, [state])

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
