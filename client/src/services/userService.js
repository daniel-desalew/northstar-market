import api from './api.js'

export async function getProfile() {
  const { data } = await api.get('/users/profile')
  return data
}

export async function updateProfile(profile) {
  const { data } = await api.put('/users/profile', profile)
  return data
}

export async function getAddresses() {
  const { data } = await api.get('/users/addresses')
  return data
}

export async function saveAddress(address) {
  const { data } = await api.post('/users/addresses', address)
  return data
}

export async function deleteAddress(addressId) {
  const { data } = await api.delete(`/users/addresses/${encodeURIComponent(addressId)}`)
  return data
}

export async function getUsers() {
  const { data } = await api.get('/admin/users')
  return data
}