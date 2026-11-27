import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { homePathFor, useAuth } from '../auth/auth-context'

export function RegisterPage() {
  const { user, register, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={homePathFor(user.role)} replace />
  }

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // The backend validates everything and replies 400 with the reasons
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
      // Log the new driver in straight away
      const newUser = await login(form.email, form.password)
      navigate(homePathFor(newUser.role), { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-wrap">
      <form className="card auth-card stack" onSubmit={handleSubmit}>
        <div>
          <h1>Create a driver account</h1>
          <p className="muted">Reserve parking spaces in a few clicks.</p>
        </div>

        {error && <div className="alert error">{error}</div>}

        <label>
          Full name
          <input value={form.fullName} onChange={update('fullName')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={update('email')} required />
        </label>
        <label>
          Phone (optional)
          <input value={form.phone} onChange={update('phone')} placeholder="09171234567" />
        </label>
        <label>
          Password
          <input
            type="password"
            value={form.password}
            onChange={update('password')}
            autoComplete="new-password"
            required
          />
          <span className="muted small-text">At least 8 characters, with a letter and a number.</span>
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Register'}
        </button>

        <p className="muted small-text">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  )
}
