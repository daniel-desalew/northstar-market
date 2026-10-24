import { CURRENCY } from './constants.js'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: CURRENCY,
})

export function formatPrice(value) {
  if (!Number.isFinite(Number(value))) {
    throw new TypeError('Price must be a finite number.')
  }

  return formatter.format(Number(value))
}