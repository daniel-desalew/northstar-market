import api from './api.js'

export async function createOrder(order) {
  const { data } = await api.post('/orders', order)
  return data
}

export async function getMyOrders() {
  const { data } = await api.get('/orders/my-orders')
  return data
}

export async function getOrder(orderId) {
  const { data } = await api.get(`/orders/${encodeURIComponent(orderId)}`)
  return data
}

export async function getAllOrders() {
  const { data } = await api.get('/admin/orders')
  return data
}

export async function updateOrderStatus(orderId, status) {
  const { data } = await api.patch(`/admin/orders/${encodeURIComponent(orderId)}`, { status })
  return data
}