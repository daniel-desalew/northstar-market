export const APP_NAME = 'Northstar Market'
export const CURRENCY = 'USD'
export const DEFAULT_PAGE_SIZE = 8
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const ORDER_STATUSES = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]