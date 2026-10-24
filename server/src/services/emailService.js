const RESEND_API_URL = 'https://api.resend.com/emails'
const REQUEST_TIMEOUT_MS = 10000

function getEmailConfiguration() {
  const { RESEND_API_KEY, EMAIL_FROM } = process.env
  if (!RESEND_API_KEY || !EMAIL_FROM) {
    throw new Error(
      'Email is not configured. Set RESEND_API_KEY and EMAIL_FROM in server/.env.',
    )
  }
  return { apiKey: RESEND_API_KEY, from: EMAIL_FROM }
}

function validateEmailAddress(value, fieldName) {
  if (
    typeof value !== 'string' ||
    value.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  ) {
    throw new TypeError(`${fieldName} must be a valid email address.`)
  }
}

async function sendEmail({ to, subject, text, html }) {
  validateEmailAddress(to, 'Recipient')
  if (typeof subject !== 'string' || !subject.trim()) {
    throw new TypeError('Email subject is required.')
  }
  if ((!text || typeof text !== 'string') && (!html || typeof html !== 'string')) {
    throw new TypeError('Email text or HTML content is required.')
  }

  const { apiKey, from } = getEmailConfiguration()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: subject.trim(),
        ...(text ? { text } : {}),
        ...(html ? { html } : {}),
      }),
      signal: controller.signal,
    })

    const result = await response.json().catch(() => ({}))
    if (!response.ok) {
      const providerMessage =
        typeof result.message === 'string' ? result.message : 'Email provider rejected the request.'
      throw new Error(`Email provider error (${response.status}): ${providerMessage}`)
    }
    if (typeof result.id !== 'string' || !result.id) {
      throw new Error('Email provider returned no message ID.')
    }

    return { id: result.id }
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Email provider request timed out.', { cause: error })
    }
    throw error
  } finally {
    clearTimeout(timeout)
  }
}

module.exports = { sendEmail }