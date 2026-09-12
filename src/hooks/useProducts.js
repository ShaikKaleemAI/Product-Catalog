import { useEffect, useState, useCallback } from 'react'
import { fetchAllProducts } from '../api/products'

let cache = null // simple in-memory cache for the session

export function useProducts() {
  const [products, setProducts] = useState(cache)
  const [status, setStatus] = useState(cache ? 'success' : 'loading')
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    if (cache) {
      setProducts(cache)
      setStatus('success')
      return
    }
    setStatus('loading')
    setError(null)
    fetchAllProducts()
      .then((data) => {
        cache = data
        setProducts(data)
        setStatus('success')
      })
      .catch((err) => {
        setError(err)
        setStatus('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { products: products ?? [], status, error, retry: load }
}
