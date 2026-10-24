import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import { requestPasswordReset } from '../services/authService.js'
import { validateEmail } from '../utils/validators.js'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    if (!validateEmail(email)) return setError('Enter a valid email address.')
    setLoading(true)
    try {
      const result = await requestPasswordReset(email.trim())
      setMessage(result.message || 'If the account exists, password reset instructions have been sent.')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell auth-page">
      <form className="form-card auth-card" onSubmit={handleSubmit}>
        <span className="eyebrow">Account help</span>
        <h1>Reset your password</h1>
        <p className="form-note">Enter the email address associated with your account.</p>
        <Input label="Email address" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-success" role="status">{message}</p>}
        <Button type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send reset instructions'}</Button>
        <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
      </form>
    </div>
  )
}

export default ForgotPassword