// Pure cart logic, kept separate from CartContext.jsx so it can be unit
// tested without rendering React or touching localStorage.
export const MAX_QTY = 99
export const MIN_QTY = 1

export function clampQty(qty) {
  const n = Math.trunc(Number(qty))
  if (Number.isNaN(n)) return MIN_QTY
  return Math.min(MAX_QTY, Math.max(MIN_QTY, n))
}

export function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload
      if (!product || typeof product.id === 'undefined') return state
      const qtyToAdd = clampQty(quantity)
      const existing = state.items.find((i) => i.id === product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === product.id ? { ...i, quantity: clampQty(i.quantity + qtyToAdd) } : i
          )
        }
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: qtyToAdd
          }
        ]
      }
    }
    case 'SET_QUANTITY': {
      const { id, quantity } = action.payload
      const q = clampQty(quantity)
      return { items: state.items.map((i) => (i.id === id ? { ...i, quantity: q } : i)) }
    }
    case 'REMOVE_ITEM': {
      return { items: state.items.filter((i) => i.id !== action.payload.id) }
    }
    case 'CLEAR_CART': {
      return { items: [] }
    }
    default:
      return state
  }
}
