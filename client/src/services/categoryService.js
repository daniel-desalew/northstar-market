import api from './api.js'

export async function getCategories() {
  const { data } = await api.get('/categories')
  return data
}

export async function createCategory(category) {
  const { data } = await api.post('/categories', category)
  return data
}

export async function deleteCategory(categoryId) {
  const { data } = await api.delete(`/categories/${encodeURIComponent(categoryId)}`)
  return data
}