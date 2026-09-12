const BASE_URL = 'https://fakestoreapi.com'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch (err) {
    throw new ApiError('Could not reach the catalog service. Check your connection and try again.', 0)
  }
  if (!response.ok) {
    throw new ApiError(`The catalog service returned an error (${response.status}).`, response.status)
  }
  try {
    return await response.json()
  } catch {
    throw new ApiError('The catalog service returned an unreadable response.', response.status)
  }
}

export function fetchAllProducts() {
  return request('/products')
}

export function fetchProductById(id) {
  const numericId = Number(id)
  if (!Number.isInteger(numericId) || numericId <= 0) {
    return Promise.reject(new ApiError('Invalid product id.', 400))
  }
  return request(`/products/${numericId}`)
}

export function fetchCategories() {
  return request('/products/categories')
}

export { ApiError }
