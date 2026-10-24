import api from './api.js'

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export async function register(details) {
  const { data } = await api.post('/auth/register', details)
  return data
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/forgot-password', { email })
  return data
}

export async function resetPassword(token, password) {
  const { data } = await api.post(`/auth/reset-password/${encodeURIComponent(token)}`, {
    password,
  })
  return data
}