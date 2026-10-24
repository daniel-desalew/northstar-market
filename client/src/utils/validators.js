export function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function validatePassword(value) {
  return value.length >= 8
}

export function validateRequired(value) {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateQuantity(value, stock = Number.MAX_SAFE_INTEGER) {
  const quantity = Number(value)
  return Number.isInteger(quantity) && quantity > 0 && quantity <= stock
}