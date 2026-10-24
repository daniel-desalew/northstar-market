import api from './api.js'

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

export async function getProduct(productId) {
  const { data } = await api.get(`/products/${encodeURIComponent(productId)}`)
  return data
}

export async function createProduct(product) {
  const { data } = await api.post('/products', product)
  return data
}

export async function updateProduct(productId, product) {
  const { data } = await api.put(`/products/${encodeURIComponent(productId)}`, product)
  return data
}

export async function deleteProduct(productId) {
  const { data } = await api.delete(`/products/${encodeURIComponent(productId)}`)
  return data
}