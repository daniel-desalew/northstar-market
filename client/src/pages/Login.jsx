import { Store } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import Input from '../components/common/Input.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { validateEmail, validatePassword } from '../utils/validators.js'

function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState('email')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (step === 'email') {
      if (!validateEmail(email)) return setError('Enter a valid email address.')
      setStep('password')
      return
    }

    if (!validatePassword(password)) return setError('Password must be at least 8 characters.')
    try {
      await login({ email, password })
      navigate(location.state?.from?.pathname || '/profile', { replace: true })
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  function changeEmail() {
    setStep('email')
    setPassword('')
    setError('')
  }

  return (
    <main className="page-shell auth-page">
      <div className="auth-brand-wrap">
        <Link className="auth-brand" to="/" aria-label="Northstar Market home">
          <span className="brand-mark"><Store size={22} strokeWidth={2.3} aria-hidden="true" /></span>
          <span><strong>Northstar</strong><small>Market &amp; more</small></span>
        </Link>
      </div>
      <section className="auth-panel" aria-labelledby="login-title">
        <form className="form-card auth-card" onSubmit={handleSubmit}>
          <h1 id="login-title">Sign in or create account</h1>
          {step === 'email' ? (
            <Input label="Enter your email address" name="email" type="email" autoComplete="email" required autoFocus value={email} onChange={(event) => setEmail(event.target.value)} />
          ) : (
            <>
              <div className="auth-identity"><span>{email}</span><button type="button" onClick={changeEmail}>Change</button></div>
              <Input label="Enter your password" name="password" type="password" autoComplete="current-password" required autoFocus value={password} onChange={(event) => setPassword(event.target.value)} />
              <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link></div>
            </>
          )}
          {error && <p className="form-error" role="alert">{error}</p>}
          <Button className="auth-continue" type="submit" disabled={loading}>{loading ? 'Signing in…' : step === 'email' ? 'Continue' : 'Sign in'}</Button>
          <p className="auth-terms">By continuing, you agree to Northstar Market&apos;s Conditions of Use and Privacy Notice.</p>
          <Link className="auth-help" to="/forgot-password">Need help?</Link>
        </form>
        <div className="auth-business">
          <strong>Buying for work?</strong>
          <Link to="/register">Create a free business account</Link>
        </div>
      </section>
    </main>
  )
}

export default Login
