import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../context/AuthContext'
import { ApiError } from '../../../api/client'
import { Button } from '../../../components/ui/Button/Button'
import { FormField } from '../../../components/admin/FormField/FormField'
import { InlineError } from '../../../components/admin/InlineError/InlineError'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/admin/nominations')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`centered-page ${styles.page}`}>
      <div className={styles.brand}>
        <h1>Youth Awards</h1>
        <p>Admin dashboard</p>
      </div>

      <div className="card">
        <h2>Log in</h2>
        <p className={styles.subtitle}>Sign in to review nominations and manage nominees.</p>

        {error && <InlineError message={error} />}
        <form onSubmit={handleSubmit} noValidate>
          <FormField id="email" label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormField>

          <FormField id="password" label="Password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormField>

          <Button type="submit" className="btn-block" loading={submitting} loadingLabel="Logging in">
            Log in
          </Button>
        </form>
      </div>
    </div>
  )
}
