function getPaymentConfiguration() {
  const { PAYMENT_PROVIDER, PAYMENT_SECRET_KEY } = process.env
  if (!PAYMENT_PROVIDER || !PAYMENT_SECRET_KEY) {
    return { configured: false, provider: null, currency: null, secretKey: null }
  }

  if (PAYMENT_PROVIDER !== 'stripe') {
    throw new Error('PAYMENT_PROVIDER must be "stripe".')
  }
  if (!PAYMENT_SECRET_KEY.startsWith('sk_test_') && !PAYMENT_SECRET_KEY.startsWith('sk_live_')) {
    throw new Error('PAYMENT_SECRET_KEY must be a Stripe secret key.')
  }

  const currency = (process.env.PAYMENT_CURRENCY || 'usd').toLowerCase()
  if (!/^[a-z]{3}$/.test(currency)) {
    throw new Error('PAYMENT_CURRENCY must be a three-letter ISO currency code.')
  }

  return {
    configured: true,
    provider: PAYMENT_PROVIDER,
    secretKey: PAYMENT_SECRET_KEY,
    currency,
  }
}

module.exports = { getPaymentConfiguration }