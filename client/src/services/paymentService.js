import api from './api.js'

export async function createPaymentIntent(orderId) {
  const { data } = await api.post('/payments/create-intent', { orderId })
  return data
}

export async function confirmPayment(paymentIntentId) {
  const { data } = await api.post('/payments/confirm', { paymentIntentId })
  return data
}